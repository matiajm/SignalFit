import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Check, Zap, Flame, Smile, Heart, Shield, Dumbbell } from "lucide-react";

interface OnboardingData {
  goals: string[];
  experience: string;
  weight: string;
  weightUnit: string;
  age: string;
  height: string;
  activityLevel: string;
  supplements: string[];
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const GOALS = [
  { id: "muscle", label: "Build Muscle", emoji: "💪", color: "#3B82F6", desc: "Gain strength & size" },
  { id: "fat", label: "Lose Fat", emoji: "🔥", color: "#EF4444", desc: "Burn body fat" },
  { id: "performance", label: "Improve Performance", emoji: "⚡", color: "#F59E0B", desc: "Athletic optimization" },
  { id: "feel", label: "Feel Better", emoji: "😊", color: "#10B981", desc: "Boost energy & mood" },
  { id: "health", label: "Maintain Health", emoji: "❤️", color: "#EC4899", desc: "Long-term wellness" },
];

const EXPERIENCE = [
  { id: "beginner", label: "Beginner", desc: "Less than 1 year of training", icon: "🌱" },
  { id: "intermediate", label: "Intermediate", desc: "1–3 years of consistent training", icon: "🔥" },
  { id: "advanced", label: "Advanced", desc: "3+ years, competitive mindset", icon: "⚡" },
];

const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
  { id: "light", label: "Lightly Active", desc: "1–3 days/week" },
  { id: "moderate", label: "Moderately Active", desc: "3–5 days/week" },
  { id: "very", label: "Very Active", desc: "6–7 days/week" },
  { id: "extreme", label: "Extremely Active", desc: "2x/day, intense" },
];

