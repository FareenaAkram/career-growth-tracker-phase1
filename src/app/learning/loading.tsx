import { CardSkeleton, StatSkeleton } from "@/components/ui/Skeleton";

export default function LearningLoading() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>
      {/* Stats row */}
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", marginBottom: 28 }}>
        {[1,2,3,4].map(i => <StatSkeleton key={i} />)}
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="sk" style={{ width: 400, height: 48, borderRadius: 14 }} />
        <div style={{ display: "flex", gap: 8 }}>
          {[60,90,110,80,100].map((w,i) => (
            <div key={i} className="sk" style={{ width: w, height: 36, borderRadius: 10 }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[50,80,120,90].map((w,i) => (
            <div key={i} className="sk" style={{ width: w, height: 32, borderRadius: 10 }} />
          ))}
        </div>
      </div>

      {/* Course card grid */}
      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))" }}>
        {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
