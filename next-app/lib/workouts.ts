import prisma from "@/lib/prisma";

export default async function fetchWorkouts(userId: number) {
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      deletedAt: null,
    },
  });

  return workouts;
}

// This function is different to above because I use its return value
// to pass from a server component to client and we can't have Date objects.
// This seems more sensible than writing filter functions on the client.

// If I need dates I can always write additions here to include them in.
export async function fetchWorkout(userId: number, workoutId: number) {
  const workout = await prisma.workout.findFirst({
    where: {
      userId,
      deletedAt: null,
      id: workoutId,
    },
    select: {
      id: true,
      name: true,
      userId: true,
      daysOfWeek: true,
      workoutExercise: {
        where: { isActive: true },
        select: {
          id: true,
          workoutId: true,
          exercise: {
            select: {
              id: true,
              description: true,
              name: true,
              createdById: true,
            },
          },
        },
      },
    },
  });

  return workout;
}

// Helper function to get the resolved type (I don't understand this...)
type Resolved<T> = T extends Promise<infer R> ? R : T;

// Export the resolved type of the return value
export type FetchWorkoutReturn = Resolved<ReturnType<typeof fetchWorkout>>;
