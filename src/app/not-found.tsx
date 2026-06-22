import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 20px",
      }}
    >
      {/* Glow orb */}
      <div
        style={{
          position: "relative",
          width: 140,
          height: 140,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(110,88,255,0.3), transparent 70%)",
            filter: "blur(24px)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(110,88,255,0.08)",
            border: "1px solid rgba(110,88,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 52,
          }}
        >
          404
        </div>
      </div>

      <h1
        style={{
          fontSize: "clamp(28px,5vw,48px)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "white",
          margin: "0 0 12px",
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "#64748b",
          maxWidth: 400,
          lineHeight: 1.7,
          margin: "0 0 32px",
        }}
      >
        Looks like this career path doesn&apos;t exist yet. Let&apos;s get you
        back on track.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            padding: "12px 28px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#6E58FF,#2DD4BF)",
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Go to Explorer
        </Link>
        <Link
          href="/dashboard"
          style={{
            padding: "12px 28px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8",
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
