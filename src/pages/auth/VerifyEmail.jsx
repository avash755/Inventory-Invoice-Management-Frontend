import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import FormField from "@/components/common/FormField";
import Card from "@/components/common/Card";
import { authService } from "@/services/authService";
import { getErrorMessage } from "@/services/api";
import { useToast } from "@/components/common/ToastProvider";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState(location.state?.email ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.verifyEmail({ email, code });
      toast.success("Email verified");
      await refreshUser();          // picks up the new session cookie
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Invalid or expired code"));
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (!email) return setError("Enter your email first");
    setResending(true);
    setError("");
    try {
      await authService.sendOtp(email);
      toast.success("New code sent");
    } catch (err) {
      setError(getErrorMessage(err, "Could not resend code"));
    } finally {
      setResending(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-xl font-semibold text-ink-900">Verify your email</h1>
      <p className="mt-1 text-sm text-ink-500">
        Enter the 6-digit code we sent to your inbox.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <FormField label="Email" required htmlFor="v-email">
          <Input
            id="v-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Verification code" required htmlFor="v-code">
          <Input
            id="v-code"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
          />
        </FormField>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-state-danger">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Verify
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={resend}
          disabled={resending}
          className="text-brand-600 hover:underline disabled:opacity-60"
        >
          {resending ? "Sending…" : "Resend code"}
        </button>
        <Link to={ROUTES.LOGIN} className="text-ink-500 hover:text-ink-900">
          Back to sign in
        </Link>
      </div>
    </Card>
  );
}