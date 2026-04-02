import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
const COOKIE = "pocket_session";

function sign(value: string): string {
  const hmac = createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${hmac}`;
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!process.env.POCKET_PASSWORD) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  if (password !== process.env.POCKET_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const value = sign(`authenticated.${Date.now()}`);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}
