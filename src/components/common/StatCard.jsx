import Card from "./Card";
import Skeleton from "./Skeleton";
import { cn } from "@/utils/cn";

export default function StatCard({ label, value, hint, variant = "default", loading = false }) {
  const accent = {
    default: "text-ink-900",
    success: "text-state-success",
    warning: "text-state-warning",
    danger: "text-state-danger",
    brand: "text-brand-600",
  }[variant];

  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wide text-ink-500">{label}</p>
      {loading ? (
        <Skeleton className="h-8 w-24 mt-2" />
      ) : (
        <p className={cn("mt-2 text-2xl font-semibold tabular-nums", accent)}>{value}</p>
      )}
      {hint && !loading && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </Card>
  );
}