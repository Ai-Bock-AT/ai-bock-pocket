import { NextRequest, NextResponse } from "next/server";
import { getFile, updateFile, deleteFile, listDir } from "@/lib/github";

async function findFile(id: string): Promise<{ path: string; sha: string; content: string } | null> {
  const files = await listDir("inbox");
  const match = files.find((f) => f.name === `${id}.md` || f.name.startsWith(id));
  if (!match) return null;
  const content = await getFile(match.path);
  return { path: match.path, sha: match.sha, content };
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const file = await findFile(id);
    if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = file.content.replace(/^status: .+$/m, `status: ${status}`);
    await updateFile(file.path, updated, file.sha, `inbox: update status → ${status}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const file = await findFile(id);
    if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await deleteFile(file.path, file.sha, `inbox: delete ${id}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
