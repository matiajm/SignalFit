import { Battery, Brain, Flame, Moon, Smile, Zap } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { calculateReadiness, formatDate } from "../data/metrics";
import { useSignalFitData } from "../data/useSignalFitData";
import { CircularProgress } from "./CircularProgress";

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

const getScoreLabel = (score: number) => {
  if (score >= 85) return { label: "Peak", color: "#10B981" };
  if (score >= 70) return { label: "Primed", color: "#3B82F6" };
  if (score >= 55) return { label: "Moderate", color: "#F59E0B" };
  return { label: "Rest", color: "#EF4444" };
};

const qualityScore = (value?: string | null) => {
  if (value === "good" || value === "high" || value === "low") return value === "low" ? 35 : 85;
  if (value === "okay" || value === "moderate") return 60;
  return 50;
};

export function RecoveryPage() {
  const { data } = useSignalFitData();
  const recoveryScore = calculateReadiness(data);
  const { label: scoreLabel, color: scoreColor } = getScoreLabel(recoveryScore);
  const weeklyData = [
    ...data.recentDays.map((day) => ({ day: day.label.replace(" ago", ""), score: day.recoveryScore, sleep: day.sleepHours })),
    { day: "Today", score: recoveryScore, sleep: data.sleepHours },
  ];
  const metrics = [
    { id: "sleep", icon: Moon, label: "Sleep Duration", value: data.sleepHours.toString(), unit: "hrs", score: Math.min(Math.round((data.sleepHours / 8) * 100), 100), color: "#8B5CF6", insight: data.sleepQuality ?? "Self-reported check-in" },
    { id: "quality", icon: Moon, label: "Sleep Quality", value: data.sleepQuality ?? "n/a", unit: "", score: qualityScore(data.sleepQuality), color: "#3B82F6", insight: "From today's check-in" },
    { id: "energy", icon: Zap, label: "Energy Level", value: data.energy ?? "n/a", unit: "", score: qualityScore(data.energy), color: "#F59E0B", insight: "From today's check-in" },
    { id: "mood", icon: Smile, label: "Mood", value: data.mood ?? "n/a", unit: "", score: qualityScore(data.mood), color: "#10B981", insight: "From today's check-in" },
    { id: "stress", icon: Brain, label: "Stress", value: data.stress ?? "n/a", unit: "", score: data.stress === "high" ? 25 : qualityScore(data.stress), color: "#06B6D4", insight: "Lower score means higher stress load" },
    { id: "motivation", icon: Flame, label: "Motivation", value: data.motivation ?? "n/a", unit: "", score: qualityScore(data.motivation), color: "#EC4899", insight: "From today's check-in" },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(160deg, #07070F 0%, #0D0820 50%, #070F1A 100%)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(16,185,129,0.05) 0%, transparent 60%)" }} />

      <div className="relative z-10 flex flex-col gap-5 px-5 pt-14 pb-32">
        <div>
          <div style={{ color: "#6B6B9A", fontSize: 13, fontWeight: 500 }}>{formatDate(data.checkinDate)}</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "#EEEEFF", marginTop: 4, lineHeight: 1.2 }}>Recovery</h1>
        </div>

        <div className="rounded-2xl p-6 flex flex-col items-center gap-4" style={{ background: `linear-gradient(135deg, ${scoreColor}15 0%, rgba(139,92,246,0.1) 100%)`, border: `1px solid ${scoreColor}30` }}>
          <div style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Recovery Score</div>
          <CircularProgress value={recoveryScore} max={100} size={140} strokeWidth={10} color={scoreColor}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: scoreColor, fontSize: 42, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", lineHeight: 1, filter: `drop-shadow(0 0 20px ${scoreColor}60)` }}>{recoveryScore}</div>
              <div style={{ color: scoreColor, fontSize: 14, fontWeight: 700, marginTop: 2 }}>{scoreLabel}</div>
            </div>
          </CircularProgress>
          <p style={{ color: "#A0A0C8", fontSize: 14, textAlign: "center", lineHeight: 1.5, maxWidth: 300 }}>{data.insight.summary}</p>
          <div className="flex gap-3 w-full">
            {[
              { label: "Sleep", value: `${data.sleepHours}h`, color: "#3B82F6" },
              { label: "Energy", value: data.energy ?? "n/a", color: "#8B5CF6" },
              { label: "Stress", value: data.stress ?? "n/a", color: "#10B981" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex-1 flex flex-col items-center py-3 rounded-xl gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color, fontSize: 14, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", textTransform: "capitalize" }}>{value}</div>
                <div style={{ color: "#6B6B9A", fontSize: 10, fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Today's Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map(({ id, icon: Icon, label, value, unit, score, color, insight }) => (
              <GlassCard key={id} style={{ padding: 16 }}>
                <div className="flex items-center justify-between mb-2">
                  <Icon size={16} style={{ color }} />
                  <div className="px-2 py-0.5 rounded-lg" style={{ background: `${color}22` }}>
                    <span style={{ color, fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{score}</span>
                  </div>
                </div>
                <div style={{ color: "#EEEEFF", fontSize: 18, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", lineHeight: 1, textTransform: "capitalize" }}>
                  {value}<span style={{ fontSize: 12, color: "#6B6B9A", fontWeight: 500, marginLeft: 2 }}>{unit}</span>
                </div>
                <div style={{ color: "#6B6B9A", fontSize: 11, marginTop: 3 }}>{label}</div>
                <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
                </div>
                <div style={{ color: "#6B6B9A", fontSize: 10, marginTop: 6, lineHeight: 1.4 }}>{insight}</div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Recent Trend</h3>
          <GlassCard>
            <div style={{ height: 130 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} fill="url(#scoreGrad)" dot={false} />
                  <Area type="monotone" dataKey="sleep" stroke="#8B5CF6" strokeWidth={2} fill="url(#sleepGrad)" dot={false} />
                  <XAxis dataKey="day" tick={{ fill: "#6B6B9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <div>
          <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Recommendations</h3>
          <div className="flex flex-col gap-3">
            {data.insight.next.map((detail, index) => (
              <GlassCard key={detail} style={{ padding: 16 }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
                    <Battery size={18} style={{ color: "#3B82F6" }} />
                  </div>
                  <div>
                    <div style={{ color: "#3B82F6", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Step {index + 1}</div>
                    <div style={{ color: "#A0A0C8", fontSize: 13, lineHeight: 1.5 }}>{detail}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
