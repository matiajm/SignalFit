-- Public demo read policies for browser access with the Supabase anon key.
-- These expose only rows attached to daily_checkins.is_demo = true.

create policy "demo_profiles_read"
  on public.profiles for select
  to anon, authenticated
  using (is_demo = true);

create policy "demo_meals_read"
  on public.meals for select
  to anon
  using (
    exists (
      select 1 from public.daily_checkins c
      where c.id = checkin_id and c.is_demo = true
    )
  );

create policy "demo_meal_items_read"
  on public.meal_items for select
  to anon
  using (
    exists (
      select 1
      from public.meals m
      join public.daily_checkins c on c.id = m.checkin_id
      where m.id = meal_id and c.is_demo = true
    )
  );

create policy "demo_meal_item_nutrition_read"
  on public.meal_item_nutrition for select
  to anon
  using (
    exists (
      select 1
      from public.meal_items mi
      join public.meals m on m.id = mi.meal_id
      join public.daily_checkins c on c.id = m.checkin_id
      where mi.id = meal_item_id and c.is_demo = true
    )
  );

create policy "demo_nutrition_snapshots_read"
  on public.nutrition_snapshots for select
  to anon
  using (
    exists (
      select 1 from public.daily_checkins c
      where c.id = checkin_id and c.is_demo = true
    )
  );

create policy "demo_training_sessions_read"
  on public.training_sessions for select
  to anon
  using (
    exists (
      select 1 from public.daily_checkins c
      where c.id = checkin_id and c.is_demo = true
    )
  );
