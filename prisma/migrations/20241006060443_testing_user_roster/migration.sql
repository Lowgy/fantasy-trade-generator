-- AddForeignKey
ALTER TABLE "rosters" ADD CONSTRAINT "rosters_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
