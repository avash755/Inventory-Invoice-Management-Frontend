import { Link, useNavigate, useParams } from "react-router-dom";
import { customerService } from "@/services/customerService";
import { invoiceService } from "@/services/invoiceService";
import { useAsync } from "@/hooks/useAsync";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import CustomerInvoicesPanel from "@/components/customer/CustomerInvoicesPanel";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROUTES } from "@/constants/routes";

function Row({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-ink-300/50 last:border-0">
      <span className="text-xs uppercase tracking-wide text-ink-500 sm:w-40 shrink-0">
        {label}
      </span>
      <span className="text-sm text-ink-900 break-words">{children}</span>
    </div>
  );
}

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = useAsync(() => customerService.get(id), [id]);
  const invoices = useAsync(() => invoiceService.list(), []);

  if (customer.loading) {
    return <div className="p-10 grid place-items-center"><Spinner size="lg" /></div>;
  }
  if (customer.error) {
    return <ErrorState message={customer.error} onRetry={customer.refetch} />;
  }

  const c = customer.data;
  if (!c) return null;

  const myInvoices = (invoices.data ?? []).filter(
    (inv) => inv.customer === c._id || inv.customer?._id === c._id
  );

  const totalBilled = myInvoices.reduce((s, i) => s + (i.total || 0), 0);
  const outstanding = myInvoices.reduce((s, i) => s + (i.balanceDue || 0), 0);

  return (
    <>
      <div className="mb-4 text-sm text-ink-500">
        <Link to={ROUTES.MANAGER.CUSTOMERS} className="hover:text-ink-900">
          Customers
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{c.name}</span>
      </div>

      <PageHeader
        title={c.name}
        description={c.company || undefined}
        actions={
          <Button onClick={() => navigate(ROUTES.MANAGER.CUSTOMER_EDIT(c._id))}>
            Edit customer
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 p-5">
          <h2 className="text-sm font-semibold text-ink-900 mb-2">Contact</h2>
          <Row label="Email">{c.email || "—"}</Row>
          <Row label="Phone">{c.phone || "—"}</Row>
          <Row label="Company">{c.company || "—"}</Row>
          <Row label="Address">{c.address || "—"}</Row>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-900 mb-3">Summary</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-ink-500">Invoices</p>
              <p className="text-lg font-semibold tabular-nums text-ink-900">
                {myInvoices.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Total billed</p>
              <p className="text-lg font-semibold tabular-nums text-ink-900">
                {formatCurrency(totalBilled)}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Outstanding</p>
              <p className={`text-lg font-semibold tabular-nums ${outstanding > 0 ? "text-state-danger" : "text-state-success"}`}>
                {formatCurrency(outstanding)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <CustomerInvoicesPanel
        loading={invoices.loading}
        error={invoices.error}
        invoices={myInvoices}
        onRetry={invoices.refetch}
      />
    </>
  );
}