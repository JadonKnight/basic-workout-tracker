import fetchServerSideSession from "@/lib/fetchServerSideSession";
import { redirect } from "next/navigation";
import hashid from "@/lib/hashid";
import { notFound } from "next/navigation";
import { fetchWorkout } from "@/lib/workouts";
import EditWorkout from "./edit-workout";

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

  return (
    <div className={"flex flex-col flex-grow-1 items-center"}>
    <div className="flex flex-col w-full md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-5/12 p-3">
      <h2 className="text-2xl p-3 pl-0 text-white font-bold w-full">
        Edit {workout.name}
      </h2>
      <EditWorkout workout={workout}/>
    </div>
  </div>
  );
}
