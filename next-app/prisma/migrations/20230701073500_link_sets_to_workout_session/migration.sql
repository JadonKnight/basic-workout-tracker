/*
  Warnings:

  - Added the required column `workoutSessionId` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "workoutSessionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workoutSessionId_fkey" FOREIGN KEY ("workoutSessionId") REFERENCES "WorkoutSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
