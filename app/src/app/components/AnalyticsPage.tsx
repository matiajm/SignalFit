import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { calculateReadiness, nutritionGoals } from "../data/metrics";
import { useSignalFitData } from "../data/useSignalFitData";

const GlassCard = ({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div className={`rounded-2xl p-5 ${className}`} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", ...style }}>
    {children}
  </div>
);

const TIME_FILTERS = ["Week", "Month", "Quarter", "Year"] as const;
type TimeFilter = (typeof TIME_FILTERS)[number];

export function AnalyticsPage() {
  const { data } = useSignalFitData();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Month");
  const recoveryScore = calculateReadiness(data);
  const caloriesData = [
    ...data.recentDays.map((day, index) => ({ day: index + 1, calories: day.calories })),
    { day: data.recentDays.length + 1, calories: data.nutrition.calories },
  ];
  const proteinData = data.meals.map((meal, index) => ({ day: index + 1, protein: meal.proteinG }));
  const volumeData = [
    ...data.recentDays.map((day, index) => ({ week: `R${index + 1}`, volume: day.trained ? data.training.totalVolumeLb * 0.65 : 0 })),
    { week: "Now", volume: data.training.totalVolumeLb },
  ];
  const recoveryData = [
    ...data.recentDays.map((day, index) => ({ day: index + 1, score: day.recoveryScore })),
    { day: data.recentDays.length + 1, score: recoveryScore },
  ];
  const stats = [
    { label: "Weight", value: data.weightLb ? data.weightLb.toString() : "n/a", unit: "lbs", change: 0, color: "#3B82F6", positive: null },
    { label: "Calories", value: Math.round(data.nutrition.calories).toLocaleString(), unit: "kcal", change: Math.round((data.nutrition.calories / nutritionGoals.calories) * 100), color: "#F59E0B", positive: null },
    { label: "Protein", value: Math.round(data.nutrition.proteinG).toString(), unit: "g", change: Math.round((data.nutrition.proteinG / nutritionGoals.proteinG) * 100), color: "#8B5CF6", positive: true },
    { label: "Recovery", value: recoveryScore.toString(), unit: "/100", change: recoveryScore - 60, color: "#10B981", positive: true },
    { label: "Workouts", value: data.training.trained ? "1" : "0", unit: "session", change: data.training.trained ? 1 : 0, color: "#EC4899", positive: true },
    { label: "Volume", value: `${Math.round(data.training.totalVolumeLb / 1000)}k`, unit: "lbs", change: data.training.totalSets, color: "#06B6D4", positive: true },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(160deg, #07070F 0%, #0D0820 50%, #070F1A 100%)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 35% at 60% 5%, rgba(59,130,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 20% 80%, rgba(16,185,129,0.05) 0%, transparent 60%)" }} />

      <div className="relative z-10 flex flex-col gap-5 px-5 pt-14 pb-32">
        <div className="flex items-center justify-between">
          <div>
            <div style={{ color: "#6B6B9A", fontSize: 13, fontWeight: 500 }}>{data.source === "supabase" ? "Supabase overview" : "Demo overview"}</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "#EEEEFF", marginTop: 4, lineHeight: 1.2 }}>Analytics</h1>
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
            {TIME_FILTERS.map((f) => (
              <button key={f} onClick={() => setTimeFilter(f)} className="px-2.5 py-1.5 rounded-lg transition-all duration-200" style={{ background: timeFilter === f ? "rgba(59,130,246,0.3)" : "transparent", color: timeFilter === f ? "#3B82F6" : "#6B6B9A", fontSize: 11, fontWeight: 600 }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.1) 100%)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <div style={{ color: "#8B5CF6", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>SignalFit AI - {timeFilter}</div>
          <p style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}>{data.insight.summary}</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex flex-col gap-2">
              <div style={{ color: "#10B981", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Wins</div>
              {data.insight.wins.map((w) => (
                <div key={w} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full" style={{ background: "#10B981" }} />
                  <span style={{ color: "#A0A0C8", fontSize: 12 }}>{w}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <div style={{ color: "#F59E0B", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Next</div>
              {data.insight.next.map((w) => (
                <div key={w} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full" style={{ background: "#F59E0B" }} />
                  <span style={{ color: "#A0A0C8", fontSize: 12 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, unit, change, color, positive }) => {
            const isPositive = change > 0;
            const isGood = positive === null ? null : positive ? isPositive : !isPositive;
            const changeColor = isGood === null ? "#6B6B9A" : isGood ? "#10B981" : "#EF4444";
            return (
              <GlassCard key={label} style={{ padding: 16 }}>
                <div style={{ color: "#6B6B9A", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
                <div style={{ color, fontSize: 22, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.1, marginTop: 6 }}>{value}</div>
                <div style={{ color: "#6B6B9A", fontSize: 11, marginTop: 1 }}>{unit}</div>
                <div className="flex items-center gap-1 mt-2">
                  {isPositive ? <TrendingUp size={11} style={{ color: changeColor }} /> : <TrendingDown size={11} style={{ color: changeColor }} />}
                  <span style={{ color: changeColor, fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{isPositive ? "+" : ""}{change}</span>
                  <span style={{ color: "#6B6B9A", fontSize: 10 }}>current</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {[
          { title: "Calorie Intake", subtitle: `Goal ${nutritionGoals.calories.toLocaleString()} kcal`, data: caloriesData, keyName: "calories", color: "#F59E0B", type: "area" },
          { title: "Protein By Meal", subtitle: `Goal ${nutritionGoals.proteinG}g`, data: proteinData, keyName: "protein", color: "#8B5CF6", type: "line" },
          { title: "Training Volume", subtitle: "Recent sessions", data: volumeData, keyName: "volume", color: "#10B981", type: "bar" },
          { title: "Recovery Score", subtitle: "Recent check-ins", data: recoveryData, keyName: "score", color: "#3B82F6", type: "area" },
        ].map((chart) => (
          <GlassCard key={chart.title}>
            <div style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{chart.title}</div>
            <div style={{ color: "#6B6B9A", fontSize: 12, marginBottom: 16 }}>{chart.subtitle}</div>
            <div style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                {chart.type === "bar" ? (
                  <BarChart data={chart.data} barSize={32}>
                    <Bar dataKey={chart.keyName} fill={chart.color} radius={[6, 6, 0, 0]} />
                    <XAxis dataKey={"week"} tick={{ fill: "#6B6B9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }} />
                  </BarChart>
                ) : chart.type === "line" ? (
                  <LineChart data={chart.data}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <Line type="monotone" dataKey={chart.keyName} stroke={chart.color} strokeWidth={2.5} dot={false} />
                    <XAxis dataKey="day" tick={{ fill: "#6B6B9A", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }} />
                  </LineChart>
                ) : (
                  <AreaChart data={chart.data}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <Area type="monotone" dataKey={chart.keyName} stroke={chart.color} strokeWidth={2} fill={chart.color} fillOpacity={0.18} dot={false} />
                    <XAxis dataKey="day" tick={{ fill: "#6B6B9A", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
