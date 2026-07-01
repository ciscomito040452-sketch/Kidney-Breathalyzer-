"use client";

import { useState } from "react";
import { CircleHelp, Droplets, Wind } from "lucide-react";
import { HealthGroupedCard } from "@/components/health";
import { SensorEducationSheet } from "@/components/shared/SensorEducationSheet";
import { SensorLevelBar } from "@/components/shared/SensorLevelBar";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getSensorUILabels } from "@/lib/i18n/labels";
import { getSensorQualitativeHeadline } from "@/lib/ui/qualitative-labels";
import {
  acetoneBarPercent,
  acetoneThresholdPercent,
  ammoniaBarPercent,
  ammoniaThresholdPercent,
} from "@/lib/sensors/sensor-zones";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
} from "@/lib/sensor-labels";
import type { RiskLevel } from "@/types/measurement";

interface ResultSensorRowsProps {
  riskLevel: RiskLevel;
  riskScore: number;
  mq135: number;
  mq3: number;
}

function SensorDetailRow({
  icon: Icon,
  iconClassName,
  label,
  value,
  unit,
  status,
  barPercent,
  thresholdPercent,
  onHelp,
}: {
  icon: typeof Wind;
  iconClassName: string;
  label: string;
  value: number;
  unit: string;
  status: ReturnType<typeof getAmmoniaStatus>;
  barPercent: number;
  thresholdPercent: number;
  onHelp: () => void;
}) {
  const { locale } = usePreferences();

  return (
    <div className="border-b border-border-subtle px-4 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
            aria-hidden
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={onHelp}
          className="shrink-0 rounded-full p-1 text-[var(--text-secondary)] hover:bg-surface hover:text-accent-primary"
          aria-label={label}
        >
          <CircleHelp className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
      <p className="mt-3 text-pinned-value text-[var(--text-primary)]">
        {value}
        <span className="ml-1 text-xl font-semibold text-[var(--text-secondary)]">
          {unit}
        </span>
      </p>
      <p className="mt-1 text-pinned-headline text-[var(--text-primary)]">
        {getSensorQualitativeHeadline(locale, status)}
      </p>
      <div className="mt-3">
        <SensorLevelBar
          percent={barPercent}
          thresholdPercent={thresholdPercent}
          status={status}
          className="h-2"
        />
      </div>
    </div>
  );
}

export function ResultSensorRows({
  riskLevel,
  riskScore,
  mq135,
  mq3,
}: ResultSensorRowsProps) {
  const [ammoniaOpen, setAmmoniaOpen] = useState(false);
  const [acetoneOpen, setAcetoneOpen] = useState(false);
  const { locale, translate } = usePreferences();
  const sensorUi = getSensorUILabels(locale);

  const ammoniaPpb = formatAmmoniaPpb(mq135);
  const acetonePpb = formatAcetonePpb(mq3);
  const ammoniaStatus = getAmmoniaStatus(mq135);
  const acetoneStatus = getAcetoneStatus(mq3);

  const educationContext = {
    ammoniaPpb,
    acetonePpb,
    riskScore,
    riskLevel,
    ammoniaStatus,
    acetoneStatus,
  };

  return (
    <>
      <HealthGroupedCard>
        <SensorDetailRow
          icon={Wind}
          iconClassName="bg-[rgb(var(--metric-ammonia-rgb)/0.12)] text-[var(--metric-ammonia)]"
          label={sensorUi.ammonia.label}
          value={ammoniaPpb}
          unit={sensorUi.ammonia.unit}
          status={ammoniaStatus}
          barPercent={ammoniaBarPercent(ammoniaPpb)}
          thresholdPercent={ammoniaThresholdPercent()}
          onHelp={() => setAmmoniaOpen(true)}
        />
        <SensorDetailRow
          icon={Droplets}
          iconClassName="bg-[rgb(var(--metric-acetone-rgb)/0.12)] text-[var(--metric-acetone)]"
          label={sensorUi.acetone.label}
          value={acetonePpb}
          unit={sensorUi.acetone.unit}
          status={acetoneStatus}
          barPercent={acetoneBarPercent(acetonePpb)}
          thresholdPercent={acetoneThresholdPercent()}
          onHelp={() => setAcetoneOpen(true)}
        />
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={() => setAmmoniaOpen(true)}
            className="text-sm font-medium text-accent-primary"
          >
            {translate("understandSensors")}
          </button>
        </div>
      </HealthGroupedCard>

      <SensorEducationSheet
        open={ammoniaOpen}
        onOpenChange={setAmmoniaOpen}
        topic="ammonia"
        context={educationContext}
      />
      <SensorEducationSheet
        open={acetoneOpen}
        onOpenChange={setAcetoneOpen}
        topic="acetone"
        context={educationContext}
      />
    </>
  );
}
