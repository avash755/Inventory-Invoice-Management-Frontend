import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import FormField from "@/components/common/FormField";
import { invoiceService } from "@/services/invoiceService";
import { useToast } from "@/components/common/ToastProvider";
import { getErrorMessage } from "@/services/api";
import { formatCurrency } from "@/utils/formatCurrency";

export default function RecordPaymentModal({ open, invoice, onClose, onDone }) {
  const toast = useToast();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) { setAmount(""); setError(""); }
  }, [open]);

  async function submit() {
    const n = Number(amount);
    if (!n || n <= 0) return setError("Enter a valid amount");
    if (n > invoice.balanceDue) return setError(`Max is ${formatCurrency(invoice.balanceDue)}`);
    setBusy(true);
    try {
      await invoiceService.recordPayment(invoice._id, n);
      toast.success("Payment recorded");
      onDone?.();
      onClose?.();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  if (!invoice) return null;

  return (
    <Modal open={open} onClose={busy ? undefined : onClose} title="Record payment"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={submit} loading={busy}>Record</Button>
        </>
      }>
      <div className="space-y-4">
        <div className="rounded-md bg-surface-50 p-3 text-sm space-y-1">
          <p>Total: <strong>{formatCurrency(invoice.total)}</strong></p>
          <p>Already paid: <strong>{formatCurrency(invoice.amountPaid)}</strong></p>
          <p>Balance due: <strong className="text-state-danger">{formatCurrency(invoice.balanceDue)}</strong></p>
        </div>

        <FormField label="Payment amount" required error={error} htmlFor="pay-amt">
          <Input id="pay-amt" type="number" min="0" step="0.01"
            value={amount} onChange={(e) => setAmount(e.target.value)} error={error} />
        </FormField>
      </div>
    </Modal>
  );
}