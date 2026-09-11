import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(function Select(
  { className, error, children, ...rest }, ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border bg-white px-3 text-sm text-ink-900",
        "focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
        error ? "border-state-danger" : "border-ink-300",
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
});

export default Select;