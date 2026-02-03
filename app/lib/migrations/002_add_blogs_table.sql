
-- Create Blogs Table
create table if not exists public.blogs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  image_url text,
  author_id uuid references public.profiles(id) on delete set null,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Blogs
alter table public.blogs enable row level security;

drop policy if exists "Public blogs are viewable by everyone" on public.blogs;
create policy "Public blogs are viewable by everyone" on public.blogs for select using (true);

drop policy if exists "Admins can insert blogs" on public.blogs;
create policy "Admins can insert blogs" on public.blogs for insert with check (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

drop policy if exists "Admins can update blogs" on public.blogs;
create policy "Admins can update blogs" on public.blogs for update using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

drop policy if exists "Admins can delete blogs" on public.blogs;
create policy "Admins can delete blogs" on public.blogs for delete using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);
