import { Link } from "react-router-dom";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import { formatDateTime } from "@/utils/formatDate";
import { ROUTES } from "@/constants/routes";

export default function RecentStockActivity({ activity }) {
  return (
    <Card>
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-300/60">
        <h2 className="text-sm font-semibold text-ink-900">Recent stock activity</h2>
        <Link
          to={ROUTES.MANAGER.INVENTORY}
          className="text-xs text-brand-600 hover:underline"
        >
          View inventory
        </Link>
      </div>

      {activity.length === 0 ? (
        <EmptyState
          title="No activity yet"
          description="Stock in/out events will appear here."
        />
      ) : (
        <ul className="divide-y divide-ink-300/50">
          {activity.map((tx) => {
            const isSale = tx.type === "sale";
            return (
              <li key={tx._id} className="px-5 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={tx.product ? ROUTES.MANAGER.PRODUCT(tx.product._id) : "#"}
                    className="block text-sm font-medium text-ink-900 hover:text-brand-600 truncate"
                  >
                    {tx.product?.name ?? "Deleted product"}
                  </Link>
                  <p className="text-xs text-ink-500 truncate">
                    {tx.previousStock} → {tx.newStock} {tx.product?.unit ?? ""}
                    {" · "}
                    {tx.createdBy?.username ?? "—"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={isSale ? "danger" : "success"}>
                    {isSale ? `−${tx.quantity}` : `+${tx.quantity}`}
                  </Badge>
                  <p className="text-[11px] text-ink-500 mt-1">
                    {formatDateTime(tx.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}