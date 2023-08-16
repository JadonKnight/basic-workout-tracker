-- AlterTable
ALTER TABLE "WorkoutExercise" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "WorkoutSet" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "workingInterval" DROP NOT NULL,
ALTER COLUMN "restInterval" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;
