import { RowSkeleton } from "@/components/ui/Skeleton";

export default function JobsLoading() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div className="sk" style={{ width: 160, height: 32, borderRadius: 10, marginBottom: 8 }} />
        <div className="sk" style={{ width: 260, height: 16, borderRadius: 6 }} />
      </div>

      {/* Tech tag filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[100,90,110,95,80,100,90].map((w,i) => (
          <div key={i} className="sk" style={{ width: w, height: 36, borderRadius: 99 }} />
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 380px" }}>
        {/* Job list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
        {/* Right panel */}
        <div style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24, height: 500 }}>
          <div className="sk" style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 20px" }} />
          <div className="sk" style={{ height: 24, borderRadius: 8, marginBottom: 10 }} />
          <div className="sk" style={{ height: 16, width: "70%", borderRadius: 6, margin: "0 auto 20px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1,2,3,4].map(i => <div key={i} className="sk" style={{ height: 14, borderRadius: 5 }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
