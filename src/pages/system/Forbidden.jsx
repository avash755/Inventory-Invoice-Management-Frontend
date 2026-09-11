import { Link } from "react-router-dom";
import Button from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";

export default function Forbidden() {
  const { user } = useAuth();
  const home =
    user?.role === ROLES.MANAGER ? ROUTES.MANAGER.DASHBOARD : ROUTES.EMPLOYEE.DASHBOARD;

  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <p className="text-6xl font-semibold text-ink-300">403</p>
        <h1 className="mt-3 text-lg font-semibold text-ink-900">Access denied</h1>
        <p className="mt-1 text-sm text-ink-500">
          You don’t have permission to view this page.
        </p>
        <Link to={home} className="inline-block mt-6">
          <Button variant="primary">Go to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}