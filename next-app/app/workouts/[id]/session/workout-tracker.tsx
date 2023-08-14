"use client";

import TrackExercise from "@/app/workouts/[id]/session/track-exercise";
import { useRef } from "react";
import type { Set } from "@/app/workouts/[id]/session/track-exercise";
import type { FetchWorkoutReturn } from "@/lib/workouts";
import type { TrackExerciseData } from "@/app/workouts/[id]/session/track-exercise";
interface Props {
  workout: NonNullable<FetchWorkoutReturn>;
  lastSessionSets?: { [key: string]: Set[] };
}

export default function WorkoutTracker({ workout, lastSessionSets }: Props) {
  // Create an object where each key maps to an exercise id and each value
  // is the data returned from the TrackExercise component
  const exerciseSetsRef = useRef(
    Object.fromEntries(
      workout.workoutExercise.map(({ exercise }) => {
        return [exercise.id, undefined as TrackExerciseData | undefined];
      })
    )
  );

  // NOTE: We should probably anticipate sets and their completion
  // and then warn user when they attempt to finish workout with unfinished sets
  // but make sure we still submit partially finished sets meaning we likely
  // need to pass data up from TrackExercise after each set is complete
  // anyway.

  const onFinishWorkout = () => {
    //  Check if there are unfinished workouts
    // if so warn the user asking if they wish to progress?

    // After checking for unfinished workouts, we submit the workout

    // If the workout submission is successful, direct the user to their dashboard

    // If not, handle the issue using the new app router way of error handling I think?
  };

  return (
    <div className="flex flex-col">
      <ul>
        {workout?.workoutExercise
          .map((exercise) => exercise.exercise)
          .map((exercise) => (
            <li key={exercise.id}>
              <TrackExercise
                exerciseName={exercise.name}
                prevSessionSets={
                  lastSessionSets ? lastSessionSets[exercise.id] : []
                }
                onExerciseDataChange={(exerciseData) => {
                  exerciseSetsRef.current[exercise.id] = exerciseData;
                }}
              />
            </li>
          ))}
      </ul>
      {/* Finish Workout */}
      <div className="flex flex-row justify-start">
        <button
          className="w-full md:w-fit bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={onFinishWorkout}
        >
          Finish Workout
        </button>
      </div>
    </div>
  );
}
