import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import { lineTotal } from "@/utils/invoiceCalculations";
import { formatCurrency } from "@/utils/formatCurrency";

export default function InvoiceItemRow({ item, index, products, onChange, onRemove }) {
  const product = products.find((p) => p._id === item.productId);
  const total = lineTotal(item);

  const stockIssue =
    product && Number(item.quantity) > product.stock
      ? `Only ${product.stock} ${product.unit} in stock`
      : null;

  function set(key, value) {
    onChange(index, { ...item, [key]: value });
  }

  function handleProductSelect(e) {
    const pid = e.target.value;
    const p = products.find((x) => x._id === pid);
    onChange(index, {
      ...item,
      productId: pid,
      description: p ? p.name : item.description,
      unitPrice: p ? String(p.price) : item.unitPrice,
    });
  }

  return (
    <tr className="align-top">
      <td className="px-3 py-3 min-w-[200px]">
        <Select value={item.productId} onChange={handleProductSelect}>
          <option value="">Select product…</option>
          {products.map((p) => (
            <option key={p._id} value={p._id} disabled={p.stock === 0}>
              {p.name} ({p.stock} {p.unit}){p.stock === 0 ? " — out of stock" : ""}
            </option>
          ))}
        </Select>
      </td>
      <td className="px-3 py-3 min-w-[200px]">
        <Input
          value={item.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Description"
        />
      </td>
      <td className="px-3 py-3 w-24">
        <Input
  type="number"
  min="1"
  max={product?.stock ?? undefined}
  value={item.quantity}
  onChange={(e) => {
    const raw = e.target.value;
    if (raw === "") return set("quantity", "");
    let n = Number(raw);
    if (isNaN(n)) return;
    if (n < 1) n = 1;
    if (product && n > product.stock) n = product.stock;
    set("quantity", String(n));
  }}
  error={!!stockIssue}
/>
        {stockIssue && <p className="mt-1 text-xs text-state-danger">{stockIssue}</p>}
      </td>
      <td className="px-3 py-3 w-32">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={item.unitPrice}
          onChange={(e) => set("unitPrice", e.target.value)}
        />
      </td>
      <td className="px-3 py-3 w-28 text-right tabular-nums text-ink-900">
        {formatCurrency(total)}
      </td>
      <td className="px-3 py-3 w-16 text-right">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-sm text-state-danger hover:underline"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}