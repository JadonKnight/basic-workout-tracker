// Define our zod based schemas
import z from "zod";

export const exerciseSelectionSchema = z.object({
  name: z.string(),
  id: z.number(),
});

export const exerciseSchema = z.object({
  name: z.string(),
  description: z.string(),
  id: z.string(),
  workoutExerciseId: z.string(),
});

export const workoutSubmissionSchema = z.object({
  name: z.string(),
  exercises: z.array(
    exerciseSelectionSchema
  ),
  daysOfWeek: z.number(),
});

export const workoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  daysOfWeek: z.number(),
  exercises: z.array(exerciseSchema)
});
