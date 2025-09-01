-- Create badges table for gamification
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  icon text not null,
  requirement_type text not null, -- 'meals_logged', 'quiz_score', 'streak_days'
  requirement_value integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user badges junction table
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, badge_id)
);

alter table public.user_badges enable row level security;

-- RLS policies for user badges
create policy "user_badges_select_own"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "user_badges_insert_own"
  on public.user_badges for insert
  with check (auth.uid() = user_id);

-- Insert sample badges
insert into public.badges (name, description, icon, requirement_type, requirement_value) values
('First Meal', 'Logged your first meal!', '🍎', 'meals_logged', 1),
('Healthy Eater', 'Logged 10 healthy meals', '🥗', 'meals_logged', 10),
('Quiz Master', 'Scored 80% or higher on a quiz', '🧠', 'quiz_score', 80),
('Nutrition Expert', 'Answered 50 quiz questions correctly', '🏆', 'quiz_correct', 50),
('Consistent Learner', 'Used the app for 7 days in a row', '📅', 'streak_days', 7);
