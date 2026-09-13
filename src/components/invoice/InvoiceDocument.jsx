import { COMPANY } from "@/constants/company";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

function Row({ label, value, strong, danger }) {
  return (
    <tr>
      <td className="py-1 pr-4 text-right text-sm text-ink-700">{label}</td>
      <td className={`py-1 pl-4 text-right text-sm tabular-nums ${strong ? "font-semibold text-ink-900" : "text-ink-900"} ${danger ? "text-state-danger" : ""}`}>
        {formatCurrency(value)}
      </td>
    </tr>
  );
}

export default function InvoiceDocument({ invoice }) {
  const items = invoice.items ?? [];

  return (
    <div className="invoice-document bg-white p-6 sm:p-10 rounded-lg border border-ink-300/60 shadow-card max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-ink-300/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{COMPANY.name}</h1>
          {COMPANY.address && <p className="text-sm text-ink-500 mt-1">{COMPANY.address}</p>}
          {COMPANY.phone && <p className="text-sm text-ink-500">{COMPANY.phone}</p>}
          {COMPANY.email && <p className="text-sm text-ink-500">{COMPANY.email}</p>}
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold tracking-tight text-ink-900">INVOICE</h2>
          <p className="text-sm text-ink-500 mt-2">Invoice No: <span className="font-medium text-ink-900">{invoice.invoiceNumber}</span></p>
          <p className="text-sm text-ink-500">Date: <span className="text-ink-900">{formatDate(invoice.createdAt)}</span></p>
          {invoice.paymentTerms && (
            <p className="text-sm text-ink-500">Terms: <span className="text-ink-900">{invoice.paymentTerms}</span></p>
          )}
        </div>
      </div>

      {/* Bill To / Ship To */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="min-h-[110px] max-h-[160px] overflow-hidden border border-ink-300/60 rounded-md p-3 break-words">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-500 mb-1">Bill To</p>
          <div className="text-sm text-ink-800 space-y-0.5 [overflow-wrap:anywhere]">
            <p className="font-semibold text-ink-900">{invoice.billTo?.contactName || "—"}</p>
            {invoice.billTo?.companyName && <p>{invoice.billTo.companyName}</p>}
            {invoice.billTo?.address && <p className="whitespace-pre-line">{invoice.billTo.address}</p>}
            {invoice.billTo?.phone && <p>{invoice.billTo.phone}</p>}
            {invoice.billTo?.email && <p>{invoice.billTo.email}</p>}
          </div>
        </div>

        <div className="min-h-[110px] max-h-[160px] overflow-hidden border border-ink-300/60 rounded-md p-3 break-words">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-500 mb-1">Ship To</p>
          <div className="text-sm text-ink-800 space-y-0.5 [overflow-wrap:anywhere]">
            <p className="font-semibold text-ink-900">{invoice.shipTo?.name || "—"}</p>
            {invoice.shipTo?.companyName && <p>{invoice.shipTo.companyName}</p>}
            {invoice.shipTo?.address && <p className="whitespace-pre-line">{invoice.shipTo.address}</p>}
            {invoice.shipTo?.phone && <p>{invoice.shipTo.phone}</p>}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-8">
        <table className="w-full text-sm">
          <thead className="border-b-2 border-ink-900/80">
            <tr>
              <th className="text-left py-2 font-semibold text-ink-900">Description</th>
              <th className="text-right py-2 font-semibold text-ink-900 w-20">Qty</th>
              <th className="text-right py-2 font-semibold text-ink-900 w-28">Unit price</th>
              <th className="text-right py-2 font-semibold text-ink-900 w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-ink-300/50">
                <td className="py-2 text-ink-900 max-w-[280px] break-words [overflow-wrap:anywhere]">
                  {it.description || it.product?.name || "—"}
                </td>
                <td className="py-2 text-right tabular-nums">{it.quantity}</td>
                <td className="py-2 text-right tabular-nums">{formatCurrency(it.unitPrice)}</td>
                <td className="py-2 text-right tabular-nums">{formatCurrency(it.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 flex justify-end">
        <table className="min-w-[280px]">
          <tbody>
            <Row label="Subtotal" value={invoice.subtotal} />
            {invoice.discount > 0 && (
              <Row label="Discount" value={-invoice.discount} />
            )}
            {invoice.shippingHandling > 0 && (
              <Row label="Shipping / handling" value={invoice.shippingHandling} />
            )}
            <Row label="Total" value={invoice.total} strong />
            <Row label="Amount paid" value={-invoice.amountPaid} />
            <Row
              label="Balance due"
              value={invoice.balanceDue}
              strong
              danger={invoice.balanceDue > 0}
            />
          </tbody>
        </table>
      </div>

      {/* Remarks */}
      {invoice.remarks && (
        <div className="mt-8 pt-6 border-t border-ink-300/60">
          <p className="text-xs uppercase tracking-wide text-ink-500 mb-1">
            Remarks / Payment instructions
          </p>
          <p className="text-sm text-ink-700 whitespace-pre-line">{invoice.remarks}</p>
        </div>
      )}
    </div>
  );
}