import { dashboardService } from "@/services/dashboardService";
import { useAsync } from "@/hooks/useAsync";
import PageHeader from "@/components/common/PageHeader";
import ErrorState from "@/components/common/ErrorState";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import TodayStats from "@/components/dashboard/TodayStats";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useAsync(
    () => dashboardService.employeeSummary(),
    []
  );

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.username ?? ""}`}
        description="Here’s a quick look at your activity today."
      />

      {error && <ErrorState message={error} onRetry={refetch} />}

      <TodayStats totals={data?.totals} loading={loading} />

      <div className="mt-6">
        <RecentInvoices invoices={data?.recentInvoices ?? []} />
      </div>
    </>
  );
}