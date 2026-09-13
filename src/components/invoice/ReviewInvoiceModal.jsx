import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Textarea from "@/components/common/Textarea";
import Input from "@/components/common/Input";
import FormField from "@/components/common/FormField";
import { invoiceService } from "@/services/invoiceService";
import { useToast } from "@/components/common/ToastProvider";
import { getErrorMessage } from "@/services/api";

export default function ReviewInvoiceModal({ open, invoice, onClose, onDone }) {
  const toast = useToast();
  const [discount, setDiscount] = useState("");
  const [shipping, setShipping] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [remarks, setRemarks] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open && invoice) {
      setDiscount(invoice.discount ?? "");
      setShipping(invoice.shippingHandling ?? "");
      setAmountPaid(invoice.amountPaid ?? "");
      setRemarks(invoice.remarks ?? "");
      setNote("");
    }
  }, [open, invoice]);

  async function approve() {
    setBusy(true);
    try {
      // Send manager edits then approve
      await invoiceService.update(invoice._id, {
        discount: Number(discount) || 0,
        shippingHandling: Number(shipping) || 0,
        amountPaid: Number(amountPaid) || 0,
        remarks,
      });
      await invoiceService.approve(invoice._id);
      toast.success("Approved");
      onDone?.();
      onClose?.();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function sendBack() {
    if (!note.trim()) return toast.error("Add a note for the SR");
    setBusy(true);
    try {
      await invoiceService.sendBack(invoice._id, {
        note: note.trim(),
        discount: Number(discount) || 0,
        shippingHandling: Number(shipping) || 0,
        amountPaid: Number(amountPaid) || 0,
        remarks,
      });
      toast.success("Sent back");
      onDone?.();
      onClose?.();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  if (!invoice) return null;

  return (
    <Modal open={open} onClose={busy ? undefined : onClose} title="Review invoice" size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="danger" onClick={sendBack} loading={busy}>Send back</Button>
          <Button variant="success" onClick={approve} loading={busy}>Approve</Button>
        </>
      }>
      <div className="space-y-4">
        <p className="text-sm text-ink-500">
          Edit discount / shipping / amount paid if needed, then approve or send back.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormField label="Discount (%)"><Input type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} /></FormField>
          <FormField label="Shipping"><Input type="number" min="0" step="0.01" value={shipping} onChange={(e) => setShipping(e.target.value)} /></FormField>
          <FormField label="Amount paid"><Input type="number" min="0" step="0.01" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} /></FormField>
        </div>

        <FormField label="Remarks"><Textarea rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} /></FormField>
        <FormField label="Note for SR (required to send back)"><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></FormField>
      </div>
    </Modal>
  );
}