import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  // Select all exercises from the database
  const exercises = await prisma.exercise.findMany(
    {
      select: {
        name: true,
        description: true,
        id: true
      }
    }
  );

  res.status(200).json(exercises);
}
