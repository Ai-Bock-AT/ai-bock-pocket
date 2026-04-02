import ProjektList from "@/components/projekte/ProjektList";

export default function ProjektePage() {
  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm px-4 py-3">
        <h1 className="font-bold text-foreground">Projekte</h1>
      </div>
      <ProjektList />
    </div>
  );
}
