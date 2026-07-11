import { promises as fs } from "fs";
import path from "path";
import {
  createSupabaseAdminClient,
  getSupabaseStorageBucket,
  getSupabaseUrl,
  isSupabaseConfigured
} from "@/lib/supabase-server";
import type { Lead, Operation, Property, PropertyLocation, PropertyOwnerContact, PropertyType, PublicProperty } from "@/types/property";

const dataDirectory = path.join(process.cwd(), "data");
const propertiesPath = path.join(dataDirectory, "properties.json");
const leadsPath = path.join(dataDirectory, "leads.json");
const uploadDirectory = path.join(process.cwd(), "public", "uploads");

type PropertyRow = {
  id: string;
  titulo: string;
  operacion: Operation;
  tipo: PropertyType;
  zona: string;
  precio: number | string;
  moneda: "MXN" | "USD";
  ubicacion: PropertyLocation;
  recamaras: number | string;
  banos: number | string;
  estacionamientos: number | string;
  superficie_construida: number | string;
  superficie_terreno: number | string;
  anio_construccion: number | string;
  descripcion: string;
  amenidades: string[] | null;
  imagenes: string[] | null;
  destacado: boolean;
  disponible: boolean;
  vistas: number;
  created_at: string;
};

type PropertyContactRow = {
  property_id: string;
  nombre: string;
  telefono: string;
  correo: string;
};

const emptyContact: PropertyOwnerContact = { nombre: "", telefono: "", correo: "" };

function contactToRow(property: Property): PropertyContactRow {
  return {
    property_id: property.id,
    nombre: property.contactoPropietario?.nombre ?? "",
    telefono: property.contactoPropietario?.telefono ?? "",
    correo: property.contactoPropietario?.correo ?? ""
  };
}

type LeadRow = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  mudanza: string;
  operacion: Operation;
  tipo: PropertyType;
  presupuesto: string;
  mensaje: string;
  property_id: string | null;
  created_at: string;
};

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

async function writeJson<T>(filePath: string, value: T) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function propertyFromRow(row: PropertyRow, contact?: PropertyContactRow): Property {
  return {
    id: row.id,
    titulo: row.titulo,
    operacion: row.operacion,
    tipo: row.tipo,
    zona: row.zona,
    precio: Number(row.precio),
    moneda: row.moneda,
    ubicacion: row.ubicacion,
    recamaras: Number(row.recamaras),
    banos: Number(row.banos),
    estacionamientos: Number(row.estacionamientos),
    superficieConstruida: Number(row.superficie_construida),
    superficieTerreno: Number(row.superficie_terreno),
    anioConstruccion: Number(row.anio_construccion),
    descripcion: row.descripcion,
    amenidades: row.amenidades ?? [],
    imagenes: row.imagenes ?? [],
    destacado: row.destacado,
    disponible: row.disponible,
    contactoPropietario: contact
      ? { nombre: contact.nombre, telefono: contact.telefono, correo: contact.correo }
      : emptyContact,
    vistas: row.vistas,
    createdAt: row.created_at
  };
}

function propertyToRow(property: Property): PropertyRow {
  return {
    id: property.id,
    titulo: property.titulo,
    operacion: property.operacion,
    tipo: property.tipo,
    zona: property.zona,
    precio: property.precio,
    moneda: property.moneda,
    ubicacion: property.ubicacion,
    recamaras: property.recamaras,
    banos: property.banos,
    estacionamientos: property.estacionamientos,
    superficie_construida: property.superficieConstruida,
    superficie_terreno: property.superficieTerreno,
    anio_construccion: property.anioConstruccion,
    descripcion: property.descripcion,
    amenidades: property.amenidades,
    imagenes: property.imagenes,
    destacado: property.destacado,
    disponible: property.disponible,
    vistas: property.vistas,
    created_at: property.createdAt
  };
}

/** The only shape ever sent to public pages/APIs — strips owner-contact info. */
export function toPublicProperty(property: Property): PublicProperty {
  const { contactoPropietario: _contactoPropietario, ...publicProperty } = property;
  return publicProperty;
}

