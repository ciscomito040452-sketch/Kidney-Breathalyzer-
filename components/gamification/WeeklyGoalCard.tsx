import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WeeklyGoalCardProps {
  count: number;
  target: number;
}

export function WeeklyGoalCard({ count, target }: WeeklyGoalCardProps) {
  const met = count >= target;
  const displayCount = met ? target : count;
  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <Target className="h-4 w-4 text-accent-primary" strokeWidth={1.75} />
          เป้าหมายรายสัปดาห์
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-3xl font-semibold tabular-nums tracking-tight">
          {displayCount}/{target}
          <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
            ครั้ง
          </span>
        </p>
        {met && (
          <p className="text-xs text-risk-low">บรรลุเป้าแล้ว</p>
        )}
        <Progress value={progressPercent} aria-label="ความคืบหน้าเป้าหมายรายสัปดาห์" />
      </CardContent>
    </Card>
  );
}
