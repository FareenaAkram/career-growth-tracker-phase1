// Server component — no "use client" directive.
// Mobile nav state lives in MobileNavContext (a thin client context),
// so sidebar/topbar can read it via useMobileNav() without making this layout
// a client component. The initial HTML is rendered on the server, giving instant
// first paint even before JS hydrates.
import { MobileNavProvider } from "@/contexts/MobileNavContext";
import { Sidebar } from "@/components/layout/sidebar";
import Topbar from "@/components/app-shell/Topbar";
import MobileBackdrop from "@/components/app-shell/MobileBackdrop";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MobileNavProvider>
      <div style={{ minHeight: "100vh", position: "relative" }}>
        <MobileBackdrop />
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <div style={{
            flex: 1, minHeight: "100vh",
            display: "flex", flexDirection: "column",
            minWidth: 0, overflow: "hidden",
          }}>
            <Topbar />
            <main style={{
              flex: 1,
              padding: "clamp(16px, 3vw, 32px)",
              overflowX: "hidden",
            }}>
              {children}
            </main>
          </div>
        </div>
      </div>
    </MobileNavProvider>
  );
}
