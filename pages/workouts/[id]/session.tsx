import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";
import type { ExerciseSelection, Workout } from "@/types/types";

import { getSession } from "next-auth/react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import hashId from "@/lib/hashid";
import TrackSets from "@/components/track-sets";
import AlertOnUnload from "@/components/alert-on-unload";
import AlertModal from "@/components/alert-modal";

// FIXME: Fix this shit, these are sets not reps fuck my god damn life.
interface Set {
  weight: number;
  reps: number;
  workingInterval: number;
  restInterval: number;
}

interface WorkoutSets {
  [key: string]: Set[];
}

export default function PerformWorkout({ session }: { session: Session }) {
  const router = useRouter();
  const { id } = router.query;

  const [exercises, setExercises] = useState<ExerciseSelection[]>([]);
  const [workoutName, setWorkoutName] = useState<string | null>("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [workoutSets, setWorkoutSets] = useState<WorkoutSets>({});

  const [hasInput, setHasInput] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const finishWorkout = async () => {
    // If exercise sets is empty, just redirect to the workout page
    if (
      Object.values(workoutSets).filter((set) => set.length > 0).length === 0
    ) {
      // Set hasInput to false so the alert doesn't show up
      setShowAlert(false);
      setHasInput(false);
      // FIXME: Using the hasInput flashes the fucking alert with a different screen
      // Wow does front end really suck ball sacks
      router.push("/workouts");
      return;
    }

    const response = await fetch(`/api/workouts/${id}/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        startTime,
        endTime: new Date(),
        workoutSets,
      }),
    });

    if (!response.ok) {
      // Push to 400 or 500 depending on response code
      if (response.status < 500 && response.status >= 400) {
        router.push("/400");
      } else {
        router.push("/500");
      }
    }

    console.log(await response.json());
  };

  // Fetch workout data based on the id and perform any necessary logic
  useEffect(() => {
    const fetchWorkout = async () => {
      const response = await fetch(`/api/workouts/${id}`);

      if (!response.ok) {
        // Push to 400 or 500 depending on response code
        if (response.status < 500 && response.status >= 400) {
          router.push("/400");
        } else {
          router.push("/500");
        }
      }

      const data: Workout = await response.json();
      setWorkoutName(data.name);
      setExercises(
        data.exercises.map((exercise) => {
          return {
            name: exercise.name,
            id: Number(hashId.decode(exercise.id)),
          };
        })
      );
    };
    fetchWorkout();
  }, [id, router]);

  // Set the start date and time
  useEffect(() => {
    setStartTime(new Date());
  }, []);

  // TODO: Remove this
  // Could probably use a unit or integration test
  useEffect(() => {
    console.log(workoutSets);
  }, [workoutSets]);

  // Check if there is any input
  const validWorkout = () => {
    return !(
      Object.values(workoutSets).filter((set) => set.length > 0).length === 0
    );
  };

  return (
    <Layout session={session}>
      <AlertOnUnload changed={hasInput} />
      <AlertModal
        title={validWorkout() ? "Finish Workout" : "Abandon Workout"}
        description={
          validWorkout()
            ? "Are you sure you want to finish this workout?"
            : "You have not entered any data for this workout. Are you sure you want to abandon it?"
        }
        onConfirm={finishWorkout}
        onCancel={() => setShowAlert(false)}
        type={validWorkout() ? "question" : "warning"}
        active={showAlert}
      />
      <div className={`${"flex"} flex-col flex-grow-1 items-center`}>
        <h2 className="text-2xl p-3 text-center w-full">
          Perform {workoutName}
        </h2>
        <div className="flex flex-col w-full md:w-6/12 p-3">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col justify-between sm:hidden">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                <span>WI = Working Interval</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>RI = Rest Interval</span>
              </div>
            </div>
            {/* Add a date and time */}
            <div className="flex flex-col">
              <span className="text-sm">
                Date:{" "}
                {startTime?.toLocaleString("en-US", { dateStyle: "short" })}
              </span>
              <span className="text-sm">
                Start Time:{" "}
                {startTime?.toLocaleString("en-US", { timeStyle: "short" })}
              </span>
            </div>
          </div>
          <ul>
            {exercises.map((exercise) => (
              <li key={exercise.id}>
                <TrackSets
                  exerciseName={exercise.name}
                  onUpdate={(sets) => {
                    // Filter out empty sets (empty means no weight)
                    sets = sets.filter((set) => set.weight !== 0);
                    setWorkoutSets((prev) => {
                      return {
                        ...prev,
                        [exercise.id]: sets,
                      };
                    });
                    setHasInput(true);
                  }}
                />
              </li>
            ))}
          </ul>
          {/* Finish Workout */}
          <div className="flex flex-row justify-start">
            <button
              className="w-full md:w-fit bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => setShowAlert(true)}
            >
              Finish Workout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Check if user is logged in
// If logged in, redirect to homepage
export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ session: Session }>> {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
