export default function AiCoachLoading() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gap: 20, gridTemplateColumns: "1fr 340px" }}>
      {/* Chat panel */}
      <div style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", gap: 16, minHeight: 600 }}>
        <div className="sk" style={{ width: 160, height: 24, borderRadius: 8 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, justifyContent: "flex-end" }}>
          {/* Incoming messages */}
          {[240, 180, 300].map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div className="sk" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
              <div className="sk" style={{ width: w, height: 44, borderRadius: 12 }} />
            </div>
          ))}
          {/* User messages */}
          {[160, 200].map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div className="sk" style={{ width: w, height: 38, borderRadius: 12 }} />
            </div>
          ))}
        </div>
        {/* Input */}
        <div className="sk" style={{ height: 52, borderRadius: 14 }} />
      </div>

      {/* Right sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 20 }}>
          <div className="sk" style={{ width: 120, height: 18, borderRadius: 6, marginBottom: 16 }} />
          {[1,2,3].map(i => <div key={i} className="sk" style={{ height: 40, borderRadius: 10, marginBottom: 8 }} />)}
        </div>
        <div style={{ background: "rgba(10,16,32,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 20 }}>
          <div className="sk" style={{ width: 100, height: 18, borderRadius: 6, marginBottom: 14 }} />
          {[1,2,3,4].map(i => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div className="sk" style={{ width: 20, height: 20, borderRadius: 4 }} />
            <div className="sk" style={{ flex: 1, height: 14, borderRadius: 4 }} />
          </div>)}
        </div>
      </div>
    </div>
  );
}
