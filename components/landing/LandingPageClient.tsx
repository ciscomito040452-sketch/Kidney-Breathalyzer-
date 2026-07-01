"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  LineChart,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Wind,
} from "lucide-react";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { HealthGroupedCard } from "@/components/health";
import { AppLogo } from "@/components/shared/AppLogo";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import type { MessageKey } from "@/lib/i18n/messages";
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

function LandingHowItWorksAccordion({
  steps,
  stepLabel,
  translate,
}: {
  steps: LandingStep[];
  stepLabel: string;
  translate: (key: MessageKey) => string;
}) {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 430px)");
    setIsOpen(!mq.matches);
  }, []);

  const Chevron = isOpen ? ChevronUp : ChevronDown;

  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded-xl py-1 text-left"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={
          isOpen
            ? translate("landingHowItWorksCollapse")
            : translate("landingHowItWorksExpand")
        }
      >
        <h2 className="text-section-title text-[var(--text-primary)]">
          {translate("landingHowItWorks")}
        </h2>
        <Chevron
          className="h-5 w-5 shrink-0 text-[var(--text-secondary)]"
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div id={panelId} className="mt-3">
          <HealthGroupedCard className="app-card--pinned">
            {steps.map((item, index) => (
              <LandingStepRow
                key={item.title}
                step={index + 1}
                stepLabel={stepLabel}
                isLast={index === steps.length - 1}
                {...item}
              />
            ))}
          </HealthGroupedCard>
        </div>
      ) : null}
    </section>
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
      <section className="shrink-0 px-5 pb-1 pt-[max(1.25rem,env(safe-area-inset-top))] sm:pt-[max(2rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex w-full max-w-full flex-col items-center text-center">
          <AppLogo
            size={72}
            variant="hero"
            className="h-[72px] w-[72px] max-w-[30vw] sm:h-24 sm:w-24"
          />

          <h1 className="mt-4 max-w-full text-balance text-[26px] font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:mt-5 sm:text-[28px]">
            {APP_NAME}
          </h1>
          <p className="mt-1.5 max-w-[20rem] text-pretty text-base leading-relaxed text-[var(--text-secondary)] sm:mt-2">
            {translate("landingTagline")}
          </p>

          <span className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] sm:mt-4">
            <ShieldCheck
              className="h-3.5 w-3.5 shrink-0 text-accent-primary"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="truncate">{translate("landingScreeningBadge")}</span>
          </span>
        </div>
      </section>

      <LandingHowItWorksAccordion
        steps={steps}
        stepLabel={translate("onboardingStep")}
        translate={translate}
      />

      <section className="sticky bottom-0 z-10 shrink-0 border-t border-border-subtle bg-[var(--bg-primary)] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto flex w-full max-w-full flex-col gap-2.5">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/onboarding">
              {translate("landingStart")}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </Button>

          <div className="flex flex-col gap-1">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
              onClick={handleDemo}
            >
              <PlayCircle className="h-4 w-4" strokeWidth={1.75} />
              {translate("landingDemo")}
            </Button>
            <p className="text-center text-xs text-[var(--text-secondary)]">
              {translate("landingDemoHint")}
            </p>
          </div>
        </div>

        <DisclaimerBanner compact className="mt-3" />
      </section>
    </main>
  );
}
