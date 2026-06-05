# SignalFit — Supabase schema

## Food: full nutrition (MFP-style)

Each row in **`foods`** is one catalog item with **complete per-serving nutrition** (not just calories/protein).

| Group | Columns |
|-------|---------|
| Identity | `slug`, `name`, `brand`, `aliases[]`, `default_serving`, `serving_grams` |
| Macros | `calories`, `protein_g`, `carbs_g`, `fat_g`, `fiber_g`, `sugar_g`, `saturated_fat_g`, `trans_fat_g`, `cholesterol_mg`, `sodium_mg`, `potassium_mg` |
| Vitamins | `vitamin_a_mcg`, `vitamin_c_mg`, `vitamin_d_iu`, `vitamin_e_mg`, `vitamin_k_mcg`, B-vitamins, `folate_mcg` |
| Minerals | `calcium_mg`, `iron_mg`, `magnesium_mg`, `phosphorus_mg`, `zinc_mg`, `selenium_mcg`, … |
| Other | `caffeine_mg`, `omega_3_g`, `micronutrients` jsonb (extras) |

**User logs food** → `meals` + `meal_items` (`description`, `quantity`, `serving_multiplier`)  
**Resolver** → match `food_id`, scale nutrients → **`meal_item_nutrition`** per line  
**Day total** → **`nutrition_snapshots`** (sum of all lines + `full_nutrients` jsonb)

Template for cleaning data: [`data/foods.schema.json`](../data/foods.schema.json)  
Seed file: [`data/foods.json`](../data/foods.json)

---

## Workouts: exercises + sets (volume & weight)

**`training_sessions`** = session summary (type, duration, RPE, performance, soreness, rollups).

| Rollup column | Meaning |
|---------------|---------|
| `total_sets` | Count of working sets |
| `total_reps` | Sum of reps |
| `total_volume_lb` | Σ (`reps` × `weight_lb`) for completed non-warmup sets |

**`workout_exercises`** = what they did (squat, RDL, …)

| Column | Example |
|--------|---------|
| `name` | Back Squat |
| `muscle_group` | quads |
| `equipment` | barbell |

**`workout_sets`** = each set

| Column | Strength | Cardio |
|--------|----------|--------|
| `set_number` | 1, 2, 3… | |
| `reps` | 5 | |
| `weight_lb` | 225 | |
| `weight_kg` | optional | |
| `duration_sec` | | 600 |
| `distance_m` | | 5000 |
| `rpe` | 8 | 7 |
| `is_warmup` | true/false | |

Template: [`data/workout-log.schema.json`](../data/workout-log.schema.json)  
Demo: [`data/demo-bad-recovery-day.json`](../data/demo-bad-recovery-day.json) → `training.exercises[]`

---

## Entity diagram

```
profiles
  └── daily_checkins
        ├── meals → meal_items → meal_item_nutrition
        ├── nutrition_snapshots (day totals)
        ├── training_sessions (summary + volume rollups)
        │     └── workout_exercises → workout_sets
        └── insights (AI JSON)
foods (reference catalog)
```

---

## Migrations (run in order)

1. `supabase/migrations/20250604000000_initial_schema.sql`
2. `supabase/migrations/20250604000001_food_nutrition_and_workout_sets.sql`
3. `supabase/seed/foods_from_json.sql` (update after you expand foods.json)

---

## Data cleaning (your tasks)

1. Every food in `foods.json` → fill all fields from `foods.schema.json` (use USDA / MFP labels for hackathon accuracy).
2. Demo workout → insert into `workout_exercises` + `workout_sets` (not only text).
3. When seeding a meal item, set `serving_multiplier` (e.g. `1.5` for 9 oz chicken if serving is 6 oz).
4. Resolver: `line_nutrient = food_nutrient * serving_multiplier`.

---

## API note

[`API-CONTRACT.md`](./API-CONTRACT.md) can keep a flat `training` object for the LLM; backend **loads from Supabase** and builds:

```json
{
  "training": {
    "exercises": [{ "name": "Back Squat", "sets": [{ "reps": 5, "weight_lb": 225 }] }],
    "total_volume_lb": 19850
  },
  "nutrition": { "calories": 1400, "vitamin_d_iu": 120, "iron_mg": 12, ... }
}
```

Frontend form: per-exercise builder (add set rows) — not one text field.
