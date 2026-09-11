import { useNavigate, useParams, Link } from "react-router-dom";
import { userService } from "@/services/userService";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/components/common/ToastProvider";
import { getErrorMessage } from "@/services/api";
import PageHeader from "@/components/common/PageHeader";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import UserForm from "@/components/user/UserForm";
import { ROUTES } from "@/constants/routes";

export default function UserFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const existing = useAsync(
    () => (isEdit ? userService.get(id) : Promise.resolve(null)),
    [id, isEdit]
  );

  async function handleSubmit(payload) {
    try {
      if (isEdit) {
        await userService.update(id, payload);
        toast.success("User updated");
        navigate(ROUTES.MANAGER.USER(id));
      } else {
        await userService.create(payload);
        toast.success("User created — they must verify their email before logging in");
        navigate(ROUTES.MANAGER.USERS);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save user"));
      throw err;
    }
  }

  if (isEdit && existing.loading) {
    return <div className="p-10 grid place-items-center"><Spinner size="lg" /></div>;
  }
  if (isEdit && existing.error) {
    return <ErrorState message={existing.error} onRetry={existing.refetch} />;
  }

  return (
    <>
      <div className="mb-4 text-sm text-ink-500">
        <Link to={ROUTES.MANAGER.USERS} className="hover:text-ink-900">Users</Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{isEdit ? "Edit user" : "New user"}</span>
      </div>

      <PageHeader
        title={isEdit ? "Edit user" : "Add user"}
        description={
          isEdit
            ? "Update this user’s name, role, or account status."
            : "Create a manager or employee account. They’ll receive a verification email."
        }
      />

      <UserForm
        mode={isEdit ? "edit" : "create"}
        initialValue={isEdit ? existing.data : undefined}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save changes" : "Create user"}
        onCancel={() =>
          navigate(isEdit ? ROUTES.MANAGER.USER(id) : ROUTES.MANAGER.USERS)
        }
      />
    </>
  );
}