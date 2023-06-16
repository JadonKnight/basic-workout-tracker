// Define our zod based schemas
import z from "zod";

export const exerciseSelectionSchema = z.object({
  name: z.string(),
  id: z.number(),
});

export const workoutSubmissionSchema = z.object({
  name: z.string(),
  exercises: z.array(
    exerciseSelectionSchema
  ),
  daysOfWeek: z.number(),
});
