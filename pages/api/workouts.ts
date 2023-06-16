// Setup a handler to create a workout
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import z from "zod";
import { workoutSubmissionSchema } from "@/types/schemas";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

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

// FIXME: Need to implement logging through here as well
async function POST(req: NextApiRequest, res: NextApiResponse) {
  // Get the session
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Validate the request body
  try {
    const workoutSubmission = workoutSubmissionSchema.parse(
      JSON.parse(req.body)
    );

    const userProfile = await prisma.profile.findUnique({
      where: {
        email: user.email?.toString(),
      },
      select: {
        user: {
          select: {
            id: true,
          },
        }
      }
    });

    const { id: userId} = userProfile?.user || {};

    if (!userId) {
      return res.status(401).json({ error: "No user found..." });
    }

    // Create a new workout
    const workout = await prisma.workout.create({
      data: {
        name: workoutSubmission.name,
        daysOfWeek: workoutSubmission.daysOfWeek,
        userId: userId,
        workoutExercise: {
          create: workoutSubmission.exercises.map((exercise) => ({
            exerciseId: exercise.id,
          })),
        },
      },
    });

    res.json({ message: "Workout created", workout });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      throw error;
    }
  }
}

// TODO: Get this working to get workouts.
function GET(req: NextApiRequest, res: NextApiResponse) {
  res.json({ message: "GET /api/workout" });
}
