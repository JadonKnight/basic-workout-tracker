import Link from "next/link";
import fetchServerSideSession from "@/lib/fetchServerSideSession";

export default async function Page() {
  const session = await fetchServerSideSession();
  const user = session?.user;

  return (
    <section className="py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome {user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-lg mb-8">
          Start tracking and improving your workouts now.
        </p>
        <div className="md:space-x-4 space-y-4 md:space-y-0 px-4 flex justify-center flex-col md:flex-row">
          <Link
            href="/workouts/new"
            className="shadow-md bg-white text-blue-500 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-md font-semibold"
          >
            Create New Workout
          </Link>
          <Link
            href="/workouts"
            className="shadow-md bg-white text-green-500 hover:bg-green-600 hover:text-white px-6 py-3 rounded-md font-semibold"
          >
            Your Workouts
          </Link>
          <Link
            href="/history"
            className="shadow-md bg-white text-indigo-500 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-md font-semibold"
          >
            Workout History
          </Link>
        </div>
      </div>
    </section>
  );
}
