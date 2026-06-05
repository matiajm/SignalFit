import { Moon, Zap, Brain, Heart, Smile, Flame } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";

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

const weeklyData = [
  { day: "Mon", score: 72, sleep: 7.2, hrv: 58 },
  { day: "Tue", score: 65, sleep: 6.5, hrv: 52 },
  { day: "Wed", score: 81, sleep: 8.0, hrv: 71 },
  { day: "Thu", score: 78, sleep: 7.8, hrv: 65 },
  { day: "Fri", score: 88, sleep: 8.5, hrv: 78 },
  { day: "Sat", score: 74, sleep: 7.4, hrv: 61 },
  { day: "Sun", score: 82, sleep: 8.2, hrv: 68 },
];

const metrics = [
  { id: "sleep", icon: Moon, label: "Sleep Duration", value: "8.2", unit: "hrs", score: 92, color: "#8B5CF6", insight: "Excellent — above your 7.8h average" },
  { id: "quality", icon: Moon, label: "Sleep Quality", value: "88", unit: "/100", score: 88, color: "#3B82F6", insight: "Deep sleep: 1h 52min · REM: 2h 14min" },
  { id: "energy", icon: Zap, label: "Energy Level", value: "78", unit: "/100", score: 78, color: "#F59E0B", insight: "High — optimal for heavy training" },
  { id: "mood", icon: Smile, label: "Mood", value: "Good", unit: "", score: 80, color: "#10B981", insight: "Positive affect trending up this week" },
  { id: "stress", icon: Brain, label: "Stress", value: "Low", unit: "", score: 85, color: "#06B6D4", insight: "Cortisol indicators within healthy range" },
  { id: "motivation", icon: Flame, label: "Motivation", value: "High", unit: "", score: 90, color: "#EC4899", insight: "Peak week for motivation score" },
];

const recoveryScore = 82;

const getScoreLabel = (score: number) => {
  if (score >= 85) return { label: "Peak", color: "#10B981" };
  if (score >= 70) return { label: "Primed", color: "#3B82F6" };
  if (score >= 55) return { label: "Moderate", color: "#F59E0B" };
  return { label: "Rest", color: "#EF4444" };
};

const { label: scoreLabel, color: scoreColor } = getScoreLabel(recoveryScore);

const recommendations = [
  {
    category: "Recovery",
    emoji: "🧊",
    title: "Cold exposure today",
    detail: "10-min cold shower or contrast therapy to reduce inflammation from yesterday's training load.",
    color: "#06B6D4",
  },
  {
    category: "Sleep",
    emoji: "🌙",
    title: "Consistent sleep window",
    detail: "Your readiness peaks when you sleep by 10:30 PM. Tonight, aim for 10:15 PM lights out.",
    color: "#8B5CF6",
  },
  {
    category: "Nutrition",
    emoji: "🥩",
    title: "Increase carbohydrates post-workout",
    detail: "Add 40–60g of fast carbs within 30 min post-training to optimize glycogen resynthesis.",
    color: "#F59E0B",
  },
  {
    category: "Stress",
    emoji: "🧘",
    title: "5-min breathwork before bed",
    detail: "Box breathing (4-4-4-4) shown to reduce your nighttime HRV dip by ~12ms based on your data.",
    color: "#10B981",
  },
];

export function RecoveryPage() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(160deg, #07070F 0%, #0D0820 50%, #070F1A 100%)" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(16,185,129,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-5 px-5 pt-14 pb-32">
        {/* Header */}
        <div>
          <div style={{ color: "#6B6B9A", fontSize: 13, fontWeight: 500 }}>Thursday, June 5</div>
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
            Recovery
          </h1>
        </div>

        {/* Recovery Score Hero */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center gap-4"
          style={{
            background: `linear-gradient(135deg, ${scoreColor}15 0%, rgba(139,92,246,0.1) 100%)`,
            border: `1px solid ${scoreColor}30`,
          }}
        >
          <div style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Recovery Score
          </div>
          <CircularProgress value={recoveryScore} max={100} size={140} strokeWidth={10} color={scoreColor}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: scoreColor,
                  fontSize: 42,
                  fontWeight: 900,
                  fontFamily: "JetBrains Mono, monospace",
                  lineHeight: 1,
                  filter: `drop-shadow(0 0 20px ${scoreColor}60)`,
                }}
              >
                {recoveryScore}
              </div>
              <div style={{ color: scoreColor, fontSize: 14, fontWeight: 700, marginTop: 2 }}>{scoreLabel}</div>
            </div>
          </CircularProgress>
          <p style={{ color: "#A0A0C8", fontSize: 14, textAlign: "center", lineHeight: 1.5, maxWidth: 280 }}>
            Your body is well-recovered. This is a great day for high-intensity training or strength work.
          </p>
          <div className="flex gap-3 w-full">
            {[
              { label: "HRV", value: "68ms", color: "#3B82F6" },
              { label: "Resting HR", value: "52 bpm", color: "#8B5CF6" },
              { label: "SpO₂", value: "98%", color: "#10B981" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center py-3 rounded-xl gap-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div style={{ color, fontSize: 14, fontWeight: 800, fontFamily: "JetBrains Mono, monospace" }}>{value}</div>
                <div style={{ color: "#6B6B9A", fontSize: 10, fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Metrics */}
        <div>
          <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Today's Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map(({ id, icon: Icon, label, value, unit, score, color, insight }) => (
              <GlassCard key={id} style={{ padding: 16 }}>
                <div className="flex items-center justify-between mb-2">
                  <Icon size={16} style={{ color }} />
                  <div
                    className="px-2 py-0.5 rounded-lg"
                    style={{ background: `${color}22` }}
                  >
                    <span style={{ color, fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                      {score}
                    </span>
                  </div>
                </div>
                <div style={{ color: "#EEEEFF", fontSize: 18, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                  {value}
                  <span style={{ fontSize: 12, color: "#6B6B9A", fontWeight: 500, marginLeft: 2 }}>{unit}</span>
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

        {/* Weekly Trend */}
        <div>
          <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Weekly Trend</h3>
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div style={{ color: "#6B6B9A", fontSize: 12 }}>Recovery Score</div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#3B82F6" }} />
                  <span style={{ color: "#6B6B9A", fontSize: 11 }}>Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#8B5CF6" }} />
                  <span style={{ color: "#6B6B9A", fontSize: 11 }}>HRV</span>
                </div>
              </div>
            </div>
            <div style={{ height: 130 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} fill="url(#scoreGrad)" dot={false} />
                  <Area type="monotone" dataKey="hrv" stroke="#8B5CF6" strokeWidth={2} fill="url(#hrvGrad)" dot={false} />
                  <XAxis dataKey="day" tick={{ fill: "#6B6B9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* AI Recommendations */}
        <div>
          <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>AI Recommendations</h3>
          <div className="flex flex-col gap-3">
            {recommendations.map((rec) => (
              <GlassCard key={rec.title} style={{ padding: 16 }}>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${rec.color}15`, border: `1px solid ${rec.color}30` }}
                  >
                    {rec.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: rec.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {rec.category}
                      </span>
                    </div>
                    <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 14 }}>{rec.title}</div>
                    <div style={{ color: "#6B6B9A", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{rec.detail}</div>
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
