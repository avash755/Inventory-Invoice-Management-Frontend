import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { useAsync } from "@/hooks/useAsync";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import StockBadge from "@/components/inventory/StockBadge";
import StockAdjustModal from "@/components/inventory/StockAdjustModal";
import StockHistoryTable from "@/components/inventory/StockHistoryTable";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateTime } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";

function Row({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-ink-300/50 last:border-0">
      <span className="text-xs uppercase tracking-wide text-ink-500 sm:w-40 shrink-0">
        {label}
      </span>
      <span className="text-sm text-ink-900">{children}</span>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [adjustOpen, setAdjustOpen] = useState(false);

  const product = useAsync(() => productService.get(id), [id]);
  const history = useAsync(() => productService.stockHistory(id), [id]);

  if (product.loading) {
    return <div className="p-10 grid place-items-center"><Spinner size="lg" /></div>;
  }
  if (product.error) {
    return <ErrorState message={product.error} onRetry={product.refetch} />;
  }

  const p = product.data;
  if (!p) return null;

  function handleAdjusted() {
    product.refetch();
    history.refetch();
  }

  return (
    <>
      <div className="mb-4 text-sm text-ink-500">
        <Link to={ROUTES.MANAGER.INVENTORY} className="hover:text-ink-900">
          Inventory
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{p.name}</span>
      </div>

      <PageHeader
        title={p.name}
        description={`SKU: ${p.sku}`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setAdjustOpen(true)}>
              Adjust stock
            </Button>
            <Button onClick={() => navigate(ROUTES.MANAGER.PRODUCT_EDIT(p._id))}>
              Edit product
            </Button>
          </>
        }
      />

      <div className="flex gap-2 border-b border-ink-300/60 mb-4">
        {[
          { key: "overview", label: "Overview" },
          { key: "history", label: "Stock history" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium -mb-px border-b-2",
              tab === t.key
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-ink-500 hover:text-ink-900"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-5">
            <h2 className="text-sm font-semibold text-ink-900 mb-2">Details</h2>
            <Row label="Name">{p.name}</Row>
            <Row label="SKU"><span className="font-mono">{p.sku}</span></Row>
            <Row label="Category">{p.category || "—"}</Row>
            <Row label="Unit">{p.unit}</Row>
            <Row label="Price">{formatCurrency(p.price)}</Row>
            <Row label="Low stock threshold">
              {p.lowStockThreshold ?? 0} {p.unit}
            </Row>
            <Row label="Description">{p.description || "—"}</Row>
            <Row label="Created">{formatDateTime(p.createdAt)}</Row>
            <Row label="Last updated">{formatDateTime(p.updatedAt)}</Row>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink-900 mb-3">Stock</h2>
            <div className="text-3xl font-semibold text-ink-900 tabular-nums">
              {p.stock} <span className="text-sm font-normal text-ink-500">{p.unit}</span>
            </div>
            <div className="mt-2"><StockBadge product={p} /></div>
            <Button
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => setAdjustOpen(true)}
            >
              Adjust stock
            </Button>
          </Card>
        </div>
      )}

      {tab === "history" && (
        <Card>
          {history.loading ? (
            <div className="p-10 grid place-items-center"><Spinner /></div>
          ) : history.error ? (
            <ErrorState message={history.error} onRetry={history.refetch} />
          ) : (
            <StockHistoryTable history={history.data ?? []} />
          )}
        </Card>
      )}

      <StockAdjustModal
        open={adjustOpen}
        product={p}
        onClose={() => setAdjustOpen(false)}
        onSuccess={handleAdjusted}
      />
    </>
  );
}