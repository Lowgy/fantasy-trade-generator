/*
  Warnings:

  - You are about to drop the `rosters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "rosters";

-- CreateTable
CREATE TABLE "teams" (
    "id" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "avatar" TEXT,
    "players" TEXT[],

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);
