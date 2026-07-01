"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMotionSafe } from "@/lib/motion/use-motion-safe";
import { useCountUp } from "@/lib/motion/use-count-up";
import { cn } from "@/lib/utils";

interface PinnedHealthCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  category: string;
  timeLabel?: string;
  headline: string;
  caption?: string;
  value?: string;
  valueUnit?: string;
  variant?: "qualitative" | "metric";
  visual?: ReactNode;
  footer?: ReactNode;
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
  value,
  valueUnit,
  variant = "qualitative",
  visual,
  footer,
  href,
  onClick,
  className,
  animationDelay = 0,
}: PinnedHealthCardProps) {
  const isMetric = variant === "metric" && value != null;
  const { animate } = useMotionSafe();
  const numericValue =
    isMetric && value != null ? parseInt(value, 10) : null;
  const animatedValue = useCountUp(
    numericValue ?? 0,
    animate && numericValue != null && !Number.isNaN(numericValue)
  );
  const displayValue =
    numericValue != null && !Number.isNaN(numericValue)
      ? String(animatedValue)
      : value;

  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              iconClassName ?? "bg-[var(--accent-tint)] text-accent-primary"
            )}
            aria-hidden
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="truncate text-pinned-caption font-semibold text-[var(--text-secondary)]">
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

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          {isMetric ? (
            <>
              <p className="text-pinned-value text-[var(--text-primary)]">
                {displayValue}
                {valueUnit && (
                  <span className="ml-1 text-xl font-semibold text-[var(--text-secondary)]">
                    {valueUnit}
                  </span>
                )}
              </p>
              <p className="mt-1 line-clamp-2 text-pinned-headline text-[var(--text-primary)]">
                {headline}
              </p>
              {caption && (
                <p className="mt-0.5 text-pinned-caption text-[var(--text-secondary)]">
                  {caption}
                </p>
              )}
            </>
          ) : (
            <>
              {value != null && (
                <p className="text-pinned-value text-[var(--text-primary)]">
                  {value}
                  {valueUnit && (
                    <span className="ml-1 text-xl font-semibold text-[var(--text-secondary)]">
                      {valueUnit}
                    </span>
                  )}
                </p>
              )}
              <p
                className={cn(
                  "line-clamp-2 text-pinned-headline text-[var(--text-primary)]",
                  value != null && "mt-1"
                )}
              >
                {headline}
              </p>
              {caption && (
                <p className="mt-1 text-pinned-caption text-[var(--text-secondary)]">
                  {caption}
                </p>
              )}
            </>
          )}
        </div>
        {visual && <div className="shrink-0">{visual}</div>}
      </div>
      {footer}
    </>
  );

  const cardClass = cn(
    "kb-fade-up kb-pressable block w-full rounded-2xl p-5 text-left app-card app-card--pinned",
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
