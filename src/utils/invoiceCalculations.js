export function lineTotal(item) {
  return (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
}

export function calculateTotals({ items = [], discount = 0, shipping = 0, amountPaid = 0 }) {
  const subtotal = items.reduce((s, it) => s + lineTotal(it), 0);
  const discountPct = Number(discount) || 0;
  const discountAmount = (subtotal * discountPct) / 100;
  const sh = Number(shipping) || 0;
  const paid = Number(amountPaid) || 0;

  const total = subtotal - discountAmount + sh;
  const balanceDue = Math.max(total - paid, 0);

  return {
    subtotal,
    discountPct,
    discount: discountAmount,
    shipping: sh,
    total,
    amountPaid: paid,
    balanceDue,
  };
}