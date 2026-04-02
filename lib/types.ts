export interface InboxItem {
  id: string;
  title: string;
  body: string;
  project: string;
  priority: "niedrig" | "normal" | "hoch" | "kritisch";
  status: "offen" | "in-arbeit" | "erledigt";
  created: string;
  filename: string;
  sha?: string;
}

export interface Project {
  id: string;
  name: string;
  readme: string;
  status: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const PROJECTS = [
  "hirter",
  "hirter-buchungssystem",
  "hirter-gewinnspiel-app",
  "ksvl",
  "gartenwelt-kropfitsch",
  "marwin-solutions",
  "create-carinthia",
  "ai-bock-academy",
  "sfs-website",
  "cocoon-sportsware",
  "uniwirt",
  "mail-manager",
  "web-apps",
  "pupa",
  "allgemein",
] as const;

export type ProjectId = typeof PROJECTS[number];
