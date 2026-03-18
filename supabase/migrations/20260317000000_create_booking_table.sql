-- Create the Booking table for MTLWorldCup
CREATE TABLE IF NOT EXISTS "Booking" (
  "id"              TEXT        PRIMARY KEY,
  "pitchId"         TEXT        NOT NULL,
  "pitchName"       TEXT        NOT NULL,
  "date"            TEXT        NOT NULL,
  "time"            TEXT        NOT NULL,
  "timeLabel"       TEXT        NOT NULL,
  "playerName"      TEXT        NOT NULL,
  "teamName"        TEXT        NOT NULL,
  "email"           TEXT        NOT NULL,
  "phone"           TEXT        NOT NULL,
  "players"         INTEGER     NOT NULL,
  "priceFull"       INTEGER     NOT NULL,
  "depositPaid"     INTEGER     NOT NULL,
  "status"          TEXT        NOT NULL DEFAULT 'pending',
  "bookedAt"        TIMESTAMPTZ NOT NULL DEFAULT now(),
  "stripeSessionId" TEXT
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS "Booking_date_idx" ON "Booking" ("date");
CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking" ("status");
CREATE INDEX IF NOT EXISTS "Booking_pitchId_date_idx" ON "Booking" ("pitchId", "date");
