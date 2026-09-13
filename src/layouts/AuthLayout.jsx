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

      <main className="min-h-screen flex items-start justify-center pt-10 px-4">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} {COMPANY.name}
      </footer>
    </div>
  );
}