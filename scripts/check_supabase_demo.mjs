import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(__dirname, "../app");
const envPath = path.join(appDir, ".env.local");
const requireFromApp = createRequire(path.join(appDir, "package.json"));
const { createClient } = requireFromApp("@supabase/supabase-js");

function readEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .filter((line) => /^\s*[^#=]+\s*=/.test(line))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index).trim();
        const value = line
          .slice(index + 1)
          .trim()
          .replace(/^["']|["']$/g, "");
        return [key, value];
      }),
  );
}

const env = readEnv(envPath);
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("supabase_query=skipped_missing_browser_env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const select = `
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
`;

const { data, error } = await supabase
  .from("daily_checkins")
  .select(select)
  .eq("is_demo", true)
  .order("checkin_date", { ascending: false })
  .limit(1)
  .maybeSingle();

if (error) {
  console.error("supabase_query=failed");
  console.error(error.message);
  process.exitCode = 1;
} else if (!data) {
  console.log("supabase_query=ok_no_demo_row");
} else {
  const meals = data.meals ?? [];
  const exercises = data.workout_exercises ?? [];
  const mealItemsCount = meals.reduce((sum, meal) => sum + (meal.meal_items?.length ?? 0), 0);
  const workoutSetsCount = exercises.reduce(
    (sum, exercise) => sum + (exercise.workout_sets?.length ?? 0),
    0,
  );
  const hasNutritionSnapshot = Boolean(
    data.nutrition_snapshots?.length ?? data.nutrition_snapshots,
  );
  const hasTrainingSession = Boolean(data.training_sessions?.length ?? data.training_sessions);
  const hasInsight = Boolean(data.insights?.length ?? data.insights);
  const isComplete =
    mealItemsCount > 0 &&
    workoutSetsCount > 0 &&
    hasNutritionSnapshot &&
    hasTrainingSession &&
    hasInsight;

  console.log("supabase_query=ok");
  console.log(`checkin_date=${data.checkin_date}`);
  console.log(`meals=${meals.length}`);
  console.log(`meal_items=${mealItemsCount}`);
  console.log(`workout_exercises=${exercises.length}`);
  console.log(`workout_sets=${workoutSetsCount}`);
  console.log(`has_nutrition_snapshot=${hasNutritionSnapshot}`);
  console.log(`has_training_session=${hasTrainingSession}`);
  console.log(`has_insight=${hasInsight}`);
  console.log(`deployment_demo_data=${isComplete ? "complete" : "incomplete"}`);

  if (!isComplete) {
    process.exitCode = 1;
  }
}

await supabase.removeAllChannels();
