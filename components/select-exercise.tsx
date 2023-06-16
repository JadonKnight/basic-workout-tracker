import { useState, useEffect } from "react";

interface Exercise {
  name: string;
  description: string;
  id: number;
}

export default function SelectWorkout({
  onSelected,
  currentSelection,
}: {
  onSelected: (selection: { name: string; id: number }) => void;
  currentSelection: number | undefined;
}) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selection, setSelection] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetch("/api/exercises")
      .then((response) => response.json())
      .then((data) => {
        setExercises(data);
      });
  }, []);

  // Set useEffect for currentSelection
  useEffect(() => {
    setSelection(currentSelection);
  }, [currentSelection]);

  return (
    <select
      value={selection || ""}
      onInput={(e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectionId = Number(e.target.value);
        const selectionName = exercises.find((exercise) => {
          return exercise.id === selectionId;
        })?.name;
        if (!selectionId || !selectionName) return;

        setSelection(selectionId);

        onSelected({
          name: selectionName,
          id: selectionId,
        });
      }}
      className="bg-white p-3 border-white border-8 rounded w-full focus-visible:outline-none"
    >
      <option value="" disabled>Select Exercise</option>
      {exercises.map((exercise) => (
        <option key={exercise.id} value={exercise.id}>
          {exercise.name}
        </option>
      ))}
    </select>
  );
}
