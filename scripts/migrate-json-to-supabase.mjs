import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();

async function loadEnvFile(filename) {
  try {
    const raw = await readFile(path.join(root, filename), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...valueParts] = trimmed.split("=");
      if (!process.env[key]) {
        process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function readJson(filename, fallback) {
  try {
    return JSON.parse(await readFile(path.join(root, filename), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

function propertyToRow(property) {
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
    amenidades: property.amenidades ?? [],
    imagenes: property.imagenes ?? [],
    destacado: property.destacado ?? false,
    vistas: property.vistas ?? 0,
    created_at: property.createdAt
  };
}

function leadToRow(lead) {
  return {
    id: lead.id,
    nombre: lead.nombre,
    telefono: lead.telefono,
    email: lead.email ?? "",
    mudanza: lead.mudanza ?? "",
    operacion: lead.operacion,
    tipo: lead.tipo,
    presupuesto: lead.presupuesto ?? "",
    mensaje: lead.mensaje ?? "",
    property_id: lead.propertyId ?? null,
    created_at: lead.createdAt
  };
}

await loadEnvFile(".env.local");
await loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before migrating.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    persistSession: false
  }
});

const properties = await readJson("data/properties.json", []);
const leads = await readJson("data/leads.json", []);

if (properties.length) {
  const { error } = await supabase.from("properties").upsert(properties.map(propertyToRow), { onConflict: "id" });
  if (error) throw error;
  console.log(`Migrated ${properties.length} properties.`);
} else {
  console.log("No properties to migrate.");
}

if (leads.length) {
  const { error } = await supabase.from("leads").upsert(leads.map(leadToRow), { onConflict: "id" });
  if (error) throw error;
  console.log(`Migrated ${leads.length} leads.`);
} else {
  console.log("No leads to migrate.");
}
