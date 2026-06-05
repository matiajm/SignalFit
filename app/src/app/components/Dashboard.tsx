import { useState } from "react";
import { Bell, Zap, ChevronRight, Plus, TrendingUp, Moon, Battery, Brain, Flame } from "lucide-react";
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

const recoveryData = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 65 },
  { day: "Wed", score: 81 },
  { day: "Thu", score: 78 },
  { day: "Fri", score: 88 },
  { day: "Sat", score: 74 },
  { day: "Sun", score: 82 },
];

const MacroCard = ({
  label,
  current,
  goal,
  unit,
  color,
  emoji,
}: {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
  emoji: string;
}) => {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color,
            fontFamily: "JetBrains Mono, monospace",
            background: `${color}22`,
            padding: "2px 7px",
            borderRadius: 6,
          }}
        >
          {Math.round(pct)}%
        </span>
      </div>
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#EEEEFF",
            fontFamily: "JetBrains Mono, monospace",
            lineHeight: 1,
          }}
        >
          {current}
          <span style={{ fontSize: 13, fontWeight: 500, color: "#6B6B9A", marginLeft: 3 }}>{unit}</span>
        </div>
        <div style={{ color: "#6B6B9A", fontSize: 12, marginTop: 2 }}>
          {label} · goal {goal}{unit}
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </GlassCard>
  );
};

