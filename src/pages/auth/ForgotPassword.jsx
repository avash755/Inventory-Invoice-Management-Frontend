import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import FormField from "@/components/common/FormField";
import Card from "@/components/common/Card";
import { authService } from "@/services/authService";
import { getErrorMessage } from "@/services/api";
import { useToast } from "@/components/common/ToastProvider";
import { ROUTES } from "@/constants/routes";
import { useLocation } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      toast.success("Verification code sent");
      navigate(ROUTES.RESET_PASSWORD, { state: { email } });
    } catch (err) {
      setError(getErrorMessage(err, "Could not send reset code"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-xl font-semibold text-ink-900">Reset password</h1>
      <p className="mt-1 text-sm text-ink-500">
        We’ll email you a verification code.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <FormField label="Email" required htmlFor="fp-email">
          <Input
            id="fp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-state-danger">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Send code
        </Button>
      </form>

      <div className="mt-4 text-sm text-center">
        <Link to={ROUTES.LOGIN} className="text-brand-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    </Card>
  );
}