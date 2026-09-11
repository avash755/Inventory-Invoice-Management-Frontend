import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productService } from "@/services/productService";
import { useAsync } from "@/hooks/useAsync";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import SearchBar from "@/components/common/SearchBar";
import Select from "@/components/common/Select";
import { Table, THead, TH, TBody, TR, TD } from "@/components/common/Table";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import StockBadge from "@/components/inventory/StockBadge";
import StockAdjustModal from "@/components/inventory/StockAdjustModal";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROUTES } from "@/constants/routes";

export default function Inventory() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useAsync(() => productService.list(), []);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | in | low | out
  const [adjustProduct, setAdjustProduct] = useState(null);

  const products = data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => {
        if (q && !`${p.name} ${p.sku} ${p.category ?? ""}`.toLowerCase().includes(q))
          return false;
        if (filter === "in") return p.stock > (p.lowStockThreshold ?? 0);
        if (filter === "low")
          return p.stock > 0 && p.stock <= (p.lowStockThreshold ?? 0);
        if (filter === "out") return p.stock === 0;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, query, filter]);

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Manage your products and stock levels."
        actions={
          <Button onClick={() => navigate(ROUTES.MANAGER.PRODUCT_NEW)}>
            + Add product
          </Button>
        }
      />

      <Card className="mb-4 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by name, SKU, or category…"
            className="flex-1"
          />
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="sm:w-52"
          >
            <option value="all">All stock</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </Select>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="p-10 grid place-items-center"><Spinner /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No products found"
            description={
              products.length === 0
                ? "Start by adding your first product."
                : "Try a different search or filter."
            }
            action={
              products.length === 0 && (
                <Button onClick={() => navigate(ROUTES.MANAGER.PRODUCT_NEW)}>
                  + Add product
                </Button>
              )
            }
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Product</TH>
                <TH>SKU</TH>
                <TH>Category</TH>
                <TH className="text-right">Price</TH>
                <TH className="text-right">Stock</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((p) => (
                <TR key={p._id}>
                  <TD className="font-medium text-ink-900">
                    <Link
                      to={ROUTES.MANAGER.PRODUCT(p._id)}
                      className="hover:text-brand-600"
                    >
                      {p.name}
                    </Link>
                  </TD>
                  <TD className="font-mono text-xs">{p.sku}</TD>
                  <TD>{p.category || "—"}</TD>
                  <TD className="text-right tabular-nums">{formatCurrency(p.price)}</TD>
                  <TD className="text-right tabular-nums">
                    {p.stock} {p.unit}
                  </TD>
                  <TD><StockBadge product={p} /></TD>
                  <TD className="text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setAdjustProduct(p)}
                      >
                        Adjust stock
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(ROUTES.MANAGER.PRODUCT_EDIT(p._id))}
                      >
                        Edit
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>

      <StockAdjustModal
        open={!!adjustProduct}
        product={adjustProduct}
        onClose={() => setAdjustProduct(null)}
        onSuccess={() => refetch()}
      />
    </>
  );
}