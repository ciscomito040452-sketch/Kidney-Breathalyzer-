"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import {
  educationTopicTitle,
  getSensorEducation,
  type EducationContext,
  type EducationTopic,
} from "@/lib/sensors/sensor-education";
import { cn } from "@/lib/utils";

interface SensorEducationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: EducationTopic;
  context?: EducationContext;
}

export function SensorEducationSheet({
  open,
  onOpenChange,
  topic,
  context = {},
}: SensorEducationSheetProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const sections = getSensorEducation(topic, context);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="ปิด"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "relative z-10 flex max-h-[70vh] w-full max-w-app flex-col rounded-t-2xl bg-[var(--bg-primary)] shadow-mobile"
        )}
        role="dialog"
        aria-labelledby="education-sheet-title"
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h2
            id="education-sheet-title"
            className="text-base font-semibold text-[var(--text-primary)]"
          >
            {educationTopicTitle(topic)}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-surface"
            aria-label="ปิด"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto px-4 py-4 pb-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className="text-sm font-medium text-[var(--text-primary)]">
                {section.title}
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-secondary)]">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
