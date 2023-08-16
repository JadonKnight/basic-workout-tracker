/*
  Warnings:

  - You are about to drop the column `endedAt` on the `WorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `WorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `workingInterval` on the `WorkoutSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkoutExercise" DROP COLUMN "endedAt",
DROP COLUMN "startedAt";

-- AlterTable
ALTER TABLE "WorkoutSet" DROP COLUMN "workingInterval";
