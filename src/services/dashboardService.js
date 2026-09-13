import { productService } from "./productService";
import { invoiceService } from "./invoiceService";

function isToday(d) {
  const now = new Date();
  const x = new Date(d);
  return (
    x.getFullYear() === now.getFullYear() &&
    x.getMonth() === now.getMonth() &&
    x.getDate() === now.getDate()
  );
}

function monthKey(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-US", { month: "short", year: "2-digit" });
}

export function buildMonthlyTrend(invoices, monthsBack = 6) {
  const now = new Date();
  const buckets = {};
  const keys = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    keys.push(k);
    buckets[k] = { key: k, label: monthLabel(k), sales: 0, outstanding: 0, count: 0 };
  }

  for (const inv of invoices) {
    const k = monthKey(inv.createdAt);
    if (!buckets[k]) continue;
    buckets[k].sales += Math.abs(inv.total || 0);
    buckets[k].outstanding += inv.balanceDue || 0;
    buckets[k].count += 1;
  }

  return keys.map((k) => buckets[k]);
}

export const dashboardService = {
  managerSummary: async () => {
    const [products, invoices] = await Promise.all([
      productService.list(),
      invoiceService.list(),
    ]);

    const approved = invoices.filter((i) => i.status === "approved");

    const totalProducts = products.length;
    const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
    const lowStockProducts = products.filter(
      (p) => p.stock > 0 && p.stock <= (p.lowStockThreshold ?? 0)
    );
    const outOfStockProducts = products.filter((p) => p.stock === 0);

    const todayInvoices = approved.filter((i) => isToday(i.createdAt));
    const todaySales = todayInvoices.reduce((s, i) => s + Math.abs(i.total || 0), 0);

    const outstandingBalance = approved.reduce(
      (s, i) => s + Math.max(i.balanceDue || 0, 0),
      0
    );

   const totalRevenue = approved.reduce((s, i) => s + Math.abs(i.total || 0), 0);

    const monthlyTrend = buildMonthlyTrend(approved, 6);

    const recentInvoices = [...invoices]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      totals: {
        totalProducts,
        totalStock,
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length,
        todayInvoices: todayInvoices.length,
        todaySales,
        outstandingBalance,
        totalRevenue,
      },
      recentInvoices,
      lowStockProducts: [...lowStockProducts, ...outOfStockProducts]
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5),
      monthlyTrend,
    };
  },

  employeeSummary: async () => {
    const invoices = await invoiceService.list();
    const approved = invoices.filter((i) => i.status === "approved");

    const todayInvoices = approved.filter((i) => isToday(i.createdAt));
    const todaySales = todayInvoices.reduce((s, i) => s + (i.total || 0), 0);

    const recentInvoices = [...invoices]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      totals: { todayInvoices: todayInvoices.length, todaySales },
      recentInvoices,
    };
  },

  recentStockActivity: async (limit = 8) => {
    return productService.recentActivity(limit);
  },
};