"use client";
import { useRef, useState } from "react";
import SelectExercise from "@/components/select-exercise";
import { TrashIcon } from "@heroicons/react/24/outline";
import { maskDaysOfWeek } from "@/lib/day-bitmask";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/alert-modal";

import type {
  DaysOfWeekSelection,
  ExerciseSelection,
  WorkoutSubmission,
} from "@/types/types";
import { Alert } from "@/components/ui/alert";

export default function CreateWorkout() {
  const workoutNameRef = useRef<HTMLInputElement | null>(null);
  const mondaySelectionRef = useRef<HTMLInputElement | null>(null);
  const tuesdaySelectionRef = useRef<HTMLInputElement | null>(null);
  const wednesdaySelectionRef = useRef<HTMLInputElement | null>(null);
  const thursdaySelectionRef = useRef<HTMLInputElement | null>(null);
  const fridaySelectionRef = useRef<HTMLInputElement | null>(null);
  const saturdaySelectionRef = useRef<HTMLInputElement | null>(null);
  const sundaySelectionRef = useRef<HTMLInputElement | null>(null);

  const [exercises, setExercises] = useState<ExerciseSelection[]>([]);
  const [invalidWorkoutName, setInvalidWorkoutName] = useState(false);
  const [invalidExercise, setInvalidExercise] = useState(false);
  const [creationError, setCreationError] = useState(false);

  const router = useRouter();

  const submitWorkout = async () => {
    let invalidData = false;

    const workoutName = workoutNameRef.current?.value;

    if (!workoutName) {
      invalidData = true;
      setInvalidWorkoutName(true);
    }

    if (exercises.length < 1) {
      invalidData = true;
      setInvalidExercise(true);
    }

    const dayOfWeekSelection: DaysOfWeekSelection = {
      Monday: mondaySelectionRef.current?.checked ?? false,
      Tuesday: tuesdaySelectionRef.current?.checked ?? false,
      Wednesday: wednesdaySelectionRef.current?.checked ?? false,
      Thursday: thursdaySelectionRef.current?.checked ?? false,
      Friday: fridaySelectionRef.current?.checked ?? false,
      Saturday: saturdaySelectionRef.current?.checked ?? false,
      Sunday: sundaySelectionRef.current?.checked ?? false
    };
    const daysOfWeek = maskDaysOfWeek(dayOfWeekSelection);

    if (invalidData) return;

    const data: WorkoutSubmission = {
      name: workoutName as string,
      daysOfWeek,
      exercises: exercises
    };

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setCreationError(true);
      return;
    }

    router.push("/workouts");
  };

  return (
    <>
      <AlertModal
        title={"Error"}
        description="Something went wrong trying to create this workout. Please try again"
        confirmText="Retry"
        onConfirm={() => {
          setCreationError(false);
          setTimeout(submitWorkout, 1000);
        }}
        onCancel={() => setCreationError(false)}
        active={creationError}
      />
      <div className="flex flex-col w-full md:w-6/12 text-white">
        <label className="text-xl">Workout Name</label>
        <input
          type="text"
          ref={workoutNameRef}
          onChange={() => setInvalidWorkoutName(false)}
          className="bg-white text-black p-3 border-white rounded focus-visible:outline-slate-400"
        />
        {invalidWorkoutName && (
          <p className="text-red-500 bg-white p-1 mt-1 rounded border border-red-500">Please enter a workout name</p>
        )}
      </div>
      <div className="flex flex-col w-full md:w-6/12 text-white mt-3">
        <label className="text-xl">Select Days of Week</label>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              ref={mondaySelectionRef}
            />
            <label className="ml-2">Monday</label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              ref={tuesdaySelectionRef}
            />
            <label className="ml-2">Tuesday</label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              ref={wednesdaySelectionRef}
            />
            <label className="ml-2">Wednesday</label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              ref={thursdaySelectionRef}
            />
            <label className="ml-2">Thursday</label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              ref={fridaySelectionRef}
            />
            <label className="ml-2">Friday</label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              ref={saturdaySelectionRef}
            />
            <label className="ml-2">Saturday </label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              ref={sundaySelectionRef}
            />
            <label className="ml-2">Sunday</label>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full md:w-6/12 mt-3">
        <label className="text-xl text-white">Select Exercises</label>
        {exercises.map((exercise, i) => (
          <div key={i} className="flex flex-row justify-between my-1">
            <SelectExercise
              onSelected={(selection) => {
                exercises[i] = selection;
                setInvalidExercise(false);
              }}
              currentSelection={exercise.id}
            />
            <button
              className="bg-white rounded p-3 ml-3"
              onClick={() => {
                setExercises(exercises.filter((_, index) => index !== i));
              }}
            >
              <TrashIcon className="w-8 h-8" />
            </button>
          </div>
        ))}
        {/* FIXME: Don't re-pull this or cache it somehow when generating another */}
        <SelectExercise
          onSelected={(selection) => {
            setExercises([...exercises, {
              id: selection.id,
              name: selection.name
            }]);
            setInvalidExercise(false);
          }}
          currentSelection={undefined}
          alwaysEmpty={true}
        />
        {invalidExercise && (
          <p className="text-red-500 bg-white p-1 mt-1 rounded border border-red-500">Please select at least one exercise.</p>
        )}
      </div>

      {/* Submit button */}
      <div className="flex flex-col w-full md:w-6/12 items-center mt-6">
        <button
          className="w-full bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            submitWorkout();
          }}
        >
          Save Workout
        </button>
      </div>
    </>
  );
}
