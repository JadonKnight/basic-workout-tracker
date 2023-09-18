"use client";

import { FetchWorkoutReturn } from "@/lib/workouts";
import { useRef, useState } from "react";
import { unmaskDaysOfWeek, maskDaysOfWeek } from "@/lib/day-bitmask";
import SelectExercise from "@/components/select-exercise";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/alert-modal";
import { InlineLoader } from "@/components/loader";

import type {
  DaysOfWeekSelection,
  ExerciseSelection,
  WorkoutSubmission,
} from "@/types/types";

export default function EditWorkout({
  workout,
}: {
  workout: NonNullable<FetchWorkoutReturn>;
}) {
  const mondaySelectionRef = useRef<HTMLInputElement | null>(null);
  const tuesdaySelectionRef = useRef<HTMLInputElement | null>(null);
  const wednesdaySelectionRef = useRef<HTMLInputElement | null>(null);
  const thursdaySelectionRef = useRef<HTMLInputElement | null>(null);
  const fridaySelectionRef = useRef<HTMLInputElement | null>(null);
  const saturdaySelectionRef = useRef<HTMLInputElement | null>(null);
  const sundaySelectionRef = useRef<HTMLInputElement | null>(null);
  const daysOfWeek = useRef(unmaskDaysOfWeek(workout.daysOfWeek));

  const [invalidExercise, setInvalidExercise] = useState(false);
  const [editError, setEditError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [exercises, setExercises] = useState<ExerciseSelection[]>(
    workout.workoutExercise.map(({ exercise }) => {
      return {
        id: exercise.id,
        name: exercise.name,
      };
    })
  );

  const router = useRouter();

  const submitWorkoutEdit = async () => {
    setSubmitting(true);

    if (exercises.length < 1) {
      setInvalidExercise(true);
      setSubmitting(false);
      return;
    }

    const dayOfWeekSelection: DaysOfWeekSelection = {
      Monday: mondaySelectionRef.current?.checked ?? false,
      Tuesday: tuesdaySelectionRef.current?.checked ?? false,
      Wednesday: wednesdaySelectionRef.current?.checked ?? false,
      Thursday: thursdaySelectionRef.current?.checked ?? false,
      Friday: fridaySelectionRef.current?.checked ?? false,
      Saturday: saturdaySelectionRef.current?.checked ?? false,
      Sunday: sundaySelectionRef.current?.checked ?? false,
    };
    const daysOfWeek = maskDaysOfWeek(dayOfWeekSelection);

    const data: WorkoutSubmission = {
      name: workout.name,
      exercises,
      daysOfWeek,
    };

    const response = await fetch(`/api/workouts/${workout.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setEditError(true);
      setSubmitting(false);
      return;
    }

    router.push("/workouts");
  };

  return (
    <>
      <AlertModal
        title={"Error"}
        description="Something went wrong trying to edit this workout. Please try again"
        confirmText="Retry"
        onConfirm={() => {
          setEditError(false);
          setTimeout(submitWorkoutEdit, 1000);
        }}
        onCancel={() => setEditError(false)}
        active={editError}
      />
      <div className="flex flex-col w-full md:w-6/12 text-white mt-3">
        <label className="text-xl">Select Days of Week</label>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              defaultChecked={daysOfWeek.current.Monday}
              ref={mondaySelectionRef}
            />
            <label className="ml-2">Monday</label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              defaultChecked={daysOfWeek.current.Tuesday}
              ref={tuesdaySelectionRef}
            />
            <label className="ml-2">Tuesday</label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              defaultChecked={daysOfWeek.current.Wednesday}
              ref={wednesdaySelectionRef}
            />
            <label className="ml-2">Wednesday</label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              defaultChecked={daysOfWeek.current.Thursday}
              ref={thursdaySelectionRef}
            />
            <label className="ml-2">Thursday</label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              defaultChecked={daysOfWeek.current.Friday}
              ref={fridaySelectionRef}
            />
            <label className="ml-2">Friday</label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              defaultChecked={daysOfWeek.current.Saturday}
              ref={saturdaySelectionRef}
            />
            <label className="ml-2">Saturday </label>
          </div>
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              defaultChecked={daysOfWeek.current.Sunday}
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
        <SelectExercise
          onSelected={(selection) => {
            setExercises([
              ...exercises,
              {
                id: selection.id,
                name: selection.name,
              },
            ]);
            setInvalidExercise(false);
          }}
          currentSelection={undefined}
          alwaysEmpty={true}
        />
        {invalidExercise && (
          <p className="text-red-500 bg-white p-1 mt-1 rounded border border-red-500">
            Please select at least one exercise.
          </p>
        )}
      </div>
      {/* Submit button */}
      <div className="flex flex-col w-full md:w-6/12 items-center mt-6">
        <InlineLoader active={submitting}>
          <button
            className="w-full bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              submitWorkoutEdit();
            }}
          >
            Save
          </button>
        </InlineLoader>
      </div>
    </>
  );
}
