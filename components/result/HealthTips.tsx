import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthTipsProps {
  tips: readonly string[];
}

export function HealthTips({ tips }: HealthTipsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">คำแนะนำด้านสุขภาพ</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-risk-low"
                strokeWidth={2}
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
