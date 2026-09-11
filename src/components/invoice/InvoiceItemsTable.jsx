import Button from "@/components/common/Button";
import InvoiceItemRow from "./InvoiceItemRow";
import EmptyState from "@/components/common/EmptyState";

export default function InvoiceItemsTable({ items, products, onChange, onRemove, onAdd }) {
  return (
    <div>
      {items.length === 0 ? (
        <EmptyState
          title="No items yet"
          description="Add at least one product line to the invoice."
          action={<Button variant="secondary" onClick={onAdd}>+ Add item</Button>}
        />
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-50 text-left text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-3 py-3 font-medium">Product</th>
                  <th className="px-3 py-3 font-medium">Description</th>
                  <th className="px-3 py-3 font-medium">Qty</th>
                  <th className="px-3 py-3 font-medium">Unit price</th>
                  <th className="px-3 py-3 font-medium text-right">Total</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-300/50">
                {items.map((item, i) => (
                  <InvoiceItemRow
                    key={i}
                    item={item}
                    index={i}
                    products={products}
                    onChange={onChange}
                    onRemove={onRemove}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <Button variant="secondary" size="sm" onClick={onAdd}>+ Add item</Button>
          </div>
        </>
      )}
    </div>
  );
}