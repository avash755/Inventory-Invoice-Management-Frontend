import { cn } from "@/utils/cn";

const VARIANTS = {
  success: "bg-state-success",
  error:   "bg-state-danger",
  info:    "bg-brand-600",
  warning: "bg-state-warning",
};

export default function Toast({ message, variant = "info", onClose, className }) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 min-w-[240px] max-w-sm text-white text-sm",
        "px-4 py-3 rounded-md shadow-pop",
        VARIANTS[variant],
        className
      )}
    >
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="text-white/80 hover:text-white leading-none text-lg"
        >
          ×
        </button>
      )}
    </div>
  );
}