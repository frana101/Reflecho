import { cn } from "@/lib/utils";

export function GridOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 bg-grid mask-radial-fade opacity-60",
        className,
      )}
    />
  );
}
