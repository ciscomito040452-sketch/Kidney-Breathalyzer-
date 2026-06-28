"use client";

import type { ReactNode } from "react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { cn } from "@/lib/utils";
import type { AvatarPreference } from "@/lib/preferences/profile-preferences";

interface ProfileAvatarProps {
  initials: string;
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
  size = "lg",
  className,
}: ProfileAvatarProps) {
  const { preferences } = usePreferences();
  const dimension = size === "lg" ? "h-16 w-16" : "h-12 w-12";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-primary/10",
        dimension,
        className
      )}
    >
      {renderAvatarContent(preferences.avatar, initials)}
    </div>
  );
}
