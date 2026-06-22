"use client";
import { useMobileNav } from "@/contexts/MobileNavContext";

export default function MobileBackdrop() {
  const { open, close } = useMobileNav();
  if (!open) return null;
  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 39,
        background: "rgba(5,8,22,0.75)",
        backdropFilter: "blur(4px)",
      }}
    />
  );
}
