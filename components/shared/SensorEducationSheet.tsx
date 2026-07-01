"use client";

import {
  Activity,
  AlertCircle,
  BookOpen,
  FlaskConical,
  Gauge,
  Radio,
  ShieldAlert,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";
import { SheetScaffold } from "@/components/motion/SheetScaffold";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { RiskMeter } from "@/components/shared/RiskMeter";
import { SensorStatusPill } from "@/components/shared/SensorStatusPill";
import { RISK_SHORT_LABELS } from "@/lib/constants";
import { RISK_ZONE_BOUNDS } from "@/lib/risk-engine/risk-zones";
import {
  educationTopicTitle,
  getSensorEducation,
  type EducationContext,
  type EducationSection,
  type EducationSectionKind,
  type EducationTopic,
} from "@/lib/sensors/sensor-education";
import { cn } from "@/lib/utils";

interface SensorEducationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: EducationTopic;
  context?: EducationContext;
}

const SECTION_ICONS: Record<EducationSectionKind, LucideIcon> = {
  intro: BookOpen,
  current: Gauge,
  threshold: Activity,
  source: Radio,
  disclaimer: ShieldAlert,
};

const ZONE_ROWS = [
  {
    label: RISK_SHORT_LABELS.low,
    range: `0–${RISK_ZONE_BOUNDS.lowMax - 1}`,
    dot: "bg-risk-low",
  },
  {
    label: RISK_SHORT_LABELS.moderate,
    range: `${RISK_ZONE_BOUNDS.lowMax}–${RISK_ZONE_BOUNDS.moderateMax - 1}`,
    dot: "bg-risk-moderate",
  },
  {
    label: RISK_SHORT_LABELS.high,
    range: `${RISK_ZONE_BOUNDS.moderateMax}–100`,
    dot: "bg-risk-high",
  },
] as const;

function EducationSectionCard({
  section,
  topic,
  context,
}: {
  section: EducationSection;
  topic: EducationTopic;
  context: EducationContext;
}) {
  const Icon = SECTION_ICONS[section.kind];
  const isDisclaimer = section.kind === "disclaimer";

  const showRiskHero =
    section.kind === "current" &&
    topic === "risk_score" &&
    context.riskScore != null &&
    context.riskLevel != null;

  const showSensorHero =
    section.kind === "current" &&
    topic === "ammonia" &&
    context.ammoniaPpb != null &&
    context.ammoniaStatus != null;

  const showAcetoneHero =
    section.kind === "current" &&
    topic === "acetone" &&
    context.acetonePpb != null &&
    context.acetoneStatus != null;

  const showRiskZones =
    section.kind === "threshold" &&
    (topic === "risk_score" ||
      (topic === "all" && section.title === "ช่วงคะแนนอ้างอิง"));

  const showThresholdLines =
    section.kind === "threshold" && !showRiskZones;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border-subtle p-4",
        isDisclaimer ? "bg-surface" : "bg-[var(--bg-primary)] shadow-card"
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            isDisclaimer
              ? "bg-accent-primary/10 text-accent-primary"
              : "bg-surface text-accent-primary"
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          {section.title}
        </h3>
      </div>

      {showRiskHero && (
        <div className="space-y-3">
          <p className="text-4xl font-semibold tabular-nums tracking-tight">
            {Math.round(context.riskScore! * 100)}
            <span className="text-lg font-normal text-[var(--text-secondary)]">
              /100
            </span>
          </p>
          {context.riskLevelLabel && (
            <p className="text-sm text-[var(--text-secondary)]">
              {context.riskLevelLabel}
            </p>
          )}
          <RiskMeter
            riskScore={context.riskScore!}
            riskLevel={context.riskLevel!}
            showZoneLabels={false}
          />
        </div>
      )}

      {showSensorHero && (
        <div className="space-y-2">
          <p className="text-3xl font-semibold tabular-nums">
            {context.ammoniaPpb}
            <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
              ppb
            </span>
          </p>
          <SensorStatusPill status={context.ammoniaStatus!} />
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {section.body}
          </p>
        </div>
      )}

      {showAcetoneHero && (
        <div className="space-y-2">
          <p className="text-3xl font-semibold tabular-nums">
            {context.acetonePpb}
            <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
              ppb
            </span>
          </p>
          <SensorStatusPill status={context.acetoneStatus!} />
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {section.body}
          </p>
        </div>
      )}

      {showRiskZones && (
        <ul className="space-y-2">
          {ZONE_ROWS.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2.5"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                <span
                  className={cn("h-2.5 w-2.5 rounded-full", row.dot)}
                  aria-hidden
                />
                {row.label}
              </span>
              <span className="text-sm tabular-nums text-[var(--text-secondary)]">
                {row.range}
              </span>
            </li>
          ))}
        </ul>
      )}

      {showThresholdLines && (
        <ul className="space-y-2">
          {section.body.split("\n").map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2 text-sm text-[var(--text-secondary)]"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary"
                strokeWidth={1.75}
                aria-hidden
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}

      {isDisclaimer ? (
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {section.body}
        </p>
      ) : (
        !showRiskHero &&
        !showSensorHero &&
        !showAcetoneHero &&
        !showRiskZones &&
        !showThresholdLines && (
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {section.body}
          </p>
        )
      )}
    </div>
  );
}

function topicHeaderIcon(topic: EducationTopic): LucideIcon {
  switch (topic) {
    case "ammonia":
      return FlaskConical;
    case "acetone":
      return Wind;
    case "risk_score":
      return Activity;
    default:
      return BookOpen;
  }
}

export function SensorEducationSheet({
  open,
  onOpenChange,
  topic,
  context = {},
}: SensorEducationSheetProps) {
  const { translate } = usePreferences();
  const sections = getSensorEducation(topic, context);
  const HeaderIcon = topicHeaderIcon(topic);

  return (
    <SheetScaffold
      open={open}
      onOpenChange={onOpenChange}
      closeLabel={translate("closeSheet")}
      ariaLabelledBy="education-sheet-title"
      header={
        <div className="flex shrink-0 items-center justify-between rounded-t-2xl border-b border-border-subtle bg-[var(--bg-primary)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
              <HeaderIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
            <h2
              id="education-sheet-title"
              className="text-base font-semibold text-[var(--text-primary)]"
            >
              {educationTopicTitle(topic)}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-surface"
            aria-label={translate("closeSheet")}
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      }
    >
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="space-y-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
          {sections.map((section) => (
            <EducationSectionCard
              key={`${section.kind}-${section.title}`}
              section={section}
              topic={topic}
              context={context}
            />
          ))}
        </div>
      </div>
    </SheetScaffold>
  );
}
