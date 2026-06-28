"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  Globe,
  Hand,
  LogOut,
  Shield,
  User,
} from "lucide-react";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { DashboardDeviceInfo } from "@/components/dashboard/DashboardDeviceInfo";
import { DisplayModeToggle } from "@/components/profile/DisplayModeToggle";
import { LanguageSelector } from "@/components/profile/LanguageSelector";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileStatsCard } from "@/components/profile/ProfileStatsCard";
import { AppLogo } from "@/components/shared/AppLogo";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE_DEVICE_GUIDE, ROUTE_PROFILE_EDIT } from "@/lib/constants";
import { formatGender } from "@/lib/i18n/messages";
import {
  getProfileDisplayFromStorage,
  getProfileInitials,
  getStoredOnboardingProfile,
} from "@/lib/profile/onboarding-storage";
import { summarizeRiskFactorLabels } from "@/lib/profile/risk-factor-labels";
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
  const pathname = usePathname();

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
  }, [locale, pathname]);

  const displayName =
    profile.displayName.trim() || translate("defaultDisplayName");

  const metaParts = [
    profile.weight_kg ? `${profile.weight_kg} ${translate("profileKg")}` : null,
    profile.age ? `${profile.age} ${translate("profileYears")}` : null,
    profile.gender ? formatGender(locale, profile.gender) : null,
  ].filter(Boolean);

  return (
    <main className="space-y-6 px-4 py-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <ProfileAvatar initials={profile.initials} />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold">{displayName}</h1>
            {metaParts.length > 0 && (
              <p className="text-sm text-[var(--text-secondary)]">
                {metaParts.join(" · ")}
              </p>
            )}
          </div>
        </div>
        <AppLogo size={36} variant="mark" className="h-9 w-9 shrink-0" />
      </header>

      <ProfileStatsCard
        totalMeasurements={totalMeasurements}
        currentStreak={currentStreak}
      />

      <DashboardDeviceInfo lastMeasuredAt={lastMeasuredAt} />

      <Card className="overflow-hidden p-0">
        <Link
          href={ROUTE_PROFILE_EDIT}
          className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3.5 transition-colors hover:bg-surface-elevated/80"
        >
          <div className="flex min-w-0 items-center gap-3">
            <User className="h-5 w-5 shrink-0 text-accent-primary" />
            <span className="text-sm">{translate("personalInfo")}</span>
          </div>
          <div className="flex min-w-0 items-center gap-1 text-sm text-[var(--text-secondary)]">
            <span className="truncate">{displayName}</span>
            <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
          </div>
        </Link>

        <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 shrink-0 text-accent-primary" />
            <span className="text-sm">{translate("notifications")}</span>
          </div>
          <SettingsToggle
            enabled={preferences.notificationsEnabled}
            onChange={setNotificationsEnabled}
            label={translate("notifications")}
          />
        </div>

        <div className="border-b border-border-subtle px-4 py-3.5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-accent-primary" />
              <span className="text-sm">{translate("language")}</span>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              {locale === "th"
                ? translate("languageTh")
                : translate("languageEn")}
            </span>
          </div>
          <LanguageSelector />
        </div>

        <div className="px-4 py-3.5">
          <div className="mb-3 flex items-center gap-3">
            <Hand className="h-5 w-5 text-accent-primary" />
            <span className="text-sm">{translate("displayMode")}</span>
          </div>
          <DisplayModeToggle />
        </div>
      </Card>

      <Card>
        <CardContent className="space-y-2 pt-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent-primary" strokeWidth={1.75} />
            <p className="text-sm font-semibold">{translate("healthFactors")}</p>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {riskSummary.length > 0
              ? riskSummary.join(" · ")
              : translate("noRiskFactors")}
          </p>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            {translate("privacyNote")}
          </p>
        </CardContent>
      </Card>

      <p className="text-center">
        <Link
          href={ROUTE_DEVICE_GUIDE}
          className="text-sm font-medium text-accent-primary"
        >
          {translate("deviceGuide")}
        </Link>
      </p>

      {isDemo && (
        <button
          type="button"
          onClick={exitDemoMode}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface py-3 text-sm font-medium text-[var(--text-secondary)]"
        >
          <LogOut className="h-4 w-4" />
          {translate("exitDemo")}
        </button>
      )}

      <p className="text-center text-xs text-[var(--text-secondary)]">
        <Link href="/login" className="text-accent-primary">
          {translate("loginReal")}
        </Link>{" "}
        {translate("loginRealHint")}
      </p>

      <p className="pb-2 text-center text-[10px] text-[var(--text-secondary)]">
        {translate("appVersion")} 0.1.0
      </p>
    </main>
  );
}
