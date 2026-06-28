"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  Globe,
  LogOut,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { DashboardDeviceInfo } from "@/components/dashboard/DashboardDeviceInfo";
import { DisplayModeToggle } from "@/components/profile/DisplayModeToggle";
import { LanguageSelector } from "@/components/profile/LanguageSelector";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileAvatarSheet } from "@/components/profile/ProfileAvatarSheet";
import { ProfileStatsCard } from "@/components/profile/ProfileStatsCard";
import { AppLogo } from "@/components/shared/AppLogo";
import { FlagIcon } from "@/components/shared/FlagIcon";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE_DEVICE_GUIDE, ROUTE_PROFILE_EDIT } from "@/lib/constants";
import { formatGender } from "@/lib/i18n/messages";
import {
  getProfileDisplayFromStorage,
  getProfileInitials,
  getRiskFactorsFromStorage,
  getStoredOnboardingProfile,
} from "@/lib/profile/onboarding-storage";
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
        "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors",
        enabled ? "bg-accent-primary" : "bg-border-subtle"
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-card transition-transform",
          enabled ? "translate-x-[22px]" : "translate-x-[2px]"
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
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [profile, setProfile] = useState({
    age: 45,
    gender: "other",
    weight_kg: 70,
    initials: "KB",
  });
  const [riskSummary, setRiskSummary] = useState<string[]>([]);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const display = getProfileDisplayFromStorage();
    const factors = getRiskFactorsFromStorage();
    const stored = getStoredOnboardingProfile();
    setProfile({
      age: display.age,
      gender: display.gender,
      weight_kg: display.weight_kg,
      initials: getProfileInitials(),
    });
    setMemberSince(stored?.completed_at ?? null);

    const summary: string[] = [];
    if (factors.has_diabetes) summary.push(translate("diabetes"));
    if (factors.has_hypertension) summary.push(translate("hypertension"));
    if (factors.has_family_history) summary.push(translate("familyHistory"));
    setRiskSummary(summary);
  }, [locale, translate, pathname]);

  const subtitle = `${profile.weight_kg} ${translate("profileKg")}${
    riskSummary.length > 0 ? ` · ${riskSummary.join(", ")}` : ""
  }`;

  return (
    <main className="space-y-6 px-4 py-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <ProfileAvatar
            initials={profile.initials}
            onEdit={() => setAvatarOpen(true)}
          />
          <div className="min-w-0">
            <h1 className="text-xl font-semibold">{translate("profileTitle")}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              {profile.age} {translate("profileYears")} ·{" "}
              {formatGender(locale, profile.gender)}
            </p>
          </div>
        </div>
        <AppLogo size={40} className="h-10 w-10 shrink-0" />
      </header>

      <ProfileStatsCard
        totalMeasurements={totalMeasurements}
        currentStreak={currentStreak}
        memberSince={memberSince}
      />

      <DashboardDeviceInfo lastMeasuredAt={lastMeasuredAt} />

      <Card className="overflow-hidden p-0">
        <Link
          href={ROUTE_PROFILE_EDIT}
          className="flex items-center justify-between border-b border-border-subtle px-4 py-3.5 transition-colors hover:bg-surface/80"
        >
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-accent-primary" />
            <span className="text-sm">{translate("personalInfo")}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
            <span>
              {profile.age} {translate("profileYears")} ·{" "}
              {formatGender(locale, profile.gender)}
            </span>
            <ChevronRight className="h-4 w-4 opacity-60" />
          </div>
        </Link>

        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-accent-primary" />
            <span className="text-sm">{translate("notifications")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)]">
              {preferences.notificationsEnabled
                ? translate("notificationsOn")
                : translate("notificationsOff")}
            </span>
            <SettingsToggle
              enabled={preferences.notificationsEnabled}
              onChange={setNotificationsEnabled}
              label={translate("notifications")}
            />
          </div>
        </div>

        <div className="border-b border-border-subtle px-4 py-3.5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-accent-primary" />
              <span className="text-sm">{translate("language")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
              <FlagIcon locale={locale} />
              <span>{locale === "th" ? "TH" : "ENG"}</span>
            </div>
          </div>
          <LanguageSelector />
        </div>

        <div className="px-4 py-3.5">
          <div className="mb-3 flex items-center gap-3">
            <Sun className="h-5 w-5 text-accent-primary" />
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

      <ProfileAvatarSheet
        open={avatarOpen}
        onOpenChange={setAvatarOpen}
        initials={profile.initials}
      />
    </main>
  );
}
