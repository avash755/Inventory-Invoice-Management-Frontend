import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { invoiceService } from "@/services/invoiceService";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import SearchBar from "@/components/common/SearchBar";
import Select from "@/components/common/Select";
import { Table, THead, TH, TBody, TR, TD } from "@/components/common/Table";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import InvoiceStatusBadge from "@/components/invoice/InvoiceStatusBadge";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

export default function InvoiceList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isManager = user?.role === ROLES.MANAGER;
  const basePath = isManager ? "/manager/invoices" : "/employee/invoices";

  const { data, loading, error, refetch } = useAsync(() => invoiceService.list(), []);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const invoices = data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices
      .filter((inv) => {
        if (q) {
          const hay = `${inv.invoiceNumber} ${inv.billTo?.contactName ?? ""} ${inv.billTo?.companyName ?? ""}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (statusFilter !== "all" && inv.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [invoices, query, statusFilter]);

  return (
    <>
      <PageHeader
        title={isManager ? "Invoices" : "My invoices"}
        description={isManager ? "All invoices in the system." : "Invoices you created."}
        actions={
          <Button onClick={() => navigate(`${basePath}/create`)}>+ Create invoice</Button>
        }
      />

      <Card className="mb-4 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by invoice no, customer, company…"
            className="flex-1"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-52"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending approval</option>
            <option value="needs_revision">Needs revision</option>
            <option value="approved">Approved</option>
          </Select>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="p-10 grid place-items-center"><Spinner /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={invoices.length === 0 ? "No invoices yet" : "No matches"}
            description={
              invoices.length === 0
                ? "Create your first invoice to get started."
                : "Try a different search or filter."
            }
            action={
              invoices.length === 0 && (
                <Button onClick={() => navigate(`${basePath}/create`)}>
                  + Create invoice
                </Button>
              )
            }
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Invoice</TH>
                <TH>Date</TH>
                <TH>Customer</TH>
                <TH className="text-right">Total</TH>
                <TH className="text-right">Paid</TH>
                <TH className="text-right">Balance Due</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((inv) => (
                <TR key={inv._id}>
                  <TD className="font-medium text-ink-900">
                    <Link to={`${basePath}/${inv._id}`} className="hover:text-brand-600">
                      {inv.invoiceNumber}
                    </Link>
                  </TD>
                  <TD>{formatDate(inv.createdAt)}</TD>
                  <TD>{inv.billTo?.contactName || inv.billTo?.companyName || "—"}</TD>
                  <TD className="text-right tabular-nums">{formatCurrency(inv.total)}</TD>
                  <TD className="text-right tabular-nums">{formatCurrency(inv.amountPaid)}</TD>
                  <TD className="text-right tabular-nums">{formatCurrency(inv.balanceDue)}</TD>
                  <TD><InvoiceStatusBadge invoice={inv} /></TD>
                  <TD className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`${basePath}/${inv._id}`)}>
                        View
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`${basePath}/${inv._id}?print=1`)}>
                        Print
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </>
  );
}