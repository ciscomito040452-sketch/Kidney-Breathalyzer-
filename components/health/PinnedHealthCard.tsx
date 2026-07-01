"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PinnedHealthCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  category: string;
  timeLabel?: string;
  headline: string;
  caption?: string;
  visual?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  animationDelay?: number;
}

export function PinnedHealthCard({
  icon: Icon,
  iconClassName,
  category,
  timeLabel,
  headline,
  caption,
  visual,
  href,
  onClick,
  className,
  animationDelay = 0,
}: PinnedHealthCardProps) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              iconClassName ?? "bg-[var(--accent-tint)] text-accent-primary"
            )}
            aria-hidden
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <span className="truncate text-pinned-caption font-medium text-[var(--text-secondary)]">
            {category}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-pinned-caption text-[var(--text-secondary)]">
          {timeLabel && <span>{timeLabel}</span>}
          {(href || onClick) && (
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          )}
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-pinned-headline font-semibold text-[var(--text-primary)]">
            {headline}
          </p>
          {caption && (
            <p className="mt-1 text-pinned-caption text-[var(--text-secondary)]">
              {caption}
            </p>
          )}
        </div>
        {visual && <div className="shrink-0">{visual}</div>}
      </div>
    </>
  );

  const cardClass = cn(
    "kb-fade-up block w-full rounded-2xl p-4 text-left app-card app-card--pinned transition-transform active:scale-[0.99]",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cardClass}
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {inner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cardClass}
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {inner}
      </button>
    );
  }

  return (
    <div
      className={cardClass}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {inner}
    </div>
  );
}
