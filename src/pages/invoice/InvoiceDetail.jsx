import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { invoiceService } from "@/services/invoiceService";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { user } = useAuth();

  const isManager = user?.role === ROLES.MANAGER;
  const basePath = isManager ? "/manager/invoices" : "/employee/invoices";

  const { data, loading, error, refetch } = useAsync(
    () => invoiceService.get(id),
    [id]
  );

  const shouldPrint = search.get("print") === "1";

  useEffect(() => {
    if (shouldPrint && data) {
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [shouldPrint, data]);

  if (loading) {
    return <div className="p-10 grid place-items-center"><Spinner size="lg" /></div>;
  }
  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }
  if (!data) return null;

  return (
    <>
      <div className="no-print mb-4 text-sm text-ink-500">
        <Link to={basePath} className="hover:text-ink-900">
          Invoices
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{data.invoiceNumber}</span>
      </div>

      <div className="no-print flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-ink-900">{data.invoiceNumber}</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(basePath)}>
            Back
          </Button>
          <Button onClick={() => window.print()}>Print</Button>
        </div>
      </div>

      <InvoiceDocument invoice={data} />
    </>
  );
}