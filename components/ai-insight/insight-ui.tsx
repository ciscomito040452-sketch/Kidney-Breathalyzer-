"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function InsightGroupedCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl app-card app-card--grouped",
        className
      )}
    >
      {children}
    </div>
  );
}

export function InsightIconBadge({
  icon: Icon,
  tone = "accent",
  size = "md",
}: {
  icon: LucideIcon;
  tone?: "accent" | "good" | "attention" | "neutral";
  size?: "sm" | "md";
}) {
  const toneClass = {
    accent: "bg-[var(--accent-tint)] text-accent-primary",
    good: "bg-risk-low/15 text-risk-low",
    attention: "bg-risk-moderate/15 text-risk-moderate",
    neutral: "bg-[var(--accent-tint)] text-accent-primary ring-1 ring-border-subtle",
  }[tone];

  const sizeClass =
    size === "sm" ? "h-9 w-9 rounded-xl" : "h-11 w-11 rounded-2xl";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        sizeClass,
        toneClass
      )}
      aria-hidden
    >
      <Icon
        className={size === "sm" ? "h-4 w-4" : "h-5 w-5"}
        strokeWidth={1.75}
      />
    </span>
  );
}

export function InsightStepHeader({
  step,
  title,
  icon: Icon,
}: {
  step: number;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-primary text-[11px] font-bold text-white">
        {step}
      </span>
      <InsightIconBadge icon={Icon} size="sm" />
      <p className="text-sm font-semibold text-[var(--text-primary)]">
        {title}
      </p>
    </div>
  );
}

export function InsightGroupedRow({
  icon: Icon,
  iconTone = "accent",
  title,
  detail,
  trailing,
  children,
}: {
  icon: LucideIcon;
  iconTone?: "accent" | "good" | "attention" | "neutral";
  title: string;
  detail?: string;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <InsightIconBadge icon={Icon} tone={iconTone} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {title}
          </p>
          {trailing}
        </div>
        {detail && (
          <p className="mt-0.5 text-sm leading-relaxed text-[var(--text-secondary)]">
            {detail}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

export function parseHighlightLabel(label: string): {
  title: string;
  detail: string;
} {
  const split = label.split(" · ");
  if (split.length < 2) {
    return { title: label, detail: "" };
  }
  const detail = split.pop() ?? "";
  return { title: split.join(" · "), detail };
}

const statusPillClass = {
  good: "bg-risk-low/15 text-risk-low",
  attention: "bg-accent-primary/12 text-accent-primary",
  neutral: "bg-surface-elevated text-[var(--text-secondary)]",
} as const;

export function InsightMetricRow({
  icon: Icon,
  iconTone = "accent",
  label,
  value,
  statusLabel,
  statusTone = "neutral",
}: {
  icon: LucideIcon;
  iconTone?: "accent" | "good" | "attention" | "neutral";
  label: string;
  value?: string;
  statusLabel?: string;
  statusTone?: keyof typeof statusPillClass;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <InsightIconBadge icon={Icon} tone={iconTone} size="sm" />
        <p className="min-w-0 text-sm text-[var(--text-secondary)]">{label}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-right">
        {value && (
          <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
            {value}
          </span>
        )}
        {statusLabel && (
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
              statusPillClass[statusTone]
            )}
          >
            {statusLabel}
          </span>
        )}
      </div>
    </div>
  );
}
