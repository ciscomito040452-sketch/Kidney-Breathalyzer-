import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({
  icon: Icon,
  message,
  ctaLabel,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <Icon
        className="mb-3 h-10 w-10 text-[var(--text-secondary)]"
        strokeWidth={1.5}
      />
      <p className="max-w-xs text-sm text-[var(--text-secondary)]">{message}</p>
      {ctaLabel && ctaHref && (
        <Button variant="secondary" className="mt-4" asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
