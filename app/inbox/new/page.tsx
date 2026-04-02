import NewInboxForm from "@/components/inbox/NewInboxForm";

export default function NewInboxPage() {
  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm px-4 py-3">
        <h1 className="font-bold text-foreground">Quick Capture</h1>
      </div>
      <NewInboxForm />
    </div>
  );
}
