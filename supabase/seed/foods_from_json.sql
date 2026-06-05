-- Seed foods from data/foods.json
-- Run after initial migration. Adjust slugs if you edit foods.json.

insert into public.foods (slug, name, aliases, default_serving, calories, protein_g, carbs_g, fat_g, fiber_g)
values
  ('chicken_breast_grilled', 'Chicken breast grilled', array['chicken breast', 'chicken breast grilled'], '6 oz', 280, 52, 0, 6, 0),
  ('white_rice_cooked', 'White rice cooked', array['white rice', 'white rice cooked', 'rice cooked'], '1 cup', 210, 4, 45, 0, 1),
  ('banana_medium', 'Banana', array['banana'], '1 medium', 105, 1, 27, 0, 3),
  ('protein_bar', 'Protein bar', array['protein bar'], '1 bar', 200, 20, 22, 6, 3),
  ('broccoli_steamed', 'Broccoli steamed', array['broccoli', 'broccoli steamed'], '1 cup', 55, 4, 11, 0, 5),
  ('coffee_black', 'Coffee black', array['coffee', 'coffee black'], '12 oz', 5, 0, 0, 0, 0),
  ('eggs_large', 'Eggs', array['egg', 'eggs', 'large eggs'], '2 large', 140, 12, 1, 10, 0),
  ('oatmeal_cooked', 'Oatmeal cooked', array['oatmeal', 'oats cooked'], '1 cup', 150, 5, 27, 3, 4),
  ('greek_yogurt', 'Greek yogurt', array['greek yogurt'], '170g', 100, 17, 6, 0, 0),
  ('whey_shake', 'Whey protein shake', array['whey', 'protein shake'], '1 scoop', 120, 24, 3, 1, 0)
on conflict (slug) do update set
  name = excluded.name,
  aliases = excluded.aliases,
  default_serving = excluded.default_serving,
  calories = excluded.calories,
  protein_g = excluded.protein_g,
  carbs_g = excluded.carbs_g,
  fat_g = excluded.fat_g,
  fiber_g = excluded.fiber_g;
