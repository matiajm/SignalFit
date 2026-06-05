import { useState } from "react";
import { Plus, Check, ChevronDown, ChevronUp, Dumbbell, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
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

const strengthData = [
  { week: "W1", weight: 185 },
  { week: "W2", weight: 190 },
  { week: "W3", weight: 190 },
  { week: "W4", weight: 195 },
  { week: "W5", weight: 200 },
  { week: "W6", weight: 205 },
  { week: "W7", weight: 205 },
  { week: "W8", weight: 215 },
];

const volumeData = [
  { day: "Mon", volume: 8200 },
  { day: "Tue", volume: 0 },
  { day: "Wed", volume: 9600 },
  { day: "Thu", volume: 12840 },
  { day: "Fri", volume: 0 },
  { day: "Sat", volume: 7400 },
  { day: "Sun", volume: 0 },
];

interface Set {
  set: number;
  weight: string;
  reps: string;
  rpe: string;
  done: boolean;
}

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  sets: Set[];
  expanded: boolean;
}

const initialExercises: Exercise[] = [
  {
    id: "bench",
    name: "Barbell Bench Press",
    muscle: "Chest",
    equipment: "Barbell",
    expanded: true,
    sets: [
      { set: 1, weight: "185", reps: "8", rpe: "7", done: true },
      { set: 2, weight: "205", reps: "6", rpe: "8", done: true },
      { set: 3, weight: "215", reps: "5", rpe: "9", done: true },
      { set: 4, weight: "215", reps: "4", rpe: "9.5", done: false },
    ],
  },
  {
    id: "ohp",
    name: "Overhead Press",
    muscle: "Shoulders",
    equipment: "Barbell",
    expanded: false,
    sets: [
      { set: 1, weight: "115", reps: "8", rpe: "7", done: true },
      { set: 2, weight: "125", reps: "6", rpe: "8.5", done: true },
      { set: 3, weight: "125", reps: "5", rpe: "9", done: false },
    ],
  },
  {
    id: "incline",
    name: "Incline Dumbbell Press",
    muscle: "Upper Chest",
    equipment: "Dumbbells",
    expanded: false,
    sets: [
      { set: 1, weight: "65", reps: "10", rpe: "7", done: true },
      { set: 2, weight: "70", reps: "8", rpe: "8", done: false },
      { set: 3, weight: "70", reps: "8", rpe: "8.5", done: false },
    ],
  },
  {
    id: "tricep",
    name: "Tricep Rope Pushdown",
    muscle: "Triceps",
    equipment: "Cable",
    expanded: false,
    sets: [
      { set: 1, weight: "45", reps: "12", rpe: "7", done: false },
      { set: 2, weight: "45", reps: "12", rpe: "8", done: false },
      { set: 3, weight: "50", reps: "10", rpe: "8.5", done: false },
    ],
  },
];

const muscleColors: Record<string, string> = {
  Chest: "#3B82F6",
  Shoulders: "#8B5CF6",
  "Upper Chest": "#06B6D4",
  Triceps: "#10B981",
};

