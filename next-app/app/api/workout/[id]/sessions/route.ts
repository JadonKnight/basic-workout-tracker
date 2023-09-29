import { NextResponse } from "next/server";
import hashId from "@/lib/hashid";
import prisma from "@/lib/prisma";
import z from "zod";
import getAuthenticatedUser from "@/lib/authenticated-user";

const setSchema = z.object({
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional(),
  reps: z.number().nonnegative(),
  weight: z.number().nonnegative().optional(),
  restInterval: z.number().nonnegative().optional(),
});

const workoutExerciseDataSchema = z.union([
  z.object({
    startedAt: z.coerce.date().optional(),
    endedAt: z.coerce.date().optional(),
    sets: z.array(setSchema),
  }),
  z.undefined(),
]);

const createWorkoutSchema = z.object({
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  workoutData: z.record(workoutExerciseDataSchema),
});

export type CreateWorkoutSchemaData = z.infer<typeof createWorkoutSchema>;

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: workoutId } = params;
  const decodedWorkoutId = Number(hashId.decode(workoutId));

  const res = await request.json();

  let workoutSessionId: number | undefined;

  try {
    const parsedData = createWorkoutSchema.parse(res);
    const { startedAt, endedAt, workoutData } = parsedData;

    await prisma.$transaction(async (prisma) => {
      // Create the workout session
      const workoutSession = await prisma.workoutSession.create({
        data: {
          startedAt,
          endedAt,
          workoutId: decodedWorkoutId,
        },
      });

      workoutSessionId = workoutSession.id;

      // Create all the workout sets
      const workoutSetData = Object.entries(workoutData)
        .map(([exerciseId, sets]) => {
          return (sets?.sets ?? []).map((set) => {
            return {
              reps: set.reps,
              weight: set.weight,
              restInterval: set.restInterval,
              startedAt: set.startedAt,
              endedAt: set.endedAt,
              workoutExerciseId: Number(exerciseId),
              workoutSessionId: workoutSession.id,
            };
          });
        })
        .flat();

      await prisma.workoutSet.createMany({
        data: workoutSetData,
      });

      // Return the created session
      return NextResponse.json({
        workoutSession,
      });
    });
  } catch (err) {
    console.error(err);
    // TODO: Write a custom error class that abstracts
    // the standard Error class to provide messages
    // based on the common errors we get such as zod errors
    // and database errors.
    if (err instanceof z.ZodError) {
      // Invalid request params
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  if (workoutSessionId === undefined) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
  return NextResponse.json({
    workoutSessionId,
  });
}
