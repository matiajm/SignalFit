import { useState } from "react";
import { Battery, Brain, Flame, Moon, Plus, Zap } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { calculateReadiness, formatDate, nutritionGoals } from "../data/metrics";
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

const scoreColorFor = (score: number) => {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
};

function MacroCard({
  label,
  current,
  goal,
  unit,
  color,
}: {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 700 }}>{label}</span>
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
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#EEEEFF",
          fontFamily: "JetBrains Mono, monospace",
          lineHeight: 1,
        }}
      >
        {current.toLocaleString()}
        <span style={{ fontSize: 13, fontWeight: 500, color: "#6B6B9A", marginLeft: 3 }}>{unit}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div style={{ color: "#6B6B9A", fontSize: 12 }}>Goal {goal.toLocaleString()}{unit}</div>
    </GlassCard>
  );
}

export function Dashboard() {
  const { data, loading, error } = useSignalFitData();
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const readinessScore = calculateReadiness(data);
  const scoreColor = scoreColorFor(readinessScore);
  const dateLabel = formatDate(data.checkinDate);
  const sourceLabel = loading ? "Loading Supabase" : error ? "Local demo fallback" : data.source === "supabase" ? "Supabase live data" : "Local demo data";
  const activeMeals = data.meals.filter((meal) => meal.items.length > 0);
  const initials = data.profileName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const workoutTitle = data.exercises[0]?.name ?? data.training.type ?? "No workout logged";
  const muscleGroups = data.training.muscleGroups.length ? data.training.muscleGroups.join(" - ") : "No muscle groups logged";

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(160deg, #07070F 0%, #0D0820 50%, #070F1A 100%)" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 15% 5%, rgba(59,130,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 85% 15%, rgba(139,92,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 30% 20% at 50% 90%, rgba(16,185,129,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-5 px-5 pt-14 pb-32">
        <div className="flex items-center justify-between">
          <div>
            <div style={{ color: "#6B6B9A", fontSize: 13, fontWeight: 500 }}>{sourceLabel}</div>
            <div style={{ color: "#EEEEFF", fontSize: 22, fontWeight: 800, fontFamily: "Outfit, sans-serif", lineHeight: 1.2, marginTop: 2 }}>
              {data.profileName}
            </div>
            <div style={{ color: "#6B6B9A", fontSize: 12, marginTop: 1 }}>{dateLabel}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)" }}>
              <Flame size={13} style={{ color: "#F59E0B" }} />
              <span style={{ color: "#F59E0B", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{activeMeals.length}</span>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>{initials}</span>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 50%, rgba(139,92,246,0.08) 100%)",
            border: "1px solid rgba(16,185,129,0.2)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center justify-between mb-5 gap-5">
            <div>
              <div style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Readiness Score
              </div>
              <div style={{ color: "#EEEEFF", fontSize: 15, marginTop: 4, maxWidth: 220, lineHeight: 1.45 }}>{data.insight.summary}</div>
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
          <div className="flex gap-2 flex-wrap">
            {[`Sleep ${data.sleepHours}h`, `Energy ${data.energy ?? "n/a"}`, `Stress ${data.stress ?? "n/a"}`].map((tag) => (
              <div key={tag} className="px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.07)", color: "#A0A0C8", fontSize: 11, fontWeight: 600 }}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Today's Nutrition</h3>
            <span style={{ color: "#3B82F6", fontSize: 13, fontWeight: 600 }}>{nutritionGoals.calories.toLocaleString()} kcal goal</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MacroCard label="Calories" current={Math.round(data.nutrition.calories)} goal={nutritionGoals.calories} unit="kcal" color="#F59E0B" />
            <MacroCard label="Protein" current={Math.round(data.nutrition.proteinG)} goal={nutritionGoals.proteinG} unit="g" color="#3B82F6" />
            <MacroCard label="Carbs" current={Math.round(data.nutrition.carbsG)} goal={nutritionGoals.carbsG} unit="g" color="#8B5CF6" />
            <MacroCard label="Fat" current={Math.round(data.nutrition.fatG)} goal={nutritionGoals.fatG} unit="g" color="#10B981" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Recovery</h3>
            <span style={{ color: "#6B6B9A", fontSize: 13 }}>Current check-in</span>
          </div>
          <GlassCard>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { icon: Moon, label: "Sleep", value: `${data.sleepHours}h`, color: "#8B5CF6", sub: data.sleepQuality ?? "Logged" },
                { icon: Battery, label: "Energy", value: data.energy ?? "n/a", color: "#F59E0B", sub: "Check-in" },
                { icon: Brain, label: "Stress", value: data.stress ?? "n/a", color: "#10B981", sub: "Check-in" },
              ].map(({ icon: Icon, label, value, color, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon size={18} style={{ color }} />
                  <div style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", textTransform: "capitalize" }}>{value}</div>
                  <div style={{ color: "#6B6B9A", fontSize: 11 }}>{label}</div>
                  <div style={{ color, fontSize: 10, fontWeight: 600, textTransform: "capitalize" }}>{sub}</div>
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
                  <Tooltip contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Today's Workout</h3>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}>
              <Plus size={13} style={{ color: "#3B82F6" }} />
              <span style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600 }}>Log</span>
            </button>
          </div>
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <div style={{ color: "#EEEEFF", fontSize: 17, fontWeight: 700 }}>{workoutTitle}</div>
                <div style={{ color: "#6B6B9A", fontSize: 13, marginTop: 2 }}>{muscleGroups}</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}>
                <span style={{ color: "#10B981", fontSize: 11, fontWeight: 700 }}>{data.training.trained ? "LOGGED" : "REST"}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: "Duration", value: data.training.durationMin || 0, unit: "min" },
                { label: "Volume", value: Math.round(data.training.totalVolumeLb).toLocaleString(), unit: "lbs" },
                { label: "Sets Done", value: data.training.totalSets, unit: "sets" },
              ].map(({ label, value, unit }) => (
                <div key={label} className="flex flex-col items-center py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ color: "#EEEEFF", fontSize: 18, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{value}</div>
                  <div style={{ color: "#6B6B9A", fontSize: 10, marginTop: 2 }}>{unit}</div>
                  <div style={{ color: "#6B6B9A", fontSize: 10, marginTop: 1 }}>{label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Meal Log</h3>
            <span style={{ color: "#6B6B9A", fontSize: 13 }}>
              {Math.round(data.nutrition.calories).toLocaleString()} / {nutritionGoals.calories.toLocaleString()} kcal
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {data.meals.map((meal) => (
              <GlassCard key={meal.id} className="cursor-pointer" style={{ padding: 16 }}>
                <button onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)} className="w-full text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: "rgba(255,255,255,0.05)", color: "#EEEEFF", fontWeight: 800 }}>
                        {meal.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 15, textTransform: "capitalize" }}>{meal.name.replaceAll("_", " ")}</div>
                        <div style={{ color: "#6B6B9A", fontSize: 12 }}>{meal.items.length} items</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div style={{ color: "#EEEEFF", fontWeight: 700, fontSize: 15, fontFamily: "JetBrains Mono, monospace" }}>{Math.round(meal.calories)} kcal</div>
                      <div style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600 }}>{Math.round(meal.proteinG)}g protein</div>
                    </div>
                  </div>
                  {expandedMeal === meal.id && (
                    <div className="mt-3 flex flex-col gap-1.5">
                      {meal.items.length === 0 ? (
                        <span style={{ color: "#A0A0C8", fontSize: 13 }}>No food logged</span>
                      ) : (
                        meal.items.map((food) => (
                          <div key={food.id} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#3B82F6", flexShrink: 0 }} />
                            <span style={{ color: "#A0A0C8", fontSize: 13 }}>{food.description} {food.quantity ? `(${food.quantity})` : ""}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </button>
              </GlassCard>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>AI Insights</h3>
          <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)" }}>
                <Zap size={16} style={{ color: "#8B5CF6" }} />
              </div>
              <div style={{ color: "#EEEEFF", fontWeight: 700, fontSize: 16 }}>SignalFit AI Analysis</div>
            </div>
            <p style={{ color: "#A0A0C8", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{data.insight.summary}</p>
            <div className="flex flex-col gap-3">
              <div>
                <div style={{ color: "#10B981", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Wins</div>
                <div className="flex flex-col gap-2">
                  {data.insight.wins.map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: "#10B981" }} />
                      <span style={{ color: "#A0A0C8", fontSize: 13 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Next</div>
                <div className="flex flex-col gap-2">
                  {data.insight.next.map((s) => (
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
