"use client";

import { useDemo } from "@/components/providers/DemoProvider";
import { getGreetingThai } from "@/lib/greeting";
import { formatDateThai } from "@/lib/utils";

export function PageHeader() {
  const { isDemo } = useDemo();

  return (
    <header>
      <p className="text-sm text-[var(--text-secondary)]">
        {getGreetingThai()}
      </p>
      <h1 className="text-xl font-semibold">สวัสดี</h1>
      <p className="text-sm text-[var(--text-secondary)]">
        {formatDateThai(new Date())}
      </p>
      {isDemo && (
        <span className="mt-2 inline-flex rounded-full bg-accent-primary/10 px-2.5 py-0.5 text-xs font-medium text-accent-primary">
          โหมดสาธิต
        </span>
      )}
    </header>
  );
}
