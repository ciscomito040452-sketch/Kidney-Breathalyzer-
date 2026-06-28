"use client";

import type { ReactNode } from "react";
import { Camera } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { cn } from "@/lib/utils";
import type { AvatarPreference } from "@/lib/preferences/profile-preferences";

interface ProfileAvatarProps {
  initials: string;
  onEdit?: () => void;
  size?: "md" | "lg";
  className?: string;
}

function renderAvatarContent(
  avatar: AvatarPreference,
  initials: string
): ReactNode {
  if (avatar.type === "photo" && avatar.photoDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar.photoDataUrl}
        alt=""
        className="h-full w-full object-cover"
      />
    );
  }

  if (avatar.type === "emoji" && avatar.emoji) {
    return (
      <span className="text-3xl leading-none" aria-hidden>
        {avatar.emoji}
      </span>
    );
  }

  return (
    <span className="text-lg font-semibold text-accent-primary">{initials}</span>
  );
}

export function ProfileAvatar({
  initials,
  onEdit,
  size = "lg",
  className,
}: ProfileAvatarProps) {
  const { preferences, translate } = usePreferences();
  const dimension = size === "lg" ? "h-16 w-16" : "h-12 w-12";

  const inner = (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-primary/10",
        dimension,
        className
      )}
    >
      {renderAvatarContent(preferences.avatar, initials)}
      {onEdit && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--bg-primary)] bg-accent-primary text-white shadow-card">
          <Camera className="h-3 w-3" strokeWidth={2} />
        </span>
      )}
    </div>
  );

  if (!onEdit) return inner;

  return (
    <button
      type="button"
      onClick={onEdit}
      className="rounded-full outline-none ring-accent-primary/30 focus-visible:ring-2"
      aria-label={translate("editAvatar")}
    >
      {inner}
    </button>
  );
}
