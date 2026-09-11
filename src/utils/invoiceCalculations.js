export function lineTotal(item) {
  return (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
}

export function calculateTotals({
  items = [],
  discount = 0,
  taxRate = 0,
  shipping = 0,
  amountPaid = 0,
}) {
  const subtotal = items.reduce((s, it) => s + lineTotal(it), 0);
  const d = Number(discount) || 0;
  const r = Number(taxRate) || 0;
  const sh = Number(shipping) || 0;
  const paid = Number(amountPaid) || 0;

  const taxableAmount = subtotal - d;       // discount applies before tax (backend match)
  const totalTax = (taxableAmount * r) / 100;
  const total = subtotal - d + totalTax + sh;

  const balanceDueWithoutPaid = total;              // NEW
  const balanceDue = Math.max(total - paid, 0);     // clamped so it never goes negative

  return {
    subtotal,
    discount: d,
    taxableAmount,
    totalTax,
    shipping: sh,
    total,
    amountPaid: paid,
    balanceDue,
    balanceDueWithoutPaid,                          // NEW
  };
}