import StatCard from "@/components/common/StatCard";
import { formatCurrency } from "@/utils/formatCurrency";

export default function TodayStats({ totals, loading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard
        label="Today’s invoices"
        value={totals?.todayInvoices ?? 0}
        variant="brand"
        loading={loading}
      />
      <StatCard
        label="Today’s sales"
        value={formatCurrency(totals?.todaySales ?? 0)}
        variant="brand"
        loading={loading}
      />
    </div>
  );
}