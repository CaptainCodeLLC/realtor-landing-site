import { promises as fs } from "fs";
import path from "path";
import type { Lead, Property, Zone } from "@/types/property";
import { zones } from "@/types/property";

const dataDirectory = path.join(process.cwd(), "data");
const propertiesPath = path.join(dataDirectory, "properties.json");
const leadsPath = path.join(dataDirectory, "leads.json");
const uploadDirectory = path.join(process.cwd(), "public", "uploads");

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

export async function getProperties() {
  const properties = await readJson<Property[]>(propertiesPath, []);
  return properties.sort((first, second) => {
    if (first.destacado !== second.destacado) {
      return first.destacado ? -1 : 1;
    }

    return second.precio - first.precio;
  });
}

export async function getProperty(id: string) {
  const properties = await getProperties();
  return properties.find((property) => property.id === id);
}

export async function addProperty(property: Property) {
  const properties = await readJson<Property[]>(propertiesPath, []);
  const nextProperties = [property, ...properties.filter((item) => item.id !== property.id)];
  await writeJson(propertiesPath, nextProperties);
  return property;
}

export async function updateProperty(property: Property) {
  const properties = await readJson<Property[]>(propertiesPath, []);
  const exists = properties.some((item) => item.id === property.id);
  if (!exists) {
    return null;
  }
  const nextProperties = properties.map((item) => (item.id === property.id ? property : item));
  await writeJson(propertiesPath, nextProperties);
  return property;
}

export async function deleteProperty(id: string) {
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

export async function unlinkUploadedImages(imagePaths: string[]) {
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
  const leads = await readJson<Lead[]>(leadsPath, []);
  await writeJson(leadsPath, [lead, ...leads]);
  return lead;
}

export async function getLeads() {
  const leads = await readJson<Lead[]>(leadsPath, []);
  return leads.sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export async function getLeadsForProperty(propertyId: string) {
  const leads = await getLeads();
  return leads.filter((lead) => lead.propertyId === propertyId);
}

export async function countPropertiesByZone() {
  const properties = await readJson<Property[]>(propertiesPath, []);
  const counts = Object.fromEntries(zones.map((zone) => [zone, 0])) as Record<Zone, number>;
  for (const property of properties) {
    if (property.zona && counts[property.zona] !== undefined) {
      counts[property.zona] += 1;
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
