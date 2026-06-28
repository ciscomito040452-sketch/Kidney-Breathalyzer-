import type { ReactNode } from "react";

interface TabPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function TabPageHeader({ title, subtitle, icon }: TabPageHeaderProps) {
  return (
    <header>
      <h1 className="flex items-center gap-2 text-xl font-semibold">
        {icon}
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
      )}
    </header>
  );
}