export function WorkoutPage() {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [chartTab, setChartTab] = useState<"strength" | "volume">("strength");

  const totalSets = exercises.reduce((acc, e) => acc + e.sets.filter((s) => s.done).length, 0);
  const totalReps = exercises.reduce(
    (acc, e) => acc + e.sets.filter((s) => s.done).reduce((a, s) => a + parseInt(s.reps || "0"), 0),
    0
  );
  const totalVolume = exercises.reduce(
    (acc, e) =>
      acc +
      e.sets.filter((s) => s.done).reduce((a, s) => a + parseFloat(s.weight || "0") * parseInt(s.reps || "0"), 0),
    0
  );

  const toggleSet = (exId: string, setIdx: number) => {
    setExercises((exs) =>
      exs.map((ex) =>
        ex.id === exId
          ? {
              ...ex,
              sets: ex.sets.map((s, i) => (i === setIdx ? { ...s, done: !s.done } : s)),
            }
          : ex
      )
    );
  };

  const toggleExpanded = (exId: string) => {
    setExercises((exs) =>
      exs.map((ex) => (ex.id === exId ? { ...ex, expanded: !ex.expanded } : ex))
    );
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(160deg, #07070F 0%, #0D0820 50%, #070F1A 100%)" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 80% 10%, rgba(59,130,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 20% 80%, rgba(139,92,246,0.06) 0%, transparent 60%)",
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
            Upper Body Push
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="px-2.5 py-1 rounded-lg" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}>
              <span style={{ color: "#3B82F6", fontSize: 11, fontWeight: 700 }}>HYPERTROPHY</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
              <span style={{ color: "#6B6B9A", fontSize: 11, fontWeight: 600 }}>52 min elapsed</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Sets Done", value: totalSets, unit: "sets", color: "#3B82F6" },
            { label: "Total Reps", value: totalReps, unit: "reps", color: "#8B5CF6" },
            { label: "Volume", value: Math.round(totalVolume).toLocaleString(), unit: "lbs", color: "#10B981" },
            { label: "Est. Calories", value: "387", unit: "kcal", color: "#F59E0B" },
          ].map(({ label, value, unit, color }) => (
            <GlassCard key={label} style={{ padding: 16 }}>
              <div style={{ color: "#6B6B9A", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {label}
              </div>
              <div
                style={{
                  color,
                  fontSize: 24,
                  fontWeight: 800,
                  fontFamily: "JetBrains Mono, monospace",
                  lineHeight: 1.1,
                  marginTop: 6,
                }}
              >
                {value}
              </div>
              <div style={{ color: "#6B6B9A", fontSize: 12, marginTop: 2 }}>{unit}</div>
            </GlassCard>
          ))}
        </div>

        {/* Exercises */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Exercises</h3>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
            >
              <Plus size={14} style={{ color: "#fff" }} />
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Add Exercise</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {exercises.map((exercise) => (
              <GlassCard key={exercise.id} style={{ padding: 0, overflow: "hidden" }}>
                <button
                  onClick={() => toggleExpanded(exercise.id)}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${muscleColors[exercise.muscle] || "#3B82F6"}22` }}
                    >
                      <Dumbbell size={18} style={{ color: muscleColors[exercise.muscle] || "#3B82F6" }} />
                    </div>
                    <div className="text-left">
                      <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 15 }}>{exercise.name}</div>
                      <div style={{ color: "#6B6B9A", fontSize: 12 }}>
                        {exercise.muscle} · {exercise.equipment}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="px-2 py-1 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <span style={{ color: "#6B6B9A", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}>
                        {exercise.sets.filter((s) => s.done).length}/{exercise.sets.length}
                      </span>
                    </div>
                    {exercise.expanded ? (
                      <ChevronUp size={16} style={{ color: "#6B6B9A" }} />
                    ) : (
                      <ChevronDown size={16} style={{ color: "#6B6B9A" }} />
                    )}
                  </div>
                </button>

                {exercise.expanded && (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {/* Table Header */}
                    <div
                      className="grid px-4 py-2"
                      style={{
                        gridTemplateColumns: "40px 1fr 1fr 1fr 44px",
                        gap: 8,
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      {["Set", "Weight", "Reps", "RPE", "✓"].map((h) => (
                        <div
                          key={h}
                          style={{
                            color: "#6B6B9A",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            textAlign: "center",
                          }}
                        >
                          {h}
                        </div>
                      ))}
                    </div>

                    {exercise.sets.map((set, idx) => (
                      <div
                        key={idx}
                        className="grid px-4 py-3 items-center"
                        style={{
                          gridTemplateColumns: "40px 1fr 1fr 1fr 44px",
                          gap: 8,
                          background: set.done ? "rgba(59,130,246,0.05)" : "transparent",
                          borderTop: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <div style={{ color: "#6B6B9A", fontSize: 13, fontWeight: 700, textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>
                          {set.set}
                        </div>
                        <div style={{ color: set.done ? "#EEEEFF" : "#A0A0C8", fontSize: 14, fontWeight: 600, textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>
                          {set.weight}<span style={{ fontSize: 10, color: "#6B6B9A" }}>lb</span>
                        </div>
                        <div style={{ color: set.done ? "#EEEEFF" : "#A0A0C8", fontSize: 14, fontWeight: 600, textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>
                          {set.reps}
                        </div>
                        <div style={{ color: set.done ? "#F59E0B" : "#6B6B9A", fontSize: 14, fontWeight: 600, textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>
                          {set.rpe}
                        </div>
                        <div className="flex justify-center">
                          <button
                            onClick={() => toggleSet(exercise.id, idx)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                            style={{
                              background: set.done
                                ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                                : "rgba(255,255,255,0.08)",
                              border: set.done ? "none" : "1px solid rgba(255,255,255,0.12)",
                            }}
                          >
                            {set.done && <Check size={14} style={{ color: "#fff" }} />}
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      className="w-full py-3 flex items-center justify-center gap-2"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <Plus size={14} style={{ color: "#3B82F6" }} />
                      <span style={{ color: "#3B82F6", fontSize: 13, fontWeight: 600 }}>Add Set</span>
                    </button>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Progress</h3>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
              {(["strength", "volume"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setChartTab(tab)}
                  className="px-3 py-1.5 rounded-lg capitalize transition-all duration-200"
                  style={{
                    background: chartTab === tab ? "rgba(59,130,246,0.3)" : "transparent",
                    color: chartTab === tab ? "#3B82F6" : "#6B6B9A",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <GlassCard>
            <div style={{ color: "#6B6B9A", fontSize: 12, marginBottom: 12 }}>
              {chartTab === "strength" ? "Bench Press 1RM Progress" : "Weekly Training Volume"}
            </div>
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
                    <YAxis domain={[175, 225]} hide />
                    <Tooltip
                      formatter={(v) => [`${v} lbs`, "Weight"]}
                      contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }}
                    />
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
                    <Tooltip
                      formatter={(v) => [`${Number(v).toLocaleString()} lbs`, "Volume"]}
                      contentStyle={{ background: "#0E0E1C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#EEEEFF", fontSize: 12 }}
                    />
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
