import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "@/components/common/ToastProvider";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";

import Login from "@/pages/auth/Login";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";
import Spinner from "@/components/common/Spinner";

import NotFound from "@/pages/system/NotFound";
import Forbidden from "@/pages/system/Forbidden";

import ManagerDashboard from "@/pages/manager/Dashboard";
import EmployeeDashboard from "@/pages/employee/Dashboard";

import Inventory from "@/pages/manager/Inventory";
import ProductDetail from "@/pages/manager/ProductDetail";
import ProductFormPage from "@/pages/manager/ProductFormPage";

import Customers from "@/pages/manager/Customers";
import CustomerDetail from "@/pages/manager/CustomerDetail";
import CustomerFormPage from "@/pages/manager/CustomerFormPage";

import InvoiceList from "@/pages/invoice/InvoiceList";
import InvoiceDetail from "@/pages/invoice/InvoiceDetail";
import CreateInvoice from "@/pages/invoice/CreateInvoice";

import Users from "@/pages/manager/Users";
import UserDetail from "@/pages/manager/UserDetail";
import UserFormPage from "@/pages/manager/UserFormPage";

import Profile from "@/pages/Profile";

import VerifyLogin from "@/pages/auth/VerifyLogin";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center"><Spinner size="lg" /></div>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  return (
    <Navigate
      to={user.role === ROLES.MANAGER ? ROUTES.MANAGER.DASHBOARD : ROUTES.EMPLOYEE.DASHBOARD}
      replace
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
            
            {/* Public */}
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
              <Route path="/verify-login" element={<VerifyLogin />} />
            </Route>

            {/* Protected shell */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route element={<RoleRoute allow={[ROLES.MANAGER]} />}>
                  <Route path={ROUTES.MANAGER.DASHBOARD} element={<ManagerDashboard />} />
                  <Route path={ROUTES.MANAGER.INVENTORY} element={<Inventory />} />
                  <Route path={ROUTES.MANAGER.PRODUCT_NEW} element={<ProductFormPage />} />
                  <Route path={ROUTES.MANAGER.PRODUCT_EDIT(":id")} element={<ProductFormPage />} />
                  <Route path={ROUTES.MANAGER.PRODUCT(":id")} element={<ProductDetail />} />
                  <Route path="/manager/customers" element={<Customers />} />
                  <Route path="/manager/customers/new" element={<CustomerFormPage />} />
                  <Route path="/manager/customers/:id/edit" element={<CustomerFormPage />} />
                  <Route path="/manager/customers/:id" element={<CustomerDetail />} />
                  <Route path="/manager/invoices" element={<InvoiceList />} />
                  <Route path="/manager/invoices/create" element={<CreateInvoice />} />
                  <Route path="/manager/invoices/:id" element={<InvoiceDetail />} />
                  <Route path="/manager/users" element={<Users />} />
                  <Route path="/manager/users/new" element={<UserFormPage />} />
                  <Route path="/manager/users/:id/edit" element={<UserFormPage />} />
                  <Route path="/manager/users/:id" element={<UserDetail />} />
                  <Route path="/manager/profile" element={<Profile />} />
                </Route>

                <Route element={<RoleRoute allow={[ROLES.EMPLOYEE]} />}>
                  <Route path={ROUTES.EMPLOYEE.DASHBOARD} element={<EmployeeDashboard />} />
                  <Route path="/employee/invoices" element={<InvoiceList />} />
                  <Route path="/employee/invoices/create" element={<CreateInvoice />} />
                  <Route path="/employee/invoices/:id" element={<InvoiceDetail />} />
                  <Route path="/employee/profile" element={<Profile />} />
                </Route>
              </Route>
            </Route>

            
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}