import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

const GlassCard = ({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`rounded-2xl p-5 ${className}`}
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(16px)",
      ...style,
    }}
  >
    {children}
  </div>
);

const TIME_FILTERS = ["Week", "Month", "Quarter", "Year"] as const;
type TimeFilter = (typeof TIME_FILTERS)[number];

const weightDataMonth = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  weight: 182 - i * 0.08 + Math.sin(i * 0.5) * 0.8,
}));

const caloriesDataMonth = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  calories: 2050 + Math.sin(i * 0.7) * 250 + (Math.random() - 0.5) * 100,
}));

const proteinDataMonth = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  protein: 158 + Math.sin(i * 0.6) * 18 + (Math.random() - 0.5) * 10,
}));

const volumeDataMonth = Array.from({ length: 4 }, (_, i) => ({
  week: `W${i + 1}`,
  volume: [38200, 41600, 39800, 44100][i],
}));

const recoveryDataMonth = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  score: 72 + Math.sin(i * 0.4) * 12 + (Math.random() - 0.5) * 5,
}));

const stats = [
  {
    label: "Avg Weight",
    value: "181.4",
    unit: "lbs",
    change: -2.8,
    color: "#3B82F6",
    positive: true,
  },
  {
    label: "Avg Calories",
    value: "2,085",
    unit: "kcal",
    change: +4.2,
    color: "#F59E0B",
    positive: null,
  },
  {
    label: "Avg Protein",
    value: "162",
    unit: "g",
    change: +8.5,
    color: "#8B5CF6",
    positive: true,
  },
  {
    label: "Avg Recovery",
    value: "76",
    unit: "/100",
    change: +5.1,
    color: "#10B981",
    positive: true,
  },
  {
    label: "Workouts",
    value: "18",
    unit: "sessions",
    change: +2,
    color: "#EC4899",
    positive: true,
  },
  {
    label: "Total Volume",
    value: "163k",
    unit: "lbs",
    change: +12.3,
    color: "#06B6D4",
    positive: true,
  },
];

