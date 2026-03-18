-- Create the bookings table used by the Supabase client (useBooking hook)
-- This is separate from the Prisma "Booking" table used by the checkout API
CREATE TABLE IF NOT EXISTS bookings (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pitch_id    TEXT        NOT NULL,
  date        DATE        NOT NULL,
  time        TEXT        NOT NULL,
  duration    INT         NOT NULL DEFAULT 60,
  player_name TEXT        NOT NULL,
  team_name   TEXT,
  email       TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  players     INT         NOT NULL DEFAULT 10,
  price       INT         NOT NULL,
  deposit_paid INT        NOT NULL DEFAULT 0,
  status      TEXT        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('confirmed', 'pending', 'cancelled', 'awaiting_approval')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS bookings_date_idx ON bookings (date);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
CREATE INDEX IF NOT EXISTS bookings_pitch_date_idx ON bookings (pitch_id, date);

-- Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public update bookings" ON bookings FOR UPDATE USING (true);
