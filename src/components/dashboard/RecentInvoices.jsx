import { Link } from "react-router-dom";
import Card from "@/components/common/Card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/common/Table";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";

function statusFor(inv) {
  const due = inv.balanceDue ?? 0;
  if (due <= 0) return { label: "Paid", variant: "success" };
  if ((inv.amountPaid ?? 0) > 0) return { label: "Partial", variant: "warning" };
  return { label: "Unpaid", variant: "danger" };
}

export default function RecentInvoices({ invoices }) {
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const invoicePath = (id) =>
    isManager ? ROUTES.MANAGER.INVOICE(id) : ROUTES.EMPLOYEE.INVOICE(id);

  const listPath = isManager ? ROUTES.MANAGER.INVOICES : ROUTES.EMPLOYEE.INVOICES;

  return (
    <Card>
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-300/60">
        <h2 className="text-sm font-semibold text-ink-900">Recent invoices</h2>
        <Link to={listPath}>
          <Button size="sm" variant="ghost">View all</Button>
        </Link>
      </div>

      {invoices.length === 0 ? (
        <EmptyState title="No invoices yet" description="Invoices you create will appear here." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Invoice</TH>
              <TH>Date</TH>
              <TH>Customer</TH>
              <TH className="text-right">Total</TH>
              <TH className="text-right">Balance Due</TH>
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
                      to={invoicePath(inv._id)}
                      className="hover:text-brand-600"
                    >
                      {inv.invoiceNumber}
                    </Link>
                  </TD>
                  <TD>{formatDate(inv.createdAt)}</TD>
                  <TD>{inv.billTo?.contactName ?? inv.customer?.name ?? "—"}</TD>
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