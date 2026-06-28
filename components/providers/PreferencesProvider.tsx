"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { t, type MessageKey } from "@/lib/i18n/messages";
import {
  applyDisplayMode,
  applyLocale,
  DEFAULT_PREFERENCES,
  getStoredPreferences,
  savePreferences,
  type AppLocale,
  type AvatarPreference,
  type DisplayMode,
  type ProfilePreferences,
} from "@/lib/preferences/profile-preferences";

interface PreferencesContextValue {
  preferences: ProfilePreferences;
  locale: AppLocale;
  displayMode: DisplayMode;
  setLocale: (locale: AppLocale) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAvatar: (avatar: AvatarPreference) => void;
  translate: (key: MessageKey) => string;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<ProfilePreferences>(
    DEFAULT_PREFERENCES
  );

  useEffect(() => {
    const stored = getStoredPreferences();
    setPreferences(stored);
    applyDisplayMode(stored.displayMode);
    applyLocale(stored.locale);
  }, []);

  const persist = useCallback((patch: Parameters<typeof savePreferences>[0]) => {
    const next = savePreferences(patch);
    setPreferences(next);
    if (patch.displayMode) applyDisplayMode(next.displayMode);
    if (patch.locale) applyLocale(next.locale);
    return next;
  }, []);

  const setLocale = useCallback(
    (locale: AppLocale) => {
      persist({ locale });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("kb-locale-change"));
      }
    },
    [persist]
  );

  const setDisplayMode = useCallback(
    (displayMode: DisplayMode) => persist({ displayMode }),
    [persist]
  );

  const setNotificationsEnabled = useCallback(
    (notificationsEnabled: boolean) => persist({ notificationsEnabled }),
    [persist]
  );

  const setAvatar = useCallback(
    (avatar: AvatarPreference) => persist({ avatar }),
    [persist]
  );

  const translate = useCallback(
    (key: MessageKey) => t(preferences.locale, key),
    [preferences.locale]
  );

  const value = useMemo(
    () => ({
      preferences,
      locale: preferences.locale,
      displayMode: preferences.displayMode,
      setLocale,
      setDisplayMode,
      setNotificationsEnabled,
      setAvatar,
      translate,
    }),
    [
      preferences,
      setAvatar,
      setDisplayMode,
      setLocale,
      setNotificationsEnabled,
      translate,
    ]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}
