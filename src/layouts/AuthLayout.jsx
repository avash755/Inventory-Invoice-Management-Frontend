import { Outlet } from "react-router-dom";
import { COMPANY } from "@/constants/company";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <header className="h-16 flex items-center px-6">
        <span className="text-lg font-semibold tracking-tight text-ink-900">
          {COMPANY.name}
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} {COMPANY.name}
      </footer>
    </div>
  );
}