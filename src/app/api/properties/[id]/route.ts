import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteProperty, getProperty, unlinkUploadedImages, updateProperty } from "@/lib/cms";
import type { Operation, Property, PropertyType } from "@/types/property";
import {
  numberFromForm,
  parseAmenities,
  parseExistingImages,
  saveImages,
  textFromForm
} from "@/lib/properties-form";
import { resolveMapEmbedQuery } from "@/lib/google-maps";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Inicia sesión para editar propiedades." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getProperty(id);
  if (!existing) {
    return NextResponse.json({ message: "Propiedad no encontrada." }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Envía el formulario con datos válidos." }, { status: 400 });
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

  const keptImages = parseExistingImages(formData);
  const removedImages = existing.imagenes.filter((image) => !keptImages.includes(image));
  const newImages = await saveImages(formData, title);
  const images = [...keptImages, ...newImages];

  const googleMapsUrl = textFromForm(formData, "googleMapsUrl");
  const mapEmbedQuery = await resolveMapEmbedQuery(googleMapsUrl, `${direccion}, ${ciudad}, ${estado}`);

  const updated: Property = {
    ...existing,
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
    imagenes: images.length ? images : ["/images/hero-property.png"],
    destacado: formData.get("destacado") === "on",
    disponible: formData.get("disponible") === "on",
    contactoPropietario: {
      nombre: textFromForm(formData, "propietarioNombre"),
      telefono: textFromForm(formData, "propietarioTelefono"),
      correo: textFromForm(formData, "propietarioCorreo")
    }
  };

  await updateProperty(updated);
  await unlinkUploadedImages(removedImages);

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Inicia sesión para eliminar propiedades." }, { status: 401 });
  }

  const { id } = await params;
  const removed = await deleteProperty(id);
  if (!removed) {
    return NextResponse.json({ message: "Propiedad no encontrada." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
