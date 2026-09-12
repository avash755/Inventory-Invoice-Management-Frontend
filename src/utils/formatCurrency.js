const formatter = new Intl.NumberFormat("en-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value) {
  const n = Number(value);
  const safe = Number.isNaN(n) ? 0 : n;
  return `\u09F3${formatter.format(safe)}`;   // ৳ symbol + number
}