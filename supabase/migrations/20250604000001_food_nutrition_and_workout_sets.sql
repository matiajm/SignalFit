-- SignalFit: full food nutrition + specific workout sets (volume / weight)
-- Run AFTER 20250604000000_initial_schema.sql if already applied.
-- Fresh installs: use 20250604000002_combined_schema.sql instead (optional merge).

-- ---------------------------------------------------------------------------
-- Expand foods: full nutritional profile per default serving
-- ---------------------------------------------------------------------------

alter table public.foods
  add column if not exists brand text,
  add column if not exists serving_grams numeric(8, 2),
  add column if not exists sugar_g numeric(8, 2) not null default 0,
  add column if not exists saturated_fat_g numeric(8, 2) not null default 0,
  add column if not exists trans_fat_g numeric(8, 2) not null default 0,
  add column if not exists cholesterol_mg numeric(8, 2) not null default 0,
  add column if not exists sodium_mg numeric(8, 2) not null default 0,
  add column if not exists potassium_mg numeric(8, 2) not null default 0,
  add column if not exists caffeine_mg numeric(8, 2) not null default 0,
  add column if not exists vitamin_a_mcg numeric(8, 2) not null default 0,
  add column if not exists vitamin_c_mg numeric(8, 2) not null default 0,
  add column if not exists vitamin_d_iu numeric(8, 2) not null default 0,
  add column if not exists vitamin_e_mg numeric(8, 2) not null default 0,
  add column if not exists vitamin_k_mcg numeric(8, 2) not null default 0,
  add column if not exists thiamin_mg numeric(8, 2) not null default 0,
  add column if not exists riboflavin_mg numeric(8, 2) not null default 0,
  add column if not exists niacin_mg numeric(8, 2) not null default 0,
  add column if not exists vitamin_b6_mg numeric(8, 2) not null default 0,
  add column if not exists folate_mcg numeric(8, 2) not null default 0,
  add column if not exists vitamin_b12_mcg numeric(8, 2) not null default 0,
  add column if not exists calcium_mg numeric(8, 2) not null default 0,
  add column if not exists iron_mg numeric(8, 2) not null default 0,
  add column if not exists magnesium_mg numeric(8, 2) not null default 0,
  add column if not exists phosphorus_mg numeric(8, 2) not null default 0,
  add column if not exists zinc_mg numeric(8, 2) not null default 0,
  add column if not exists selenium_mcg numeric(8, 2) not null default 0,
  add column if not exists copper_mg numeric(8, 2) not null default 0,
  add column if not exists manganese_mg numeric(8, 2) not null default 0,
  add column if not exists omega_3_g numeric(8, 4) not null default 0;

comment on table public.foods is
  'Per-serving nutrition (MFP-style). Values are for default_serving; scale via meal_items.serving_multiplier.';

-- Per-line resolved nutrition (after matching food + multiplier)
create table if not exists public.meal_item_nutrition (
  meal_item_id uuid primary key references public.meal_items (id) on delete cascade,
  calories numeric(8, 2) not null default 0,
  protein_g numeric(8, 2) not null default 0,
  carbs_g numeric(8, 2) not null default 0,
  fat_g numeric(8, 2) not null default 0,
  fiber_g numeric(8, 2) not null default 0,
  sugar_g numeric(8, 2) not null default 0,
  sodium_mg numeric(8, 2) not null default 0,
  vitamin_d_iu numeric(8, 2) not null default 0,
  iron_mg numeric(8, 2) not null default 0,
  magnesium_mg numeric(8, 2) not null default 0,
  calcium_mg numeric(8, 2) not null default 0,
  vitamin_b12_mcg numeric(8, 2) not null default 0,
  full_nutrients jsonb not null default '{}',
  computed_at timestamptz not null default now()
);

alter table public.meal_items
  add column if not exists serving_multiplier numeric(6, 3) not null default 1.0;

comment on column public.meal_items.serving_multiplier is
  'e.g. 1.5 = one and a half servings of matched food';

