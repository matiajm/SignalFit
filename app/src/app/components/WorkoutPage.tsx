import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Dumbbell, Plus } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

const muscleColors: Record<string, string> = {
  chest: "#3B82F6",
  shoulders: "#8B5CF6",
  quads: "#06B6D4",
  glutes: "#10B981",
  hamstrings: "#F59E0B",
  triceps: "#10B981",
};

export function WorkoutPage() {
  const { data } = useSignalFitData();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [chartTab, setChartTab] = useState<"strength" | "volume">("strength");

  const exercises = data.exercises;
  const totalSets = data.training.totalSets || exercises.reduce((acc, e) => acc + e.sets.filter((s) => s.completed && !s.isWarmup).length, 0);
  const totalReps = data.training.totalReps || exercises.reduce((acc, e) => acc + e.sets.filter((s) => s.completed).reduce((sum, s) => sum + s.reps, 0), 0);
  const totalVolume = data.training.totalVolumeLb || exercises.reduce((acc, e) => acc + e.sets.filter((s) => s.completed && !s.isWarmup).reduce((sum, s) => sum + s.weightLb * s.reps, 0), 0);
  const volumeData = useMemo(
    () => [
      ...data.recentDays.map((day) => ({ day: day.label.slice(0, 3), volume: day.trained ? Math.round(totalVolume * 0.65) : 0 })),
      { day: "Today", volume: totalVolume },
    ],
    [data.recentDays, totalVolume],
  );
  const strengthData = exercises[0]?.sets.map((set) => ({ week: `S${set.setNumber}`, weight: set.weightLb })) ?? [];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(160deg, #07070F 0%, #0D0820 50%, #070F1A 100%)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 35% at 80% 10%, rgba(59,130,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 20% 80%, rgba(139,92,246,0.06) 0%, transparent 60%)" }} />

      <div className="relative z-10 flex flex-col gap-5 px-5 pt-14 pb-32">
        <div>
          <div style={{ color: "#6B6B9A", fontSize: 13, fontWeight: 500 }}>{data.source === "supabase" ? "Supabase workout" : "Demo workout"}</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "#EEEEFF", marginTop: 4, lineHeight: 1.2 }}>
            {data.training.type ? `${data.training.type} session` : "Workout"}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="px-2.5 py-1 rounded-lg" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}>
              <span style={{ color: "#3B82F6", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{data.training.intensity ?? "logged"}</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
              <span style={{ color: "#6B6B9A", fontSize: 11, fontWeight: 600 }}>{data.training.durationMin} min</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Sets Done", value: totalSets, unit: "sets", color: "#3B82F6" },
            { label: "Total Reps", value: totalReps, unit: "reps", color: "#8B5CF6" },
            { label: "Volume", value: Math.round(totalVolume).toLocaleString(), unit: "lbs", color: "#10B981" },
            { label: "Soreness", value: data.training.soreness ?? 0, unit: "/5", color: "#F59E0B" },
          ].map(({ label, value, unit, color }) => (
            <GlassCard key={label} style={{ padding: 16 }}>
              <div style={{ color: "#6B6B9A", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
              <div style={{ color, fontSize: 24, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.1, marginTop: 6 }}>{value}</div>
              <div style={{ color: "#6B6B9A", fontSize: 12, marginTop: 2 }}>{unit}</div>
            </GlassCard>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Exercises</h3>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
              <Plus size={14} style={{ color: "#fff" }} />
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Add Exercise</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {exercises.map((exercise, index) => {
              const isExpanded = expanded[exercise.id] ?? index === 0;
              const color = muscleColors[exercise.muscleGroup.toLowerCase()] ?? "#3B82F6";
              return (
                <GlassCard key={exercise.id} style={{ padding: 0, overflow: "hidden" }}>
                  <button onClick={() => setExpanded((current) => ({ ...current, [exercise.id]: !isExpanded }))} className="w-full flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
                        <Dumbbell size={18} style={{ color }} />
                      </div>
                      <div className="text-left">
                        <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 15 }}>{exercise.name}</div>
                        <div style={{ color: "#6B6B9A", fontSize: 12 }}>{exercise.muscleGroup} - {exercise.equipment}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <span style={{ color: "#6B6B9A", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}>{exercise.sets.filter((s) => s.completed).length}/{exercise.sets.length}</span>
                      </div>
                      {isExpanded ? <ChevronUp size={16} style={{ color: "#6B6B9A" }} /> : <ChevronDown size={16} style={{ color: "#6B6B9A" }} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="grid px-4 py-2" style={{ gridTemplateColumns: "40px 1fr 1fr 1fr 44px", gap: 8, background: "rgba(255,255,255,0.02)" }}>
                        {["Set", "Weight", "Reps", "RPE", "Done"].map((h) => (
                          <div key={h} style={{ color: "#6B6B9A", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center" }}>{h}</div>
                        ))}
                      </div>
                      {exercise.sets.map((set) => (
                        <div key={set.id} className="grid px-4 py-3 items-center" style={{ gridTemplateColumns: "40px 1fr 1fr 1fr 44px", gap: 8, background: set.completed ? "rgba(59,130,246,0.05)" : "transparent", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ color: "#6B6B9A", fontSize: 13, fontWeight: 700, textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>{set.setNumber}</div>
                          <div style={{ color: set.completed ? "#EEEEFF" : "#A0A0C8", fontSize: 14, fontWeight: 600, textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>{set.weightLb}<span style={{ fontSize: 10, color: "#6B6B9A" }}>lb</span></div>
                          <div style={{ color: set.completed ? "#EEEEFF" : "#A0A0C8", fontSize: 14, fontWeight: 600, textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>{set.reps}</div>
                          <div style={{ color: set.completed ? "#F59E0B" : "#6B6B9A", fontSize: 14, fontWeight: 600, textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>{set.rpe ?? "-"}</div>
                          <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: set.completed ? "linear-gradient(135deg, #3B82F6, #8B5CF6)" : "rgba(255,255,255,0.08)", border: set.completed ? "none" : "1px solid rgba(255,255,255,0.12)" }}>
                              {set.completed && <Check size={14} style={{ color: "#fff" }} />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Progress</h3>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
              {(["strength", "volume"] as const).map((tab) => (
                <button key={tab} onClick={() => setChartTab(tab)} className="px-3 py-1.5 rounded-lg capitalize transition-all duration-200" style={{ background: chartTab === tab ? "rgba(59,130,246,0.3)" : "transparent", color: chartTab === tab ? "#3B82F6" : "#6B6B9A", fontSize: 12, fontWeight: 600 }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <GlassCard>
            <div style={{ color: "#6B6B9A", fontSize: 12, marginBottom: 12 }}>{chartTab === "strength" ? `${exercises[0]?.name ?? "Exercise"} sets` : "Training volume"}</div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                {chartTab === "strength" ? (
                  <AreaChart data={strengthData}>
                    <defs>
                      <linearGradient id="strGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2.5} fill="url(#strGrad)" dot={{ fill: "#3B82F6", r: 4, strokeWidth: 0 }} />
                    <XAxis dataKey="week" tick={{ fill: "#6B6B9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v) => [`${v} lbs`, "Weight"]} contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }} />
                  </AreaChart>
                ) : (
                  <BarChart data={volumeData} barSize={24}>
                    <Bar dataKey="volume" fill="url(#volGrad)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: "#6B6B9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} lbs`, "Volume"]} contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
