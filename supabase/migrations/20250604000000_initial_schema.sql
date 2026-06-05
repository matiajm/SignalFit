-- SignalFit initial schema
-- Run in Supabase SQL Editor or via: supabase db push

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.goal_type as enum (
  'build_muscle',
  'lose_fat',
  'performance',
  'feel_better',
  'maintain'
);

create type public.level_type as enum (
  'beginner',
  'intermediate',
  'advanced'
);

create type public.quality_level as enum (
  'low',
  'okay',
  'good'
);

create type public.tri_level as enum (
  'yes',
  'somewhat',
  'no'
);

create type public.nutrition_source as enum (
  'manual',
  'demo',
  'pasted'
);

create type public.training_type as enum (
  'strength',
  'hypertrophy',
  'power',
  'cardio',
  'hiit',
  'sport',
  'mobility',
  'mixed'
);

create type public.intensity_level as enum (
  'light',
  'moderate',
  'hard',
  'max_effort'
);

create type public.performance_vs_usual as enum (
  'better',
  'normal',
  'below',
  'much_worse'
);

create type public.volume_feel as enum (
  'lower',
  'normal',
  'higher'
);

create type public.supplement_status as enum (
  'yes',
  'no',
  'partial',
  'skipped',
  'not_sure'
);

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  goal public.goal_type not null default 'feel_better',
  experience_level public.level_type,
  weight_unit text not null default 'lb' check (weight_unit in ('lb', 'kg')),
  is_demo boolean not null default false,
  demo_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User preferences; is_demo + demo_slug for hackathon public demo.';

-- ---------------------------------------------------------------------------
-- Food reference catalog (seed from data/foods.json)
-- ---------------------------------------------------------------------------

create table public.foods (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  aliases text[] not null default '{}',
  default_serving text,
  calories numeric(8, 2) not null default 0,
  protein_g numeric(8, 2) not null default 0,
  carbs_g numeric(8, 2) not null default 0,
  fat_g numeric(8, 2) not null default 0,
  fiber_g numeric(8, 2) not null default 0,
  micronutrients jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index foods_aliases_gin on public.foods using gin (aliases);

comment on table public.foods is 'Hackathon food DB; later replace with USDA / MFP import.';

-- ---------------------------------------------------------------------------
-- Daily check-in (hub)
-- ---------------------------------------------------------------------------

create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  checkin_date date not null,
  goal_snapshot public.goal_type,
  weight_lb numeric(6, 2),
  sleep_hours numeric(4, 2),
  sleep_quality public.quality_level,
  skipped_food_log boolean not null default false,
  nutrition_source public.nutrition_source not null default 'manual',
  pasted_text text,
  supplements jsonb not null default '{}',
  energy public.quality_level,
  mood public.quality_level,
  stress public.quality_level,
  motivation public.quality_level,
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

create index daily_checkins_user_date_idx on public.daily_checkins (user_id, checkin_date desc);

comment on table public.daily_checkins is 'One row per user per day; wellbeing + sleep + supplements.';

-- ---------------------------------------------------------------------------
-- Meals & line items (user food input)
-- ---------------------------------------------------------------------------

create table public.meals (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.daily_checkins (id) on delete cascade,
  name text not null,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create table public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals (id) on delete cascade,
  description text not null,
  quantity text,
  food_id uuid references public.foods (id) on delete set null,
  match_confidence numeric(3, 2),
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create index meal_items_meal_id_idx on public.meal_items (meal_id);

-- ---------------------------------------------------------------------------
-- Derived nutrition (computed from meal_items + foods)
-- ---------------------------------------------------------------------------

create table public.nutrition_snapshots (
  checkin_id uuid primary key references public.daily_checkins (id) on delete cascade,
  calories numeric(8, 2) not null default 0,
  protein_g numeric(8, 2) not null default 0,
  carbs_g numeric(8, 2) not null default 0,
  fat_g numeric(8, 2) not null default 0,
  fiber_g numeric(8, 2) not null default 0,
  meals_count smallint not null default 0,
  ate_enough_for_goal public.tri_level,
  micronutrients jsonb not null default '{}',
  computed_at timestamptz not null default now()
);

comment on table public.nutrition_snapshots is 'Server-derived; maps to API contract nutrition object.';

-- ---------------------------------------------------------------------------
-- Training
-- ---------------------------------------------------------------------------

create table public.training_sessions (
  checkin_id uuid primary key references public.daily_checkins (id) on delete cascade,
  trained boolean not null default false,
  type public.training_type,
  duration_min smallint,
  muscle_groups text[] not null default '{}',
  exercises text,
  intensity public.intensity_level,
  rpe smallint check (rpe is null or (rpe >= 1 and rpe <= 10)),
  performance_vs_usual public.performance_vs_usual,
  volume_feel public.volume_feel,
  soreness smallint check (soreness is null or (soreness >= 1 and soreness <= 5)),
  soreness_areas text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- AI insights
-- ---------------------------------------------------------------------------

create table public.insights (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.daily_checkins (id) on delete cascade,
  payload jsonb not null,
  model text,
  created_at timestamptz not null default now(),
  unique (checkin_id)
);

comment on column public.insights.payload is 'Full API response: main_insight, signals, safety_note, etc.';

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger daily_checkins_updated_at
  before update on public.daily_checkins
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security (enable; relax for demo during hackathon)
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.foods enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.nutrition_snapshots enable row level security;
alter table public.training_sessions enable row level security;
alter table public.insights enable row level security;

-- Foods: everyone can read
create policy "foods_read_all"
  on public.foods for select
  to authenticated, anon
  using (true);

-- Profiles: own row
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Demo: public read for expo (optional — tighten after hackathon)
create policy "demo_checkins_read"
  on public.daily_checkins for select
  to anon, authenticated
  using (is_demo = true);

create policy "demo_checkins_write_service"
  on public.daily_checkins for all
  to authenticated
  using (auth.uid() = user_id);

-- Meals / items / nutrition / training / insights: via checkin ownership
create policy "meals_via_checkin"
  on public.meals for all
  to authenticated
  using (
    exists (
      select 1 from public.daily_checkins c
      where c.id = checkin_id and c.user_id = auth.uid()
    )
  );

create policy "meal_items_via_checkin"
  on public.meal_items for all
  to authenticated
  using (
    exists (
      select 1 from public.meals m
      join public.daily_checkins c on c.id = m.checkin_id
      where m.id = meal_id and c.user_id = auth.uid()
    )
  );

create policy "nutrition_via_checkin"
  on public.nutrition_snapshots for all
  to authenticated
  using (
    exists (
      select 1 from public.daily_checkins c
      where c.id = checkin_id and c.user_id = auth.uid()
    )
  );

create policy "training_via_checkin"
  on public.training_sessions for all
  to authenticated
  using (
    exists (
      select 1 from public.daily_checkins c
      where c.id = checkin_id and c.user_id = auth.uid()
    )
  );

create policy "insights_via_checkin"
  on public.insights for all
  to authenticated
  using (
    exists (
      select 1 from public.daily_checkins c
      where c.id = checkin_id and c.user_id = auth.uid()
    )
  );

-- Demo insights readable when checkin is demo
create policy "demo_insights_read"
  on public.insights for select
  to anon
  using (
    exists (
      select 1 from public.daily_checkins c
      where c.id = checkin_id and c.is_demo = true
    )
  );
