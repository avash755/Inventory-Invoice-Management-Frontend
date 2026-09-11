export function getStockStatus(product) {
  const stock = product?.stock ?? 0;
  const threshold = product?.lowStockThreshold ?? 0;
  if (stock === 0) return { label: "Out of stock", variant: "danger", key: "out" };
  if (stock <= threshold) return { label: "Low stock", variant: "warning", key: "low" };
  return { label: "In stock", variant: "success", key: "in" };
}