import Link from "next/link";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";

export default function Dashboard({ session } : { session: Session }) {
  return (
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
          <div className="space-x-4">
            <Link
              href="/workout/new"
              className="bg-white text-blue-500 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-md font-semibold"
            >
              Create Workout
            </Link>
            <Link
              href="/workout/stats"
              className="bg-white text-indigo-500 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-md font-semibold"
            >
              View Statistics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Check if user is logged in
// If logged in, redirect to dashboard
export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ session: Session | null }>> {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
