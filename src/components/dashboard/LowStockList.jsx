import { Link } from "react-router-dom";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";

export default function LowStockList({ products }) {
  return (
    <Card>
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-300/60">
        <h2 className="text-sm font-semibold text-ink-900">Low stock</h2>
        <Link to={ROUTES.MANAGER.INVENTORY} className="text-xs text-brand-600 hover:underline">
          Manage inventory
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="All good"
          description="No products are running low on stock."
        />
      ) : (
        <ul className="divide-y divide-ink-300/50">
          {products.map((p) => {
            const out = p.stock === 0;
            return (
              <li key={p._id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <Link
                    to={ROUTES.MANAGER.PRODUCT(p._id)}
                    className="block text-sm font-medium text-ink-900 hover:text-brand-600 truncate"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-ink-500">
                    Threshold: {p.lowStockThreshold ?? 0} {p.unit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm tabular-nums text-ink-700">
                    {p.stock} {p.unit}
                  </span>
                  <Badge variant={out ? "danger" : "warning"}>
                    {out ? "Out" : "Low"}
                  </Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}