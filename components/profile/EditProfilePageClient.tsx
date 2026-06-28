"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileAvatarSheet } from "@/components/profile/ProfileAvatarSheet";
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
    age: "",
    gender: "",
    weight: "",
    hasDiabetes: false,
    hasHypertension: false,
    hasFamilyHistory: false,
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
  }

  function handleSave() {
    if (!isProfileFormValid(form)) return;
    persistProfileForm(form);
    router.push("/profile");
    router.refresh();
  }

  const riskOptions = [
    {
      id: "diabetes",
      label: translate("riskFactorDiabetes"),
      checked: form.hasDiabetes,
      onChange: (checked: boolean) => updateForm("hasDiabetes", checked),
    },
    {
      id: "hypertension",
      label: translate("riskFactorHypertension"),
      checked: form.hasHypertension,
      onChange: (checked: boolean) => updateForm("hasHypertension", checked),
    },
    {
      id: "family",
      label: translate("riskFactorFamily"),
      checked: form.hasFamilyHistory,
      onChange: (checked: boolean) => updateForm("hasFamilyHistory", checked),
    },
  ] as const;

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

      <div className="flex justify-center">
        <ProfileAvatar
          initials={initials}
          onEdit={() => setAvatarOpen(true)}
        />
      </div>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium">{translate("ageLabel")}</span>
            <Input
              type="number"
              min={1}
              max={120}
              value={form.age}
              onChange={(e) => updateForm("age", e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">{translate("genderLabel")}</span>
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
            <span className="text-sm font-medium">{translate("weightLabel")}</span>
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
        <CardContent className="space-y-3 pt-4">
          <div>
            <p className="text-sm font-medium">{translate("riskFactorsTitle")}</p>
            <p className="text-sm text-[var(--text-secondary)]">
              {translate("riskFactorsHint")}
            </p>
          </div>
          {riskOptions.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-subtle bg-[var(--bg-primary)] px-4 py-3"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.onChange(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent-primary)]"
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
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
