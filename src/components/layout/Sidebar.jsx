import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import { COMPANY } from "@/constants/company";

export default function Sidebar({ items, onNavigate }) {
  return (
    <aside className="h-full w-64 bg-ink-900 text-white flex flex-col">
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <span className="font-semibold text-lg tracking-tight">
          {COMPANY.name}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-5 py-3 border-t border-white/10 text-[11px] text-white/40">
        v1.0
      </div>
    </aside>
  );
}