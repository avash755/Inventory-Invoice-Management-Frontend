import Badge from "@/components/common/Badge";

export function getInvoiceStatus(inv) {
  const due = inv.balanceDue ?? 0;
  if (due <= 0) return { label: "Paid", variant: "success" };
  if ((inv.amountPaid ?? 0) > 0) return { label: "Partial", variant: "warning" };
  return { label: "Unpaid", variant: "danger" };
}

export default function InvoiceStatusBadge({ invoice }) {
  const s = getInvoiceStatus(invoice);
  return <Badge variant={s.variant}>{s.label}</Badge>;
}