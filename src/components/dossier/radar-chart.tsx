"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { RADAR_LABELS, type RadarKey } from "@/lib/types/dossier";

export function CognitiveRadar({
  scores,
}: {
  scores: Partial<Record<RadarKey, number>>;
}) {
  const data = (Object.keys(RADAR_LABELS) as RadarKey[]).map((k) => ({
    axis: RADAR_LABELS[k],
    value: scores[k] ?? 0,
  }));

  return (
    <div className="w-full h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="78%">
          <PolarGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 4" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "rgba(245,245,245,0.55)", fontSize: 11, letterSpacing: "0.18em" }}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            stroke="rgba(255,255,255,0.08)"
          />
          <Radar
            name="Subject"
            dataKey="value"
            stroke="rgba(245,245,245,0.9)"
            fill="rgba(245,245,245,0.18)"
            strokeWidth={1.5}
            dot={{ r: 3, fill: "#F5F5F5", stroke: "rgba(0,0,0,0)" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
