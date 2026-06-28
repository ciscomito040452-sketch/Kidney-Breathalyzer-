import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChallengeProgressBarProps {
  challengeDays: boolean[];
}

export function ChallengeProgressBar({ challengeDays }: ChallengeProgressBarProps) {
  const completedCount = challengeDays.filter(Boolean).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
          ท้าทาย 14 วัน
        </CardTitle>
        <p className="text-xs text-[var(--text-secondary)]">
          ความคืบหน้า {completedCount}/{challengeDays.length} วัน
        </p>
      </CardHeader>
      <CardContent>
        <div
          className="flex gap-1.5"
          role="list"
          aria-label="ความคืบหน้าท้าทาย 14 วัน"
        >
          {challengeDays.map((filled, index) => (
            <div
              key={index}
              role="listitem"
              aria-label={filled ? `วันที่ ${index + 1} วัดแล้ว` : `วันที่ ${index + 1}`}
              className={cn(
                "h-3 flex-1 rounded-full transition-colors",
                filled ? "bg-accent-primary" : "bg-border-subtle"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