const SUPPLEMENTS = [
  { id: "creatine", label: "Creatine", emoji: "💊", color: "#3B82F6" },
  { id: "protein", label: "Protein Powder", emoji: "🥤", color: "#8B5CF6" },
  { id: "vitd", label: "Vitamin D", emoji: "☀️", color: "#F59E0B" },
  { id: "mag", label: "Magnesium", emoji: "🧲", color: "#10B981" },
  { id: "caffeine", label: "Caffeine", emoji: "☕", color: "#EC4899" },
  { id: "omega3", label: "Omega-3", emoji: "🐟", color: "#06B6D4" },
  { id: "zinc", label: "Zinc", emoji: "⚗️", color: "#F97316" },
  { id: "other", label: "Other", emoji: "➕", color: "#6B7280" },
];

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
      backdropFilter: "blur(12px)",
      ...style,
    }}
  >
    {children}
  </div>
);

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    experience: "",
    weight: "175",
    weightUnit: "lbs",
    age: "28",
    height: "5'11\"",
    activityLevel: "moderate",
    supplements: ["creatine", "protein"],
  });

  const totalSteps = 6;

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const toggleGoal = (id: string) => {
    setData((d) => ({
      ...d,
      goals: d.goals.includes(id) ? d.goals.filter((g) => g !== id) : [...d.goals, id],
    }));
  };

  const toggleSupplement = (id: string) => {
    setData((d) => ({
      ...d,
      supplements: d.supplements.includes(id)
        ? d.supplements.filter((s) => s !== id)
        : [...d.supplements, id],
    }));
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

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
            "radial-gradient(ellipse 60% 40% at 20% 10%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Progress bar */}
      {step > 0 && step < 5 && (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-12 pb-4">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                    width: step >= i ? "100%" : "0%",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 flex flex-col px-6 pt-16 pb-6 overflow-y-auto"
            style={{ minHeight: "100vh" }}
          >
            {/* STEP 0: Welcome */}
            {step === 0 && (
              <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6 -mt-16">
                <div
                  className="relative w-48 h-48 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)",
                  }}
                >
                  <div
                    className="absolute w-32 h-32 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))",
                      filter: "blur(20px)",
                    }}
                  />
                  <div className="relative text-7xl">🏋️</div>
                </div>

                <div>
                  <div
                    className="text-sm mb-3 tracking-widest uppercase"
                    style={{ color: "#3B82F6", fontFamily: "Outfit, sans-serif", fontWeight: 600 }}
                  >
                    PeakTrack AI
                  </div>
                  <h1
                    style={{
                      fontSize: 36,
                      fontWeight: 800,
                      lineHeight: 1.1,
                      letterSpacing: "-0.03em",
                      fontFamily: "Outfit, sans-serif",
                      background: "linear-gradient(135deg, #EEEEFF 0%, #A0A0C8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Optimize Your Body Every Day
                  </h1>
                </div>

                <p style={{ color: "#6B6B9A", fontSize: 16, lineHeight: 1.6, maxWidth: 300 }}>
                  AI-powered tracking for fitness, nutrition, and recovery — personalized to you.
                </p>

                <div className="flex flex-col gap-3 w-full mt-4">
                  <GlassCard className="flex items-center gap-3">
                    <div className="text-2xl">🤖</div>
                    <div>
                      <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 14 }}>AI Readiness Score</div>
                      <div style={{ color: "#6B6B9A", fontSize: 12 }}>Daily insights from your data</div>
                    </div>
                  </GlassCard>
                  <GlassCard className="flex items-center gap-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 14 }}>Smart Nutrition Tracking</div>
                      <div style={{ color: "#6B6B9A", fontSize: 12 }}>Macros, micros, and meal timing</div>
                    </div>
                  </GlassCard>
                  <GlassCard className="flex items-center gap-3">
                    <div className="text-2xl">💤</div>
                    <div>
                      <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 14 }}>Recovery Intelligence</div>
                      <div style={{ color: "#6B6B9A", fontSize: 12 }}>WHOOP-inspired recovery metrics</div>
                    </div>
                  </GlassCard>
                </div>

                <button
                  onClick={goNext}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mt-4"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 17,
                    fontFamily: "Outfit, sans-serif",
                    boxShadow: "0 8px 32px rgba(59,130,246,0.35)",
                  }}
                >
                  Get Started
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* STEP 1: Goals */}
            {step === 1 && (
              <div className="flex flex-col gap-6 pt-8">
                <div>
                  <div style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Step 1 of 4
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "#EEEEFF", marginTop: 8, lineHeight: 1.2 }}>
                    What are your goals?
                  </h2>
                  <p style={{ color: "#6B6B9A", marginTop: 6, fontSize: 15 }}>Select all that apply</p>
                </div>

                <div className="flex flex-col gap-3">
                  {GOALS.map((goal) => {
                    const selected = data.goals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                        style={{
                          background: selected
                            ? `linear-gradient(135deg, ${goal.color}22, ${goal.color}11)`
                            : "rgba(255,255,255,0.03)",
                          border: selected
                            ? `1.5px solid ${goal.color}55`
                            : "1.5px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: selected ? `${goal.color}22` : "rgba(255,255,255,0.05)" }}
                        >
                          {goal.emoji}
                        </div>
                        <div className="flex-1">
                          <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 16 }}>{goal.label}</div>
                          <div style={{ color: "#6B6B9A", fontSize: 13, marginTop: 2 }}>{goal.desc}</div>
                        </div>
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: selected ? goal.color : "rgba(255,255,255,0.08)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {selected && <Check size={14} color="#fff" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goNext}
                  disabled={data.goals.length === 0}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mt-2"
                  style={{
                    background:
                      data.goals.length > 0
                        ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                        : "rgba(255,255,255,0.06)",
                    color: data.goals.length > 0 ? "#fff" : "#6B6B9A",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "Outfit, sans-serif",
                    boxShadow: data.goals.length > 0 ? "0 8px 32px rgba(59,130,246,0.3)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 2: Experience */}
            {step === 2 && (
              <div className="flex flex-col gap-6 pt-8">
                <div>
                  <div style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Step 2 of 4
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "#EEEEFF", marginTop: 8, lineHeight: 1.2 }}>
                    Your experience level
                  </h2>
                  <p style={{ color: "#6B6B9A", marginTop: 6, fontSize: 15 }}>Helps us personalize your plan</p>
                </div>

                <div className="flex flex-col gap-3">
                  {EXPERIENCE.map((exp) => {
                    const selected = data.experience === exp.id;
                    return (
                      <button
                        key={exp.id}
                        onClick={() => setData((d) => ({ ...d, experience: exp.id }))}
                        className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200"
                        style={{
                          background: selected
                            ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))"
                            : "rgba(255,255,255,0.03)",
                          border: selected
                            ? "1.5px solid rgba(59,130,246,0.45)"
                            : "1.5px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="text-3xl">{exp.icon}</div>
                        <div className="flex-1">
                          <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 17 }}>{exp.label}</div>
                          <div style={{ color: "#6B6B9A", fontSize: 13, marginTop: 3 }}>{exp.desc}</div>
                        </div>
                        <div
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                          style={{
                            borderColor: selected ? "#3B82F6" : "rgba(255,255,255,0.2)",
                            background: selected ? "#3B82F6" : "transparent",
                          }}
                        >
                          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goNext}
                  disabled={!data.experience}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mt-2"
                  style={{
                    background: data.experience
                      ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                      : "rgba(255,255,255,0.06)",
                    color: data.experience ? "#fff" : "#6B6B9A",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "Outfit, sans-serif",
                    boxShadow: data.experience ? "0 8px 32px rgba(59,130,246,0.3)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 3: Metrics */}
            {step === 3 && (
              <div className="flex flex-col gap-6 pt-8">
                <div>
                  <div style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Step 3 of 4
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "#EEEEFF", marginTop: 8, lineHeight: 1.2 }}>
                    Your metrics
                  </h2>
                  <p style={{ color: "#6B6B9A", marginTop: 6, fontSize: 15 }}>For accurate calorie & macro targets</p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Weight */}
                  <GlassCard>
                    <label style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Weight
                    </label>
                    <div className="flex gap-3 mt-3">
                      <input
                        value={data.weight}
                        onChange={(e) => setData((d) => ({ ...d, weight: e.target.value }))}
                        className="flex-1 rounded-xl px-4 py-3 outline-none"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#EEEEFF",
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                        type="number"
                      />
                      <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                        {["lbs", "kg"].map((unit) => (
                          <button
                            key={unit}
                            onClick={() => setData((d) => ({ ...d, weightUnit: unit }))}
                            className="px-4 py-3 transition-all duration-200"
                            style={{
                              background: data.weightUnit === unit
                                ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                                : "rgba(255,255,255,0.03)",
                              color: data.weightUnit === unit ? "#fff" : "#6B6B9A",
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            {unit}
                          </button>
                        ))}
                      </div>
                    </div>
                  </GlassCard>

                  {/* Age & Height */}
                  <div className="grid grid-cols-2 gap-3">
                    <GlassCard>
                      <label style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Age
                      </label>
                      <input
                        value={data.age}
                        onChange={(e) => setData((d) => ({ ...d, age: e.target.value }))}
                        className="w-full mt-3 rounded-xl px-3 py-3 outline-none"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#EEEEFF",
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                        type="number"
                      />
                    </GlassCard>
                    <GlassCard>
                      <label style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Height
                      </label>
                      <input
                        value={data.height}
                        onChange={(e) => setData((d) => ({ ...d, height: e.target.value }))}
                        className="w-full mt-3 rounded-xl px-3 py-3 outline-none"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#EEEEFF",
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                      />
                    </GlassCard>
                  </div>

                  {/* Activity Level */}
                  <GlassCard>
                    <label style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Activity Level
                    </label>
                    <div className="flex flex-col gap-2 mt-3">
                      {ACTIVITY_LEVELS.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setData((d) => ({ ...d, activityLevel: level.id }))}
                          className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
                          style={{
                            background: data.activityLevel === level.id
                              ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.1))"
                              : "rgba(255,255,255,0.04)",
                            border: data.activityLevel === level.id
                              ? "1px solid rgba(59,130,246,0.4)"
                              : "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <div>
                            <div style={{ color: "#EEEEFF", fontWeight: 600, fontSize: 14 }}>{level.label}</div>
                            <div style={{ color: "#6B6B9A", fontSize: 12 }}>{level.desc}</div>
                          </div>
                          {data.activityLevel === level.id && (
                            <Check size={16} style={{ color: "#3B82F6" }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                <button
                  onClick={goNext}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mt-2"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "Outfit, sans-serif",
                    boxShadow: "0 8px 32px rgba(59,130,246,0.3)",
                  }}
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 4: Supplements */}
            {step === 4 && (
              <div className="flex flex-col gap-6 pt-8">
                <div>
                  <div style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Step 4 of 4
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "#EEEEFF", marginTop: 8, lineHeight: 1.2 }}>
                    Supplements you take
                  </h2>
                  <p style={{ color: "#6B6B9A", marginTop: 6, fontSize: 15 }}>We'll factor these into your nutrition</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {SUPPLEMENTS.map((supp) => {
                    const selected = data.supplements.includes(supp.id);
                    return (
                      <button
                        key={supp.id}
                        onClick={() => toggleSupplement(supp.id)}
                        className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-200"
                        style={{
                          background: selected
                            ? `linear-gradient(135deg, ${supp.color}22, ${supp.color}11)`
                            : "rgba(255,255,255,0.03)",
                          border: selected
                            ? `1.5px solid ${supp.color}55`
                            : "1.5px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="text-3xl">{supp.emoji}</div>
                        <div style={{ color: selected ? "#EEEEFF" : "#6B6B9A", fontWeight: 600, fontSize: 14 }}>
                          {supp.label}
                        </div>
                        {selected && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: supp.color }}
                          >
                            <Check size={12} color="#fff" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goNext}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mt-2"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "Outfit, sans-serif",
                    boxShadow: "0 8px 32px rgba(59,130,246,0.3)",
                  }}
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 5: Completion */}
            {step === 5 && (
              <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6 -mt-16">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  className="w-28 h-28 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    boxShadow: "0 0 60px rgba(59,130,246,0.5)",
                  }}
                >
                  <Check size={52} color="#fff" strokeWidth={3} />
                </motion.div>

                <div>
                  <h2 style={{ fontSize: 32, fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "#EEEEFF", lineHeight: 1.2 }}>
                    You're all set!
                  </h2>
                  <p style={{ color: "#6B6B9A", marginTop: 8, fontSize: 16 }}>
                    Your personalized plan is ready
                  </p>
                </div>

                <GlassCard className="w-full text-left">
                  <div style={{ color: "#6B6B9A", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                    Your Profile
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span style={{ color: "#6B6B9A", fontSize: 14 }}>Goals</span>
                      <span style={{ color: "#EEEEFF", fontSize: 14, fontWeight: 600 }}>
                        {data.goals.map((g) => GOALS.find((x) => x.id === g)?.emoji).join(" ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#6B6B9A", fontSize: 14 }}>Experience</span>
                      <span style={{ color: "#EEEEFF", fontSize: 14, fontWeight: 600 }}>
                        {EXPERIENCE.find((e) => e.id === data.experience)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#6B6B9A", fontSize: 14 }}>Weight</span>
                      <span style={{ color: "#EEEEFF", fontSize: 14, fontWeight: 600, fontFamily: "JetBrains Mono, monospace" }}>
                        {data.weight} {data.weightUnit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#6B6B9A", fontSize: 14 }}>Activity</span>
                      <span style={{ color: "#EEEEFF", fontSize: 14, fontWeight: 600 }}>
                        {ACTIVITY_LEVELS.find((a) => a.id === data.activityLevel)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#6B6B9A", fontSize: 14 }}>Supplements</span>
                      <span style={{ color: "#EEEEFF", fontSize: 14, fontWeight: 600 }}>
                        {data.supplements.length} selected
                      </span>
                    </div>
                  </div>
                </GlassCard>

                <button
                  onClick={() => onComplete(data)}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 17,
                    fontFamily: "Outfit, sans-serif",
                    boxShadow: "0 8px 40px rgba(59,130,246,0.4)",
                  }}
                >
                  Enter Dashboard
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
