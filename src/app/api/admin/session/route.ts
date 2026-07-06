import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  adminSessionCookieName,
  createAdminSessionValue,
  isValidAdminPassword
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { password?: string };

  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ message: "Envía la clave de acceso." }, { status: 400 });
  }

  if (!body.password || !isValidAdminPassword(body.password)) {
    return NextResponse.json({ message: "Clave de acceso inválida." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookieName, createAdminSessionValue(), adminCookieOptions);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookieName, "", {
    ...adminCookieOptions,
    maxAge: 0
  });
  return response;
}
