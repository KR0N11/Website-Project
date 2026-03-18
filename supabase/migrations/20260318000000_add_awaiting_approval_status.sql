-- Add awaiting_approval to the bookings status CHECK constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('confirmed', 'pending', 'cancelled', 'awaiting_approval'));
