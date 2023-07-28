import WorkoutList from "@/components/workout-list";
import fetchWorkouts from "@/lib/workouts";
import fetchServerSideSession from "@/lib/fetchServerSideSession";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await fetchServerSideSession();

  if (!session) {
    redirect("/login");
  }

  const workouts = (await fetchWorkouts(Number(session?.user?.id))).map(
    (workout) => {
      // Typed this weird way to keep the linter happy :)
      const {
        createdAt: _createdAt,
        deletedAt: _deletedAt,
        updatedAt: _updatedAt,
        ...rest
      } = workout;
      return rest;
    }
  );

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="flex flex-col w-full md:w-6/12 p-3 items-center">
          <h2 className="text-2xl p-3 text-white font-bold w-full">Your Workouts</h2>
        </div>
      </div>
      <div className="p-4">
        <WorkoutList workoutsProp={workouts} />
      </div>
    </>
  );
}
