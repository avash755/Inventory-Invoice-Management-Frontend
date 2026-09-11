import { cn } from "@/utils/cn";

export default function FormField({ label, required, error, hint, htmlFor, children, className }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink-700">
          {label} {required && <span className="text-state-danger">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
      {error && <p className="text-xs text-state-danger">{error}</p>}
    </div>
  );
}