import Layout from "@/components/layout";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";
import type { Workout } from "@/types/types";
import { useEffect, useState } from "react";
import WorkoutList from "@/components/workout-list";

export default function WorkoutPage({ session }: { session: Session }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const res = await fetch("/api/workouts");
      const { workouts }: { workouts: Workout[] } = await res.json();
      setWorkouts(workouts);
    };

    fetchWorkouts();

    return () => undefined;
  }, []);

  return (
    <Layout session={session}>
      <div className="flex w-full justify-center">
        <div className="flex flex-col w-full md:w-6/12 p-3 items-center">
          <h2 className="text-2xl p-3 text-start w-full">
            Your Workouts
          </h2>
        </div>
      </div>
      <div className="p-4">
        <WorkoutList workoutsProp={workouts}/>
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
