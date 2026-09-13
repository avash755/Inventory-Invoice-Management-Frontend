import { cn } from "@/utils/cn";
import Spinner from "./Spinner";

const VARIANTS = {
  primary:   "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-600/50",
  secondary: "bg-surface-100 text-ink-900 hover:bg-surface-50 border border-ink-300",
  ghost:     "bg-transparent text-ink-700 hover:bg-surface-100",
  danger:    "bg-state-danger text-white hover:opacity-90 disabled:opacity-50",
  success:   "bg-state-success text-white hover:opacity-90 disabled:opacity-50",
};

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export default function Button({
  children, variant = "primary", size = "md",
  type = "button", loading = false, disabled = false,
  className, ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors whitespace-nowrap",
        "disabled:cursor-not-allowed",
        VARIANTS[variant], SIZES[size], className
      )}
      {...rest}
    >
      {loading && (
        <Spinner size="sm" className="border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}