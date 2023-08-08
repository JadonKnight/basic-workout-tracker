"use client";

import TrackExercise from "@/app/workouts/[id]/session/track-exercise";
import { useRef } from "react";
import type { Set } from "@/app/workouts/[id]/session/track-exercise";
import type { FetchWorkoutReturn } from "@/lib/workouts";
interface Props {
  workout: NonNullable<FetchWorkoutReturn>;
  lastSessionSets?: { [key: string]: Set[] };
}

export default function WorkoutTracker({ workout, lastSessionSets }: Props) {
  // Create an object where each key maps to an exercise id and each value
  // is an array of sets performed for each exercise.
  const exerciseSetsRef = useRef(
    Object.fromEntries(
      workout.workoutExercise.map(({ exercise }) => {
        return [exercise.id, [] as Set[]];
      })
    )
  );

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
                // onUpdate={(sets) => {
                //   // Filter out empty sets (empty means no weight)
                //   sets = sets.filter((set) => set.weight !== 0);
                //   setWorkoutSets((prev) => {
                //     return {
                //       ...prev,
                //       [exercise.id]: sets,
                //     };
                //   });
                //   setHasInput(true);
                // }}
              />
            </li>
          ))}
      </ul>
      {/* Finish Workout */}
      <div className="flex flex-row justify-start">
        <button
          className="w-full md:w-fit bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
          // onClick={() => setShowAlert(true)}
        >
          Finish Workout
        </button>
      </div>
    </div>
  );
}
