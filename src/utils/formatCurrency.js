export function formatCurrency(value, currency = "USD") {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(isFinite(n) ? n : 0);
}