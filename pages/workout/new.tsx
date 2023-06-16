import SelectWorkout from "../../components/select-exercise";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  DaysOfWeekSelection,
  ExerciseSelection,
  WorkoutSubmission,
} from "@/types/types";
import { maskDaysOfWeek } from "@/lib/day-bitmask";
import Layout from "@/components/layout";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";

export default function NewWorkoutPage({ session } : {session: Session | null}) {
  const [exercises, setExercises] = useState<ExerciseSelection[]>([
    { name: "", id: NaN },
  ]);
  const [invalidExercise, setInvalidExercise] = useState<boolean>(false);
  const [workoutName, setWorkoutName] = useState<string>("");
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
      (exercise) => exercise.id !== undefined
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
      name: workoutName,
      exercises: filteredExercises,
      daysOfWeek: maskDaysOfWeek(daysOfWeek),
    };

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // TODO: Fix this - I need a protocol for handling errors
    if (!response.ok && response.status >= 500) {
      // Router.push("/500");
      console.error("Server error");
    } else if (!response.ok) {
      // Router.push("/400");
      console.error("Client error");
    }

    console.log("Workout created", await response.json());
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
        <h2 className="text-2xl p-3 text-center w-full">Create New Workout</h2>
        <div className="flex flex-col w-full md:w-6/12 p-3">
          <label className="text-xl">Workout Name</label>
          <input
            type="text"
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
                className="form-checkbox"
                onInput={() => {
                  handleAddWeekday("Monday");
                }}
              />
              <label className="ml-2">Monday</label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onInput={() => {
                  handleAddWeekday("Tuesday");
                }}
              />
              <label className="ml-2">Tuesday</label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onInput={() => {
                  handleAddWeekday("Wednesday");
                }}
              />
              <label className="ml-2">Wednesday</label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onInput={() => {
                  handleAddWeekday("Thursday");
                }}
              />
              <label className="ml-2">Thursday</label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onInput={() => {
                  handleAddWeekday("Friday");
                }}
              />
              <label className="ml-2">Friday</label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onInput={() => {
                  handleAddWeekday("Saturday");
                }}
              />
              <label className="ml-2">Saturday </label>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onInput={() => {
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
// If logged in, redirect to dashboard
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
