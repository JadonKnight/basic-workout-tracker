// This api handler returns all sessions for all workouts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import hashId from "@/lib/hashid";
import { Workout } from '@prisma/client';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return GET(req, res);
  }
  res.status(405).end();
}

// NOTE: This is a bit of a mess, and is really only for client side typing.
// Until I do the first full re-write of this app, I'm not going to worry
// about it too much.
export interface SessionData {
  createdAt: Date;
  endedAt: Date | null;
  id: number;
  startedAt: Date | null;
  workout: Workout;
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

  const workoutSessions = await prisma.workoutSession.findMany({
    where: {
      workout: {
        userId: Number(user.id),
      },
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
      // Need to grab the workout name too
      workout: true,
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
