export default function CareerLoading() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 36, display: "flex", alignItems: "flex-start", gap: 20 }}>
        <div className="sk" style={{ width: 72, height: 72, borderRadius: 18 }} />
        <div style={{ flex: 1 }}>
          <div className="sk" style={{ width: "50%", height: 36, borderRadius: 10, marginBottom: 10 }} />
          <div className="sk" style={{ width: "75%", height: 16, borderRadius: 6, marginBottom: 6 }} />
          <div className="sk" style={{ width: "60%", height: 16, borderRadius: 6 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {[80,90,100,70].map((w,i) => <div key={i} className="sk" style={{ width: w, height: 28, borderRadius: 99 }} />)}
          </div>
        </div>
      </div>

      {/* Roadmap stages */}
      {["Beginner", "Intermediate", "Advanced"].map(stage => (
        <div key={stage} style={{ marginBottom: 32 }}>
          <div className="sk" style={{ width: 130, height: 24, borderRadius: 8, marginBottom: 16 }} />
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 18 }}>
                <div className="sk" style={{ width: "60%", height: 18, borderRadius: 6, marginBottom: 10 }} />
                <div className="sk" style={{ height: 13, borderRadius: 5, marginBottom: 6 }} />
                <div className="sk" style={{ height: 13, width: "80%", borderRadius: 5, marginBottom: 12 }} />
                <div className="sk" style={{ height: 6, borderRadius: 99 }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
