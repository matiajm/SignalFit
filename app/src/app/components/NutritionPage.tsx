import { useMemo, useState } from "react";
import { Camera, Minus, Plus, Search } from "lucide-react";

import { nutritionGoals, statusFromRatio } from "../data/metrics";
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

const statusColors: Record<string, string> = {
  green: "#10B981",
  yellow: "#F59E0B",
  red: "#EF4444",
};

function MacroRing({
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
  return (
    <div className="flex flex-col items-center gap-2">
      <CircularProgress value={current} max={goal} size={82} strokeWidth={7} color={color}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#EEEEFF", fontSize: 14, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
            {Math.round(current)}
          </div>
          <div style={{ color: "#6B6B9A", fontSize: 9 }}>{unit}</div>
        </div>
      </CircularProgress>
      <div style={{ color: "#A0A0C8", fontSize: 12, fontWeight: 600 }}>{label}</div>
      <div style={{ color: "#6B6B9A", fontSize: 10 }}>/{goal}{unit}</div>
    </div>
  );
}

export function NutritionPage() {
  const { data } = useSignalFitData();
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [serving, setServing] = useState(1);
  const remainingCalories = Math.max(0, nutritionGoals.calories - data.nutrition.calories);
  const caloriePct = Math.round(Math.min((data.nutrition.calories / nutritionGoals.calories) * 100, 100));

  const recentFoods = useMemo(
    () =>
      data.meals
        .flatMap((meal) => meal.items)
        .map((item) => ({ name: item.description, cal: item.calories, protein: item.proteinG })),
    [data.meals],
  );
  const filtered = recentFoods.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const micronutrients = [
    { name: "Vitamin D", current: data.nutrition.vitaminDIu, goal: nutritionGoals.vitaminDIu, unit: "IU" },
    { name: "Iron", current: data.nutrition.ironMg, goal: nutritionGoals.ironMg, unit: "mg" },
    { name: "Magnesium", current: data.nutrition.magnesiumMg, goal: nutritionGoals.magnesiumMg, unit: "mg" },
    { name: "Calcium", current: data.nutrition.calciumMg, goal: nutritionGoals.calciumMg, unit: "mg" },
    { name: "Vitamin B12", current: data.nutrition.vitaminB12Mcg, goal: nutritionGoals.vitaminB12Mcg, unit: "mcg" },
    { name: "Vitamin C", current: data.nutrition.vitaminCMg, goal: nutritionGoals.vitaminCMg, unit: "mg" },
    { name: "Potassium", current: data.nutrition.potassiumMg, goal: nutritionGoals.potassiumMg, unit: "mg" },
    { name: "Zinc", current: data.nutrition.zincMg, goal: nutritionGoals.zincMg, unit: "mg" },
  ].map((micro) => ({ ...micro, status: statusFromRatio(micro.current, micro.goal) }));

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(160deg, #07070F 0%, #0D0820 50%, #070F1A 100%)" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 30% 5%, rgba(16,185,129,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 70% 80%, rgba(59,130,246,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-5 px-5 pt-14 pb-32">
        <div>
          <div style={{ color: "#6B6B9A", fontSize: 13, fontWeight: 500 }}>{data.source === "supabase" ? "Supabase nutrition" : "Demo nutrition"}</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "#EEEEFF", marginTop: 4, lineHeight: 1.2 }}>
            Nutrition
          </h1>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Calories Today</div>
              <div style={{ color: "#EEEEFF", marginTop: 4, display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{Math.round(data.nutrition.calories).toLocaleString()}</span>
                <span style={{ color: "#6B6B9A", fontSize: 16 }}>/ {nutritionGoals.calories.toLocaleString()}</span>
              </div>
              <div style={{ color: "#10B981", fontSize: 13, fontWeight: 600, marginTop: 4 }}>{Math.round(remainingCalories).toLocaleString()} kcal remaining</div>
            </div>
            <CircularProgress value={data.nutrition.calories} max={nutritionGoals.calories} size={80} strokeWidth={7} color="#10B981">
              <div style={{ color: "#10B981", fontSize: 16, fontWeight: 800, fontFamily: "JetBrains Mono, monospace" }}>{caloriePct}%</div>
            </CircularProgress>
          </div>
          <div className="flex gap-4">
            {data.meals.map((meal) => (
              <div key={meal.id} className="flex flex-col items-center gap-1 flex-1">
                <div style={{ color: "#3B82F6", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{Math.round(meal.calories)}</div>
                <div style={{ color: "#6B6B9A", fontSize: 10, textTransform: "capitalize" }}>{meal.name.replaceAll("_", " ")}</div>
              </div>
            ))}
          </div>
        </div>

        <GlassCard>
          <div style={{ color: "#EEEEFF", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Macronutrients</div>
          <div className="flex justify-around">
            <MacroRing label="Protein" current={data.nutrition.proteinG} goal={nutritionGoals.proteinG} unit="g" color="#3B82F6" />
            <MacroRing label="Carbs" current={data.nutrition.carbsG} goal={nutritionGoals.carbsG} unit="g" color="#8B5CF6" />
            <MacroRing label="Fat" current={data.nutrition.fatG} goal={nutritionGoals.fatG} unit="g" color="#F59E0B" />
            <MacroRing label="Fiber" current={data.nutrition.fiberG} goal={nutritionGoals.fiberG} unit="g" color="#10B981" />
          </div>
        </GlassCard>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700 }}>Micronutrients</h3>
            <div className="flex gap-2">
              {[
                { color: "#10B981", label: "Met" },
                { color: "#F59E0B", label: "Near" },
                { color: "#EF4444", label: "Low" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span style={{ color: "#6B6B9A", fontSize: 10, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <GlassCard style={{ padding: 0 }}>
            {micronutrients.map((micro, idx) => {
              const pct = Math.min((micro.current / micro.goal) * 100, 100);
              const color = statusColors[micro.status];
              return (
                <div key={micro.name} className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: idx < micronutrients.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span style={{ color: "#EEEEFF", fontSize: 14, fontWeight: 600 }}>{micro.name}</span>
                      <span style={{ color, fontSize: 12, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                        {Math.round(micro.current)}/{micro.goal}{micro.unit}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </GlassCard>
        </div>

        <div>
          <h3 style={{ color: "#EEEEFF", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Logged Foods</h3>
          <div className="relative mb-3">
            <Search size={16} style={{ color: "#6B6B9A", position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logged food..."
              className="w-full pl-10 pr-12 py-3.5 rounded-2xl outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#EEEEFF", fontSize: 14 }}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.2)" }}>
              <Camera size={14} style={{ color: "#3B82F6" }} />
            </button>
          </div>

          <GlassCard style={{ padding: 0 }}>
            <div style={{ color: "#6B6B9A", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "14px 20px 10px" }}>
              {search ? "Search Results" : "Foods From Current Day"}
            </div>
            {filtered.map((food, idx) => (
              <button key={`${food.name}-${idx}`} onClick={() => setSelectedFood(selectedFood === food.name ? null : food.name)} className="w-full text-left">
                <div className="flex items-center justify-between px-5 py-3.5 transition-all duration-200" style={{ borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.05)" : "none", background: selectedFood === food.name ? "rgba(59,130,246,0.08)" : "transparent" }}>
                  <div>
                    <div style={{ color: "#EEEEFF", fontSize: 14, fontWeight: 600 }}>{food.name}</div>
                    <div style={{ color: "#6B6B9A", fontSize: 12, marginTop: 1 }}>{Math.round(food.cal)} kcal - {Math.round(food.protein)}g protein</div>
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: selectedFood === food.name ? "linear-gradient(135deg, #3B82F6, #8B5CF6)" : "rgba(255,255,255,0.08)" }}>
                    <Plus size={16} style={{ color: selectedFood === food.name ? "#fff" : "#6B6B9A" }} />
                  </div>
                </div>

                {selectedFood === food.name && (
                  <div className="px-5 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ color: "#6B6B9A", fontSize: 12, marginBottom: 10, marginTop: 12 }}>Serving preview</div>
                    <div className="flex items-center gap-4">
                      <button onClick={(e) => { e.stopPropagation(); setServing((s) => Math.max(0.5, s - 0.5)); }} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <Minus size={16} style={{ color: "#EEEEFF" }} />
                      </button>
                      <div className="flex-1 text-center">
                        <div style={{ color: "#EEEEFF", fontSize: 22, fontWeight: 800, fontFamily: "JetBrains Mono, monospace" }}>{serving}x</div>
                        <div style={{ color: "#6B6B9A", fontSize: 12 }}>{Math.round(food.cal * serving)} kcal - {Math.round(food.protein * serving)}g protein</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setServing((s) => s + 0.5); }} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <Plus size={16} style={{ color: "#EEEEFF" }} />
                      </button>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
