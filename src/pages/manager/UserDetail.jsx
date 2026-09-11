import { Link, useNavigate, useParams } from "react-router-dom";
import { userService } from "@/services/userService";
import { useAsync } from "@/hooks/useAsync";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import UserStatusBadge from "@/components/user/UserStatusBadge";
import { ROUTES } from "@/constants/routes";

function Row({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-ink-300/50 last:border-0">
      <span className="text-xs uppercase tracking-wide text-ink-500 sm:w-40 shrink-0">
        {label}
      </span>
      <span className="text-sm text-ink-900">{children}</span>
    </div>
  );
}

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useAsync(() => userService.get(id), [id]);

  if (loading) return <div className="p-10 grid place-items-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <>
      <div className="mb-4 text-sm text-ink-500">
        <Link to={ROUTES.MANAGER.USERS} className="hover:text-ink-900">Users</Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{data.username}</span>
      </div>

      <PageHeader
        title={data.username}
        description={data.email}
        actions={
          <Button onClick={() => navigate(ROUTES.MANAGER.USER_EDIT(data._id))}>
            Edit user
          </Button>
        }
      />

      <Card className="p-5 max-w-2xl">
        <Row label="Username">{data.username}</Row>
        <Row label="Email">{data.email}</Row>
        <Row label="Role"><span className="capitalize">{data.role}</span></Row>
        <Row label="Status"><UserStatusBadge user={data} /></Row>
        {data._id && <Row label="User ID"><span className="font-mono text-xs">{data._id}</span></Row>}
      </Card>
    </>
  );
}