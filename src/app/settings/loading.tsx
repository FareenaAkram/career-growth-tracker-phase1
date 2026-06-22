export default function SettingsLoading() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <div className="sk" style={{ width: 150, height: 36, borderRadius: 10, marginBottom: 8 }} />
        <div className="sk" style={{ width: 240, height: 16, borderRadius: 6 }} />
      </div>

      {/* Profile section */}
      <div style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28, marginBottom: 20 }}>
        <div className="sk" style={{ width: 130, height: 18, borderRadius: 6, marginBottom: 24 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div className="sk" style={{ width: 80, height: 80, borderRadius: "50%" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="sk" style={{ height: 48, borderRadius: 12 }} />
            <div className="sk" style={{ height: 48, borderRadius: 12 }} />
          </div>
        </div>
      </div>

      {/* Career goal */}
      <div style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28, marginBottom: 20 }}>
        <div className="sk" style={{ width: 140, height: 18, borderRadius: 6, marginBottom: 20 }} />
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
          {[1,2,3,4].map(i => <div key={i} className="sk" style={{ height: 56, borderRadius: 12 }} />)}
        </div>
      </div>

      {/* Learning pace */}
      <div style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28, marginBottom: 20 }}>
        <div className="sk" style={{ width: 150, height: 18, borderRadius: 6, marginBottom: 20 }} />
        <div style={{ display: "flex", gap: 12 }}>
          {[1,2,3].map(i => <div key={i} className="sk" style={{ flex: 1, height: 80, borderRadius: 14 }} />)}
        </div>
      </div>

      <div className="sk" style={{ height: 48, borderRadius: 12 }} />
    </div>
  );
}
