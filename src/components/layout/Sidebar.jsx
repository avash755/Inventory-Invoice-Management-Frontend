import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";

/* ---------- Icons (inline SVG, no extra deps) ---------- */
const Icon = {
  dashboard: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5M5 9.5V20h14V9.5" />
    </svg>
  ),
  box: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8" />
    </svg>
  ),
  invoice: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a2 2 0 0 1 2 2v14l-3-2-2 2-2-2-2 2-2-2-3 2V5a2 2 0 0 1 2-2ZM9 8h6M9 12h6M9 16h4" />
    </svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  ),
  users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
    </svg>
  ),
  user: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    </svg>
  ),
};

/* ---------- Nav groups ---------- */
function buildNav(role) {
  const isManager = role === ROLES.MANAGER;
  const R = isManager ? ROUTES.MANAGER : ROUTES.EMPLOYEE;

  const sales = [
    { label: "Dashboard", to: R.DASHBOARD, icon: Icon.dashboard, end: true },
    { label: "Create Invoice", to: R.INVOICE_NEW, icon: Icon.plus, end: true },
    { label: "Invoices", to: R.INVOICES, icon: Icon.invoice, end: true },
  ];
  if (isManager) sales.push({ label: "Customers", to: R.CUSTOMERS, icon: Icon.users });

  const inventory = isManager
    ? [
        { label: "Inventory", to: R.INVENTORY, icon: Icon.box, end: true },
      ]
    : [];

  const account = [
    { label: "Profile", to: R.PROFILE, icon: Icon.user, end: true },
  ];

  const admin = isManager
    ? [{ label: "Users", to: R.USERS, icon: Icon.users }]
    : [];

  return { sales, inventory, account, admin, isManager };
}

/* ---------- Reusable link ---------- */
function Item({ item }) {
  const IconCmp = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
          isActive
            ? "bg-[#2563EB]/15 text-white shadow-[inset_2px_0_0_0_rgb(99_102_241)]"
            : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <IconCmp
            className={`h-[18px] w-[18px] shrink-0 transition-colors ${
              isActive ? "text-[#477cee]" : "text-slate-500 group-hover:text-slate-300"
            }`}
          />
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

/* ---------- Section ---------- */
function Section({ title, items }) {
  if (!items.length) return null;
  return (
    <div className="px-3 pt-4">
      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </p>
      <nav className="space-y-1">
        {items.map((it) => (
          <Item key={it.to} item={it} />
        ))}
      </nav>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const { sales, inventory, account, admin, isManager } = buildNav(user?.role);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col",
          "bg-slate-950 text-slate-300 border-r border-slate-800/80",
          "transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800/80">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[#4679e7] to-[#2563EB] grid place-items-center text-white text-xs font-bold">
            I
          </div>
          <span className="text-white font-semibold tracking-tight">
            Inventory
            <span className="text-[#4e7bdd]">.</span>
          </span>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto scrollbar-thin pb-4">
          <Section title="Sales" items={sales} />
          {inventory.length > 0 && <Section title="Inventory" items={inventory} />}
          {admin.length > 0 && <Section title="Admin" items={admin} />}
          <Section title="Account" items={account} />
        </div>

        {/* User footer */}
        <div className="border-t border-slate-800/80 p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#2563EB] text-white grid place-items-center text-sm font-semibold shrink-0">
              {(user?.username || user?.email || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-100 truncate">{user?.username || user?.email}</p>
              <p className="text-[11px] uppercase tracking-wide text-[#3771ed]">
                {isManager ? "Manager" : "Employee"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}