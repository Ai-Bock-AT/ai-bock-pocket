import InboxList from "@/components/inbox/InboxList";

export default function InboxPage() {
  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm px-4 py-3">
        <h1 className="font-bold text-foreground">Inbox</h1>
      </div>
      <InboxList />
    </div>
  );
}
