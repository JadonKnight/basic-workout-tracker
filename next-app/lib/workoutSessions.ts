import prisma from "@/lib/prisma";

interface Parameters {
  fromDate?: Date;
  toDate?: Date;
  workoutId?: number;
}

export default async function fetchWorkoutSessions(
  userId: number,
  parameters?: Parameters
) {
  const whereClause = {
    // FIXME: Use the destructuring pattern like below to fix this up.
    AND: [
      { endedAt: { lt: parameters?.toDate } },
      { endedAt: { gt: parameters?.fromDate } },
    ],
    workout: {
      userId,
      ...(parameters !== undefined && parameters.workoutId !== undefined
        ? { id: parameters.workoutId }
        : {}),
    },
  };

  const workoutSessions = await prisma.workoutSession.findMany({
    where: whereClause,
    include: {
      sets: {
        include: {
          workoutExercise: {
            include: {
              exercise: true,
            },
          },
        },
      },
      workout: true,
    },
    orderBy: {
      endedAt: "desc",
    },
  });

  return workoutSessions;
}
