"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Timer from "@/components/timer";

export interface Set {
  weight: number | null;
  reps: number;
  workingInterval: number;
  restInterval: number;
  startedAt: Date;
  endedAt: Date;
}

interface InProgressSet {
  weight?: number;
  reps?: number;
  workingInterval?: number;
  restInterval?: number;
  startedAt: Date;
  endedAt?: Date;
}

export interface TrackExerciseData {
  startedAt: Date;
  finishedAt: Date;
  sets: Set[];
}

interface TrackExerciseProps {
  exerciseName: string;
  onUpdate?: (sets: Set[]) => void;
  prevSessionSets?: Set[];
}

export default function TrackExercise({ exerciseName }: TrackExerciseProps) {
  const [workoutComplete, _setWorkoutComplete] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [targetWeight, setTargetWeight] = useState<number | undefined>(
    undefined
  );
  const [targetSetNumber, setTargetSetNumber] = useState<number | undefined>(
    undefined
  );
  const [exerciseData, setExerciseData] = useState<
    TrackExerciseData | undefined
  >(undefined);
  const [currentSet, setCurrentSet] = useState<InProgressSet | undefined>(
    undefined
  );

  return (
    <div className="flex flex-col bg-black bg-opacity-30 my-2 p-3 rounded text-white">
      {/* NOTE: Use defaultValue param on accordian to set it open by default */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full">
              <h3 className="text-xl my-2">{exerciseName}</h3>
              {workoutComplete ? (
                <CheckCircleIcon
                  className="text-green-500"
                  height={32}
                  width={32}
                />
              ) : null}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {!exerciseStarted ? (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label htmlFor="weight-input">Target Set Weight (kg)</label>
                  <input
                    id="weight-input"
                    className="white-input"
                    type="number"
                    onChange={(e) => setTargetWeight(Number(e.target.value))}
                  ></input>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="target-set-input">Target Set Number</label>
                  <input
                    id="target-set-input"
                    className="white-input"
                    type="number"
                    onChange={(e) => setTargetSetNumber(Number(e.target.value))}
                  ></input>
                </div>
                <button
                  className="w-full md:w-fit bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={() => setExerciseStarted(true)}
                >
                  Start Exercise
                </button>
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col w-3/6 text-lg">
                    <span className="text-center text-xl">Weight</span>
                    <span className="text-center">
                      {targetWeight !== null ? `${targetWeight} kg` : "*"}
                    </span>
                  </div>
                  <div className="flex flex-col w-3/6 text-lg">
                    <span className="text-center text-xl">Set</span>
                    <span className="text-center">
                      {targetSetNumber !== null ? `1/${targetSetNumber}` : "*"}
                    </span>
                  </div>
                </div>
                {currentSet !== undefined ? (
                  <div className="flex flex-col items-center w-full">
                    Set Time
                    <div className="flex">
                      <Timer startDateProp={currentSet.startedAt} />
                    </div>
                  </div>
                ) : null}
                <button
                  className="w-full md:w-fit bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={() => {
                    setCurrentSet({
                      startedAt: new Date(),
                      weight: targetWeight,
                    });
                  }}
                >
                  Perform Set
                </button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
