import getAuthenticatedUser from "@/lib/authenticated-user";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: Request) {
  const user = await getAuthenticatedUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workouts = await prisma.workout.findMany({
    where: {
      userId: Number(user?.id),
      deletedAt: null,
    },
  });

  return NextResponse.json(workouts);
}
