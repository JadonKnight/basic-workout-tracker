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
import { NonDissmissibleDrawer } from "@/components/drawer";
import { useMobileContext } from "@/context/mobile-context";
export interface Set {
  weight?: number;
  reps: number;
  workingInterval: number;
  // Because rest interval is determined automatically
  // between sets, I'm making it optional.
  restInterval?: number;
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
  finishedAt?: Date;
  sets: Set[];
}

interface TrackExerciseProps {
  exerciseName: string;
  onUpdate?: (sets: Set[]) => void;
  prevSessionSets?: Set[];
}

export default function TrackExercise({ exerciseName }: TrackExerciseProps) {
  const [workoutComplete, _setWorkoutComplete] = useState(false);
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

  const { isMobile } = useMobileContext();

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
            {!exerciseData?.startedAt ? (
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
                  onClick={() =>
                    setExerciseData({
                      startedAt: new Date(),
                      sets: [],
                    })
                  }
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
                      {targetWeight !== undefined ? `${targetWeight} kg` : "*"}
                    </span>
                  </div>
                  <div className="flex flex-col w-3/6 text-lg">
                    <span className="text-center text-xl">Set</span>
                    <span className="text-center">
                      {targetSetNumber !== undefined
                        ? `${exerciseData.sets.length + 1}/${targetSetNumber}`
                        : "1/*"}
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

                {currentSet === undefined ? (
                  <button
                    className="w-full md:w-fit bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={() => {
                      // TODO: Find the last set and update it's rest interval
                      // by using a new Date() time stamp - the endedat timestamp for it.

                      setCurrentSet({
                        startedAt: new Date(),
                        weight: targetWeight,
                      });
                    }}
                  >
                    Perform Set
                  </button>
                ) : isMobile ? (
                  <NonDissmissibleDrawer
                    trigger={
                      <button
                        className="w-full md:w-fit bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={() => {
                          setCurrentSet((prev) => {
                            return {
                              // Logically we should never have an undefined startedAt...
                              // TODO: Maybe change this? Seems like it could cause bugs...
                              startedAt: prev?.startedAt ?? new Date(),
                              endedAt: new Date(),
                              ...prev,
                            };
                          });
                        }}
                      >
                        Finish Set
                      </button>
                    }
                    content={
                      <div className="grid gap-y-3">
                        <label className="font-semibold">Weight (kg)</label>
                        <input
                          className="white-input"
                          type="number"
                          value={currentSet.weight ?? ""}
                          onChange={(e) => {
                            setCurrentSet({
                              ...currentSet,
                              weight: Number(e.target.value),
                            });
                          }}
                        ></input>
                        <label className="font-semibold">Reps</label>
                        <input
                          className="white-input"
                          type="number"
                          onChange={(e) => {
                            setCurrentSet({
                              ...currentSet,
                              reps: Number(e.target.value),
                            });
                          }}
                        ></input>
                      </div>
                    }
                    onClose={() => {
                      // Calculate the working interval from cSet.startedAt - cSet.endedAt

                      // TODO: Test and improve this. Very rough still...
                      const newSet: Set = {
                        startedAt: currentSet.startedAt,
                        endedAt: currentSet.endedAt ?? new Date(),
                        reps: currentSet.reps ?? 0,
                        weight: currentSet.weight,
                        workingInterval:
                          (currentSet.endedAt ?? new Date()).getTime() -
                          currentSet.startedAt.getTime(),
                      };
                      setExerciseData({
                        ...exerciseData,
                        sets: [...exerciseData.sets, newSet],
                      });
                      setCurrentSet(undefined);
                    }}
                    closeText="Save Set"
                  />
                ) : (
                  <div> Dialogue Modal Coming </div>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
