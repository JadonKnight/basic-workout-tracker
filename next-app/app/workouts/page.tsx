import WorkoutList from "@/components/workout-list";
import fetchServerSideSession from "@/lib/fetchServerSideSession";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await fetchServerSideSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="flex flex-col w-full md:w-6/12 p-3 items-center">
          <h2 className="text-2xl p-3 text-white font-bold w-full">
            Your Workouts
          </h2>
        </div>
      </div>
      <div className="p-4">
        <WorkoutList />
      </div>
    </>
  );
}
