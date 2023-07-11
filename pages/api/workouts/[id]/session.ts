import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import hashId from "@/lib/hashid";
import z from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return POST(req, res);
  }
  res.status(405).end();
}

const workoutSessionSubmissionSchema = z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  workoutSets: z.record(
    z.string().refine((value) => {
      const parsedInt = parseInt(value);
      if (parsedInt && parsedInt > 0) {
        return true;
      }
      return false;
    }),
    z.array(
      z.object({
        weight: z.number(),
        reps: z.number(),
        workingInterval: z.number(),
        restInterval: z.number(),
      })
    )
  ),
});

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;
  if (!user || !Number(user.id)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id: workoutId } = req.query;
  if (!workoutId) {
    return res.status(400).json({ error: "No workout id provided" });
  }
  const parsedWorkoutId = [...workoutId].join("").toString();
  const decodedWorkoutId = Number(hashId.decode(parsedWorkoutId));

  try {
    const parsedBody = workoutSessionSubmissionSchema.parse(req.body);
    const { startTime, endTime, workoutSets } = parsedBody;

    await prisma.$transaction(async (prisma) => {
      // Create the workout session
      const workoutSession = await prisma.workoutSession.create({
        data: {
          startedAt: startTime,
          endedAt: endTime,
          workoutId: decodedWorkoutId,
        },
      });

      // Create all the workout sets
      const workoutSetData = Object.entries(workoutSets).map(
        ([exerciseId, sets]) => {
          // Bit of a sanity check, the above zod schema should prevent this
          // but I'm paranoid
          if (Number.isNaN(Number(exerciseId))) {
            throw new Error("Invalid exercise id");
          }
          return sets.map((set) => {
            return {
              reps: set.reps,
              weight: set.weight,
              workingInterval: set.workingInterval,
              restInterval: set.restInterval,
              workoutExerciseId: Number(exerciseId),
              workoutSessionId: workoutSession.id,
            };
          });
        }
      ).flat();

      await prisma.workoutSet.createMany({
        data: workoutSetData,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Invalid workout session" });
  }

  return res.status(200).json({ message: "Workout Session Completed" });
}
