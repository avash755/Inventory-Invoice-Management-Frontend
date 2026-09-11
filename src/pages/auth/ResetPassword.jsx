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

export default function ResetPassword() {
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState("code"); // "code" | "password"
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onVerifyCode(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.verifyResetCode(code);
      toast.success("Code verified");
      setStep("password");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid or expired code"));
    } finally {
      setLoading(false);
    }
  }

  async function onSetPassword(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      await authService.setNewPassword(password);
      toast.success("Password updated");
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Could not update password"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-xl font-semibold text-ink-900">
        {step === "code" ? "Enter verification code" : "Set a new password"}
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        {step === "code"
          ? "Check your email for the 6-digit code."
          : "Choose a password with at least 6 characters."}
      </p>

      {step === "code" ? (
        <form onSubmit={onVerifyCode} className="mt-6 space-y-4">
          <FormField label="Verification code" required htmlFor="rp-code">
            <Input
              id="rp-code"
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
            Verify code
          </Button>
        </form>
      ) : (
        <form onSubmit={onSetPassword} className="mt-6 space-y-4">
          <FormField label="New password" required htmlFor="rp-pass">
            <Input
              id="rp-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>

          <FormField label="Confirm password" required htmlFor="rp-confirm">
            <Input
              id="rp-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-state-danger">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Update password
          </Button>
        </form>
      )}

      <div className="mt-4 text-sm text-center">
        <Link to={ROUTES.LOGIN} className="text-brand-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    </Card>
  );
}