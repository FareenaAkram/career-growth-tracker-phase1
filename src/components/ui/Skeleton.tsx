/* Server component — no "use client" needed */

interface SkProps {
  w?: string | number;
  h?: string | number;
  r?: number;
  style?: React.CSSProperties;
}

export function Sk({ w, h, r = 8, style }: SkProps) {
  return (
    <div
      className="sk"
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: typeof h === "number" ? `${h}px` : h,
        borderRadius: r,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/* Reusable card skeleton matching the project's card style */
export function CardSkeleton() {
  return (
    <div
      style={{
        background: "rgba(10,16,32,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Sk w={46} h={46} r={13} />
        <Sk w={80} h={22} r={99} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Sk h={18} w="68%" r={6} />
        <Sk h={13} r={6} />
        <Sk h={13} w="82%" r={6} />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[58, 72, 52, 66].map((w, i) => (
          <Sk key={i} w={w} h={22} r={99} />
        ))}
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: 14,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Sk w={110} h={18} r={6} />
        <Sk w={90} h={18} r={6} />
      </div>
    </div>
  );
}

/* Row skeleton (for lists: jobs, bookmarks, resources) */
export function RowSkeleton() {
  return (
    <div
      style={{
        background: "rgba(10,16,32,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Sk w={44} h={44} r={12} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        <Sk h={16} w="45%" r={5} />
        <Sk h={13} w="30%" r={5} />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <Sk w={60} h={22} r={99} />
        <Sk w={60} h={22} r={99} />
      </div>
      <Sk w={80} h={32} r={10} />
    </div>
  );
}

/* Stat chip skeleton */
export function StatSkeleton() {
  return (
    <div
      style={{
        background: "rgba(10,16,32,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Sk w={36} h={36} r={10} />
      <Sk h={28} w="60%" r={6} />
      <Sk h={13} w="80%" r={5} />
    </div>
  );
}

/* Chart area skeleton */
export function ChartSkeleton({ h = 260 }: { h?: number }) {
  return (
    <div
      style={{
        background: "rgba(10,16,32,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: 24,
      }}
    >
      <Sk h={20} w="40%" r={6} style={{ marginBottom: 24 }} />
      <Sk h={h} r={12} />
    </div>
  );
}
