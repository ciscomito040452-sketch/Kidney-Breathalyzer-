import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AppLocale } from "@/lib/preferences/profile-preferences";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function localeTag(locale: AppLocale): string {
  return locale === "en" ? "en-US" : "th-TH";
}

export function formatDateThai(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTimeLocale(
  locale: AppLocale,
  date: Date | string
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(localeTag(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatHistoryListDateLocale(
  locale: AppLocale,
  date: Date | string
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(localeTag(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatHistoryListTimeLocale(
  locale: AppLocale,
  date: Date | string
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString(localeTag(locale), {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatChartAxisDate(
  locale: AppLocale,
  date: Date | string
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(localeTag(locale), {
    day: "numeric",
    month: "short",
  });
}

export function formatDateTimeThai(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatHistoryListDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatHistoryListTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
