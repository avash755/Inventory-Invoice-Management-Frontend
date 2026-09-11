import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(function Input(
  { className, error, type = "text", ...rest }, ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-10 w-full rounded-md border bg-white px-3 text-sm text-ink-900",
        "placeholder:text-ink-500",
        "focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
        "disabled:bg-surface-100 disabled:cursor-not-allowed",
        error ? "border-state-danger" : "border-ink-300",
        className
      )}
      {...rest}
    />
  );
});

export default Input;