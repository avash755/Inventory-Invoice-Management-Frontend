import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Checkbox from "@/components/common/Checkbox";
import FormField from "@/components/common/FormField";
import Card from "@/components/common/Card";
import { ROLES } from "@/constants/roles";

export default function UserForm({
  mode = "create",
  initialValue,
  onSubmit,
  submitting,
  submitLabel = "Save",
  onCancel,
}) {
  const [form, setForm] = useState({
    username: initialValue?.username ?? "",
    email: initialValue?.email ?? "",
    password: "",
    role: initialValue?.role ?? ROLES.EMPLOYEE,
    status: initialValue?.status ?? true,
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    const v = e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [key]: v }));
  };

  function validate() {
    const err = {};
    if (!form.username || form.username.length < 3 || form.username.length > 25)
      err.username = "Username must be 3–25 characters";
    if (mode === "create") {
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        err.email = "Enter a valid email";
      if (!form.password || form.password.length < 6)
        err.password = "Password must be at least 6 characters";
    }
    if (![ROLES.MANAGER, ROLES.EMPLOYEE].includes(form.role))
      err.role = "Invalid role";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    if (mode === "create") {
      await onSubmit({
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });
    } else {
      await onSubmit({
        username: form.username.trim(),
        role: form.role,
        status: form.status,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-5 sm:p-6 space-y-4">
        <FormField label="Username" required error={errors.username} htmlFor="u-name">
          <Input id="u-name" value={form.username} onChange={set("username")} error={errors.username} />
        </FormField>

        {mode === "create" && (
          <>
            <FormField label="Email" required error={errors.email} htmlFor="u-email">
              <Input id="u-email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
            </FormField>

            <FormField
              label="Temporary password"
              required
              error={errors.password}
              hint="User must verify email before first login."
              htmlFor="u-pass"
            >
              <Input id="u-pass" type="text" value={form.password} onChange={set("password")} error={errors.password} />
            </FormField>
          </>
        )}

        <FormField label="Role" required error={errors.role} htmlFor="u-role">
          <Select id="u-role" value={form.role} onChange={set("role")}>
            <option value={ROLES.EMPLOYEE}>Sales Representative</option>
            <option value={ROLES.MANAGER}>Manager</option>
          </Select>
        </FormField>

        {mode === "edit" && (
          <FormField label="Account status">
            <Checkbox
              id="u-status"
              checked={form.status}
              onChange={set("status")}
              label={form.status ? "Active" : "Deactivated"}
            />
            <p className="mt-1 text-xs text-ink-500">
              Deactivated users cannot log in or use the application.
            </p>
          </FormField>
        )}
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