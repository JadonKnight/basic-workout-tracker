import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import hashId from "@/lib/hashid";

import SelectWorkout from "../../components/select-exercise";
import { TrashIcon } from "@heroicons/react/24/outline";
import type {
  DaysOfWeekSelection,
  ExerciseSelection,
  Workout,
  WorkoutSubmission,
} from "@/types/types";
import { maskDaysOfWeek, unmaskDaysOfWeek } from "@/lib/day-bitmask";

// TODO: Implement back button and api
export default function Workout({ session }: { session: Session }) {
  // Loaded Workout
  const router = useRouter();
  const { id } = router.query;
  const [workout, setWorkout] = useState<Workout | null>(null);

  // Editable data
  const [exercises, setExercises] = useState<ExerciseSelection[]>([
    { name: "", id: NaN },
  ]);
  const [invalidExercise, setInvalidExercise] = useState<boolean>(false);
  const [invalidWorkoutName, setInvalidWorkoutName] = useState<boolean>(false);
  const [daysOfWeek, setDaysOfWeek] = useState<DaysOfWeekSelection>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  const [invalidDaysOfWeek, setInvalidDaysOfWeek] = useState<boolean>(false);
  const [workoutName, setWorkoutName] = useState<string | null>("");

  // Fetch workout data based on the id and perform any necessary logic
  useEffect(() => {
    const fetchWorkout = async () => {
      const response = await fetch(`/api/workouts/${id}`);
      if (response.ok) {
        const data: Workout = await response.json();
        setWorkout(data);
        setWorkoutName(data.name);
        setDaysOfWeek(unmaskDaysOfWeek(data.daysOfWeek));
        setExercises(
          data.exercises.map((exercise) => {
            return {
              name: exercise.name,
              id: Number(hashId.decode(exercise.id)),
            };
          })
        );
      }
    };
    fetchWorkout();
  }, [id]);

  const handleRemoveExercise = (index: number) => {
    // If there is only one exercise, don't remove it
    if (exercises.length === 1) {
      return;
    }
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const submitWorkout = async () => {
    let isValid = true;

    if (!workoutName) {
      setInvalidWorkoutName(true);
      isValid = false;
    }

    const filteredExercises = exercises.filter(
      (exercise) => exercise.name !== ""
    );

    if (filteredExercises.length === 0) {
      setInvalidExercise(true);
      isValid = false;
    }

    if (Object.values(daysOfWeek).every((day) => day === false)) {
      setInvalidDaysOfWeek(true);
      isValid = false;
    }

    if (!isValid) return;

    const data: WorkoutSubmission = {
      name: workoutName as string,
      exercises: filteredExercises,
      daysOfWeek: maskDaysOfWeek(daysOfWeek),
    };

    // TODO: Change this to PUT since we will update the entire workout
    const response = await fetch(`/api/workouts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    // // TODO: Fix this - I need a protocol for handling errors
    if (!response.ok && response.status >= 500) {
      // Router.push("/500");
      console.error("Server error");
    } else if (!response.ok) {
      // Router.push("/400");
      console.error("Client error");
    }

    // Router.push("/");
  };

  const handleWorkoutNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkoutName(e.target.value);
    setInvalidWorkoutName(false);
  };

  const handleAddWeekday = (day: keyof DaysOfWeekSelection) => {
    setDaysOfWeek({ ...daysOfWeek, [day]: !daysOfWeek[day] });
    setInvalidDaysOfWeek(false);
  };

  return (
    <Layout session={session}>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl p-3 text-center w-full">
          Edit {workout?.name || "Workout"}
        </h2>
        <div className="flex flex-col w-full md:w-6/12 p-3">
          <label className="text-xl">Workout Name</label>
          <input
            type="text"
            value={workoutName || ""}
            onChange={handleWorkoutNameChange}
            className="bg-white p-3 border-white rounded focus-visible:outline-slate-400"
          />
          {invalidWorkoutName && (
            <p className="text-red-500">Please enter a workout name</p>
          )}
        </div>

        {/* Select days of week */}
        <div className="flex flex-col w-full md:w-6/12 p-3">
          <label className="text-xl">Select Days of Week</label>
          {/* setup a 3 by 3 grid for each checkbox */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={daysOfWeek.Monday || false}
                className="form-checkbox"
                onChange={() => {
                  handleAddWeekday("Monday");
                }}
              />
              <label className="ml-2">Monday</label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={daysOfWeek.Tuesday || false}
                className="form-checkbox"
                onChange={() => {
                  handleAddWeekday("Tuesday");
                }}
              />
              <label className="ml-2">Tuesday</label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={daysOfWeek.Wednesday || false}
                className="form-checkbox"
                onChange={() => {
                  handleAddWeekday("Wednesday");
                }}
              />
              <label className="ml-2">Wednesday</label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={daysOfWeek.Thursday || false}
                className="form-checkbox"
                onChange={() => {
                  handleAddWeekday("Thursday");
                }}
              />
              <label className="ml-2">Thursday</label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={daysOfWeek.Friday || false}
                className="form-checkbox"
                onChange={() => {
                  handleAddWeekday("Friday");
                }}
              />
              <label className="ml-2">Friday</label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={daysOfWeek.Saturday || false}
                className="form-checkbox"
                onChange={() => {
                  handleAddWeekday("Saturday");
                }}
              />
              <label className="ml-2">Saturday </label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={daysOfWeek.Sunday || false}
                className="form-checkbox"
                onChange={() => {
                  handleAddWeekday("Sunday");
                }}
              />
              <label className="ml-2">Sunday</label>
            </div>
          </div>
          {invalidDaysOfWeek && (
            <p className="text-red-500">Please select at least one day</p>
          )}
        </div>

        {/* Select Workout */}
        <div className="flex flex-col w-full md:w-6/12 p-3">
          <label className="text-xl">Select Exercises</label>
          {exercises.map((exercise, i) => (
            <div key={i} className="flex flex-row justify-between my-1">
              <SelectWorkout
                onSelected={(selection) => {
                  exercises[i] = selection;
                  setInvalidExercise(false);
                }}
                currentSelection={exercise.id}
              />
              <button
                className="bg-white rounded p-3 ml-3"
                onClick={() => handleRemoveExercise(i)}
              >
                <TrashIcon className="w-8 h-8" />
              </button>
            </div>
          ))}
          {invalidExercise && (
            <p className="text-red-500">Please select at least one exercise</p>
          )}
        </div>

        {/* Add workout button */}
        <div className="flex flex-col w-full md:w-6/12 p-3 items-center">
          <button
            onClick={() => {
              setExercises([...exercises, { name: "", id: NaN }]);
            }}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Exercise
          </button>
        </div>

        {/* Submit button */}
        <div className="flex flex-col w-full md:w-6/12 p-3 items-center">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              submitWorkout();
            }}
          >
            Save Workout
          </button>
        </div>
      </div>
    </Layout>
  );
}

// Check if user is logged in
// If logged in, redirect to homepage
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
