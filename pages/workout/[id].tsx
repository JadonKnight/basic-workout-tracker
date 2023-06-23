import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";

export default function Workout({ session }: { session: Session }) {
  const router = useRouter();
  const { id } = router.query;
  const [workout, setWorkout] = useState(null);

  // TODO: Now I am finally fetching workout data, time to display it
  // and allow it to be updated.

  // Fetch workout data based on the id and perform any necessary logic
  useEffect(() => {
    const fetchWorkout = async () => {
      const response = await fetch(`/api/workouts/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("the data is - ", data);
        setWorkout(data);
      }
    };
    fetchWorkout();
  }, [id]);

  return (
    <Layout session={session}>
      <div>
        <h1>Workout Page</h1>
        <p>Workout ID: {id}</p>
        {/* Add the rest of your workout details here */}
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
