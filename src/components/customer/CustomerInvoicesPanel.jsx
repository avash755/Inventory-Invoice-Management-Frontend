import { Link } from "react-router-dom";
import Card from "@/components/common/Card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/common/Table";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { ROUTES } from "@/constants/routes";

function statusFor(inv) {
  const due = inv.balanceDue ?? 0;
  if (due <= 0) return { label: "Paid", variant: "success" };
  if ((inv.amountPaid ?? 0) > 0) return { label: "Partial", variant: "warning" };
  return { label: "Unpaid", variant: "danger" };
}

export default function CustomerInvoicesPanel({ loading, error, invoices, onRetry }) {
  return (
    <Card>
      <div className="px-5 py-4 border-b border-ink-300/60">
        <h2 className="text-sm font-semibold text-ink-900">Invoice history</h2>
      </div>

      {loading ? (
        <div className="p-10 grid place-items-center"><Spinner /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : invoices.length === 0 ? (
        <EmptyState
          title="No invoices"
          description="This customer has no invoices yet."
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Invoice</TH>
              <TH>Date</TH>
              <TH className="text-right">Total</TH>
              <TH className="text-right">Balance</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {invoices.map((inv) => {
              const st = statusFor(inv);
              return (
                <TR key={inv._id}>
                  <TD className="font-medium text-ink-900">
                    <Link
                      to={ROUTES.MANAGER.INVOICE(inv._id)}
                      className="hover:text-brand-600"
                    >
                      {inv.invoiceNumber}
                    </Link>
                  </TD>
                  <TD>{formatDate(inv.createdAt)}</TD>
                  <TD className="text-right tabular-nums">{formatCurrency(inv.total)}</TD>
                  <TD className="text-right tabular-nums">{formatCurrency(inv.balanceDue)}</TD>
                  <TD><Badge variant={st.variant}>{st.label}</Badge></TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </Card>
  );
}