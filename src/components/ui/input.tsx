"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border border-line bg-transparent px-4 py-2 text-[15px] tracking-tight",
          "placeholder:text-bone/30 placeholder:font-light",
          "focus:outline-none focus:border-bone/40 transition-colors duration-300",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full min-h-[120px] border border-line bg-transparent px-4 py-3 text-[15px] leading-relaxed",
      "placeholder:text-bone/30 placeholder:font-light",
      "focus:outline-none focus:border-bone/40 transition-colors duration-300",
      "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Input, Textarea };
