import { RowSkeleton } from "@/components/ui/Skeleton";

export default function BookmarksLoading() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="sk" style={{ width: 190, height: 36, borderRadius: 10, marginBottom: 8 }} />
        <div className="sk" style={{ width: 260, height: 16, borderRadius: 6 }} />
      </div>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[60, 80, 100, 70].map((w,i) => (
          <div key={i} className="sk" style={{ width: w, height: 36, borderRadius: 10 }} />
        ))}
      </div>
      {/* Search */}
      <div className="sk" style={{ height: 48, borderRadius: 14, marginBottom: 20 }} />
      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: 7 }).map((_, i) => <RowSkeleton key={i} />)}
      </div>
    </div>
  );
}
