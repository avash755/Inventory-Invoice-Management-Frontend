import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "@/context/AuthContext";
import { NAV } from "./navConfig";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AppLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV[user?.role] ?? [];

  const location = useLocation();
  const pageTitle = NAV[user?.role]?.find((n) => location.pathname.startsWith(n.to))?.label;

  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} · Inventory` : "Inventory";
  }, [pageTitle]);

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen">
        <Sidebar items={items} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar items={items} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onOpenMobileNav={() => setMobileOpen(true)} title={pageTitle ?? ""} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}