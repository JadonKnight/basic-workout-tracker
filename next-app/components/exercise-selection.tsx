import type { ExerciseSelection } from "@/types/types";

import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ExerciseSelectProps {
  exerciseSelections?: ExerciseSelection[];
  onLoaded?: () => void;
  onChange?: (exerciseSelections: ExerciseSelection[]) => void;
  onEmpty?: () => void;
}
export default function ExerciseSelect({
  exerciseSelections,
  onLoaded,
  onChange,
  onEmpty,
}: ExerciseSelectProps) {
  const [exercises, setExercises] = useState<ExerciseSelection[]>([]);
  const [invalidExercise, setInvalidExercise] = useState(false);
  const [exerciseSelection, setExerciseSelection] = useState<
    ExerciseSelection[]
  >([]);

  useEffect(() => {
    fetch("/api/exercises")
      .then((response) => response.json())
      .then((data) => {
        setExercises(data);
      });
  }, []);

  useEffect(() => {
    if (exercises.length > 0 && exerciseSelection.length > 0) {
      onLoaded?.();
    }
  }, [exercises, exerciseSelection, onLoaded]);

  useEffect(() => {
    if (exerciseSelections && exerciseSelections.length > 0) {
      setExerciseSelection([...exerciseSelections]);
    }
  }, [exerciseSelections]);

  useEffect(() => {
    if (exerciseSelection.length > 0) {
      setInvalidExercise(false);
      onChange?.(exerciseSelection);
    } else {
      setInvalidExercise(true);
      onEmpty?.();
    }
  }, [exerciseSelection, onChange, onEmpty]);

  return (
    <div className="flex flex-col">
      <label className="text-xl">Select Exercises</label>
      {exerciseSelection?.map((selection, i) => (
        <div key={i} className="flex flex-row justify-between my-1">
          <select
            value={selection.id || ""}
            onChange={(e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              const label = selectedOption.label;
              const value = selectedOption.value;
              setExerciseSelection(
                exerciseSelection.map((exercise) => {
                  if (exercise.id === selection.id) {
                    return { name: label, id: parseInt(value) };
                  }
                  return exercise;
                })
              );
            }}
            className="bg-white p-3 border-white border-8 rounded w-full focus-visible:outline-none"
          >
            <option value="" disabled>
              Select Exercise
            </option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setExerciseSelection(
                exerciseSelection.filter((_, index) => index !== i)
              );
            }}
            className="bg-white rounded p-3 ml-3"
          >
            <TrashIcon className="w-8 h-8" />
          </button>
        </div>
      ))}
      <div className="flex flex-row justify-between my-1">
        <select
          value={""}
          onChange={(e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const label = selectedOption.label;
            const value = selectedOption.value;
            setExerciseSelection([
              ...exerciseSelection,
              { name: label, id: parseInt(value) },
            ]);
          }}
          className="bg-white p-3 border-white border-8 rounded w-full focus-visible:outline-none"
        >
          <option value="" disabled>
            Select Exercise
          </option>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>
      {invalidExercise && (
        <p className="text-red-500">Please select at least one exercise</p>
      )}
    </div>
  );
}
