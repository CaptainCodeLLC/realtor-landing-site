import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const adminSessionCookieName = "mara_admin_session";

const sessionMaxAge = 60 * 60 * 8;

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: sessionMaxAge
};

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? process.env.ADMIN_TOKEN ?? "mara-demo";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_TOKEN ?? "mara-demo-session";
}

function signSession(issuedAt: string) {
  return createHmac("sha256", getSessionSecret()).update(issuedAt).digest("hex");
}

function safeCompare(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}

export function isValidAdminPassword(password: string) {
  return safeCompare(password, getAdminPassword());
}

export function createAdminSessionValue() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${signSession(issuedAt)}`;
}

export function isValidAdminSessionValue(value?: string) {
  if (!value) return false;

  const [issuedAt, signature] = value.split(".");
  if (!issuedAt || !signature || !Number.isFinite(Number(issuedAt))) return false;

  const ageInSeconds = (Date.now() - Number(issuedAt)) / 1000;
  if (ageInSeconds > sessionMaxAge) return false;

  return safeCompare(signature, signSession(issuedAt));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return isValidAdminSessionValue(cookieStore.get(adminSessionCookieName)?.value);
}
