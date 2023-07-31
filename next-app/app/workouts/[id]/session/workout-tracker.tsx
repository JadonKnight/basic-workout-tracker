import TrackSets from "@/components/track-sets";
import type { Set } from "@/components/track-sets";
import type { FetchWorkoutReturn } from "@/lib/workouts";

interface Props {
  workout: FetchWorkoutReturn;
  lastSessionSets?: { [key: string]: Set[] };
}
export default function WorkoutTracker({ workout, lastSessionSets }: Props) {
  return (
    <div className="flex flex-col">
      {/* This here needs to be embedded in a client side component */}
      <ul>
        {workout?.workoutExercise
          .map((exercise) => exercise.exercise)
          .map((exercise) => (
            <li key={exercise.id}>
              <TrackSets
                exerciseName={exercise.name}
                prevSessionSets={
                  lastSessionSets ? lastSessionSets[exercise.id] : []
                }
                // onUpdate={(sets) => {
                //   // Filter out empty sets (empty means no weight)
                //   sets = sets.filter((set) => set.weight !== 0);
                //   setWorkoutSets((prev) => {
                //     return {
                //       ...prev,
                //       [exercise.id]: sets,
                //     };
                //   });
                //   setHasInput(true);
                // }}
              />
            </li>
          ))}
      </ul>
      {/* Finish Workout */}
      <div className="flex flex-row justify-start">
        <button
          className="w-full md:w-fit bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
          // onClick={() => setShowAlert(true)}
        >
          Finish Workout
        </button>
      </div>
    </div>
  );
}
