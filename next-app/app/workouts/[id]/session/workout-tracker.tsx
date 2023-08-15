"use client";

import TrackExercise from "@/app/workouts/[id]/session/track-exercise";
import { useRef, useState } from "react";
import type { Set } from "@/app/workouts/[id]/session/track-exercise";
import type { FetchWorkoutReturn } from "@/lib/workouts";
import type { TrackExerciseData } from "@/app/workouts/[id]/session/track-exercise";
interface Props {
  workout: NonNullable<FetchWorkoutReturn>;
  lastSessionSets?: { [key: string]: Set[] };
  startTime: Date;
}

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function WorkoutTracker({
  workout,
  lastSessionSets,
  startTime,
}: Props) {
  // Create an object where each key maps to an exercise id and each value
  // is the data returned from the TrackExercise component
  const exerciseSetsRef = useRef(
    Object.fromEntries(
      workout.workoutExercise.map(({ exercise }) => {
        return [exercise.id, undefined as TrackExerciseData | undefined];
      })
    )
  );

  const [incompleteWarning, setIncompleteWarning] = useState(false);

  /**
   * @param {boolean} confirmed - allows user to confirm they wish to
   * submit the exercise even though it isn't complete.
   * @returns {void}
   */
  const onFinishWorkout = (confirmed?: boolean) => {
    //  Check for unfinished exercises and warn the user
    // if there are.
    if (
      !confirmed &&
      !Object.values(exerciseSetsRef.current).every(
        (value) => value?.endedAt !== undefined
      )
    ) {
      setIncompleteWarning(true);
      return;
    }

    // After checking for unfinished workouts, we submit the workout

    // If the workout submission is successful, direct the user to their dashboard

    // If not, we probably need to look at a good 400/500 redirect strategy.

    console.log(exerciseSetsRef.current);
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
      {!incompleteWarning ? (
        <div className="flex flex-row justify-start">
          <button
            className="w-full md:w-fit bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => onFinishWorkout()}
          >
            Finish Workout
          </button>
        </div>
      ) : (
        <Alert className="bg-amber-400 text-white border-amber-400">
          <div className="flex flex-row items-start justify-between">
            <ExclamationCircleIcon height={48} width={48} />
            <div className="flex flex-col ml-2">
              <AlertTitle>Are you sure?</AlertTitle>
              <AlertDescription>
                You have unfinished exercises in this workout.
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="md:w-fit outline outline-white text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={() => setIncompleteWarning(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="md:w-fit bg-blue-400 hover:bg-blue-500 outline outline-blue-400 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={() => onFinishWorkout(true)}
                  >
                    Continue
                  </button>
                </div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
}
