import { StatSkeleton, ChartSkeleton } from "@/components/ui/Skeleton";

export default function AnalyticsLoading() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>
      {/* Header + selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div className="sk" style={{ width: 200, height: 34, borderRadius: 10, marginBottom: 8 }} />
          <div className="sk" style={{ width: 300, height: 16, borderRadius: 6 }} />
        </div>
        <div className="sk" style={{ width: 180, height: 44, borderRadius: 12 }} />
      </div>

      {/* Stat chips */}
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", marginBottom: 28 }}>
        {[1,2,3,4].map(i => <StatSkeleton key={i} />)}
      </div>

      {/* Charts grid */}
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr", marginBottom: 20 }}>
        <ChartSkeleton h={260} />
        <ChartSkeleton h={260} />
      </div>
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }}>
        <ChartSkeleton h={240} />
        <ChartSkeleton h={240} />
      </div>
    </div>
  );
}
