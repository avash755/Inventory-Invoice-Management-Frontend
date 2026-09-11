import { useNavigate, useParams, Link } from "react-router-dom";
import { customerService } from "@/services/customerService";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/components/common/ToastProvider";
import { getErrorMessage } from "@/services/api";
import PageHeader from "@/components/common/PageHeader";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import CustomerForm from "@/components/customer/CustomerForm";
import { ROUTES } from "@/constants/routes";

export default function CustomerFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const existing = useAsync(
    () => (isEdit ? customerService.get(id) : Promise.resolve(null)),
    [id, isEdit]
  );

  async function handleSubmit(payload) {
    try {
      if (isEdit) {
        await customerService.update(id, payload);
        toast.success("Customer updated");
        navigate(ROUTES.MANAGER.CUSTOMER(id));
      } else {
        await customerService.create(payload);
        toast.success("Customer created");
        navigate(ROUTES.MANAGER.CUSTOMERS);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save customer"));
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
        <Link to={ROUTES.MANAGER.CUSTOMERS} className="hover:text-ink-900">
          Customers
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{isEdit ? "Edit customer" : "New customer"}</span>
      </div>

      <PageHeader
        title={isEdit ? "Edit customer" : "Add customer"}
        description={
          isEdit
            ? "Update this customer’s contact information."
            : "Add a new customer to your directory."
        }
      />

      <CustomerForm
        initialValue={isEdit ? existing.data : undefined}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save changes" : "Create customer"}
        onCancel={() =>
          navigate(isEdit ? ROUTES.MANAGER.CUSTOMER(id) : ROUTES.MANAGER.CUSTOMERS)
        }
      />
    </>
  );
}