-- Expand daily nutrition snapshot (sums meal_item_nutrition + supplements logic in app)
alter table public.nutrition_snapshots
  add column if not exists sugar_g numeric(8, 2) not null default 0,
  add column if not exists saturated_fat_g numeric(8, 2) not null default 0,
  add column if not exists sodium_mg numeric(8, 2) not null default 0,
  add column if not exists cholesterol_mg numeric(8, 2) not null default 0,
  add column if not exists vitamin_d_iu numeric(8, 2) not null default 0,
  add column if not exists iron_mg numeric(8, 2) not null default 0,
  add column if not exists magnesium_mg numeric(8, 2) not null default 0,
  add column if not exists calcium_mg numeric(8, 2) not null default 0,
  add column if not exists vitamin_b12_mcg numeric(8, 2) not null default 0,
  add column if not exists vitamin_c_mg numeric(8, 2) not null default 0,
  add column if not exists potassium_mg numeric(8, 2) not null default 0,
  add column if not exists zinc_mg numeric(8, 2) not null default 0,
  add column if not exists full_nutrients jsonb not null default '{}';

-- ---------------------------------------------------------------------------
-- Workouts: exercises + sets (reps, weight, volume)
-- ---------------------------------------------------------------------------

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.daily_checkins (id) on delete cascade,
  name text not null,
  muscle_group text,
  equipment text,
  sort_order smallint not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists workout_exercises_checkin_idx on public.workout_exercises (checkin_id);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.workout_exercises (id) on delete cascade,
  set_number smallint not null,
  reps smallint,
  weight_lb numeric(7, 2),
  weight_kg numeric(7, 2),
  duration_sec smallint,
  distance_m numeric(8, 2),
  rpe smallint check (rpe is null or (rpe >= 1 and rpe <= 10)),
  is_warmup boolean not null default false,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (exercise_id, set_number)
);

create index if not exists workout_sets_exercise_idx on public.workout_sets (exercise_id);

comment on table public.workout_sets is
  'One row per set. Strength: reps + weight_lb. Cardio: duration_sec / distance_m.';

-- Session-level rollups (computed on save)
alter table public.training_sessions
  add column if not exists total_sets smallint not null default 0,
  add column if not exists total_reps integer not null default 0,
  add column if not exists total_volume_lb numeric(12, 2) not null default 0,
  add column if not exists total_tonnage_kg numeric(12, 2) not null default 0;

comment on column public.training_sessions.total_volume_lb is
  'Sum of (reps * weight_lb) for completed working sets';

-- Optional: keep exercises text as human summary; prefer workout_exercises for structure
comment on column public.training_sessions.exercises is
  'Legacy summary string; structured data lives in workout_exercises + workout_sets';

-- ---------------------------------------------------------------------------
-- RLS for new tables
-- ---------------------------------------------------------------------------

alter table public.meal_item_nutrition enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_sets enable row level security;

create policy "meal_item_nutrition_via_checkin"
  on public.meal_item_nutrition for all
  to authenticated
  using (
    exists (
      select 1 from public.meal_items mi
      join public.meals m on m.id = mi.meal_id
      join public.daily_checkins c on c.id = m.checkin_id
      where mi.id = meal_item_id and c.user_id = auth.uid()
    )
  );

create policy "workout_exercises_via_checkin"
  on public.workout_exercises for all
  to authenticated
  using (
    exists (
      select 1 from public.daily_checkins c
      where c.id = checkin_id and c.user_id = auth.uid()
    )
  );

create policy "demo_workout_exercises_read"
  on public.workout_exercises for select
  to anon
  using (
    exists (
      select 1 from public.daily_checkins c
      where c.id = checkin_id and c.is_demo = true
    )
  );

create policy "workout_sets_via_exercise"
  on public.workout_sets for all
  to authenticated
  using (
    exists (
      select 1 from public.workout_exercises e
      join public.daily_checkins c on c.id = e.checkin_id
      where e.id = exercise_id and c.user_id = auth.uid()
    )
  );

create policy "demo_workout_sets_read"
  on public.workout_sets for select
  to anon
  using (
    exists (
      select 1 from public.workout_exercises e
      join public.daily_checkins c on c.id = e.checkin_id
      where e.id = exercise_id and c.is_demo = true
    )
  );

-- ---------------------------------------------------------------------------
-- Helper: compute set volume (reps * weight_lb)
-- ---------------------------------------------------------------------------

create or replace function public.set_volume_lb(p_reps smallint, p_weight_lb numeric)
returns numeric
language sql
immutable
as $$
  select coalesce(p_reps, 0) * coalesce(p_weight_lb, 0);
$$;