export function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Month");

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(160deg, #07070F 0%, #0D0820 50%, #070F1A 100%)" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 60% 5%, rgba(59,130,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 20% 80%, rgba(16,185,129,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-5 px-5 pt-14 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div style={{ color: "#6B6B9A", fontSize: 13, fontWeight: 500 }}>Performance Overview</div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                fontFamily: "Outfit, sans-serif",
                color: "#EEEEFF",
                marginTop: 4,
                lineHeight: 1.2,
              }}
            >
              Analytics
            </h1>
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
            {TIME_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className="px-2.5 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: timeFilter === f ? "rgba(59,130,246,0.3)" : "transparent",
                  color: timeFilter === f ? "#3B82F6" : "#6B6B9A",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.1) 100%)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <div style={{ color: "#8B5CF6", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            🤖 AI Summary · {timeFilter}
          </div>
          <p style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}>
            Your progress this month
          </p>
          <p style={{ color: "#A0A0C8", fontSize: 13, lineHeight: 1.6, marginTop: 6 }}>
            You lost <span style={{ color: "#10B981", fontWeight: 700 }}>2.8 lbs</span> while maintaining muscle mass — a textbook body recomposition. Protein consistency at 93% of target is your biggest driver. Recovery scores improved <span style={{ color: "#3B82F6", fontWeight: 700 }}>+5.1 points</span> month-over-month after optimizing sleep.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex flex-col gap-2">
              <div style={{ color: "#10B981", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>✓ Wins</div>
              {["Protein targets hit 93%", "Workout consistency up", "Best recovery month ever"].map((w) => (
                <div key={w} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full" style={{ background: "#10B981" }} />
                  <span style={{ color: "#A0A0C8", fontSize: 12 }}>{w}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <div style={{ color: "#F59E0B", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>↑ Next Month</div>
              {["Hit carb targets daily", "Add 1 more workout/week", "Improve Vitamin C intake"].map((w) => (
                <div key={w} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full" style={{ background: "#F59E0B" }} />
                  <span style={{ color: "#A0A0C8", fontSize: 12 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, unit, change, color, positive }) => {
            const isPositive = change > 0;
            const isGood = positive === null ? null : (positive ? isPositive : !isPositive);
            const changeColor = isGood === null ? "#6B6B9A" : isGood ? "#10B981" : "#EF4444";
            return (
              <GlassCard key={label} style={{ padding: 16 }}>
                <div style={{ color: "#6B6B9A", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {label}
                </div>
                <div
                  style={{
                    color,
                    fontSize: 22,
                    fontWeight: 800,
                    fontFamily: "JetBrains Mono, monospace",
                    lineHeight: 1.1,
                    marginTop: 6,
                  }}
                >
                  {value}
                </div>
                <div style={{ color: "#6B6B9A", fontSize: 11, marginTop: 1 }}>{unit}</div>
                <div className="flex items-center gap-1 mt-2">
                  {isPositive ? (
                    <TrendingUp size={11} style={{ color: changeColor }} />
                  ) : (
                    <TrendingDown size={11} style={{ color: changeColor }} />
                  )}
                  <span style={{ color: changeColor, fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                    {isPositive ? "+" : ""}{change}{typeof change === "number" && change % 1 !== 0 ? "%" : ""}
                  </span>
                  <span style={{ color: "#6B6B9A", fontSize: 10 }}>vs last {timeFilter.toLowerCase()}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Weight Trend */}
        <GlassCard>
          <div style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Weight Trend</div>
          <div style={{ color: "#6B6B9A", fontSize: 12, marginBottom: 16 }}>
            182.0 → 179.2 lbs · <span style={{ color: "#10B981", fontWeight: 700 }}>−2.8 lbs</span>
          </div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightDataMonth}>
                <defs>
                  <linearGradient id="wtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <Area type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} fill="url(#wtGrad)" dot={false} />
                <XAxis dataKey="day" tick={{ fill: "#6B6B9A", fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                <Tooltip
                  formatter={(v: number) => [`${v.toFixed(1)} lbs`, "Weight"]}
                  contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Calories Trend */}
        <GlassCard>
          <div style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Calorie Intake</div>
          <div style={{ color: "#6B6B9A", fontSize: 12, marginBottom: 16 }}>Avg 2,085 kcal/day · Goal 2,200</div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={caloriesDataMonth}>
                <defs>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <Area type="monotone" dataKey="calories" stroke="#F59E0B" strokeWidth={2} fill="url(#calGrad)" dot={false} />
                <XAxis dataKey="day" tick={{ fill: "#6B6B9A", fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                <Tooltip
                  formatter={(v: number) => [`${Math.round(v)} kcal`, "Calories"]}
                  contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Protein Trend */}
        <GlassCard>
          <div style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Protein Intake</div>
          <div style={{ color: "#6B6B9A", fontSize: 12, marginBottom: 16 }}>Avg 162g/day · Goal 175g · <span style={{ color: "#3B82F6", fontWeight: 700 }}>93% hit rate</span></div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={proteinDataMonth}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <Line type="monotone" dataKey="protein" stroke="#8B5CF6" strokeWidth={2.5} dot={false} />
                <XAxis dataKey="day" tick={{ fill: "#6B6B9A", fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                <Tooltip
                  formatter={(v: number) => [`${Math.round(v)}g`, "Protein"]}
                  contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Volume Trend */}
        <GlassCard>
          <div style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Training Volume</div>
          <div style={{ color: "#6B6B9A", fontSize: 12, marginBottom: 16 }}>Weekly total volume · <span style={{ color: "#10B981", fontWeight: 700 }}>+12.3% MoM</span></div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeDataMonth} barSize={32}>
                <defs>
                  <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <Bar dataKey="volume" fill="url(#vGrad)" radius={[6, 6, 0, 0]} />
                <XAxis dataKey="week" tick={{ fill: "#6B6B9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [`${(v / 1000).toFixed(1)}k lbs`, "Volume"]}
                  contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recovery Trend */}
        <GlassCard>
          <div style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Recovery Score</div>
          <div style={{ color: "#6B6B9A", fontSize: 12, marginBottom: 16 }}>Avg 76/100 · <span style={{ color: "#10B981", fontWeight: 700 }}>+5.1 points</span> vs last month</div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recoveryDataMonth}>
                <defs>
                  <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} fill="url(#recGrad)" dot={false} />
                <XAxis dataKey="day" tick={{ fill: "#6B6B9A", fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                <Tooltip
                  formatter={(v: number) => [`${Math.round(v)}/100`, "Recovery"]}
                  contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
