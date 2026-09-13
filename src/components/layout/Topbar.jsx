import { useAuth } from "@/context/AuthContext";
import Button from "@/components/common/Button";

export default function Topbar({ onOpenMobileNav, title }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-ink-300/60 flex items-center px-4 sm:px-6 gap-3">
      <button
        type="button"
        className="lg:hidden text-ink-700 p-2 -ml-2 rounded-md hover:bg-surface-100"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <h1 className="text-sm font-medium text-ink-900 truncate flex-1">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-ink-900 leading-tight">
            {user?.username ?? "—"}
          </p>
          <p className="text-xs text-ink-500">
            {user?.role === "manager" ? "Manager" : user?.role === "employee" ? "Sales Representative" : ""}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}