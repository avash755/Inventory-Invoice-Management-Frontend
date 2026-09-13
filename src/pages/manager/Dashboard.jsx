import { dashboardService } from "@/services/dashboardService";
import { useAsync } from "@/hooks/useAsync";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import ErrorState from "@/components/common/ErrorState";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import LowStockList from "@/components/dashboard/LowStockList";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import RecentStockActivity from "@/components/dashboard/RecentStockActivity";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAuth } from "@/context/AuthContext";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const summary = useAsync(() => dashboardService.managerSummary(), []);
  const activity = useAsync(() => dashboardService.recentStockActivity(8), []);

  const t = summary.data?.totals;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.username ?? ""}`}
        description="Here’s what’s happening across your business."
      />

      {summary.error && <ErrorState message={summary.error} onRetry={summary.refetch} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Products" value={t?.totalProducts ?? 0} loading={summary.loading} />
        <StatCard label="Total stock" value={t?.totalStock ?? 0} loading={summary.loading} />
        <StatCard
          label="Low stock"
          value={t?.lowStock ?? 0}
          hint={t?.outOfStock ? `${t.outOfStock} out of stock` : undefined}
          variant={t?.lowStock ? "warning" : "default"}
          loading={summary.loading}
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(t?.totalRevenue ?? 0)}
          variant="success"
          loading={summary.loading}
        />
        <StatCard
          label="Outstanding Balance"
          value={formatCurrency(Math.abs(t?.outstandingBalance ?? 0))}
          variant={(t?.outstandingBalance ?? 0) > 0 ? "danger" : "success"}
          loading={summary.loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <StatCard
          label="Today’s invoices"
          value={t?.todayInvoices ?? 0}
          variant="brand"
          loading={summary.loading}
        />
        <StatCard
          label="Today’s sales"
          value={formatCurrency(t?.todaySales ?? 0)}
          variant="brand"
          loading={summary.loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          <MonthlySalesChart data={summary.data?.monthlyTrend ?? []} />
        </div>
        <div>
          <LowStockList products={summary.data?.lowStockProducts ?? []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          <RecentInvoices invoices={summary.data?.recentInvoices ?? []} />
        </div>
        <div>
          {activity.error ? (
            <ErrorState message={activity.error} onRetry={activity.refetch} />
          ) : (
            <RecentStockActivity activity={activity.data ?? []} />
          )}
        </div>
      </div>
    </>
  );
}