import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import FormField from "@/components/common/FormField";
import Card from "@/components/common/Card";

const EMPTY = { name: "", company: "", address: "", phone: "", email: "" };

export default function CustomerForm({
  initialValue,
  onSubmit,
  submitting,
  submitLabel = "Save",
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
    if (!form.name || form.name.length < 3 || form.name.length > 25)
      err.name = "Name must be between 3 and 25 characters";
    if (!form.email) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Invalid email address";
    if (!form.phone) err.phone = "Phone is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: form.name.trim(),
      company: form.company?.trim() || undefined,
      address: form.address?.trim() || undefined,
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Name" required error={errors.name} htmlFor="c-name">
            <Input id="c-name" value={form.name} onChange={set("name")} error={errors.name} />
          </FormField>

          <FormField label="Company" htmlFor="c-company">
            <Input id="c-company" value={form.company} onChange={set("company")} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Email" required error={errors.email} htmlFor="c-email">
            <Input
              id="c-email"
              type="email"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
            />
          </FormField>

          <FormField label="Phone" required error={errors.phone} htmlFor="c-phone">
            <Input
              id="c-phone"
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              error={errors.phone}
              placeholder="+1 555 123 4567"
            />
          </FormField>
        </div>

        <FormField label="Address" htmlFor="c-address">
          <Textarea
            id="c-address"
            rows={3}
            value={form.address}
            onChange={set("address")}
          />
        </FormField>
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