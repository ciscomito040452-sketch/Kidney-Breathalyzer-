"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  LineChart,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Wind,
} from "lucide-react";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { AppLogo } from "@/components/shared/AppLogo";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LandingStep {
  icon: LucideIcon;
  tone: "accent" | "good" | "attention";
  title: string;
  description: string;
}

function LandingStepRow({
  step,
  icon: Icon,
  tone,
  title,
  description,
  isLast,
}: LandingStep & { step: number; isLast?: boolean }) {
  const toneClass = {
    accent: "bg-[var(--accent-tint)] text-accent-primary",
    good: "bg-risk-low/15 text-risk-low",
    attention: "bg-risk-moderate/15 text-risk-moderate",
  }[tone];

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-4",
        !isLast && "border-b border-border-subtle"
      )}
    >
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary text-[10px] font-bold text-white">
          {step}
        </span>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            toneClass
          )}
          aria-hidden
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}

export function LandingPageClient() {
  const router = useRouter();
  const { enterDemoMode } = useDemo();
  const { translate } = usePreferences();

  function handleDemo() {
    enterDemoMode();
    router.push("/dashboard");
  }

  const steps: LandingStep[] = [
    {
      icon: Wind,
      tone: "accent",
      title: translate("landingStep1Title"),
      description: translate("landingStep1Desc"),
    },
    {
      icon: Smartphone,
      tone: "good",
      title: translate("landingStep2Title"),
      description: translate("landingStep2Desc"),
    },
    {
      icon: LineChart,
      tone: "attention",
      title: translate("landingStep3Title"),
      description: translate("landingStep3Desc"),
    },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative px-4 pb-2 pt-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,var(--accent-tint-strong),transparent)]"
          aria-hidden
        />

        <div className="relative flex flex-col items-center text-center">
          <div className="rounded-[28px] bg-surface p-2 shadow-card ring-1 ring-border-subtle">
            <AppLogo size={88} className="h-[88px] w-[88px] shadow-none" />
          </div>

          <h1 className="mt-6 text-balance text-[32px] font-semibold leading-tight tracking-tight">
            {APP_NAME}
          </h1>
          <p className="mt-2 max-w-[280px] text-base leading-relaxed text-[var(--text-secondary)]">
            {translate("landingTagline")}
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] ring-1 ring-border-subtle">
            <ShieldCheck
              className="h-3.5 w-3.5 text-accent-primary"
              strokeWidth={1.75}
              aria-hidden
            />
            {translate("landingScreeningBadge")}
          </span>
        </div>
      </section>

      <section className="flex-1 px-4 py-4">
        <p className="mb-3 text-base font-semibold text-[var(--text-primary)]">
          {translate("landingHowItWorks")}
        </p>
        <div className="overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface shadow-card app-card">
          {steps.map((item, index) => (
            <LandingStepRow
              key={item.title}
              step={index + 1}
              {...item}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </section>

      <section className="sticky bottom-0 border-t border-border-subtle bg-[var(--bg-primary)] px-4 pb-6 pt-4">
        <div
          className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"
          aria-hidden
        />

        <div className="flex flex-col gap-3">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/onboarding">
              {translate("landingStart")}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className="h-auto flex-col gap-1 py-3"
            onClick={handleDemo}
          >
            <span className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" strokeWidth={1.75} />
              {translate("landingDemo")}
            </span>
            <span className="text-xs font-normal text-[var(--text-secondary)]">
              {translate("landingDemoHint")}
            </span>
          </Button>
        </div>

        <DisclaimerBanner compact className="mt-4" />
      </section>
    </main>
  );
}
