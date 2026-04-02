import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
const COOKIE = "pocket_session";

function sign(value: string): string {
  const hmac = createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verify(signed: string): string | null {
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return null;
  const value = signed.slice(0, lastDot);
  const expected = sign(value);
  try {
    if (timingSafeEqual(Buffer.from(signed), Buffer.from(expected))) return value;
  } catch {
    return null;
  }
  return null;
}

export function makeSessionCookie(): string {
  const value = sign(`authenticated.${Date.now()}`);
  return value;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE);
  if (!session) return false;
  return verify(session.value) !== null;
}
