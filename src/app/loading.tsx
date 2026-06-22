import { CardSkeleton } from "@/components/ui/Skeleton";

export default function GlobalLoading() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 4px" }}>
      {/* Hero skeleton */}
      <div style={{ marginBottom: 36 }}>
        <div className="sk" style={{ width: 200, height: 24, borderRadius: 99, marginBottom: 18 }} />
        <div className="sk" style={{ width: "55%", height: 52, borderRadius: 12, marginBottom: 10 }} />
        <div className="sk" style={{ width: "72%", height: 52, borderRadius: 12, marginBottom: 18 }} />
        <div className="sk" style={{ width: "40%", height: 18, borderRadius: 6 }} />
        {/* Stats row */}
        <div style={{ display: "flex", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="sk" style={{ width: 38, height: 38, borderRadius: 11 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div className="sk" style={{ width: 50, height: 20, borderRadius: 5 }} />
                <div className="sk" style={{ width: 70, height: 12, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter skeletons */}
      <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="sk" style={{ width: 380, height: 48, borderRadius: 14 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[80, 120, 70, 90, 110].map((w, i) => (
            <div key={i} className="sk" style={{ width: w, height: 36, borderRadius: 10 }} />
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