function leadFromRow(row: LeadRow): Lead {
  return {
    id: row.id,
    nombre: row.nombre,
    telefono: row.telefono,
    email: row.email,
    mudanza: row.mudanza,
    operacion: row.operacion,
    tipo: row.tipo,
    presupuesto: row.presupuesto,
    mensaje: row.mensaje,
    propertyId: row.property_id ?? undefined,
    createdAt: row.created_at
  };
}

function leadToRow(lead: Lead): LeadRow {
  return {
    id: lead.id,
    nombre: lead.nombre,
    telefono: lead.telefono,
    email: lead.email,
    mudanza: lead.mudanza,
    operacion: lead.operacion,
    tipo: lead.tipo,
    presupuesto: lead.presupuesto,
    mensaje: lead.mensaje,
    property_id: lead.propertyId ?? null,
    created_at: lead.createdAt
  };
}

async function getLocalProperties() {
  const properties = await readJson<Property[]>(propertiesPath, []);
  return properties
    .map((property) => ({
      ...property,
      disponible: property.disponible ?? true,
      contactoPropietario: property.contactoPropietario ?? emptyContact
    }))
    .sort((first, second) => {
      if (first.destacado !== second.destacado) {
        return first.destacado ? -1 : 1;
      }

      return second.precio - first.precio;
    });
}

function throwSupabaseError(action: string, error: unknown): never {
  const message = error instanceof Error ? error.message : JSON.stringify(error);
  throw new Error(`Supabase ${action} failed: ${message}`);
}

