import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addProperty, generateUniqueId, getProperties, toPublicProperty } from "@/lib/cms";
import type { Operation, Property, PropertyType } from "@/types/property";
import { numberFromForm, parseAmenities, saveImages, textFromForm } from "@/lib/properties-form";
import { resolveMapEmbedQuery } from "@/lib/google-maps";

export const runtime = "nodejs";

export async function GET() {
  const properties = await getProperties();
  return NextResponse.json(properties.filter((property) => property.disponible).map(toPublicProperty));
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
  if (!zonaRaw) {
    return NextResponse.json({ message: "La zona es obligatoria." }, { status: 400 });
  }

  const precio = numberFromForm(formData, "precio");
  if (!precio) {
    return NextResponse.json({ message: "El precio es obligatorio." }, { status: 400 });
  }

  const ciudad = textFromForm(formData, "ciudad");
  if (!ciudad) {
    return NextResponse.json({ message: "La ciudad es obligatoria." }, { status: 400 });
  }

  const estado = textFromForm(formData, "estado");
  if (!estado) {
    return NextResponse.json({ message: "El estado es obligatorio." }, { status: 400 });
  }

  const direccion = textFromForm(formData, "direccion");
  if (!direccion) {
    return NextResponse.json({ message: "La dirección es obligatoria." }, { status: 400 });
  }

  const descripcion = textFromForm(formData, "descripcion");
  if (!descripcion) {
    return NextResponse.json({ message: "La descripción es obligatoria." }, { status: 400 });
  }

  const id = await generateUniqueId(title);
  const newImages = await saveImages(formData, title);
  const images = newImages.length ? newImages : ["/images/hero-property.png"];

  const googleMapsUrl = textFromForm(formData, "googleMapsUrl");
  const mapEmbedQuery = await resolveMapEmbedQuery(googleMapsUrl, `${direccion}, ${ciudad}, ${estado}`);

  const property: Property = {
    id,
    titulo: title,
    operacion: textFromForm(formData, "operacion") as Operation,
    tipo: textFromForm(formData, "tipo") as PropertyType,
    zona: zonaRaw,
    precio,
    moneda: textFromForm(formData, "moneda") === "USD" ? "USD" : "MXN",
    ubicacion: {
      direccion,
      ciudad,
      estado,
      googleMapsUrl,
      mapEmbedQuery
    },
    recamaras: numberFromForm(formData, "recamaras"),
    banos: numberFromForm(formData, "banos"),
    estacionamientos: numberFromForm(formData, "estacionamientos"),
    superficieConstruida: numberFromForm(formData, "superficieConstruida"),
    superficieTerreno: numberFromForm(formData, "superficieTerreno"),
    anioConstruccion: numberFromForm(formData, "anioConstruccion"),
    descripcion,
    amenidades: parseAmenities(formData),
    imagenes: images,
    destacado: formData.get("destacado") === "on",
    disponible: formData.get("disponible") === "on",
    contactoPropietario: {
      nombre: textFromForm(formData, "propietarioNombre"),
      telefono: textFromForm(formData, "propietarioTelefono"),
      correo: textFromForm(formData, "propietarioCorreo")
    },
    vistas: 0,
    createdAt: new Date().toISOString()
  };

  await addProperty(property);
  return NextResponse.json(property, { status: 201 });
}
