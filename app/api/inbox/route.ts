import { NextRequest, NextResponse } from "next/server";
import { listDir, getFile, createFile } from "@/lib/github";
import type { InboxItem } from "@/lib/types";

function parseInboxItem(content: string, filename: string, sha: string): InboxItem {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!frontmatterMatch) {
    return {
      id: filename.replace(".md", ""),
      title: filename.replace(".md", ""),
      body: content,
      project: "allgemein",
      priority: "normal",
      status: "offen",
      created: new Date().toISOString(),
      filename,
      sha,
    };
  }

  const meta = frontmatterMatch[1];
  const body = frontmatterMatch[2].trim();

  function getMeta(key: string): string {
    const m = meta.match(new RegExp(`^${key}:\\s*(.+)`, "m"));
    return m ? m[1].trim() : "";
  }

  return {
    id: getMeta("id") || filename.replace(".md", ""),
    title: getMeta("title") || filename.replace(".md", ""),
    body,
    project: getMeta("project") || "allgemein",
    priority: (getMeta("priority") as InboxItem["priority"]) || "normal",
    status: (getMeta("status") as InboxItem["status"]) || "offen",
    created: getMeta("created") || new Date().toISOString(),
    filename,
    sha,
  };
}

export async function GET() {
  try {
    const files = await listDir("inbox");
    const mdFiles = files.filter((f) => f.type === "file" && f.name.endsWith(".md"));

    const items: InboxItem[] = [];
    for (const file of mdFiles) {
      try {
        const content = await getFile(file.path);
        items.push(parseInboxItem(content, file.name, file.sha));
      } catch {
        // skip unreadable file
      }
    }

    // Sort by created desc
    items.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, body, project, priority } = await request.json();

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9äöü]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    const id = `${dateStr}-${slug}`;
    const filename = `${id}.md`;

    const content = `---
id: ${id}
title: ${title}
project: ${project || "allgemein"}
priority: ${priority || "normal"}
status: offen
created: ${now.toISOString()}
---

${body || ""}
`;

    await createFile(`inbox/${filename}`, content, `inbox: ${title}`);
    return NextResponse.json({ ok: true, id, filename });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
