import { cn } from "@/lib/utils";
import type { AppLocale } from "@/lib/preferences/profile-preferences";

interface FlagIconProps {
  locale: AppLocale;
  className?: string;
}

export function FlagIcon({ locale, className }: FlagIconProps) {
  if (locale === "th") {
    return (
      <svg
        viewBox="0 0 24 16"
        className={cn("h-4 w-6 shrink-0 rounded-[3px] shadow-sm", className)}
        aria-hidden
      >
        <rect width="24" height="16" fill="#A51931" />
        <rect y="2.67" width="24" height="10.66" fill="#F4F5F8" />
        <rect y="5.33" width="24" height="5.33" fill="#2D2A4A" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 16"
      className={cn("h-4 w-6 shrink-0 rounded-[3px] shadow-sm", className)}
      aria-hidden
    >
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="2.5" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.2" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="4" />
      <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="2.2" />
    </svg>
  );
}
