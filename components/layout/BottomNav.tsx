"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Sparkles, User } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { NAV_ITEMS } from "@/lib/constants";
import type { MessageKey } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

const iconMap = {
  Home,
  BarChart3,
  Sparkles,
  User,
} as const;

const NAV_LABEL_KEYS: Record<string, MessageKey> = {
  "/dashboard": "navHome",
  "/history": "navHistory",
  "/ai-insight": "navInsight",
  "/profile": "navProfile",
};

export function BottomNav() {
  const pathname = usePathname();
  const { translate } = usePreferences();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const hideNav =
    pathname === "/profile/edit" || pathname.startsWith("/guide/");

  const activeIndex = NAV_ITEMS.findIndex((item) => pathname === item.href);

  useEffect(() => {
    const nav = navRef.current;
    const activeEl = itemRefs.current[activeIndex];
    if (!nav || !activeEl || activeIndex < 0) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();
    setIndicator({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
    });
  }, [pathname, activeIndex]);

  if (hideNav) return null;

  return (
    <nav
      className="pointer-events-none fixed bottom-0 left-1/2 z-50 w-full max-w-app -translate-x-1/2 px-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))]"
      aria-label={translate("navMain")}
    >
      <div
        ref={navRef}
        className="pointer-events-auto relative flex items-center justify-around rounded-full border border-[var(--nav-border)] bg-[var(--nav-backdrop)] px-1 py-1.5 shadow-card backdrop-blur-xl backdrop-saturate-150"
      >
        <span
          className="kb-nav-indicator pointer-events-none absolute inset-y-1 rounded-full bg-[var(--accent-tint)]"
          style={{
            left: indicator.left,
            width: indicator.width,
          }}
          aria-hidden
        />
        {NAV_ITEMS.map((item, index) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          const labelKey = NAV_LABEL_KEYS[item.href];
          const label = labelKey ? translate(labelKey) : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={cn(
                "relative z-[1] flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "text-accent-primary"
                  : "text-[var(--text-secondary)]"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-105"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="max-w-[72px] truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
