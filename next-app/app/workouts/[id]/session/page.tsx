// TODO: WIP migration from pages router

import { fetchWorkout } from "@/lib/workouts";
import fetchWorkoutSessions from "@/lib/workoutSessions";
import fetchServerSideSession from "@/lib/fetchServerSideSession";
import { redirect } from "next/navigation";
import hashid from "@/lib/hashid";
import { notFound } from "next/navigation";
import Timer from "@/components/timer";
import WorkoutTracker from "./workout-tracker";

import type { Set } from "@/components/track-sets";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await fetchServerSideSession();

  if (!session) {
    redirect("/");
  }

  const workoutId = Number(hashid.decode(params.id)[0]);
  const workout = await fetchWorkout(Number(session.user.id), workoutId);

  if (!workout) {
    notFound();
  }

  const workoutSessions = await fetchWorkoutSessions(Number(session.user.id), {
    workoutId,
  });
  const lastWorkoutSession = workoutSessions[0];

  const lastWorkoutSessionSets = (lastWorkoutSession?.sets || []).reduce(
    (acc, curr) => {
      const { workoutExercise } = curr;
      const set = {
        weight: curr.weight,
        reps: curr.reps,
        workingInterval: curr.workingInterval,
        restInterval: curr.restInterval,
      };
      return {
        ...acc,
        [workoutExercise.exercise.id]: [
          ...(acc[workoutExercise.id] || []),
          set,
        ],
      };
    },
    {} as {
      [key: string]: Set[];
    }
  );

  const startTime = new Date();

  return (
    <div className={"flex flex-col flex-grow-1 items-center"}>
      <div className="flex flex-col w-full md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-5/12 p-3">
        <h2 className="text-2xl p-3 pl-0 text-white font-bold w-full">
          Perform {workout.name}
        </h2>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col text-white">
            <span className="text-sm sm:text-base">
              Date: {startTime?.toLocaleString("en-US", { dateStyle: "short" })}
            </span>
            <span className="text-sm sm:text-base">
              Start Time:{" "}
              {startTime?.toLocaleString("en-US", { timeStyle: "short" })}
            </span>
          </div>
          <div className="flex flex-col">
            <Timer />
          </div>
        </div>
        <WorkoutTracker
          workout={workout}
          lastSessionSets={lastWorkoutSessionSets}
        />
      </div>
    </div>
  );
}
