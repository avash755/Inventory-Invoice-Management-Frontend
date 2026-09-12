import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/common/ToastProvider";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import FormField from "@/components/common/FormField";
import Card from "@/components/common/Card";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";

export default function VerifyLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { setSession, isAuthenticated, user } = useAuth();

  const [email] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const dest =
        user?.role === ROLES.MANAGER
          ? ROUTES.MANAGER.DASHBOARD
          : ROUTES.EMPLOYEE.DASHBOARD;
      navigate(dest, { replace: true });
    }
    if (!email) navigate("/login", { replace: true });
  }, [isAuthenticated, user, email, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/verify-login-otp", {
        email,
        code: code.trim(),
      });
      setSession(data.user);
      toast.success("Welcome back");
      const role = data.user.role;
      navigate(
        role === ROLES.MANAGER ? ROUTES.MANAGER.DASHBOARD : ROUTES.EMPLOYEE.DASHBOARD,
        { replace: true }
      );
    } catch (err) {
      setError(getErrorMessage(err, "Verification failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-xl font-semibold text-ink-900">Two-factor verification</h1>
      <p className="mt-1 text-sm text-ink-500">
        Enter the 6-digit code sent to <strong>{email}</strong>.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <FormField label="Verification code" required htmlFor="otp-code">
          <Input
            id="otp-code"
            value={code}
            inputMode="numeric"
            maxLength={6}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="text-center tracking-[0.5em] text-lg font-semibold"
            required
          />
        </FormField>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-state-danger">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" loading={submitting}>
          Verify &amp; sign in
        </Button>
      </form>

      <div className="mt-4 text-sm text-center">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-brand-600 hover:underline"
        >
          Back to sign in
        </button>
      </div>
    </Card>
  );
}