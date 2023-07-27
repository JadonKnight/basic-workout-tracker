import prisma from "@/lib/prisma";

interface Parameters {
  fromDate?: Date;
  toDate?: Date;
}

export default async function fetchWorkoutSessions(
  userId: number,
  parameters?: Parameters
) {
  const whereClause = {
    AND: [
      { endedAt: { lt: parameters?.toDate } },
      { endedAt: { gt: parameters?.fromDate } },
    ],
    workout: {
      userId,
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
