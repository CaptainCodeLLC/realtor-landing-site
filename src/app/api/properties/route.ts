import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addProperty, getProperties, slugify } from "@/lib/cms";
import { isZone } from "@/types/property";
import type { Operation, Property, PropertyType, Zone } from "@/types/property";
import { numberFromForm, parseAmenities, saveImages, textFromForm } from "@/lib/properties-form";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getProperties());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Inicia sesión para publicar propiedades." }, { status: 401 });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Envía el formulario de propiedad con datos válidos." }, { status: 400 });
  }

  const title = textFromForm(formData, "titulo");

  if (!title) {
    return NextResponse.json({ message: "El título es obligatorio." }, { status: 400 });
  }

  const zonaRaw = textFromForm(formData, "zona");
  if (!isZone(zonaRaw)) {
    return NextResponse.json({ message: "La zona es obligatoria." }, { status: 400 });
  }

  const id = `${slugify(title)}-${crypto.randomUUID().slice(0, 8)}`;
  const newImages = await saveImages(formData, title);
  const images = newImages.length ? newImages : ["/images/hero-property.png"];

  const property: Property = {
    id,
    titulo: title,
    operacion: textFromForm(formData, "operacion") as Operation,
    tipo: textFromForm(formData, "tipo") as PropertyType,
    zona: zonaRaw as Zone,
    precio: numberFromForm(formData, "precio"),
    moneda: textFromForm(formData, "moneda") === "USD" ? "USD" : "MXN",
    ubicacion: {
      direccion: textFromForm(formData, "direccion"),
      ciudad: textFromForm(formData, "ciudad"),
      estado: textFromForm(formData, "estado"),
      lat: numberFromForm(formData, "lat"),
      lng: numberFromForm(formData, "lng")
    },
    recamaras: numberFromForm(formData, "recamaras"),
    banos: numberFromForm(formData, "banos"),
    estacionamientos: numberFromForm(formData, "estacionamientos"),
    superficieConstruida: numberFromForm(formData, "superficieConstruida"),
    superficieTerreno: numberFromForm(formData, "superficieTerreno"),
    anioConstruccion: numberFromForm(formData, "anioConstruccion"),
    descripcion: textFromForm(formData, "descripcion"),
    amenidades: parseAmenities(formData),
    imagenes: images,
    destacado: formData.get("destacado") === "on",
    vistas: 0,
    createdAt: new Date().toISOString()
  };

  await addProperty(property);
  return NextResponse.json(property, { status: 201 });
}
