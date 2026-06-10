import { timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const cookieName = "apgb_admin_session";

function secret(): Uint8Array | null {
  return process.env.AUTH_SECRET ? new TextEncoder().encode(process.env.AUTH_SECRET) : null;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET);
}

export function verifyAdminPassword(password: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  const left = Buffer.from(password);
  const right = Buffer.from(configured);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function createAdminSession(): Promise<void> {
  const key = secret();
  if (!key) throw new Error("AUTH_SECRET não configurado.");
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(key);
  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(cookieName);
}

export async function hasAdminSession(): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload.role === "admin";
  } catch {
    return false;
  }
}
