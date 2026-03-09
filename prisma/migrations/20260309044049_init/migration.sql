-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pitchId" TEXT NOT NULL,
    "pitchName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "timeLabel" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "players" INTEGER NOT NULL,
    "priceFull" INTEGER NOT NULL,
    "depositPaid" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "bookedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeSessionId" TEXT
);
