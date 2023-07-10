import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";
import type { ExerciseSelection, Workout } from "@/types/types";

import { getSession } from "next-auth/react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import hashId from "@/lib/hashid";
import TrackSets from "@/components/track-sets";

export default function PerformWorkout({ session }: { session: Session }) {
  const router = useRouter();
  const { id } = router.query;

  const [exercises, setExercises] = useState<ExerciseSelection[]>([]);
  const [workoutName, setWorkoutName] = useState<string | null>("");

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

  return (
    <Layout session={session}>
      <div className={`${"flex"} flex-col flex-grow-1 items-center`}>
        <h2 className="text-2xl p-3 text-center w-full">
          Perform {workoutName}
        </h2>
        <div className="flex flex-col w-full md:w-6/12 p-3">
          {/* Legend to show WI and RI */}
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
          <ul>
            {exercises.map((exercise) => (
              <li key={exercise.id}>
                <TrackSets exerciseName={exercise.name} />
              </li>
            ))}
          </ul>
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
