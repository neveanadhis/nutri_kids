-- Create meals table for meal logging
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_description text not null,
  ai_feedback text,
  nutrition_score integer check (nutrition_score >= 1 and nutrition_score <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.meals enable row level security;

-- RLS policies for meals
create policy "meals_select_own"
  on public.meals for select
  using (auth.uid() = user_id);

create policy "meals_insert_own"
  on public.meals for insert
  with check (auth.uid() = user_id);

create policy "meals_update_own"
  on public.meals for update
  using (auth.uid() = user_id);

create policy "meals_delete_own"
  on public.meals for delete
  using (auth.uid() = user_id);
