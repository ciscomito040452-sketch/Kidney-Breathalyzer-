import { cookies } from "next/headers";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import { LOCALE_COOKIE } from "@/lib/preferences/profile-preferences";

export function getServerLocale(): AppLocale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : "th";
}
