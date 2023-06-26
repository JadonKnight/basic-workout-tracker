import DropdownMenu from "@/components/dropdown-menu";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import type { Workout } from "@/types/types";
import { unmaskDaysOfWeek } from "@/lib/day-bitmask";
import { useState, useEffect } from "react";
import AlertModal from "@/components/alert-modal";
import { useRouter } from "next/router";

interface AlertableWorkout extends Workout {
  alert?: boolean;
}

export default function WorkoutList({
  workoutsProp,
}: {
  workoutsProp: Workout[];
}) {
  const [workouts, setWorkouts] = useState<AlertableWorkout[]>([]);

  const router = useRouter();

  useEffect(() => {
    setWorkouts(workoutsProp);
  }, [workoutsProp]);

  const deleteWorkout = async (id: string) => {
    const response = await fetch(`/api/workouts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      // Since no user input is being used, this should never happen
      // Redirect to error page for now
      // TODO: Create better error handling process.
      router.push("/500");
    }

    // Filter out the removed workout
    setWorkouts(workouts.filter((workout) => workout.id !== id));
  };

  return (
    <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {workouts.map((workout, index) => (
        <li
          key={index}
          className="bg-white shadow rounded-lg p-4 flex flex-col"
        >
          <AlertModal
            title={`${workout.name}`}
            description="Are you sure you want to delete this workout?"
            onConfirm={async () => {
              deleteWorkout(workout.id);
            }}
            onCancel={() => {
              setWorkouts(
                workouts.map((_workout) => {
                  if (_workout.id === workout.id) {
                    return { ...workout, alert: false };
                  }
                  return _workout;
                }
                )
              );
            }}
            active={workout.alert || false}
          />
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{workout.name}</h3>
            <div className="relative">
              <DropdownMenu
                items={[
                  {
                    name: "Edit",
                    href: `/workout/${workout.id}`,
                    icon: <PencilIcon className="w-4 h-4" />,
                  },
                  {
                    name: "Delete",
                    onClick: () => {
                      setWorkouts(
                        workouts.map((_workout) => {
                          if (_workout.id === workout.id) {
                            return { ...workout, alert: true };
                          }
                          return _workout;
                        }
                        )
                      );
                    },
                    icon: <TrashIcon className="w-4 h-4" />,
                  },
                ]}
              />
            </div>
          </div>
          <div className="flex justify-between flex-col sm:flex-row">
            <div className="mt-4 flex items-center flex-wrap">
              {Object.entries(unmaskDaysOfWeek(workout.daysOfWeek)).map(
                ([day, value], index) => {
                  if (value) {
                    return (
                      <span
                        key={index}
                        className="my-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm mr-2"
                      >
                        {day}
                      </span>
                    );
                  }
                }
              )}
            </div>
            <div className="mt-4">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Start Workout
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
