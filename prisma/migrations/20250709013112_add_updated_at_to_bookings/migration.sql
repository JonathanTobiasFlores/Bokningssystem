/*
  Warnings:

  - Added the required column `updatedAt` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "timeSlotId" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    CONSTRAINT "bookings_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "time_slots" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("createdAt", "date", "endTime", "id", "roomId", "startTime", "status", "timeSlotId", "userName", "updatedAt") SELECT "createdAt", "date", "endTime", "id", "roomId", "startTime", "status", "timeSlotId", "userName", "createdAt" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
CREATE UNIQUE INDEX "bookings_roomId_date_timeSlotId_key" ON "bookings"("roomId", "date", "timeSlotId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
