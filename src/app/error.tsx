"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, send to your error tracking service here
    console.error("[GlobalError]", error);
  }, [error]);

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
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          marginBottom: 24,
        }}
      >
        ⚠️
      </div>

      <h1
        style={{
          fontSize: "clamp(22px,4vw,36px)",
          fontWeight: 800,
          color: "white",
          margin: "0 0 10px",
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "#64748b",
          maxWidth: 380,
          lineHeight: 1.7,
          margin: "0 0 28px",
          fontFamily: "monospace",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "10px 14px",
          borderRadius: 10,
        }}
      >
        {error.message || "An unexpected error occurred."}
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={reset}
          style={{
            padding: "11px 26px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#6E58FF,#2DD4BF)",
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Try Again
        </button>
        <a
          href="/"
          style={{
            padding: "11px 26px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8",
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
