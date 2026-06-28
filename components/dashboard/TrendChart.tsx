"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { getSensorUILabels } from "@/lib/i18n/labels";
import { formatChartAxisDate } from "@/lib/utils";

export interface TrendDataPoint {
  date: string;
  mq135_value: number;
  mq3_value?: number;
  risk_score: number;
}

interface TrendChartProps {
  data: TrendDataPoint[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
  showDualLine?: boolean;
}

export function TrendChart({
  data,
  title,
  subtitle,
  compact = false,
  showDualLine = false,
}: TrendChartProps) {
  const { locale, translate } = usePreferences();
  const sensorUi = getSensorUILabels(locale);
  const chartTitle =
    title ?? translate("trendTitle").replace("{n}", "7");

  const chartData = data.map((d) => ({
    ...d,
    acetone_ppb: d.mq3_value != null ? Math.round(d.mq3_value * 500) : undefined,
    label: formatChartAxisDate(locale, d.date),
  }));

  const hasDualData =
    showDualLine && chartData.some((d) => d.acetone_ppb != null);

  return (
    <Card>
      <CardHeader className={compact ? "space-y-1 pb-2" : "space-y-1"}>
        <CardTitle className="text-base">{chartTitle}</CardTitle>
        {subtitle && (
          <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <EmptyState icon={BarChart3} message={translate("chartNoData")} />
        ) : (
          <ResponsiveContainer width="100%" height={compact ? 140 : hasDualData ? 220 : 200}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle, #E5E5EA)"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--text-secondary, #86868B)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-secondary, #86868B)" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border-subtle, #E5E5EA)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="mq135_value"
                stroke="var(--accent-primary, #2563EB)"
                strokeWidth={2}
                dot={false}
                name={sensorUi.ammonia.label}
              />
              {hasDualData && (
                <Line
                  type="monotone"
                  dataKey="acetone_ppb"
                  stroke="var(--accent-secondary, #7DD3FC)"
                  strokeWidth={2}
                  dot={false}
                  name={sensorUi.acetone.label}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
