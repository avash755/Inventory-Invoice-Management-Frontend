import Badge from "@/components/common/Badge";
import { getStockStatus } from "@/utils/stockStatus";

export default function StockBadge({ product, showLabel = true }) {
  const { label, variant } = getStockStatus(product);
  return (
    <Badge variant={variant}>
      {showLabel ? label : ""}
      {!showLabel && product?.stock}
    </Badge>
  );
}