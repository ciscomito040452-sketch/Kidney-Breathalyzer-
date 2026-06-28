import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
