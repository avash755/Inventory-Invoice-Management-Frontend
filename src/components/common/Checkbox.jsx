import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Checkbox = forwardRef(function Checkbox(
  { className, label, id, ...rest }, ref
) {
  return (
    <label htmlFor={id} className={cn("inline-flex items-center gap-2 cursor-pointer", className)}>
      <input
        id={id}
        ref={ref}
        type="checkbox"
        className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
        {...rest}
      />
      {label && <span className="text-sm text-ink-700">{label}</span>}
    </label>
  );
});

export default Checkbox;