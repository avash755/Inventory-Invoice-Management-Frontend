import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { ROUTES } from "@/constants/routes";

function Row({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-ink-300/50 last:border-0">
      <span className="text-xs uppercase tracking-wide text-ink-500 sm:w-40 shrink-0">
        {label}
      </span>
      <span className="text-sm text-ink-900 break-words">{children}</span>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your account information."
      />

      <Card className="p-5 max-w-2xl">
        <Row label="Username">{user?.username ?? "—"}</Row>
        <Row label="Email">{user?.email ?? "—"}</Row>
        <Row label="Role">
          <span className="capitalize">{user?.role ?? "—"}</span>
        </Row>
      </Card>

      <Card className="p-5 max-w-2xl mt-4">
        <h2 className="text-sm font-semibold text-ink-900">Security</h2>
        <p className="mt-1 text-sm text-ink-500">
          Changing your password requires a verification code sent to your email.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              navigate(ROUTES.FORGOT_PASSWORD, {
                state: { email: user?.email },
              })
            }
          >
            Change password
          </Button>
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </Card>
    </>
  );
}