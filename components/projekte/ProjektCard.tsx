import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

interface Props {
  project: Project;
}

export default function ProjektCard({ project }: Props) {
  const preview = project.readme
    .replace(/^#.*$/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\*\*/g, "")
    .trim()
    .slice(0, 150);

  return (
    <div className="rounded-xl border border-border bg-card p-4 bock-animate-in">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-foreground leading-tight">{project.name}</h3>
        <Badge
          variant="outline"
          className="shrink-0 text-xs border-green-500/30 bg-green-500/10 text-green-400"
        >
          {project.status}
        </Badge>
      </div>
      {preview && (
        <p className="text-sm text-muted-foreground line-clamp-3">{preview}</p>
      )}
    </div>
  );
}
