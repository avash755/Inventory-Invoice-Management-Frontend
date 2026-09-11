import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import FormField from "@/components/common/FormField";
import Card from "@/components/common/Card";

const EMPTY = {
  name: "",
  sku: "",
  description: "",
  category: "",
  price: "",
  stock: 0,
  lowStockThreshold: 10,
  unit: "pcs",
};

export default function ProductForm({
  initialValue,
  onSubmit,
  submitting,
  submitLabel = "Save",
  mode = "create", // "create" | "edit"
  onCancel,
}) {
  const [form, setForm] = useState({ ...EMPTY, ...(initialValue || {}) });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    const v = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: v }));
  };

  function validate() {
    const err = {};
    if (!form.name || form.name.length < 3) err.name = "Name must be at least 3 characters";
    if (!form.sku) err.sku = "SKU is required";
    if (form.description && form.description.length < 20)
      err.description = "Description must be at least 20 characters (or leave empty)";
    if (form.price === "" || Number(form.price) < 0) err.price = "Price must be 0 or greater";
    if (Number(form.stock) < 0) err.stock = "Stock cannot be negative";
    if (Number(form.lowStockThreshold) < 0) err.lowStockThreshold = "Threshold cannot be negative";
    if (!form.unit) err.unit = "Unit is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      description: form.description?.trim() || undefined,
      category: form.category?.trim() || undefined,
      price: Number(form.price),
      lowStockThreshold: Number(form.lowStockThreshold),
      unit: form.unit.trim(),
    };
    if (mode === "create") payload.stock = Number(form.stock);

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Product name" required error={errors.name} htmlFor="p-name">
            <Input id="p-name" value={form.name} onChange={set("name")} error={errors.name} />
          </FormField>

          <FormField label="SKU" required error={errors.sku} htmlFor="p-sku">
            <Input
              id="p-sku"
              value={form.sku}
              onChange={set("sku")}
              error={errors.sku}
              placeholder="e.g. WID-001"
              className="uppercase"
            />
          </FormField>
        </div>

        <FormField
          label="Description"
          error={errors.description}
          hint="Optional — if filled, must be at least 20 characters."
          htmlFor="p-desc"
        >
          <Textarea
            id="p-desc"
            rows={3}
            value={form.description}
            onChange={set("description")}
            error={errors.description}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Category" htmlFor="p-cat">
            <Input id="p-cat" value={form.category} onChange={set("category")} />
          </FormField>

          <FormField label="Unit" required error={errors.unit} htmlFor="p-unit">
            <Input
              id="p-unit"
              value={form.unit}
              onChange={set("unit")}
              error={errors.unit}
              placeholder="pcs / kg / box"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Price" required error={errors.price} htmlFor="p-price">
            <Input
              id="p-price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={set("price")}
              error={errors.price}
            />
          </FormField>

          <FormField
            label="Initial stock"
            error={errors.stock}
            htmlFor="p-stock"
            hint={mode === "edit" ? "Use “Adjust stock” on the product page." : undefined}
          >
            <Input
              id="p-stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={set("stock")}
              error={errors.stock}
              disabled={mode === "edit"}
            />
          </FormField>

          <FormField label="Low stock threshold" error={errors.lowStockThreshold} htmlFor="p-threshold">
            <Input
              id="p-threshold"
              type="number"
              min="0"
              value={form.lowStockThreshold}
              onChange={set("lowStockThreshold")}
              error={errors.lowStockThreshold}
            />
          </FormField>
        </div>
      </Card>

      <div className="mt-4 flex justify-end gap-2">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}