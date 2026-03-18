-- Add pitch_id column to bookings table (the Supabase-native table, not the Prisma "Booking" table)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pitch_id TEXT NOT NULL DEFAULT '5-a-side';
