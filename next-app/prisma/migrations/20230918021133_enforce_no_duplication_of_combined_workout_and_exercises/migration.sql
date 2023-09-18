/*
  Warnings:

  - A unique constraint covering the columns `[workoutId,exerciseId]` on the table `WorkoutExercise` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkoutExercise_workoutId_exerciseId_key" ON "WorkoutExercise"("workoutId", "exerciseId");
