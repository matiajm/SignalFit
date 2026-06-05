import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { demoSignalFitData } from "./demoData";
import { hasSupabaseConfig, supabase } from "./supabase";
import type {
  Meal,
  MealItem,
  SignalFitData,
  SignalFitDataState,
  WorkoutExercise,
  WorkoutSet,
} from "./types";

const DataContext = createContext<SignalFitDataState>({
  data: demoSignalFitData,
  loading: false,
  error: null,
});

const asNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
};

const first = <T,>(value: T | T[] | null | undefined): T | undefined =>
  Array.isArray(value) ? value[0] : value ?? undefined;

function mealItemNutrition(row: any): MealItem {
  const nutrition = first(row.meal_item_nutrition);
  const food = first(row.foods);
  const multiplier = asNumber(row.serving_multiplier) || 1;

  return {
    id: row.id,
    description: row.description ?? food?.name ?? "Food item",
    quantity: row.quantity,
    calories: asNumber(nutrition?.calories ?? food?.calories) * (nutrition ? 1 : multiplier),
    proteinG: asNumber(nutrition?.protein_g ?? food?.protein_g) * (nutrition ? 1 : multiplier),
    carbsG: asNumber(nutrition?.carbs_g ?? food?.carbs_g) * (nutrition ? 1 : multiplier),
    fatG: asNumber(nutrition?.fat_g ?? food?.fat_g) * (nutrition ? 1 : multiplier),
  };
}

function normalizeMeal(row: any): Meal {
  const items = (row.meal_items ?? []).map(mealItemNutrition);
  return {
    id: row.id,
    name: row.name ?? "Meal",
    calories: items.reduce((sum: number, item: MealItem) => sum + item.calories, 0),
    proteinG: items.reduce((sum: number, item: MealItem) => sum + item.proteinG, 0),
    items,
  };
}

function normalizeExercise(row: any): WorkoutExercise {
  const sets: WorkoutSet[] = (row.workout_sets ?? [])
    .map((set: any) => ({
      id: set.id,
      setNumber: asNumber(set.set_number),
      reps: asNumber(set.reps),
      weightLb: asNumber(set.weight_lb),
      rpe: set.rpe == null ? null : asNumber(set.rpe),
      isWarmup: Boolean(set.is_warmup),
      completed: set.completed !== false,
    }))
    .sort((a: WorkoutSet, b: WorkoutSet) => a.setNumber - b.setNumber);

  return {
    id: row.id,
    name: row.name ?? "Exercise",
    muscleGroup: row.muscle_group ?? "training",
    equipment: row.equipment ?? "equipment",
    sets,
  };
}

function normalizeSupabaseDay(row: any): SignalFitData {
  const nutrition = first(row.nutrition_snapshots) ?? {};
  const training = first(row.training_sessions) ?? {};
  const insight = first(row.insights)?.payload ?? {};
  const meals = (row.meals ?? []).map(normalizeMeal);
  const exercises = (row.workout_exercises ?? []).map(normalizeExercise);

  return {
    source: "supabase",
    profileName: "SignalFit Demo",
    goal: row.goal_snapshot ?? "feel_better",
    weightLb: asNumber(row.weight_lb),
    checkinDate: row.checkin_date,
    sleepHours: asNumber(row.sleep_hours),
    sleepQuality: row.sleep_quality,
    energy: row.energy,
    mood: row.mood,
    stress: row.stress,
    motivation: row.motivation,
    notes: row.notes,
    nutrition: {
      calories: asNumber(nutrition.calories),
      proteinG: asNumber(nutrition.protein_g),
      carbsG: asNumber(nutrition.carbs_g),
      fatG: asNumber(nutrition.fat_g),
      fiberG: asNumber(nutrition.fiber_g),
      mealsCount: asNumber(nutrition.meals_count) || meals.filter((meal: Meal) => meal.items.length > 0).length,
      ateEnoughForGoal: nutrition.ate_enough_for_goal,
      vitaminDIu: asNumber(nutrition.vitamin_d_iu),
      ironMg: asNumber(nutrition.iron_mg),
      magnesiumMg: asNumber(nutrition.magnesium_mg),
      calciumMg: asNumber(nutrition.calcium_mg),
      vitaminB12Mcg: asNumber(nutrition.vitamin_b12_mcg),
      vitaminCMg: asNumber(nutrition.vitamin_c_mg),
      potassiumMg: asNumber(nutrition.potassium_mg),
      zincMg: asNumber(nutrition.zinc_mg),
    },
    meals,
    training: {
      trained: Boolean(training.trained),
      type: training.type,
      durationMin: asNumber(training.duration_min),
      muscleGroups: training.muscle_groups ?? [],
      intensity: training.intensity,
      rpe: training.rpe == null ? null : asNumber(training.rpe),
      performanceVsUsual: training.performance_vs_usual,
      volumeFeel: training.volume_feel,
      soreness: training.soreness == null ? null : asNumber(training.soreness),
      sorenessAreas: training.soreness_areas ?? [],
      totalSets: asNumber(training.total_sets),
      totalReps: asNumber(training.total_reps),
      totalVolumeLb: asNumber(training.total_volume_lb),
      exercisesSummary: training.exercises,
    },
    exercises,
    recentDays: demoSignalFitData.recentDays,
    insight: {
      summary: insight.main_insight ?? insight.summary ?? demoSignalFitData.insight.summary,
      wins: insight.signals?.strengths ?? insight.wins ?? demoSignalFitData.insight.wins,
      next: insight.signals?.next_steps ?? insight.next ?? demoSignalFitData.insight.next,
    },
  };
}

function hasUsableSupabaseDay(row: any): boolean {
  const meals = row.meals ?? [];
  const exercises = row.workout_exercises ?? [];
  return Boolean(
    first(row.nutrition_snapshots) &&
      first(row.training_sessions) &&
      first(row.insights) &&
      meals.some((meal: any) => (meal.meal_items ?? []).length > 0) &&
      exercises.some((exercise: any) => (exercise.workout_sets ?? []).length > 0),
  );
}

async function loadDemoCheckin(): Promise<SignalFitData> {
  if (!supabase) return demoSignalFitData;

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(
      `
      id,
      checkin_date,
      goal_snapshot,
      weight_lb,
      sleep_hours,
      sleep_quality,
      energy,
      mood,
      stress,
      motivation,
      notes,
      nutrition_snapshots (*),
      training_sessions (*),
      meals (
        id,
        name,
        sort_order,
        meal_items (
          id,
          description,
          quantity,
          serving_multiplier,
          sort_order,
          foods (name, calories, protein_g, carbs_g, fat_g),
          meal_item_nutrition (*)
        )
      ),
      workout_exercises (
        id,
        name,
        muscle_group,
        equipment,
        sort_order,
        workout_sets (*)
      ),
      insights (payload, model, created_at)
    `,
    )
    .eq("is_demo", true)
    .order("checkin_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data && hasUsableSupabaseDay(data) ? normalizeSupabaseDay(data) : demoSignalFitData;
}

export function SignalFitDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SignalFitDataState>({
    data: demoSignalFitData,
    loading: hasSupabaseConfig,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    if (!hasSupabaseConfig) return;

    loadDemoCheckin()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setState({
            data: demoSignalFitData,
            loading: false,
            error: error.message,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useSignalFitData() {
  return useContext(DataContext);
}
