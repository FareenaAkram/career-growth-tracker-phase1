export default function LearnLoading() {
  return (
    <div style={{ display: "flex", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="sk" style={{ width: 60, height: 14, borderRadius: 4 }} />
          <div className="sk" style={{ width: 8, height: 14, borderRadius: 4 }} />
          <div className="sk" style={{ width: 120, height: 14, borderRadius: 4 }} />
        </div>

        {/* Video area */}
        <div className="sk" style={{ height: 340, borderRadius: 18 }} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {[80,80,60,80].map((w,i) => <div key={i} className="sk" style={{ width: w, height: 40, borderRadius: 10 }} />)}
        </div>

        {/* Content */}
        <div style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          {[1,2,3,4,5].map(i => <div key={i} className="sk" style={{ height: 16, width: i % 2 === 0 ? "88%" : "100%", borderRadius: 5 }} />)}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Progress ring */}
        <div style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div className="sk" style={{ width: 100, height: 100, borderRadius: "50%" }} />
          <div className="sk" style={{ width: "70%", height: 16, borderRadius: 5 }} />
        </div>
        {/* Module list */}
        <div style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 18 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <div className="sk" style={{ width: 20, height: 20, borderRadius: "50%" }} />
              <div className="sk" style={{ flex: 1, height: 14, borderRadius: 5 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
