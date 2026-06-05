import type { SignalFitData } from "./types";

export const nutritionGoals = {
  calories: 2200,
  proteinG: 175,
  carbsG: 260,
  fatG: 73,
  fiberG: 30,
  vitaminDIu: 600,
  ironMg: 18,
  magnesiumMg: 400,
  calciumMg: 1000,
  vitaminB12Mcg: 2.4,
  vitaminCMg: 90,
  potassiumMg: 3500,
  zincMg: 11,
};

const qualityScore: Record<string, number> = {
  low: 25,
  okay: 60,
  good: 85,
  high: 85,
  moderate: 55,
};

export function calculateReadiness(data: SignalFitData): number {
  const sleep = Math.min((data.sleepHours / 8) * 100, 100);
  const energy = qualityScore[data.energy ?? "okay"] ?? 60;
  const stress = data.stress === "high" ? 25 : data.stress === "moderate" ? 55 : 85;
  const calories = Math.min((data.nutrition.calories / nutritionGoals.calories) * 100, 100);
  const sorenessPenalty = Math.max(0, (data.training.soreness ?? 0) - 2) * 9;

  return Math.max(0, Math.min(100, Math.round(sleep * 0.35 + energy * 0.25 + stress * 0.2 + calories * 0.2 - sorenessPenalty)));
}

export function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function statusFromRatio(current: number, goal: number): "green" | "yellow" | "red" {
  const ratio = goal > 0 ? current / goal : 0;
  if (ratio >= 0.9) return "green";
  if (ratio >= 0.65) return "yellow";
  return "red";
}
