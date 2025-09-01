-- Create quiz questions table
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer char(1) not null check (correct_answer in ('A', 'B', 'C', 'D')),
  explanation text,
  difficulty_level integer default 1 check (difficulty_level >= 1 and difficulty_level <= 3),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quiz questions are public (no RLS needed as they're read-only for all users)

-- Insert sample quiz questions
insert into public.quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level) values
('Which food group provides the most energy?', 'Proteins', 'Carbohydrates', 'Vitamins', 'Minerals', 'B', 'Carbohydrates are the body''s main source of energy, providing 4 calories per gram.', 1),
('How many servings of fruits and vegetables should you eat per day?', '2-3 servings', '5-9 servings', '1-2 servings', '10+ servings', 'B', 'Health experts recommend 5-9 servings of fruits and vegetables daily for optimal nutrition.', 1),
('Which vitamin helps your body absorb calcium?', 'Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K', 'C', 'Vitamin D helps the body absorb calcium, which is essential for strong bones and teeth.', 2),
('What is the recommended daily water intake for kids?', '2-3 glasses', '4-6 glasses', '6-8 glasses', '10+ glasses', 'C', 'Kids should drink 6-8 glasses of water daily to stay properly hydrated.', 1),
('Which nutrient helps build and repair muscles?', 'Carbohydrates', 'Fats', 'Proteins', 'Fiber', 'C', 'Proteins are essential for building and repairing muscle tissue, especially important for growing kids.', 2);
