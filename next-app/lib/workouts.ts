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
