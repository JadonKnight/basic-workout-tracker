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