export async function getProperties() {
  if (!isSupabaseConfigured()) {
    return getLocalProperties();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("destacado", { ascending: false })
    .order("precio", { ascending: false });

  if (error) throwSupabaseError("properties select", error);

  const { data: contactRows, error: contactError } = await supabase.from("property_contacts").select("*");
  if (contactError) throwSupabaseError("property contacts select", contactError);

  const contactById = new Map(
    ((contactRows ?? []) as PropertyContactRow[]).map((contact) => [contact.property_id, contact])
  );

  return ((data ?? []) as PropertyRow[]).map((row) => propertyFromRow(row, contactById.get(row.id)));
}

export async function getProperty(id: string) {
  if (!isSupabaseConfigured()) {
    const properties = await getLocalProperties();
    return properties.find((property) => property.id === id);
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();

  if (error) throwSupabaseError("property select", error);
  if (!data) return undefined;

  const { data: contact, error: contactError } = await supabase
    .from("property_contacts")
    .select("*")
    .eq("property_id", id)
    .maybeSingle();

  if (contactError) throwSupabaseError("property contact select", contactError);

  return propertyFromRow(data as PropertyRow, (contact as PropertyContactRow) ?? undefined);
}

export async function addProperty(property: Property) {
  if (!isSupabaseConfigured()) {
    const properties = await readJson<Property[]>(propertiesPath, []);
    const nextProperties = [property, ...properties.filter((item) => item.id !== property.id)];
    await writeJson(propertiesPath, nextProperties);
    return property;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("properties").upsert(propertyToRow(property), { onConflict: "id" });
  if (error) throwSupabaseError("property upsert", error);

  const { error: contactError } = await supabase
    .from("property_contacts")
    .upsert(contactToRow(property), { onConflict: "property_id" });
  if (contactError) throwSupabaseError("property contact upsert", contactError);

  return property;
}

export async function updateProperty(property: Property) {
  if (!isSupabaseConfigured()) {
    const properties = await readJson<Property[]>(propertiesPath, []);
    const exists = properties.some((item) => item.id === property.id);
    if (!exists) {
      return null;
    }
    const nextProperties = properties.map((item) => (item.id === property.id ? property : item));
    await writeJson(propertiesPath, nextProperties);
    return property;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .update(propertyToRow(property))
    .eq("id", property.id)
    .select("*")
    .maybeSingle();

  if (error) throwSupabaseError("property update", error);
  if (!data) return null;

  const { error: contactError } = await supabase
    .from("property_contacts")
    .upsert(contactToRow(property), { onConflict: "property_id" });
  if (contactError) throwSupabaseError("property contact upsert", contactError);

  return propertyFromRow(data as PropertyRow, contactToRow(property));
}

export async function deleteProperty(id: string) {
  if (!isSupabaseConfigured()) {
    const properties = await readJson<Property[]>(propertiesPath, []);
    const target = properties.find((item) => item.id === id);
    if (!target) {
      return null;
    }
    const nextProperties = properties.filter((item) => item.id !== id);
    await writeJson(propertiesPath, nextProperties);
    await unlinkUploadedImages(target.imagenes);
    return target;
  }

  const existing = await getProperty(id);
  if (!existing) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) throwSupabaseError("property delete", error);

  await unlinkUploadedImages(existing.imagenes);
  return existing;
}

function getSupabaseStoragePath(image: string) {
  const bucket = getSupabaseStorageBucket();
  const publicPrefix = `/storage/v1/object/public/${bucket}/`;
  const publicIndex = image.indexOf(publicPrefix);

  if (publicIndex >= 0) {
    return decodeURIComponent(image.slice(publicIndex + publicPrefix.length));
  }

  const storagePrefix = `supabase://${bucket}/`;
  if (image.startsWith(storagePrefix)) {
    return image.slice(storagePrefix.length);
  }

  const supabaseUrl = getSupabaseUrl();
  if (supabaseUrl && image.startsWith(`${supabaseUrl}/storage/v1/object/public/${bucket}/`)) {
    return decodeURIComponent(image.replace(`${supabaseUrl}/storage/v1/object/public/${bucket}/`, ""));
  }

  return null;
}

export async function unlinkUploadedImages(imagePaths: string[]) {
  const supabasePaths = imagePaths.map(getSupabaseStoragePath).filter((image): image is string => Boolean(image));

  if (isSupabaseConfigured() && supabasePaths.length) {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.storage.from(getSupabaseStorageBucket()).remove(supabasePaths);

    if (error) throwSupabaseError("storage remove", error);
  }

  await Promise.all(
    imagePaths
      .filter((image) => image.startsWith("/uploads/"))
      .map(async (image) => {
        const filename = image.replace(/^\/uploads\//, "");
        const fullPath = path.join(uploadDirectory, filename);
        try {
          await fs.unlink(fullPath);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw error;
          }
        }
      })
  );
}

export async function addLead(lead: Lead) {
  if (!isSupabaseConfigured()) {
    const leads = await readJson<Lead[]>(leadsPath, []);
    await writeJson(leadsPath, [lead, ...leads]);
    return lead;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("leads").insert(leadToRow(lead));

  if (error) throwSupabaseError("lead insert", error);
  return lead;
}

export async function getLeads() {
  if (!isSupabaseConfigured()) {
    const leads = await readJson<Lead[]>(leadsPath, []);
    return leads.sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });

  if (error) throwSupabaseError("leads select", error);
  return ((data ?? []) as LeadRow[]).map(leadFromRow);
}

export async function getLeadsForProperty(propertyId: string) {
  if (!isSupabaseConfigured()) {
    const leads = await getLeads();
    return leads.filter((lead) => lead.propertyId === propertyId);
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) throwSupabaseError("leads for property select", error);
  return ((data ?? []) as LeadRow[]).map(leadFromRow);
}

export async function countPropertiesByZone() {
  const counts: Record<string, number> = {};

  if (!isSupabaseConfigured()) {
    const properties = await readJson<Property[]>(propertiesPath, []);
    for (const property of properties) {
      if (property.zona) {
        counts[property.zona] = (counts[property.zona] ?? 0) + 1;
      }
    }
    return counts;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("properties").select("zona");

  if (error) throwSupabaseError("zone count select", error);

  for (const property of (data ?? []) as Array<{ zona: string }>) {
    if (property.zona) {
      counts[property.zona] = (counts[property.zona] ?? 0) + 1;
    }
  }

  return counts;
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generateUniqueId(title: string) {
  const base = slugify(title) || "propiedad";

  if (!isSupabaseConfigured()) {
    const properties = await getLocalProperties();
    const existing = new Set(properties.map((property) => property.id));
    if (!existing.has(base)) return base;
    let suffix = 2;
    while (existing.has(`${base}-${suffix}`)) suffix += 1;
    return `${base}-${suffix}`;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("properties").select("id").like("id", `${base}%`);
  if (error) throwSupabaseError("property id lookup", error);

  const existing = new Set((data ?? []).map((row) => (row as { id: string }).id));
  if (!existing.has(base)) return base;

  let suffix = 2;
  while (existing.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}
