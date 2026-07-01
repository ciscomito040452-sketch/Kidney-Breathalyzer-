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
import {
  HealthGroupedCard,
} from "@/components/health";
import { AppLogo } from "@/components/shared/AppLogo";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LandingStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

function LandingStepRow({
  step,
  icon: Icon,
  title,
  description,
  stepLabel,
  isLast,
}: LandingStep & {
  step: number;
  stepLabel: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3.5",
        !isLast && "border-b border-border-subtle"
      )}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-accent-primary"
        aria-hidden
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          {stepLabel} {step}
        </p>
        <p className="mt-0.5 text-[15px] font-semibold leading-snug text-[var(--text-primary)]">
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
      title: translate("landingStep1Title"),
      description: translate("landingStep1Desc"),
    },
    {
      icon: Smartphone,
      title: translate("landingStep2Title"),
      description: translate("landingStep2Desc"),
    },
    {
      icon: LineChart,
      title: translate("landingStep3Title"),
      description: translate("landingStep3Desc"),
    },
  ];

  return (
    <main className="flex min-h-dvh w-full max-w-full flex-col overflow-x-hidden bg-[var(--bg-surface)]">
      <section className="px-5 pb-2 pt-[max(2rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex w-full max-w-full flex-col items-center text-center">
          <AppLogo
            size={96}
            variant="hero"
            className="h-24 w-24 max-w-[30vw]"
          />

          <h1 className="mt-5 max-w-full text-balance text-[28px] font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-[32px]">
            {APP_NAME}
          </h1>
          <p className="mt-2 max-w-[20rem] text-pretty text-base leading-relaxed text-[var(--text-secondary)]">
            {translate("landingTagline")}
          </p>

          <span className="mt-4 inline-flex max-w-full items-center gap-1.5 rounded-full bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <ShieldCheck
              className="h-3.5 w-3.5 shrink-0 text-accent-primary"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="truncate">{translate("landingScreeningBadge")}</span>
          </span>
        </div>
      </section>

      <section className="flex-1 px-5 py-4">
        <h2 className="mb-3 text-section-title text-[var(--text-primary)]">
          {translate("landingHowItWorks")}
        </h2>
        <HealthGroupedCard className="app-card--pinned">
          {steps.map((item, index) => (
            <LandingStepRow
              key={item.title}
              step={index + 1}
              stepLabel={translate("onboardingStep")}
              isLast={index === steps.length - 1}
              {...item}
            />
          ))}
        </HealthGroupedCard>
      </section>

      <section className="mt-auto border-t border-border-subtle bg-[var(--bg-primary)] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <div className="mx-auto flex w-full max-w-full flex-col gap-3">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/onboarding">
              {translate("landingStart")}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className="h-auto min-h-[52px] flex-col gap-1 py-3"
            onClick={handleDemo}
          >
            <span className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" strokeWidth={1.75} />
              {translate("landingDemo")}
            </span>
            <span className="text-center text-xs font-normal text-[var(--text-secondary)]">
              {translate("landingDemoHint")}
            </span>
          </Button>
        </div>

        <DisclaimerBanner compact className="mt-4" />
      </section>
    </main>
  );
}
