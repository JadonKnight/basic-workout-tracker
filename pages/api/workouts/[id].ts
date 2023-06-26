import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import hashId from "@/lib/hashid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    return DELETE(req, res);
  }
  if (req.method === "GET") {
    return GET(req, res);
  }
  // TODO: Implement PUT method
  // if (req.method === "PUT") {
  //   return PUT(req, res);
  // }
  res.status(405).end();
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  // Get the session
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userProfile = await prisma.profile.findUnique({
    where: {
      email: user.email?.toString(),
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  const { id: userId } = userProfile?.user || {};

  if (!userId) {
    return res.status(401).json({ error: "No user found..." });
  }

  const { id: workoutId } = req.query;

  if (!workoutId) {
    return res.status(400).json({ error: "No workout id provided" });
  }

  try {
    await prisma.workout.update({
      where: {
        id: Number(hashId.decode(workoutId.toString())),
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return res.status(200).json({ message: "Workout deleted" });
  } catch (error) {
    console.error(error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ error: "Workout not found" });
    }
    return res.status(500).json({ error: "Error deleting workout" });
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  // FIXME: Fix up the session typing here...
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

  const workout = await prisma.workout.findFirst({
    where: {
      id: decodedWorkoutId,
      userId: Number(user.id),
      deletedAt: null,
    },
    select: {
      daysOfWeek: true,
      id: true,
      name: true,
      workoutExercise: {
        select: {
          exercise: {
            select: {
              name: true,
              description: true,
              id: true
            },
          },
        },
      },
    },
  });

  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  res.status(200).json({
    name: workout.name,
    daysOfWeek: workout.daysOfWeek,
    // Probably not a good way to do it... oh well.
    exercises: workout.workoutExercise.map((exercise) => {
      return {
        name: exercise.exercise.name,
        description: exercise.exercise.description,
        id: hashId.encode(exercise.exercise.id)
      };
    }),
    id: hashId.encode(workout.id)
  });
}
