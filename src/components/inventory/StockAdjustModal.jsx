import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import FormField from "@/components/common/FormField";
import { productService } from "@/services/productService";
import { getErrorMessage } from "@/services/api";
import { useToast } from "@/components/common/ToastProvider";

export default function StockAdjustModal({ open, onClose, product, onSuccess }) {
  const toast = useToast();
  const [type, setType] = useState("stock_in");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setType("stock_in");
      setQuantity("");
      setError("");
    }
  }, [open]);

  const previous = product?.stock ?? 0;
  const q = Number(quantity) || 0;
  const preview =
    type === "stock_in" ? previous + q : Math.max(previous - q, 0);

  async function handleSubmit() {
    setError("");
    if (q <= 0) return setError("Quantity must be greater than 0");
    if (type === "sell" && q > previous)
      return setError("Cannot remove more than current stock");

    setSubmitting(true);
    try {
      await productService.adjustStock(product._id, { quantity: q, type });
      toast.success("Stock updated");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(getErrorMessage(err, "Could not update stock"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={submitting ? undefined : onClose}
      title={product ? `Adjust stock — ${product.name}` : "Adjust stock"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} loading={submitting}>Update stock</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-md bg-surface-50 px-3 py-2 text-sm">
          <span className="text-ink-500">Current stock: </span>
          <span className="font-medium text-ink-900">
            {previous} {product?.unit}
          </span>
        </div>

        <FormField label="Action" htmlFor="sa-type">
          <Select id="sa-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="stock_in">Add stock (stock in)</option>
            <option value="sell">Remove stock (sell)</option>
          </Select>
        </FormField>

        <FormField label="Quantity" required error={error} htmlFor="sa-qty">
          <Input
            id="sa-qty"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            error={error}
          />
        </FormField>

        {q > 0 && (
          <div className="rounded-md bg-blue-50 px-3 py-2 text-sm text-ink-700">
            New stock will be{" "}
            <span className="font-semibold text-ink-900">
              {preview} {product?.unit}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}