import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import hashId from "@/lib/hashid";

import z from "zod";
import { workoutSubmissionSchema } from "@/types/schemas";

// TODO: After the prototype is up and running, I want to refactor and improve this backend

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
  if (req.method === "PUT") {
    return PUT(req, res);
  }
  res.status(405).end();
}

// FIXME: We don't make checks that users own their workouts...

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
          id: true,
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
    exercises: workout.workoutExercise.map((_workoutExercise) => {
      return {
        name: _workoutExercise.exercise.name,
        description: _workoutExercise.exercise.description,
        id: hashId.encode(_workoutExercise.id)
      };
    }),
    id: hashId.encode(workout.id)
  });
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
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

  // Validate the request body
  try {
    const workoutSubmission = workoutSubmissionSchema.parse(
      JSON.parse(req.body)
    );

    // Create a new workout
    const workoutUpdate = await prisma.workout.update({
      where: {
        id: decodedWorkoutId
      },
      data: {
        name: workoutSubmission.name,
        daysOfWeek: workoutSubmission.daysOfWeek,
        updatedAt: new Date(),
        workoutExercise: {
          deleteMany: {},
          create: workoutSubmission.exercises.map((exercise) => ({
            exerciseId: exercise.id,
          })),
        },
      },
    });

    res.json({ message: `Updated ${workoutUpdate.name}` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
