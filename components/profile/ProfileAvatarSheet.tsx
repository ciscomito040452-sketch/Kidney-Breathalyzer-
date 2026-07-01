"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { SheetScaffold } from "@/components/motion/SheetScaffold";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import {
  AVATAR_EMOJI_OPTIONS,
  readAvatarPhotoFile,
  type AvatarType,
} from "@/lib/preferences/profile-preferences";
import { cn } from "@/lib/utils";

interface ProfileAvatarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initials: string;
}

const TAB_TYPES: AvatarType[] = ["photo", "emoji", "initials"];

export function ProfileAvatarSheet({
  open,
  onOpenChange,
  initials,
}: ProfileAvatarSheetProps) {
  const { preferences, setAvatar, translate } = usePreferences();
  const [activeTab, setActiveTab] = useState<AvatarType>(preferences.avatar.type);
  const [selectedEmoji, setSelectedEmoji] = useState(
    preferences.avatar.emoji ?? AVATAR_EMOJI_OPTIONS[0]
  );
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setActiveTab(preferences.avatar.type);
    setSelectedEmoji(preferences.avatar.emoji ?? AVATAR_EMOJI_OPTIONS[0]);
    setError(null);
  }, [open, preferences.avatar]);

  async function handleFileChange(file: File | undefined) {
    if (!file) return;
    setError(null);
    const dataUrl = await readAvatarPhotoFile(file);
    if (!dataUrl) {
      setError(translate("photoTooLarge"));
      return;
    }
    setAvatar({ type: "photo", photoDataUrl: dataUrl });
    onOpenChange(false);
  }

  function handleSave() {
    if (activeTab === "emoji") {
      setAvatar({ type: "emoji", emoji: selectedEmoji });
    } else if (activeTab === "initials") {
      setAvatar({ type: "initials" });
    }
    onOpenChange(false);
  }

  const tabLabel: Record<AvatarType, string> = {
    photo: translate("avatarPhoto"),
    emoji: translate("avatarEmoji"),
    initials: translate("avatarInitials"),
  };

  return (
    <SheetScaffold
      open={open}
      onOpenChange={onOpenChange}
      closeLabel={translate("cancel")}
      ariaLabelledBy="avatar-sheet-title"
      align="centerOnDesktop"
      sheetClassName="bg-[var(--bg-primary)]"
      header={
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h2 id="avatar-sheet-title" className="text-base font-semibold">
            {translate("editAvatar")}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-[var(--text-secondary)]"
            aria-label={translate("cancel")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="mb-5 flex justify-center">
          <ProfileAvatar initials={initials} size="lg" />
        </div>

        <div className="mb-4 flex rounded-xl bg-surface p-1">
          {TAB_TYPES.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
                activeTab === tab
                  ? "bg-[var(--bg-primary)] text-accent-primary shadow-card"
                  : "text-[var(--text-secondary)]"
              )}
            >
              {tabLabel[tab]}
            </button>
          ))}
        </div>

        {activeTab === "photo" && (
          <div className="space-y-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="kb-pressable flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-accent-primary/40 bg-accent-primary/5 py-8 text-sm font-medium text-accent-primary"
            >
              <ImagePlus className="h-5 w-5" />
              {translate("choosePhoto")}
            </button>
            {error && (
              <p className="text-center text-xs text-risk-high">{error}</p>
            )}
          </div>
        )}

        {activeTab === "emoji" && (
          <div className="grid grid-cols-4 gap-3">
            {AVATAR_EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={cn(
                  "kb-pressable flex h-14 items-center justify-center rounded-2xl text-2xl transition-colors",
                  selectedEmoji === emoji
                    ? "bg-accent-primary/15 ring-2 ring-accent-primary"
                    : "bg-surface hover:bg-accent-primary/5"
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {activeTab === "initials" && (
          <p className="rounded-2xl bg-surface px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
            {initials}
          </p>
        )}
      </div>

      {activeTab !== "photo" && (
        <div className="border-t border-border-subtle p-4">
          <Button className="h-[52px] w-full" onClick={handleSave}>
            {translate("save")}
          </Button>
        </div>
      )}
    </SheetScaffold>
  );
}
