import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import FormField from "@/components/common/FormField";
import Card from "@/components/common/Card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/common/ToastProvider";
import { getErrorMessage } from "@/services/api";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // Backend accepts {username, email}; send identifier as both.
      const res = await login({ username: identifier, email: identifier, password });
      toast.success("Welcome back");
      const role = res.user.role;
      const dest =
        location.state?.from?.pathname ||
        (role === ROLES.MANAGER ? ROUTES.MANAGER.DASHBOARD : ROUTES.EMPLOYEE.DASHBOARD);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Invalid credentials"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-xl font-semibold text-ink-900">Sign in</h1>
      <p className="mt-1 text-sm text-ink-500">Use your account credentials.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <FormField label="Username or Email" required htmlFor="login-id">
          <Input
            id="login-id"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
          />
        </FormField>

        <FormField label="Password" required htmlFor="login-pass">
          <Input
            id="login-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </FormField>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-state-danger">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" loading={submitting}>
          Sign in
        </Button>
      </form>

      <div className="mt-4 text-sm text-center">
        <button
          type="button"
          onClick={() => navigate(ROUTES.FORGOT_PASSWORD, { state: { email: identifier } })}
          className="text-brand-600 hover:underline"
        >
          Forgot password?
        </button>
      </div>
    </Card>
  );
}