import { MEDICAL_DISCLAIMER } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DisclaimerBannerProps {
  className?: string;
  compact?: boolean;
}

export function DisclaimerBanner({
  className,
  compact = false,
}: DisclaimerBannerProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface text-[13px] leading-relaxed text-[var(--text-secondary)]",
        compact ? "p-3" : "p-4",
        className
      )}
      role="note"
      aria-label="คำเตือนทางการแพทย์"
    >
      {MEDICAL_DISCLAIMER}
    </div>
  );
}
