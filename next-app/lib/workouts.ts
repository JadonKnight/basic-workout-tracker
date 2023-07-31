import prisma from "@/lib/prisma";

export default async function fetchWorkouts(userId: number) {
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      deletedAt: null
    }
  });

  return workouts;
}

export async function fetchWorkout(userId: number, workoutId: number) {
  const workout = await prisma.workout.findFirst({
    where: {
      userId,
      deletedAt: null,
      id: workoutId
    },
    include: {
      workoutExercise: {
        include: {
          exercise: true
        }
      }
    }
  });

  return workout;
}

// Helper function to get the resolved type (I don't understand this...)
type Resolved<T> = T extends Promise<infer R> ? R : T;

// Export the resolved type of the return value
export type FetchWorkoutReturn = Resolved<ReturnType<typeof fetchWorkout>>;
