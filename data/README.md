# SignalFit — Data files

| File | Supabase target | Notes |
|------|-----------------|-------|
| `foods.schema.json` | — | **Template** — every nutrient field per serving |
| `foods.json` | `public.foods` | Full nutrition per food; expand all rows like chicken |
| `workout-log.schema.json` | — | **Template** — exercises + sets with weight/reps |
| `demo-bad-recovery-day.json` | check-in + meals + `workout_exercises` + `workout_sets` | Includes structured `training.exercises[]` |
| `recent-days.json` | `daily_checkins` summaries | Pattern context for AI |
| `fallback-insight.json` | *(create)* | API fallback when LLM fails |

## Cleaning checklist

- [ ] Each food has macros + vitamins + minerals (see `foods.schema.json`)
- [ ] Run migration `000001_food_nutrition_and_workout_sets.sql`
- [ ] Demo workout has real sets: `reps`, `weight_lb`, `set_number` per exercise
- [ ] `total_volume_lb` = sum of reps × weight for non-warmup sets
- [ ] Enum values match migrations
- [ ] Food `aliases` lowercase for matching
- [ ] `meal_items.serving_multiplier` when quantity ≠ 1 serving

See [docs/SUPABASE-SCHEMA.md](../docs/SUPABASE-SCHEMA.md).
