"use client";

import { Moon, MoonStar } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { DisplayMode } from "@/lib/preferences/profile-preferences";
import { cn } from "@/lib/utils";

export function DisplayModeToggle() {
  const { displayMode, setDisplayMode, translate } = usePreferences();

  const options: {
    mode: DisplayMode;
    icon: typeof Moon;
    label: string;
  }[] = [
    {
      mode: "comfort",
      icon: Moon,
      label: translate("displayComfort"),
    },
    {
      mode: "dark",
      icon: MoonStar,
      label: translate("displayDark"),
    },
  ];

  return (
    <div className="space-y-2">
      <div className="relative flex rounded-xl bg-surface p-1">
        {options.map(({ mode, icon: Icon, label }) => {
          const active = displayMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setDisplayMode(mode)}
              className={cn(
                "relative z-[1] flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-accent-primary"
                  : "text-[var(--text-secondary)]"
              )}
              aria-pressed={active}
            >
              <Icon
                className={cn("h-4 w-4", active && "fill-accent-primary/15")}
                strokeWidth={active ? 2.25 : 1.75}
              />
              {label}
            </button>
          );
        })}
        <div
          className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-[var(--bg-primary)] shadow-card transition-transform duration-200 ease-out"
          style={{
            transform:
              displayMode === "dark" ? "translateX(100%)" : "translateX(0)",
          }}
          aria-hidden
        />
      </div>
      <p className="text-xs text-[var(--text-secondary)]">
        {displayMode === "comfort"
          ? translate("displayComfortHint")
          : translate("displayDarkHint")}
      </p>
    </div>
  );
}
