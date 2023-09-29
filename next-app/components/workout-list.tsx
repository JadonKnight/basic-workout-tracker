"use client";

import DropdownMenu from "@/components/dropdown-menu";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { unmaskDaysOfWeek } from "@/lib/day-bitmask";
import { useState, useEffect } from "react";
import AlertModal from "@/components/alert-modal";
import Link from "next/link";
import hashId from "@/lib/hashid";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

interface Workout {
  id: number;
  name: string;
  daysOfWeek: number;
  alert?: boolean;
}

export default function WorkoutList() {
  const queryClient = useQueryClient();

  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: async () => {
      const res = await fetch("/api/workout", {
        cache: "no-cache",
      });

      const data = await res.json();

      return data as Workout[];
    },
    useErrorBoundary: true,
  });

  useEffect(() => {
    if (data) setWorkouts(data);
  }, [data]);

  const deleteWorkout = async (id: number) => {
    const response = await fetch(`/api/workouts/${hashId.encode(id)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Could not delete workout");
    }

    setWorkouts(workouts.filter((workout) => workout.id !== id));

    // Invalidate the query cache since the data is changed
    queryClient.invalidateQueries({ queryKey: ["workouts"] });
  };

  const { mutate: doDeleteWorkout } = useMutation(deleteWorkout, {
    useErrorBoundary: true,
  });

  if (isLoading) return <Loader />;

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
              doDeleteWorkout(workout.id);
            }}
            onCancel={() => {
              setWorkouts(
                workouts.map((_workout) => {
                  if (_workout.id === workout.id) {
                    return { ...workout, alert: false };
                  }
                  return _workout;
                })
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
                    href: `/workouts/${hashId.encode(workout.id)}`,
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
                        })
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
              <Link
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                href={`/workouts/${hashId.encode(workout.id)}/session`}
              >
                Start Workout
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

function Loader() {
  return (
    <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(4)].map((_x, i) => {
        return (
          <li
            className="bg-gray-300 rounded-lg p-4 flex flex-col"
            key={i}
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
