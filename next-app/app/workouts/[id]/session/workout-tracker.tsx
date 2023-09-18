"use client";

import TrackExercise from "@/app/workouts/[id]/session/track-exercise";
import { useRef, useState, useEffect } from "react";
import { InlineLoader } from "@/components/loader";
import hashId from "@/lib/hashid";
import { useRouter } from "next/navigation";

import type { Set } from "@/app/workouts/[id]/session/track-exercise";
import type { FetchWorkoutReturn } from "@/lib/workouts";
import type { TrackExerciseData } from "@/app/workouts/[id]/session/track-exercise";

// Trying to make sure our backend source of truth is at least kind of
// followed according to the typesafety checks with zod.
import type { CreateWorkoutSchemaData } from "@/app/api/workout/[id]/sessions/route";
interface Props {
  workout: NonNullable<FetchWorkoutReturn>;
  lastSessionSets?: { [key: string]: Set[] };
  startTime: Date;
  workoutId: number;
}

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function WorkoutTracker({
  workout,
  lastSessionSets,
  startTime,
  workoutId,
}: Props) {
  const router = useRouter();

  // Create an object where each key maps to a workout exercise id and each value
  // is the data returned from the TrackExercise component
  const exerciseSetsRef = useRef(
    Object.fromEntries(
      workout.workoutExercise.map(({ id }) => {
        return [id, undefined as TrackExerciseData | undefined];
      })
    )
  );

  const [incompleteWarning, setIncompleteWarning] = useState(false);
  const [submittingWorkout, setSubmittingWorkout] = useState(false);
  const [errorSubmitting, setErrorSubmitting] = useState(false);

  /**
   * @param {boolean} confirmed - allows user to confirm they wish to
   * submit the exercise even though it isn't complete.
   * @returns {Promise<void>}
   */
  const onFinishWorkout = async (confirmed?: boolean): Promise<void> => {
    if (errorSubmitting) setErrorSubmitting(false);
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

    setIncompleteWarning(false);
    setSubmittingWorkout(true);

    const workoutData = exerciseSetsRef.current;

    const data: CreateWorkoutSchemaData = {
      startedAt: startTime,
      endedAt: new Date(),
      workoutData: workoutData ?? {},
    };

    const response = await fetch(
      `/api/workout/${hashId.encode(workoutId)}/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    // TODO:
    // Display an error modal and reset the UI so they can attempt another go.
    if (!response.ok) {
      setErrorSubmitting(true);
    }

    // TODO: Instead of redirecting to dashboard we will instead be re-directing
    // to the workout summary. This will either be a seperate page,
    // or possibly a non-routeable page but a page in a page (using the new nextjs features)
    // which overlays as a full page modal. This will then have linkage back to the dashboard.
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col">
      <ul>
        {workout?.workoutExercise
          .map(({id, exercise}) => {
            return (
              <li key={id}>
                <TrackExercise
                  exerciseName={exercise.name}
                  prevSessionSets={
                    lastSessionSets ? lastSessionSets[id] : []
                  }
                  onExerciseDataChange={(exerciseData) => {
                    exerciseSetsRef.current[id] = exerciseData;
                  }}
                />
              </li>
            );
          })}
      </ul>
      <InlineLoader active={submittingWorkout}>
        {errorSubmitting ? (
          <Alert className="bg-red-500 text-white">
            <div className="flex flex-row items-start justify-between">
              <ExclamationCircleIcon height={48} width={48} />
              <div className="flex flex-col ml-2">
                <AlertTitle className="font-bold">
                  Error Submitting Workout!
                </AlertTitle>
                <AlertDescription className="font-semibold">
                  Please try submitting again, if this issue continues please
                  contact{" "}
                  <a
                    href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                    className="text-white underline"
                  >
                    support
                  </a>
                  .
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ) : null}
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
          <Alert className="bg-white text-amber-500 shadow-white shadow-sm">
            <div className="flex flex-row items-start justify-between">
              <div className="flex flex-col ml-2">
                <AlertTitle className="font-bold">Are you sure?</AlertTitle>
                <AlertDescription className="font-semibold">
                  You have unfinished exercises in this workout.
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="md:w-fit outline outline-black text-black font-bold py-2 px-4 rounded mt-4"
                      onClick={() => setIncompleteWarning(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="md:w-fit bg-black outline outline-black text-white font-bold py-2 px-4 rounded mt-4"
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
      </InlineLoader>
    </div>
  );
}
