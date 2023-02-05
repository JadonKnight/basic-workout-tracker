import { useSession } from "next-auth/react";
import WorkoutFab from "../components/buttons/workout-fab";

export default function Home() {
  const { data: session } = useSession();
  const username = session?.user?.name;

  return (
    <>
      {username ?
        <h1 className="text-2xl font-bold">Welcome {username}</h1>
        :
        <h1 className="text-2xl font-bold">Welcome</h1>
      }
      <WorkoutFab />
    </>
  );
}
