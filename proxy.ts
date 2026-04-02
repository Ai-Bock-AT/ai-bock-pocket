import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "pocket_session";

function verify(signed: string): boolean {
  const secret = process.env.SESSION_SECRET || "dev-secret-change-me";
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return false;
  const value = signed.slice(0, lastDot);
  const expected = `${value}.${createHmac("sha256", secret).update(value).digest("hex")}`;
  try {
    return timingSafeEqual(Buffer.from(signed), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/manifest") ||
    pathname === "/login" ||
    pathname === "/api/auth/login"
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get(COOKIE);
  if (!session || !verify(session.value)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
