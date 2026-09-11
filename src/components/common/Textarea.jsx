import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(function Textarea(
  { className, error, rows = 4, ...rest }, ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-md border bg-white px-3 py-2 text-sm text-ink-900",
        "placeholder:text-ink-500",
        "focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
        error ? "border-state-danger" : "border-ink-300",
        className
      )}
      {...rest}
    />
  );
});

export default Textarea;