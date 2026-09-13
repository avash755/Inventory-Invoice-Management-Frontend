import Input from "@/components/common/Input";
import FormField from "@/components/common/FormField";
import { formatCurrency } from "@/utils/formatCurrency";

function Row({ label, value, emphasize, danger }) {
  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        emphasize
          ? "text-base font-semibold text-ink-900 border-t border-ink-300/60 pt-3 mt-2"
          : "text-sm text-ink-700"
      }`}
    >
      <span>{label}</span>
      <span className={`tabular-nums ${danger ? "text-state-danger" : ""}`}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}

export default function InvoiceSummary({ totals, form, onChange }) {
  const maxPaid = totals.total;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <FormField label="Discount (%)" htmlFor="iv-discount">
          <Input
            id="iv-discount"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.discount}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") return onChange({ ...form, discount: "" });

              const n = Number(raw);
              if (Number.isNaN(n) || n < 0) return;

              const capped = Math.min(n, 100);
              onChange({ ...form, discount: String(capped) });
            }}
          />
        </FormField>

        <FormField label="Shipping / handling" htmlFor="iv-ship">
          <Input
            id="iv-ship"
            type="number"
            min="0"
            step="0.01"
            value={form.shipping}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") return onChange({ ...form, shipping: "" });

              const n = Number(raw);
              if (Number.isNaN(n) || n < 0) return;

              onChange({ ...form, shipping: raw });
            }}
          />
        </FormField>

        <FormField label="Amount paid" htmlFor="iv-paid">
          <Input
            id="iv-paid"
            type="number"
            min="0"
            step="0.01"
            value={form.amountPaid}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") return onChange({ ...form, amountPaid: "" });

              const n = Number(raw);
              if (Number.isNaN(n) || n < 0) return;

              const capped = Math.min(n, maxPaid);
              onChange({ ...form, amountPaid: String(capped) });
            }}
          />
        </FormField>
      </div>

      <div className="rounded-md bg-surface-50 px-4 py-4">
        <Row label="Subtotal" value={totals.subtotal} />

        {totals.discount > 0 && (
          <Row label={`Discount (${totals.discountPct}%)`} value={-totals.discount} />
        )}

        <Row label="Shipping / handling" value={totals.shipping} />
        <Row label="Total" value={totals.total} emphasize />
        <Row label="Amount paid" value={-totals.amountPaid} />
        <Row
          label="Balance due"
          value={totals.balanceDue}
          emphasize
          danger={totals.balanceDue > 0}
        />
      </div>
    </div>
  );
}