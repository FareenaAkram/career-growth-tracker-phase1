import { StatSkeleton, ChartSkeleton, RowSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="sk" style={{ width: 280, height: 36, borderRadius: 10, marginBottom: 10 }} />
        <div className="sk" style={{ width: 200, height: 16, borderRadius: 6 }} />
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", marginBottom: 28 }}>
        {[1,2,3,4].map(i => <StatSkeleton key={i} />)}
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }}>
        <ChartSkeleton h={220} />
        <ChartSkeleton h={220} />
      </div>

      {/* Activity feed */}
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="sk" style={{ width: 140, height: 18, borderRadius: 6, marginBottom: 4 }} />
        {[1,2,3].map(i => <RowSkeleton key={i} />)}
      </div>
    </div>
  );
}
