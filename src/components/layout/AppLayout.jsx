import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "@/context/AuthContext";
import { NAV } from "./navConfig";

export default function AppLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageTitle = NAV[user?.role]?.find((n) =>
    location.pathname.startsWith(n.to)
  )?.label;

  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} · Inventory` : "Inventory";
  }, [pageTitle]);

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Sidebar handles its own desktop/mobile layout + backdrop */}
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileOpen(true)}
          title={pageTitle ?? ""}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}