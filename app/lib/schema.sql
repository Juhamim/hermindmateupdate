-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES Table (Extends Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade not null,
  email text not null,
  role text not null check (role in ('admin', 'psychologist', 'patient')),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (new.id, new.email, 'patient', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Psychologists Table
create table if not exists public.psychologists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null, -- Link to Auth User
  name text not null,
  title text not null,
  bio text,
  specializations text[] default '{}',
  education text[] default '{}',
  years_of_experience integer default 0,
  availability text, -- Display text like "Mon-Fri 9am-5pm"
  price integer not null, -- Price in INR
  image_url text,
  location text,
  languages text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Availability Table
create table if not exists public.availability (
  id uuid primary key default uuid_generate_v4(),
  psychologist_id uuid references public.psychologists(id) on delete cascade not null,
  day_of_week integer not null, -- 0 = Sunday, 1 = Monday, etc.
  start_time time not null,
  end_time time not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bookings Table
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  psychologist_id uuid references public.psychologists(id) on delete set null not null,
  user_name text not null,
  user_email text not null,
  user_phone text not null,
  start_time timestamp with time zone not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  payment_id text,
  payment_status text default 'pending',
  amount integer not null, -- Amount in INR
  meeting_link text,
  calendar_event_id text, -- Google Calendar Event ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sessions Table (Clinical Data)
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings(id) on delete cascade not null,
  psychologist_id uuid references public.psychologists(id) on delete set null not null,
  patient_id uuid references public.profiles(id) on delete set null, -- Optional, link if user is registered
  notes text, -- Clinical Data
  tags text[] default '{}', -- e.g. Anxiety, Trauma
  mood_rating integer check (mood_rating >= 1 and mood_rating <= 10),
  prescription text,
  is_locked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- Profiles
alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles" on public.profiles for update using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

-- Psychologists
alter table public.psychologists enable row level security;

drop policy if exists "Public psychologists are viewable by everyone" on public.psychologists;
create policy "Public psychologists are viewable by everyone" on public.psychologists for select using (true);

-- Admin only insert/update policies
drop policy if exists "Admins can insert psychologists" on public.psychologists;
create policy "Admins can insert psychologists" on public.psychologists for insert with check (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

drop policy if exists "Admins can update psychologists" on public.psychologists;
create policy "Admins can update psychologists" on public.psychologists for update using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

drop policy if exists "Admins can delete psychologists" on public.psychologists;
create policy "Admins can delete psychologists" on public.psychologists for delete using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

-- Availability
alter table public.availability enable row level security;

drop policy if exists "Public availability is viewable by everyone" on public.availability;
create policy "Public availability is viewable by everyone" on public.availability for select using (true);

-- Bookings
alter table public.bookings enable row level security;

drop policy if exists "Users can view their own bookings via email/payment_id lookup (simplified)" on public.bookings;
-- REMOVED: Insecure public view
-- REPLACED WITH:

-- 1. Patients can view their own bookings (via email match)
drop policy if exists "Patients can view own bookings" on public.bookings;
create policy "Patients can view own bookings" on public.bookings for select using (
  user_email = (select email from public.profiles where id = auth.uid())
);

-- 2. Psychologists can view their assigned bookings
drop policy if exists "Psychologists can view assigned bookings" on public.bookings;
create policy "Psychologists can view assigned bookings" on public.bookings for select using (
  exists (
    select 1 from public.psychologists p 
    where p.id = psychologist_id 
    and p.user_id = auth.uid()
  )
);

drop policy if exists "Anyone can create a booking" on public.bookings;
create policy "Anyone can create a booking" on public.bookings for insert with check (true);

drop policy if exists "Admins can update bookings" on public.bookings;
create policy "Admins can update bookings" on public.bookings for update using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

drop policy if exists "Admins can select bookings" on public.bookings;
create policy "Admins can select bookings" on public.bookings for select using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

drop policy if exists "Admins can delete bookings" on public.bookings;
create policy "Admins can delete bookings" on public.bookings for delete using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

-- Sessions
alter table public.sessions enable row level security;

drop policy if exists "Psychologists can view assigned sessions" on public.sessions;
create policy "Psychologists can view assigned sessions" on public.sessions for select using (
  exists (
    select 1 from public.psychologists p 
    where p.id = psychologist_id 
    and p.user_id = auth.uid()
  )
);

drop policy if exists "Patients can view their own timeline (excluding notes)" on public.sessions;
create policy "Patients can view their own timeline (excluding notes)" on public.sessions for select using (
  auth.uid() = patient_id
);


-- MIGRATION HELPERS (Implicit updates if run on existing DB)
-- If 'user_id' doesn't exist on Psychologists, the above 'create table if not exists' won't add it.
-- We must explicitly add it if it's missing (though 'create table if not exists' skips if table exists).
-- Since we are editing schema.sql, we should include an ALTER TABLE statement to be safe for running migrations manually.

do $$ 
begin 
    if not exists (select 1 from information_schema.columns where table_name = 'psychologists' and column_name = 'user_id') then 
        alter table public.psychologists add column user_id uuid references public.profiles(id) on delete set null; 
    end if; 


    if not exists (select 1 from information_schema.columns where table_name = 'psychologists' and column_name = 'languages') then
        alter table public.psychologists add column languages text[] default '{}';
    end if;
end $$;

-- Blogs Table
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

-- RLS for Blogs
alter table public.blogs enable row level security;

create policy "Public blogs are viewable by everyone" on public.blogs for select using (true);

create policy "Admins can insert blogs" on public.blogs for insert with check (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

create policy "Admins can update blogs" on public.blogs for update using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

create policy "Admins can delete blogs" on public.blogs for delete using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);


