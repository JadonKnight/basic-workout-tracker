// Begin the hardest rework of performing session
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
        <div className="flex flex-row justify-between text-white">
          <div className="flex flex-col sm:hidden">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
              <span>WI = Working Interval</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>RI = Rest Interval</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">
              Date: {startTime?.toLocaleString("en-US", { dateStyle: "short" })}
            </span>
            <span className="text-sm">
              Start Time:{" "}
              {startTime?.toLocaleString("en-US", { timeStyle: "short" })}
            </span>
            <span className="text-sm">
              <Timer />
            </span>
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
