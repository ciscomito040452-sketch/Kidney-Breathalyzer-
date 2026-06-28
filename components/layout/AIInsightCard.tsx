"use client";

import Link from "next/link";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTA_VIEW_DETAIL } from "@/lib/constants";

interface SparklinePoint {
  date: string;
  risk_score: number;
}

interface AIInsightCardProps {
  explanation: string;
  resultId?: string;
  sparklineData?: SparklinePoint[];
}

export function AIInsightCard({
  explanation,
  resultId,
  sparklineData = [],
}: AIInsightCardProps) {
  const chartData = sparklineData.map((d) => ({
    ...d,
    score: Math.round(d.risk_score * 100),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-accent-primary" />
          สรุปจาก AI
        </CardTitle>
        <p className="text-sm text-[var(--text-secondary)]">
          การวิเคราะห์เบื้องต้นจากข้อมูลการวัด
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {chartData.length >= 2 && (
          <ResponsiveContainer width="100%" height={56}>
            <LineChart data={chartData}>
              <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border-subtle, #E5E5EA)",
                  fontSize: 12,
                }}
                formatter={(value) => [
                  `${value ?? 0}/100`,
                  "คะแนน",
                ]}
                labelFormatter={() => ""}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--accent-primary, #2563EB)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        <p className="text-sm leading-relaxed">{explanation}</p>
        {resultId && (
          <Link
            href={`/result/${resultId}`}
            className="text-sm font-medium text-accent-primary"
          >
            {CTA_VIEW_DETAIL}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
