-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, age, grade)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Student'),
    coalesce((new.raw_user_meta_data ->> 'age')::integer, null),
    coalesce(new.raw_user_meta_data ->> 'grade', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
