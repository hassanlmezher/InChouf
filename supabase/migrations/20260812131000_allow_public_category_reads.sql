alter table public.categories enable row level security;

drop policy if exists "Categories are publicly readable" on public.categories;

create policy "Categories are publicly readable"
on public.categories
for select
to anon, authenticated
using (true);
