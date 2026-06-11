import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Card({ className, ...props }, ref) {
  return (
    <section
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-card shadow-sm",
        className
      )}
      {...props}
    />
  );
});
