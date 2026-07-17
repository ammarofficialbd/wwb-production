"use client";

import { ChevronDown } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Dot,
} from "recharts";

const data = [
  { day: "S", hours: 1.6 },
  { day: "M", hours: 2.7 },
  { day: "T", hours: 2.0 },
  { day: "W", hours: 2.5 },
  { day: "T", hours: 2.6 },
  { day: "F", hours: 1.9 },
  { day: "S", hours: 2.9 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ActiveDot(props: any) {
  const { cx, cy, index } = props;
  if (index !== 3 || cx === undefined || cy === undefined) return null;
  return (
    <g>
      <foreignObject x={cx - 46} y={cy - 46} width={92} height={32}>
        <div className="bg-[var(--ink)] text-white text-xs font-semibold rounded-lg px-3 py-1.5 text-center whitespace-nowrap">
          2,5 Hours
        </div>
      </foreignObject>
      <Dot cx={cx} cy={cy} r={5} fill="#fff" stroke="#f7a531" strokeWidth={3} />
    </g>
  );
}

export default function ActivityChart() {
  return (
    <div className="bg-white rounded-3xl p-6 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-[15px]">Activity</h3>
        <button className="flex items-center gap-1 text-xs font-medium text-[#5b5d76] bg-[#f5f5fa] px-3 py-1.5 rounded-lg">
          This Week
          <ChevronDown size={14} />
        </button>
      </div>
      <div className="h-[280px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 50, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9a9df5" />
                <stop offset="100%" stopColor="#7c7ff2" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eef0f6" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8a8ca6", fontSize: 13, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              domain={[0, 4]}
              ticks={[1, 2, 3, 4]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8a8ca6", fontSize: 13, fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              fill="transparent"
              activeDot={false}
              dot={<ActiveDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
