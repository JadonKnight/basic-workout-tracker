import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import hashId from "@/lib/hashid";
import { maskDaysOfWeek, unmaskDaysOfWeek } from "@/lib/day-bitmask";
import ExerciseSelect from "@/components/exercise-selection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";
import type {
  DaysOfWeekSelection,
  ExerciseSelection,
  Workout,
  WorkoutSubmission,
} from "@/types/types";

export default function Workout({ session }: { session: Session }) {
  // Loaded Workout data
  const router = useRouter();
  const { id } = router.query;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutLoaded, setWorkoutLoaded] = useState<boolean>(false);
  const [workoutExercises, setWorkoutExercises] = useState<ExerciseSelection[]>(
    []
  );

  // Data to update
  const [exercises, setExercises] = useState<ExerciseSelection[]>([]);
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
        setWorkoutExercises(
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

  const submitWorkout = async () => {
    let isValid = true;

    if (!workoutName) {
      setInvalidWorkoutName(true);
      isValid = false;
    }

    const filteredExercises = exercises.filter(
      (exercise) => exercise.name !== ""
    );

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

    const response = await fetch(`/api/workouts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok && response.status >= 500) {
      router.push("/500");
      console.error("Server error");
    } else if (!response.ok) {
      router.push("/400");
      console.error("Client error");
    }

    // Show a toast notification when the workout is updated
    toast.success("Workout updated successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
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
      <ToastContainer />
      <div
        className={`${
          !workoutLoaded ? "flex" : "hidden"
        } items-center justify-center fixed inset-0`}
      >
        <div
          className="inline-block text-violet-300 h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
      <div
        className={`${
          workoutLoaded ? "flex" : "hidden"
        } flex-col flex-grow-1 items-center`}
      >
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
          <ExerciseSelect
            exerciseSelections={workoutExercises}
            onLoaded={() => {
              setWorkoutLoaded(true);
            }}
            onChange={(selections) => {
              setExercises(selections);
            }}
            // For some reason, I get an infinite loop if I set exercises to an empty array... I'm sure there is a good React reason for this
            onEmpty={() => {
              if (exercises.length > 0) {
                setExercises([]);
              }
            }}
          />
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
