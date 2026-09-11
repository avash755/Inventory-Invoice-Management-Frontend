import { cn } from "@/utils/cn";

export default function Spinner({ className, size = "md" }) {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-6 h-6 border-2", lg: "w-10 h-10 border-4" };
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full border-brand-500/30 border-t-brand-600 animate-spin",
        sizes[size], className
      )}
    />
  );
}