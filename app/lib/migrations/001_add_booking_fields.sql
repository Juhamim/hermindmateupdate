-- Add new columns to the bookings table
ALTER TABLE public.bookings
ADD COLUMN user_job_status text,
ADD COLUMN user_is_physically_challenged boolean DEFAULT false,
ADD COLUMN user_gender text;
