import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/context-loader";

export async function GET() {
  try {
    const { contextCount, projectCount } = await buildSystemPrompt();
    return NextResponse.json({ contextCount, projectCount });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
