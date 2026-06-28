import type { DeviceGuideStep } from "@/lib/device-guide/content";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

interface DeviceGuideStepCardProps {
  step: DeviceGuideStep;
  isLast: boolean;
}

export function DeviceGuideStepCard({ step, isLast }: DeviceGuideStepCardProps) {
  const Icon = step.icon;

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div
          className="absolute left-5 top-12 bottom-0 w-px bg-border-subtle"
          aria-hidden
        />
      )}

      <div className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-semibold text-white shadow-card">
        {step.step}
      </div>

      <div className="min-w-0 flex-1 pb-8">
        <div className="rounded-2xl border border-border-subtle bg-[var(--bg-primary)] p-4 shadow-card">
          <div className="mb-3 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-primary/10 text-accent-primary">
              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                {step.title}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {step.summary}
              </p>
            </div>
          </div>

          <ul className="space-y-2 border-t border-border-subtle pt-3">
            {step.details.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-sm leading-relaxed text-[var(--text-primary)]"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {step.tip && (
            <div
              className={cn(
                "mt-3 flex gap-2 rounded-xl bg-surface px-3 py-2.5",
                "text-xs leading-relaxed text-[var(--text-secondary)]"
              )}
            >
              <Lightbulb
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary"
                strokeWidth={1.75}
                aria-hidden
              />
              <span>{step.tip}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
