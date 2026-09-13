import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { invoiceService } from "@/services/invoiceService";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/common/ToastProvider";
import { getErrorMessage } from "@/services/api";
import { ROLES } from "@/constants/roles";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";
import ReviewInvoiceModal from "@/components/invoice/ReviewInvoiceModal";
import { getInvoiceStatus } from "@/components/invoice/InvoiceStatusBadge";
import Badge from "@/components/common/Badge";
import RecordPaymentModal from "@/components/invoice/RecordPaymentModal";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();

  const [confirmApprove, setConfirmApprove] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const [paymentOpen, setPaymentOpen] = useState(false);

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

  const statusInfo = getInvoiceStatus(data);

  return (
    <>
      <div className="no-print mb-4 text-sm text-ink-500">
        <Link to={basePath} className="hover:text-ink-900">Invoices</Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{data.invoiceNumber}</span>
      </div>

      <div className="no-print flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-ink-900">{data.invoiceNumber}</h1>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" onClick={() => navigate(basePath)}>Back</Button>

          {isManager && data.status === "pending" && (
            <>
              <Button variant="secondary" onClick={() => setReviewOpen(true)}>
                Review &amp; edit
              </Button>
              <Button variant="success" onClick={() => setConfirmApprove(true)}>
                Approve
              </Button>
            </>
          )}

          {isManager && data.status === "approved" && data.balanceDue > 0 && (
            <Button onClick={() => setPaymentOpen(true)}>Record Payment</Button>
          )}

          {!isManager && data.status === "needs_revision" && (
            <Button
              onClick={async () => {
                try {
                  await invoiceService.resubmit(id);
                  toast.success("Resubmitted");
                  refetch();
                } catch (e) {
                  toast.error(getErrorMessage(e));
                }
              }}
            >
              Resubmit
            </Button>
          )}

          <Button onClick={() => window.print()}>Print</Button>
        </div>
      </div>

      {data.status === "needs_revision" && (
        <Card className="no-print mb-4 p-4 bg-red-50 border-red-200">
          <p className="text-sm font-medium text-state-danger">Manager note:</p>
          <p className="text-sm text-ink-700 mt-1">
            {data.approvalHistory?.filter(h => h.action === "sent_back").slice(-1)[0]?.note || "—"}
          </p>
        </Card>
      )}

      <InvoiceDocument invoice={data} />

      {data.approvalHistory?.length > 0 && (
        <Card className="no-print mt-6 p-5">
          <h2 className="text-sm font-semibold text-ink-900 mb-3">Approval history</h2>
          <ul className="space-y-3">
            {[...data.approvalHistory].reverse().map((h, i) => (
              <li key={i} className="flex flex-wrap gap-3 text-sm">
                <span className="text-ink-500 shrink-0">
                  {new Date(h.at).toLocaleString()}
                </span>
                <span className="capitalize font-medium text-ink-900">
                  {h.action.replace("_", " ")}
                </span>
                {h.note && <span className="text-ink-500">— {h.note}</span>}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <ConfirmDialog
        open={confirmApprove}
        onClose={() => setConfirmApprove(false)}
        onConfirm={async () => {
          try {
            await invoiceService.approve(id);
            toast.success("Approved");
            setConfirmApprove(false);
            refetch();
          } catch (e) {
            toast.error(getErrorMessage(e));
          }
        }}
        title="Approve invoice?"
        message="Stock will be deducted. This cannot be undone."
        confirmText="Approve"
        variant="success"
      />

      <ReviewInvoiceModal
        open={reviewOpen}
        invoice={data}
        onClose={() => setReviewOpen(false)}
        onDone={refetch}
      />

      <RecordPaymentModal
        open={paymentOpen}
        invoice={data}
        onClose={() => setPaymentOpen(false)}
        onDone={refetch}
      />
    </>
  );
}