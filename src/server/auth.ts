import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import mysql from "mysql2/promise";

const cookieName = "apgb_admin_session";

export type AdminRole = "admin" | "editor";

export type AdminIdentity = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
};

type Environment = Record<string, string | undefined>;

export type UpdateAdminProfileInput = {
  name: string;
  password?: string;
};

type SupabaseAdminProfile = {
  name: string | null;
  role: AdminRole | null;
  active: boolean | null;
};

function secret(): Uint8Array | null {
  return process.env.AUTH_SECRET ? new TextEncoder().encode(process.env.AUTH_SECRET) : null;
}

function safeEqual(leftValue: string, rightValue: string): boolean {
  const left = Buffer.from(leftValue);
  const right = Buffer.from(rightValue);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isAdminConfigured(environment: Environment = process.env): boolean {
  const driver = environment.AUTH_DRIVER || "local";
  if (!environment.AUTH_SECRET) return false;
  if (driver === "supabase") {
    return Boolean(environment.NEXT_PUBLIC_SUPABASE_URL && environment.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }
  if (driver === "mariadb") return Boolean(environment.DATABASE_URL);
  return Boolean(environment.ADMIN_PASSWORD);
}

export function authenticateLocalAdmin(
  email: string,
  password: string,
  environment: Environment = process.env,
): AdminIdentity | null {
  const configuredPassword = environment.ADMIN_PASSWORD;
  const configuredEmail = environment.ADMIN_EMAIL || "";
  if (!configuredPassword || !safeEqual(password, configuredPassword)) return null;
  if (configuredEmail && !safeEqual(email.trim().toLowerCase(), configuredEmail.trim().toLowerCase())) return null;
  return {
    id: "local-admin",
    email: configuredEmail || email || "admin@apgb.local",
    name: environment.ADMIN_NAME || "Administrador APGB",
    role: "admin",
  };
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminIdentity | null> {
  const driver = process.env.AUTH_DRIVER || "local";
  if (driver === "supabase") return authenticateSupabase(email, password);
  if (driver === "mariadb") return authenticateMariaDb(email, password);
  return authenticateLocalAdmin(email, password);
}

async function authenticateSupabase(email: string, password: string): Promise<AdminIdentity | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const client = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user) return null;
  const { data: profile } = await client
    .from("admin_profiles")
    .select("name, role, active")
    .eq("user_id", data.user.id)
    .maybeSingle<SupabaseAdminProfile>();
  if (profile) {
    if (profile.active === false || (profile.role !== "admin" && profile.role !== "editor")) return null;
    return {
      id: data.user.id,
      email: data.user.email || email,
      name: profile.name || data.user.email || "Equipa APGB",
      role: profile.role,
    };
  }
  const role = data.user.app_metadata.role;
  if (role !== "admin" && role !== "editor") return null;
  return {
    id: data.user.id,
    email: data.user.email || email,
    name: String(data.user.app_metadata.name || data.user.email || "Equipa APGB"),
    role,
  };
}

async function authenticateMariaDb(email: string, password: string): Promise<AdminIdentity | null> {
  if (!process.env.DATABASE_URL) return null;
  const pool = mysql.createPool(process.env.DATABASE_URL);
  try {
    const [rows] = await pool.execute(
      "SELECT id, email, name, role, password_hash FROM admin_users WHERE email=? AND active=1 LIMIT 1",
      [email.trim().toLowerCase()],
    );
    const user = (rows as Array<AdminIdentity & { password_hash: string }>)[0];
    if (!user || !verifyScryptPassword(password, user.password_hash)) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } finally {
    await pool.end();
  }
}

function verifyScryptPassword(password: string, encoded: string): boolean {
  const [algorithm, salt, hash] = encoded.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const calculated = scryptSync(password, salt, Buffer.from(hash, "hex").length);
  return timingSafeEqual(calculated, Buffer.from(hash, "hex"));
}

function createScryptPassword(password: string): string {
  const salt = randomUUID();
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export async function updateAdminProfile(
  identity: AdminIdentity,
  input: UpdateAdminProfileInput,
): Promise<AdminIdentity> {
  const driver = process.env.AUTH_DRIVER || "local";
  if (driver === "supabase") return updateSupabaseAdminProfile(identity, input);
  if (driver === "mariadb") return updateMariaDbAdminProfile(identity, input);
  return { ...identity, name: input.name || identity.name };
}

async function updateSupabaseAdminProfile(
  identity: AdminIdentity,
  input: UpdateAdminProfileInput,
): Promise<AdminIdentity> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Configuracao Supabase incompleta.");
  const client = createClient(url, key, { auth: { persistSession: false } });
  if (input.password) {
    const { error } = await client.auth.admin.updateUserById(identity.id, { password: input.password });
    if (error) throw error;
  }
  const { data, error } = await client
    .from("admin_profiles")
    .update({ name: input.name, updated_at: new Date().toISOString() })
    .eq("user_id", identity.id)
    .select("name, role, active")
    .maybeSingle<SupabaseAdminProfile>();
  if (error) throw error;
  if (!data || data.active === false || (data.role !== "admin" && data.role !== "editor")) {
    throw new Error("Perfil administrativo invalido.");
  }
  return { ...identity, name: data.name || identity.name, role: data.role };
}

async function updateMariaDbAdminProfile(
  identity: AdminIdentity,
  input: UpdateAdminProfileInput,
): Promise<AdminIdentity> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL nao configurada.");
  const pool = mysql.createPool(process.env.DATABASE_URL);
  try {
    if (input.password) {
      await pool.execute(
        "UPDATE admin_users SET name=?, password_hash=? WHERE id=? AND active=1",
        [input.name, createScryptPassword(input.password), identity.id],
      );
    } else {
      await pool.execute(
        "UPDATE admin_users SET name=? WHERE id=? AND active=1",
        [input.name, identity.id],
      );
    }
    const [rows] = await pool.execute(
      "SELECT id, email, name, role FROM admin_users WHERE id=? AND active=1 LIMIT 1",
      [identity.id],
    );
    const user = (rows as AdminIdentity[])[0];
    if (!user || (user.role !== "admin" && user.role !== "editor")) throw new Error("Perfil administrativo invalido.");
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } finally {
    await pool.end();
  }
}

export function verifyAdminPassword(password: string): boolean {
  return Boolean(authenticateLocalAdmin("", password));
}

export function hasRequiredRole(identity: AdminIdentity, required: AdminRole): boolean {
  return identity.role === "admin" || required === "editor";
}

export async function createAdminSession(
  identity: AdminIdentity = authenticateLocalAdmin("", process.env.ADMIN_PASSWORD || "")!,
): Promise<void> {
  const key = secret();
  if (!key || !identity) throw new Error("Configuração administrativa incompleta.");
  const token = await new SignJWT(identity)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(identity.id)
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

export async function getAdminSession(): Promise<AdminIdentity | null> {
  const key = secret();
  if (!key) return null;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    if (
      typeof payload.sub !== "string"
      || typeof payload.email !== "string"
      || typeof payload.name !== "string"
      || (payload.role !== "admin" && payload.role !== "editor")
    ) return null;
    return { id: payload.sub, email: payload.email, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}

export async function hasAdminSession(): Promise<boolean> {
  return Boolean(await getAdminSession());
}

export async function requireAdminRole(required: AdminRole = "editor"): Promise<AdminIdentity | null> {
  const identity = await getAdminSession();
  return identity && hasRequiredRole(identity, required) ? identity : null;
}
