import { CardSkeleton } from "@/components/ui/Skeleton";

export default function ProjectsLoading() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="sk" style={{ width: 180, height: 36, borderRadius: 10, marginBottom: 8 }} />
        <div className="sk" style={{ width: 300, height: 16, borderRadius: 6 }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[80,100,90,110,80,90,100].map((w,i) => (
          <div key={i} className="sk" style={{ width: w, height: 36, borderRadius: 10 }} />
        ))}
      </div>
      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))" }}>
        {Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
