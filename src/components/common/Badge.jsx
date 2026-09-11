import { cn } from "@/utils/cn";

const VARIANTS = {
  neutral: "bg-surface-100 text-ink-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  danger:  "bg-red-50 text-red-700",
  info:    "bg-blue-50 text-blue-700",
};

export default function Badge({ children, variant = "neutral", className }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
      VARIANTS[variant], className
    )}>
      {children}
    </span>
  );
}