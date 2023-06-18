/**
 * At the moment the project is small enough for 1 global interface file.
 * If the project grows, we can split this into multiple files.
 */
import z from "zod";
import {
  workoutSubmissionSchema,
  exerciseSelectionSchema,
  workoutSchema,
} from "./schemas";

export interface DaysOfWeekSelection {
  Sunday: boolean;
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
}

export type ExerciseSelection = z.infer<typeof exerciseSelectionSchema>;
export type WorkoutSubmission = z.infer<typeof workoutSubmissionSchema>;
export type Workout = z.infer<typeof workoutSchema>;
