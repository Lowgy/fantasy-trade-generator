/*
  Warnings:

  - The primary key for the `players` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `players` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "roster_players" DROP CONSTRAINT "roster_players_playerId_fkey";

-- AlterTable
ALTER TABLE "players" DROP CONSTRAINT "players_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "players_pkey" PRIMARY KEY ("playerId");

-- AddForeignKey
ALTER TABLE "roster_players" ADD CONSTRAINT "roster_players_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("playerId") ON DELETE CASCADE ON UPDATE CASCADE;
