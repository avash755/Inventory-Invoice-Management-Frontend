import Input from "@/components/common/Input";
import FormField from "@/components/common/FormField";
import { formatCurrency } from "@/utils/formatCurrency";

function Row({ label, value, emphasize, danger }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${emphasize ? "text-base font-semibold text-ink-900 border-t border-ink-300/60 pt-3 mt-2" : "text-sm text-ink-700"}`}>
      <span>{label}</span>
      <span className={`tabular-nums ${danger ? "text-state-danger" : ""}`}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}

export default function InvoiceSummary({ totals, form, onChange }) {
  const set = (k) => (e) => onChange({ ...form, [k]: e.target.value });

  const maxPaid = totals.balanceDueWithoutPaid ?? totals.total;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <FormField label="Discount (%)" htmlFor="iv-discount">
          <Input id="iv-discount" type="number" min="0" max="100" step="0.01"
            value={form.discount} onChange={set("discount")} />
        </FormField>

        <FormField label="Shipping / handling" htmlFor="iv-ship">
          <Input
            id="iv-ship"
            type="number"
            min="0"
            step="0.01"
            value={form.shipping}
            onChange={set("shipping")}
          />
        </FormField>

        <FormField label="Amount paid" htmlFor="iv-paid">
          <Input
            id="iv-paid"
            type="number"
            min="0"
            step="0.01"
            max={maxPaid}
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
          <p className="text-xs text-ink-500 mt-1">
            Max: {formatCurrency(maxPaid)}
          </p>
        </FormField>
      </div>

      <div className="rounded-md bg-surface-50 px-4 py-4">
        <Row label="Subtotal" value={totals.subtotal} />
        <Row label="Discount" value={-totals.discount} />
        <Row label="Subtotal less discount" value={totals.taxableAmount} />
        <Row label={`Tax (${form.taxRate || 0}%)`} value={totals.totalTax} />
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