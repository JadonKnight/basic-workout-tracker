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
  if (req.method === "GET") {
    return GET(req, res);
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
      const workoutSetData = Object.entries(workoutSets)
        .map(([exerciseId, sets]) => {
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
        })
        .flat();

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

// NOTE: This is a bit of a mess, and is really only for client side typing.
// Until I do the first full re-write of this app, I'm not going to worry
// about it too much.
export interface SessionData {
  createdAt: Date;
  endedAt: Date | null;
  id: number;
  startedAt: Date | null;
  sets: {
    createdAt: Date | null;
    id: number;
    reps: number;
    restInterval: number;
    updatedAt: Date | null;
    weight: number;
    workingInterval: number;
    workoutExercise: {
      exercise: {
        createdAt: Date | null;
        createdById: number | null;
        description: string | null;
        id: string;
        name: string;
        updatedAt: Date | null;
      };
      exerciseId: number;
      id: number;
      workoutId: number;
    };
    workoutExerciseId: number;
    workoutSessionId: number;
  }[];
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
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

  const workoutSessions = await prisma.workoutSession.findMany({
    where: {
      workoutId: decodedWorkoutId,
    },
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // NOTE: I'm hashing the exercise ID
  // but this is all hacky and prototyping
  // I should either define exactly what I want or not do this at all
  const responseData: SessionData[] = workoutSessions.map((session) => {
    const { sets, ...rest } = session;
    const exerciseSets = sets.map((set) => {
      const { workoutExercise, ...rest } = set;
      return {
        ...rest,
        workoutExercise: {
          ...workoutExercise,
          exercise: {
            ...workoutExercise.exercise,
            id: hashId.encode(workoutExercise.exercise.id),
          },
        },
      };
    });
    return {
      ...rest,
      sets: exerciseSets,
    };
  });

  return res.status(200).json({
    workoutSessions: responseData,
  });
}
