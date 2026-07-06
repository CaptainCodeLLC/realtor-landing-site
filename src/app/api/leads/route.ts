import { NextResponse } from "next/server";
import { addLead } from "@/lib/cms";
import type { Lead } from "@/types/property";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Omit<Lead, "id" | "createdAt">;

  try {
    body = (await request.json()) as Omit<Lead, "id" | "createdAt">;
  } catch {
    return NextResponse.json({ message: "Envía la solicitud con datos válidos." }, { status: 400 });
  }

  if (!body.nombre || !body.telefono) {
    return NextResponse.json({ message: "Faltan datos obligatorios." }, { status: 400 });
  }

  const lead: Lead = {
    id: crypto.randomUUID(),
    nombre: body.nombre,
    telefono: body.telefono,
    email: body.email || "",
    mudanza: body.mudanza || "",
    operacion: body.operacion,
    tipo: body.tipo,
    presupuesto: body.presupuesto || "",
    mensaje: body.mensaje || "",
    propertyId: body.propertyId || undefined,
    createdAt: new Date().toISOString()
  };

  await addLead(lead);
  return NextResponse.json(lead, { status: 201 });
}
