import { NextResponse } from "next/server";
import { listDir, getFile } from "@/lib/github";
import type { Project } from "@/lib/types";

export async function GET() {
  try {
    const dirs = await listDir("projects");
    const projects: Project[] = [];

    for (const dir of dirs) {
      if (dir.type !== "dir") continue;
      let readme = "";
      let status = "aktiv";
      try {
        readme = await getFile(`projects/${dir.name}/README.md`);
        // Try to extract status from README frontmatter or first line
        const statusMatch = readme.match(/status:\s*(.+)/i);
        if (statusMatch) status = statusMatch[1].trim();
      } catch {
        readme = "Kein README verfügbar.";
      }

      projects.push({
        id: dir.name,
        name: dir.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        readme,
        status,
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
