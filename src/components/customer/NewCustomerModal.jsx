import Modal from "@/components/common/Modal";
import CustomerForm from "./CustomerForm";
import { customerService } from "@/services/customerService";
import { getErrorMessage } from "@/services/api";
import { useToast } from "@/components/common/ToastProvider";
import { useState } from "react";

export default function NewCustomerModal({ open, onClose, onCreated }) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(payload) {
    setSubmitting(true);
    try {
      await customerService.create(payload);
      // Backend doesn't return the created customer, so refetch the list
      const fresh = await customerService.list();
      // Newest first by createdAt
      const created = fresh
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      toast.success("Customer created");
      onCreated?.(created, fresh);
      onClose?.();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not create customer"));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={submitting ? undefined : onClose}
      title="Add new customer"
      size="lg"
    >
      <CustomerForm
        onSubmit={handleSubmit}
        submitLabel="Create customer"
        onCancel={onClose}
        submitting={submitting}
      />
    </Modal>
  );
}