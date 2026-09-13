import Badge from "@/components/common/Badge";

const MAP = {
  pending:        { label: "Pending",        variant: "warning" },
  needs_revision: { label: "Needs revision", variant: "danger"  },
  approved:       { label: "Approved",       variant: "success" },
};

export function getInvoiceStatus(inv) {
  return MAP[inv?.status] ?? { label: "Pending", variant: "warning" };
}

export default function InvoiceStatusBadge({ invoice }) {
  const s = getInvoiceStatus(invoice);
  return <Badge variant={s.variant}>{s.label}</Badge>;
}