"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  Globe,
  Hand,
  LogOut,
  Moon,
  Shield,
  Smartphone,
  User,
} from "lucide-react";
import { DeviceStatusBadge } from "@/components/dashboard/DeviceStatusBadge";
import { DisplayModeToggle } from "@/components/profile/DisplayModeToggle";
import { LanguageSelector } from "@/components/profile/LanguageSelector";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileStatsCard } from "@/components/profile/ProfileStatsCard";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import {
  HealthGroupedCard,
  HealthGroupedDivider,
  HealthListRow,
  SectionHeader,
  SummaryPageHeader,
} from "@/components/health";
import { ROUTE_DEVICE_GUIDE, ROUTE_PROFILE_EDIT } from "@/lib/constants";
import { resolveDeviceStatus } from "@/lib/device/status";
import { formatGender, getGreeting } from "@/lib/i18n/messages";
import {
  getProfileDisplayFromStorage,
  getProfileInitials,
  getStoredOnboardingProfile,
} from "@/lib/profile/onboarding-storage";
import { summarizeRiskFactorLabels } from "@/lib/profile/risk-factor-labels";
import { formatDateTimeThai } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProfilePageClientProps {
  lastMeasuredAt: string | null;
  totalMeasurements: number;
  currentStreak: number;
}

function SettingsToggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 overflow-hidden rounded-full transition-colors",
        enabled ? "bg-accent-primary" : "bg-[var(--bg-fill)]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-6 w-6 rounded-full bg-[var(--bg-surface-elevated)] shadow-sm transition-transform",
          enabled ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function ProfilePageClient({
  lastMeasuredAt,
  totalMeasurements,
  currentStreak,
}: ProfilePageClientProps) {
  const { isDemo, exitDemoMode } = useDemo();
  const {
    preferences,
    locale,
    setNotificationsEnabled,
    translate,
  } = usePreferences();
  const [profile, setProfile] = useState({
    displayName: "",
    age: 45,
    gender: "other",
    weight_kg: 70,
    initials: "KB",
  });
  const [riskSummary, setRiskSummary] = useState<string[]>([]);

  useEffect(() => {
    const display = getProfileDisplayFromStorage();
    const stored = getStoredOnboardingProfile();
    setProfile({
      displayName: display.display_name ?? "",
      age: display.age,
      gender: display.gender,
      weight_kg: display.weight_kg,
      initials: getProfileInitials(),
    });

    setRiskSummary(
      summarizeRiskFactorLabels(
        locale,
        stored?.risk_factor_ids ?? [],
        stored?.risk_factor_other ?? null
      )
    );
  }, [locale]);

  const displayName =
    profile.displayName.trim() || translate("defaultDisplayName");

  const metaParts = [
    profile.weight_kg ? `${profile.weight_kg} ${translate("profileKg")}` : null,
    profile.age ? `${profile.age} ${translate("profileYears")}` : null,
    profile.gender ? formatGender(locale, profile.gender) : null,
  ].filter(Boolean);

  const deviceStatus = resolveDeviceStatus(lastMeasuredAt, isDemo);

  return (
    <main className="space-y-6 px-4 py-6 pb-8">
      <SummaryPageHeader titleKey="profileTitle" showGreeting={false} />

      <Link
        href={ROUTE_PROFILE_EDIT}
        className="app-card app-card--pinned kb-fade-up flex items-center gap-4 rounded-2xl p-4 transition-transform active:scale-[0.99]"
      >
        <ProfileAvatar initials={profile.initials} size="xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-pinned-headline font-semibold text-[var(--text-primary)]">
            {displayName}
          </p>
          <p className="mt-0.5 text-pinned-caption text-[var(--text-secondary)]">
            {getGreeting(locale)}
            {metaParts.length > 0 && ` · ${metaParts.join(" · ")}`}
          </p>
          <p className="mt-2 text-xs font-medium text-accent-primary">
            {translate("editProfileLink")}
          </p>
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-[var(--text-secondary)]"
          strokeWidth={2}
          aria-hidden
        />
      </Link>

      <ProfileStatsCard
        totalMeasurements={totalMeasurements}
        currentStreak={currentStreak}
      />

      <section className="space-y-3">
        <SectionHeader title={translate("settingsSection")} />
        <HealthGroupedCard className="app-card--pinned">
          <HealthListRow
            icon={User}
            title={translate("personalInfo")}
            detail={displayName}
            href={ROUTE_PROFILE_EDIT}
          />
          <HealthGroupedDivider />
          <HealthListRow
            icon={Bell}
            title={translate("notifications")}
            detail={
              preferences.notificationsEnabled
                ? translate("notificationsOn")
                : translate("notificationsOff")
            }
            trailing={
              <SettingsToggle
                enabled={preferences.notificationsEnabled}
                onChange={setNotificationsEnabled}
                label={translate("notifications")}
              />
            }
            showChevron={false}
          />
          <HealthGroupedDivider />
          <div className="space-y-3 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-accent-primary">
                <Globe className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {translate("language")}
              </p>
            </div>
            <LanguageSelector />
          </div>
          <HealthGroupedDivider />
          <div className="space-y-3 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-accent-primary">
                <Moon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {translate("displayMode")}
              </p>
            </div>
            <DisplayModeToggle />
          </div>
          <HealthGroupedDivider />
          <HealthListRow
            icon={Smartphone}
            title={translate("deviceStatus")}
            detail={
              lastMeasuredAt
                ? `${translate("lastSync")} · ${formatDateTimeThai(lastMeasuredAt)}`
                : undefined
            }
            trailing={<DeviceStatusBadge status={deviceStatus} />}
            showChevron={false}
          />
          <HealthGroupedDivider />
          <HealthListRow
            icon={Smartphone}
            title={translate("deviceGuide")}
            href={ROUTE_DEVICE_GUIDE}
          />
        </HealthGroupedCard>
      </section>

      <section className="space-y-3">
        <SectionHeader title={translate("healthFactors")} />
        <HealthGroupedCard className="app-card--pinned">
          <div className="space-y-3 px-4 py-4">
            <div className="flex items-center gap-2">
              <Shield
                className="h-4 w-4 text-accent-primary"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {translate("healthFactors")}
              </p>
            </div>
            {riskSummary.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {riskSummary.map((factor) => (
                  <span
                    key={factor}
                    className="inline-flex rounded-full bg-[var(--accent-tint)] px-2.5 py-1 text-xs font-medium text-accent-primary"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-pinned-caption text-[var(--text-secondary)]">
                {translate("noRiskFactors")}
              </p>
            )}
            <p className="text-pinned-caption leading-relaxed text-[var(--text-secondary)]">
              {translate("privacyNote")}
            </p>
          </div>
        </HealthGroupedCard>
      </section>

      {isDemo && (
        <button
          type="button"
          onClick={exitDemoMode}
          className="app-card app-card--pinned flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium text-[var(--text-secondary)] transition-transform active:scale-[0.99]"
        >
          <LogOut className="h-4 w-4" />
          {translate("exitDemo")}
        </button>
      )}

      <p className="text-center text-pinned-caption text-[var(--text-secondary)]">
        <Link href="/login" className="font-medium text-accent-primary">
          {translate("loginReal")}
        </Link>{" "}
        {translate("loginRealHint")}
      </p>

      <p className="pb-2 text-center text-[11px] text-[var(--text-secondary)]">
        {translate("appVersion")} 0.1.0
      </p>
    </main>
  );
}
