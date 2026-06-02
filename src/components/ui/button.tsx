"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bone/40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-bone text-ink-0 hover:bg-bone/90 border border-bone/0",
        outline:
          "border border-line-strong text-bone hover:bg-bone/[0.04] hover:border-bone/30",
        ghost:
          "text-bone-muted hover:text-bone hover:bg-bone/[0.04]",
        link:
          "text-bone underline-offset-4 hover:underline",
        subtle:
          "bg-ink-100 text-bone hover:bg-ink-200 border border-line",
      },
      size: {
        sm: "h-9 px-4 text-[12px] tracking-widest uppercase",
        md: "h-11 px-6 text-[12px] tracking-widest uppercase",
        lg: "h-14 px-9 text-[13px] tracking-widest uppercase",
        xl: "h-16 px-12 text-[14px] tracking-[0.32em] uppercase",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
