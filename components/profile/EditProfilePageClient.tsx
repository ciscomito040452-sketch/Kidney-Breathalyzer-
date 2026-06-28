"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileAvatarSheet } from "@/components/profile/ProfileAvatarSheet";
import { RiskFactorPicker } from "@/components/profile/RiskFactorPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { getProfileInitials } from "@/lib/profile/onboarding-storage";
import {
  isProfileFormValid,
  persistProfileForm,
  profileFormFromStorage,
  type ProfileFormValues,
} from "@/lib/profile/profile-form";

export function EditProfilePageClient() {
  const router = useRouter();
  const { translate } = usePreferences();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [initials, setInitials] = useState("KB");
  const [form, setForm] = useState<ProfileFormValues>({
    displayName: "",
    age: "",
    gender: "",
    weight: "",
    riskFactorIds: [],
    riskFactorOther: "",
  });

  useEffect(() => {
    setForm(profileFormFromStorage());
    setInitials(getProfileInitials());
  }, []);

  function updateForm<K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "displayName" && typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        const parts = trimmed.split(/\s+/);
        setInitials(
          parts.length >= 2
            ? `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
            : trimmed.slice(0, 2).toUpperCase()
        );
      }
    }
  }

  function handleRiskToggle(id: string, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      riskFactorIds: checked
        ? [...prev.riskFactorIds, id]
        : prev.riskFactorIds.filter((item) => item !== id),
    }));
  }

  function handleSave() {
    if (!isProfileFormValid(form)) return;
    persistProfileForm(form);
    router.push("/profile");
    router.refresh();
  }

  return (
    <main className="space-y-6 px-4 py-6">
      <header className="flex items-center gap-3">
        <Link
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-[var(--text-secondary)] transition-colors hover:text-accent-primary"
          aria-label={translate("editProfileBack")}
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">{translate("editProfileTitle")}</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {translate("editProfileHint")}
          </p>
        </div>
      </header>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setAvatarOpen(true)}
          className="rounded-full outline-none ring-accent-primary/30 focus-visible:ring-2"
          aria-label={translate("editAvatar")}
        >
          <ProfileAvatar initials={initials} />
        </button>
        <button
          type="button"
          onClick={() => setAvatarOpen(true)}
          className="text-sm font-medium text-accent-primary"
        >
          {translate("editAvatar")}
        </button>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium">{translate("displayNameLabel")}</span>
            <Input
              value={form.displayName}
              onChange={(e) => updateForm("displayName", e.target.value)}
              placeholder={translate("displayNamePlaceholder")}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">
              {translate("ageLabel")}{" "}
              <span className="font-normal text-[var(--text-secondary)]">
                ({translate("optionalField")})
              </span>
            </span>
            <Input
              type="number"
              min={1}
              max={120}
              value={form.age}
              onChange={(e) => updateForm("age", e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">
              {translate("genderLabel")}{" "}
              <span className="font-normal text-[var(--text-secondary)]">
                ({translate("optionalField")})
              </span>
            </span>
            <Select
              value={form.gender}
              onChange={(e) => updateForm("gender", e.target.value)}
            >
              <option value="">{translate("selectGender")}</option>
              <option value="female">{translate("genderFemale")}</option>
              <option value="male">{translate("genderMale")}</option>
              <option value="other">{translate("genderOther")}</option>
            </Select>
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">
              {translate("weightLabel")}{" "}
              <span className="font-normal text-[var(--text-secondary)]">
                ({translate("optionalField")})
              </span>
            </span>
            <Input
              type="number"
              min={1}
              step={0.1}
              value={form.weight}
              onChange={(e) => updateForm("weight", e.target.value)}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <RiskFactorPicker
            selectedIds={form.riskFactorIds}
            otherNote={form.riskFactorOther}
            onToggle={handleRiskToggle}
            onOtherNoteChange={(value) => updateForm("riskFactorOther", value)}
          />
        </CardContent>
      </Card>

      <div className="flex gap-3 pb-2">
        <Button variant="secondary" className="flex-1" asChild>
          <Link href="/profile">{translate("cancel")}</Link>
        </Button>
        <Button
          className="flex-1"
          disabled={!isProfileFormValid(form)}
          onClick={handleSave}
        >
          {translate("save")}
        </Button>
      </div>

      <ProfileAvatarSheet
        open={avatarOpen}
        onOpenChange={setAvatarOpen}
        initials={initials}
      />
    </main>
  );
}
