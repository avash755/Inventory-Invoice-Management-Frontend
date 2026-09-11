import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

export default function RoleRoute({ allow }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!allow.includes(user.role)) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}