"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HealthListRowProps {
  icon?: LucideIcon;
  iconNode?: ReactNode;
  iconClassName?: string;
  title: string;
  detail?: string;
  trailing?: ReactNode;
  href?: string;
  onClick?: () => void;
  showChevron?: boolean;
  className?: string;
}

export function HealthListRow({
  icon: Icon,
  iconNode,
  iconClassName,
  title,
  detail,
  trailing,
  href,
  onClick,
  showChevron = Boolean(href || onClick),
  className,
}: HealthListRowProps) {
  const content = (
    <>
      {(Icon || iconNode) && (
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-accent-primary",
            iconClassName
          )}
          aria-hidden
        >
          {iconNode ?? (Icon && <Icon className="h-4 w-4" strokeWidth={1.75} />)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
        {detail && (
          <p className="mt-0.5 text-pinned-caption text-[var(--text-secondary)]">
            {detail}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {trailing}
        {showChevron && (
          <ChevronRight
            className="h-4 w-4 text-[var(--text-secondary)]"
            strokeWidth={2}
            aria-hidden
          />
        )}
      </div>
    </>
  );

  const rowClass = cn(
    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-surface-elevated/80",
    className
  );

  if (href) {
    return (
      <Link href={href} className={rowClass}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClass}>
        {content}
      </button>
    );
  }

  return <div className={rowClass}>{content}</div>;
}
