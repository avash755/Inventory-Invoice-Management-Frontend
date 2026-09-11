import { useNavigate, useParams, Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/components/common/ToastProvider";
import { getErrorMessage } from "@/services/api";
import PageHeader from "@/components/common/PageHeader";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import ProductForm from "@/components/inventory/ProductForm";
import { ROUTES } from "@/constants/routes";

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const existing = useAsync(
    () => (isEdit ? productService.get(id) : Promise.resolve(null)),
    [id, isEdit]
  );

  async function handleSubmit(payload) {
    try {
      if (isEdit) {
        await productService.update(id, payload);
        toast.success("Product updated");
        navigate(ROUTES.MANAGER.PRODUCT(id));
      } else {
        await productService.create(payload);
        toast.success("Product created");
        navigate(ROUTES.MANAGER.INVENTORY);
      }
    } catch (err) {
      // Let the form show it — rethrow so caller can handle if needed
      toast.error(getErrorMessage(err, "Could not save product"));
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
        <Link to={ROUTES.MANAGER.INVENTORY} className="hover:text-ink-900">
          Inventory
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{isEdit ? "Edit product" : "New product"}</span>
      </div>

      <PageHeader
        title={isEdit ? "Edit product" : "Add product"}
        description={
          isEdit
            ? "Update product details. Stock changes go through “Adjust stock”."
            : "Add a new product to your inventory."
        }
      />

      <ProductForm
        mode={isEdit ? "edit" : "create"}
        initialValue={isEdit ? existing.data : undefined}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save changes" : "Create product"}
        onCancel={() =>
          navigate(isEdit ? ROUTES.MANAGER.PRODUCT(id) : ROUTES.MANAGER.INVENTORY)
        }
      />
    </>
  );
}