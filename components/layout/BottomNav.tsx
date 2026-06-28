"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Sparkles, User } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  Home,
  BarChart3,
  Sparkles,
  User,
} as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-app -translate-x-1/2 border-t border-border-subtle bg-[var(--bg-primary)] pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="เมนูหลัก"
    >
      <div className="flex min-h-14 items-center justify-between px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[11px] transition-colors",
                isActive
                  ? "text-accent-primary"
                  : "text-[var(--text-secondary)]"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="max-w-[64px] truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
