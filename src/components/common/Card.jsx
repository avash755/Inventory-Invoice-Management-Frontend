import { cn } from "@/utils/cn";

export default function Card({ children, className }) {
  return (
    <div className={cn("bg-white rounded-lg border border-ink-300/60 shadow-card", className)}>
      {children}
    </div>
  );
}