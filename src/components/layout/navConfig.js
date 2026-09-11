import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";

export const NAV = {
  [ROLES.MANAGER]: [
    { label: "Dashboard",     to: ROUTES.MANAGER.DASHBOARD },
    { label: "Inventory",     to: ROUTES.MANAGER.INVENTORY },
    { label: "Create Invoice",to: ROUTES.MANAGER.INVOICE_NEW },
    { label: "Invoices",      to: ROUTES.MANAGER.INVOICES },
    { label: "Customers",     to: ROUTES.MANAGER.CUSTOMERS },
    { label: "Users",         to: ROUTES.MANAGER.USERS },
    { label: "Profile",       to: ROUTES.MANAGER.PROFILE },
  ],
  [ROLES.EMPLOYEE]: [
    { label: "Dashboard",      to: ROUTES.EMPLOYEE.DASHBOARD },
    { label: "Create Invoice", to: ROUTES.EMPLOYEE.INVOICE_NEW },
    { label: "My Invoices",    to: ROUTES.EMPLOYEE.INVOICES },
    { label: "Profile",        to: ROUTES.EMPLOYEE.PROFILE },
  ],
};