export function Dashboard() {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const readinessScore = 82;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const scoreColor = getScoreColor(readinessScore);

  const meals = [
    {
      id: "breakfast",
      name: "Breakfast",
      emoji: "🌅",
      time: "7:30 AM",
      calories: 520,
      protein: 38,
      foods: ["Greek yogurt (150g)", "Granola (40g)", "Blueberries (80g)", "Whey protein shake"],
    },
    {
      id: "lunch",
      name: "Lunch",
      emoji: "☀️",
      time: "12:15 PM",
      calories: 680,
      protein: 52,
      foods: ["Grilled chicken breast (200g)", "Brown rice (150g)", "Broccoli (120g)", "Olive oil (1 tbsp)"],
    },
    {
      id: "dinner",
      name: "Dinner",
      emoji: "🌙",
      time: "6:45 PM",
      calories: 720,
      protein: 58,
      foods: ["Salmon fillet (220g)", "Sweet potato (200g)", "Asparagus (100g)", "Lemon butter sauce"],
    },
    {
      id: "snacks",
      name: "Snacks",
      emoji: "🍎",
      time: "3:00 PM",
      calories: 280,
      protein: 22,
      foods: ["Protein bar (1)", "Apple (1 medium)", "Almonds (30g)"],
    },
  ];

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(160deg, #07070F 0%, #0D0820 50%, #070F1A 100%)" }}
    >
      {/* Ambient glows */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 15% 5%, rgba(59,130,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 85% 15%, rgba(139,92,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 30% 20% at 50% 90%, rgba(16,185,129,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-5 px-5 pt-14 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div style={{ color: "#6B6B9A", fontSize: 13, fontWeight: 500 }}>Good morning 👋</div>
            <div
              style={{
                color: "#EEEEFF",
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "Outfit, sans-serif",
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              Alex Johnson
            </div>
            <div style={{ color: "#6B6B9A", fontSize: 12, marginTop: 1 }}>Thursday, June 5 · Week 18</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)" }}>
              <Flame size={13} style={{ color: "#F59E0B" }} />
              <span style={{ color: "#F59E0B", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>23</span>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
            >
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>AJ</span>
            </div>
          </div>
        </div>

        {/* AI Readiness Score */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 50%, rgba(139,92,246,0.08) 100%)",
            border: "1px solid rgba(16,185,129,0.2)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <div style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                AI Readiness Score
              </div>
              <div style={{ color: "#EEEEFF", fontSize: 15, marginTop: 4, maxWidth: 200 }}>
                Your body is <span style={{ color: scoreColor, fontWeight: 700 }}>primed</span> for a heavy training session today.
              </div>
            </div>
            <CircularProgress value={readinessScore} max={100} size={90} strokeWidth={7} color={scoreColor}>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: scoreColor, fontSize: 22, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                  {readinessScore}
                </div>
                <div style={{ color: "#6B6B9A", fontSize: 10 }}>/ 100</div>
              </div>
            </CircularProgress>
          </div>
          <div className="flex gap-2">
            {["Sleep 8.2h", "HRV 68ms", "Resting HR 52"].map((tag) => (
              <div
                key={tag}
                className="px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(255,255,255,0.07)", color: "#A0A0C8", fontSize: 11, fontWeight: 600 }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Macro Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Today's Nutrition</h3>
            <span style={{ color: "#3B82F6", fontSize: 13, fontWeight: 600 }}>2,200 kcal goal</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MacroCard label="Calories" current={1680} goal={2200} unit="kcal" color="#F59E0B" emoji="🔥" />
            <MacroCard label="Protein" current={142} goal={175} unit="g" color="#3B82F6" emoji="💪" />
            <MacroCard label="Carbs" current={196} goal={260} unit="g" color="#8B5CF6" emoji="🌾" />
            <MacroCard label="Fat" current={52} goal={73} unit="g" color="#10B981" emoji="🥑" />
          </div>
        </div>

        {/* Recovery */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Recovery</h3>
            <span style={{ color: "#6B6B9A", fontSize: 13 }}>Last 7 days</span>
          </div>
          <GlassCard>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { icon: Moon, label: "Sleep", value: "8.2h", color: "#8B5CF6", sub: "Excellent" },
                { icon: Battery, label: "Energy", value: "78%", color: "#F59E0B", sub: "High" },
                { icon: Brain, label: "Stress", value: "Low", color: "#10B981", sub: "Optimal" },
              ].map(({ icon: Icon, label, value, color, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon size={18} style={{ color }} />
                  <div style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                    {value}
                  </div>
                  <div style={{ color: "#6B6B9A", fontSize: 11 }}>{label}</div>
                  <div style={{ color, fontSize: 10, fontWeight: 600 }}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 60 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recoveryData}>
                  <defs>
                    <linearGradient id="recovGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} fill="url(#recovGrad)" dot={false} />
                  <XAxis dataKey="day" hide />
                  <Tooltip
                    contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Workout */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Today's Workout</h3>
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
            >
              <Plus size={13} style={{ color: "#3B82F6" }} />
              <span style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600 }}>Log</span>
            </button>
          </div>
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <div style={{ color: "#EEEEFF", fontSize: 17, fontWeight: 700 }}>Upper Body Push</div>
                <div style={{ color: "#6B6B9A", fontSize: 13, marginTop: 2 }}>Chest · Shoulders · Triceps</div>
              </div>
              <div
                className="px-3 py-1.5 rounded-xl"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}
              >
                <span style={{ color: "#10B981", fontSize: 11, fontWeight: 700 }}>ACTIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: "Duration", value: "52", unit: "min" },
                { label: "Volume", value: "12,840", unit: "lbs" },
                { label: "Sets Done", value: "18", unit: "sets" },
              ].map(({ label, value, unit }) => (
                <div key={label} className="flex flex-col items-center py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ color: "#EEEEFF", fontSize: 18, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ color: "#6B6B9A", fontSize: 10, marginTop: 2 }}>{unit}</div>
                  <div style={{ color: "#6B6B9A", fontSize: 10, marginTop: 1 }}>{label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Meals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Meal Log</h3>
            <span style={{ color: "#6B6B9A", fontSize: 13 }}>1,680 / 2,200 kcal</span>
          </div>
          <div className="flex flex-col gap-2">
            {meals.map((meal) => (
              <GlassCard key={meal.id} className="cursor-pointer" style={{ padding: 16 }}>
                <button
                  onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        {meal.emoji}
                      </div>
                      <div>
                        <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 15 }}>{meal.name}</div>
                        <div style={{ color: "#6B6B9A", fontSize: 12 }}>{meal.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div style={{ color: "#EEEEFF", fontWeight: 700, fontSize: 15, fontFamily: "JetBrains Mono, monospace" }}>
                        {meal.calories} kcal
                      </div>
                      <div style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600 }}>{meal.protein}g protein</div>
                    </div>
                  </div>
                  {expandedMeal === meal.id && (
                    <div className="mt-3 flex flex-col gap-1.5">
                      {meal.foods.map((food, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#3B82F6", flexShrink: 0 }} />
                          <span style={{ color: "#A0A0C8", fontSize: 13 }}>{food}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>AI Insights</h3>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)" }}>
                <Zap size={16} style={{ color: "#8B5CF6" }} />
              </div>
              <div style={{ color: "#EEEEFF", fontWeight: 700, fontSize: 16 }}>PeakTrack AI Analysis</div>
            </div>

            <p style={{ color: "#A0A0C8", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              You've maintained an average protein intake of <span style={{ color: "#3B82F6", fontWeight: 700 }}>168g/day</span> this week — 96% of your target. Sleep consistency is improving your recovery scores.
            </p>

            <div className="flex flex-col gap-3">
              <div>
                <div style={{ color: "#10B981", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                  ✓ Strengths
                </div>
                <div className="flex flex-col gap-2">
                  {["Protein targets consistently hit", "Sleep duration improved +18%", "Workout volume trending up"].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: "#10B981" }} />
                      <span style={{ color: "#A0A0C8", fontSize: 13 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                  ↑ Areas to Improve
                </div>
                <div className="flex flex-col gap-2">
                  {["Carbohydrate intake 18% below target", "Vitamin D supplementation timing", "Add 1 more rest day per week"].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: "#F59E0B" }} />
                      <span style={{ color: "#A0A0C8", fontSize: 13 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
