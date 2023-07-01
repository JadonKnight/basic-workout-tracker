import Link from "next/link";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";
import Layout from "@/components/layout";

export default function Dashboard({ session }: { session: Session }) {
  return (
    <Layout session={session}>
      <div className="bg-gray-100">
        {/* User Dashboard Section */}
        <section className="py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome, {session?.user?.name}!
            </h1>
            <p className="text-lg mb-8">
              Start tracking and improving your workouts now.
            </p>
            <div className="md:space-x-4 space-y-4 md:space-y-0 px-4 flex justify-center flex-col md:flex-row">
              <Link
                href="/workouts/new"
                className="bg-white text-blue-500 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-md font-semibold"
              >
                Create New Workout
              </Link>
              <Link
                href="/workouts"
                className="bg-white text-green-500 hover:bg-green-600 hover:text-white px-6 py-3 rounded-md font-semibold"
              >
                Your Workouts
              </Link>
              <Link
                href="/workouts/statistics"
                className="bg-white text-indigo-500 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-md font-semibold"
              >
                Stats
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

// Check if user is logged in
// If logged in, redirect to dashboard
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
