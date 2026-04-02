import { getFile, listDir } from "./github";

interface CacheEntry {
  prompt: string;
  loadedAt: number;
  contextCount: number;
  projectCount: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function buildSystemPrompt(): Promise<{ prompt: string; contextCount: number; projectCount: number }> {
  if (cache && Date.now() - cache.loadedAt < CACHE_TTL_MS) {
    return { prompt: cache.prompt, contextCount: cache.contextCount, projectCount: cache.projectCount };
  }

  const contextFiles = ["me.md", "work.md", "goals.md", "current-priorities.md", "team.md"];
  const sections: string[] = [];
  let loadedCount = 0;

  const contextLabels: Record<string, string> = {
    "me.md": "Über Harald",
    "work.md": "Arbeitskontext & Kunden",
    "goals.md": "Ziele",
    "current-priorities.md": "Aktuelle Prioritäten",
    "team.md": "Team",
  };

  for (const file of contextFiles) {
    try {
      const content = await getFile(`context/${file}`);
      sections.push(`## ${contextLabels[file]}\n${content.trim()}`);
      loadedCount++;
    } catch {
      // Context file not yet synced — skip silently
    }
  }

  // Load project READMEs
  let projectCount = 0;
  const projectSections: string[] = [];
  try {
    const projectDirs = await listDir("projects");
    for (const dir of projectDirs) {
      if (dir.type !== "dir") continue;
      try {
        const readme = await getFile(`projects/${dir.name}/README.md`);
        projectSections.push(`### ${dir.name}\n${readme.trim().slice(0, 800)}`);
        projectCount++;
      } catch {
        // No README — skip
      }
    }
  } catch {
    // No projects dir yet
  }

  const today = new Date().toLocaleDateString("de-AT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prompt = `Du bist der AI-BOCK Assistent — Haraldis mobiles Claude-Interface.
Harald betreibt die Agentur BOCK Digital und die AI-Bock Academy.

Heute ist ${today}.

${sections.join("\n\n")}

${projectSections.length > 0 ? `## Aktive Projekte\n${projectSections.join("\n\n")}` : ""}

## Deine Fähigkeiten
- Fragen zu Projekten, Kunden, Buchhaltung beantworten
- Texte schreiben (E-Mails, Angebote, Notizen)
- Hochgeladene Bilder und Dokumente analysieren
- Brainstorming und Ideenfindung
- Berechnungen und Analysen
- Inbox-Anweisungen für Claude Code auf dem Mac erstellen

## Was du NICHT kannst (→ als Inbox-Anweisung)
Wenn Harald etwas braucht das Dateizugriff, Code-Ausführung oder Bildgenerierung erfordert:
Erstelle eine strukturierte Inbox-Anweisung im Format:

---
INBOX-ANWEISUNG FÜR CLAUDE CODE:
Aufgabe: [Was zu tun ist]
Projekt: [Projektname]
Priorität: [hoch/normal/niedrig]
Kontext: [Relevante Infos aus dem Chat]
---

## Regeln
- Sprache: Deutsch
- Ton: Direkt, lösungsorientiert, kein Geschwafel
- Secrets/Zugangsdaten NIEMALS ausgeben`;

  cache = { prompt, loadedAt: Date.now(), contextCount: loadedCount, projectCount };
  return { prompt, contextCount: loadedCount, projectCount };
}

export function invalidateCache() {
  cache = null;
}
