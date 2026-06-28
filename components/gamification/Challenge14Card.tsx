import { CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Challenge14CardProps {
  challengeDays: boolean[];
}

export function Challenge14Card({ challengeDays }: Challenge14CardProps) {
  const completedCount = challengeDays.filter(Boolean).length;

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <CalendarCheck
            className="h-4 w-4 text-accent-primary"
            strokeWidth={1.75}
          />
          ตรวจต่อเนื่อง 14 วัน
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums tracking-tight">
          {completedCount}
          <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
            /{challengeDays.length} วัน
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
