"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Timer from "@/components/timer";
import { NonDissmissibleDrawer } from "@/components/drawer";
import { useMobileContext } from "@/context/mobile-context";
export interface Set {
  weight?: number;
  reps: number;
  restInterval?: number;
  startedAt: Date;
  endedAt: Date;
}

interface InProgressSet {
  weight?: number;
  reps?: number;
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

function formattedTimeDiffSeconds(startTime: Date, endTime: Date) {
  const timeDiff = endTime.getTime() - startTime.getTime();
  const timeDiffS = timeDiff / 1000;

  return `${timeDiffS.toFixed(2)} s`;
}

export default function TrackExercise({ exerciseName }: TrackExerciseProps) {
  const [exerciseComplete, setExerciseComplete] = useState(false);
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

  useEffect(() => {
    if (
      targetSetNumber !== undefined &&
      exerciseData !== undefined &&
      exerciseData.sets.length >= targetSetNumber
    ) {
      setExerciseComplete(true);
    }
  }, [exerciseData, targetSetNumber]);

  return (
    <div className="flex flex-col bg-black bg-opacity-30 my-2 p-3 rounded text-white">
      {/* NOTE: Use defaultValue param on accordian to set it open by default */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger>
            <div className="flex items-center justify-start w-full">
              <h3 className="text-xl my-2 mr-2">{exerciseName}</h3>
              {exerciseComplete ? (
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
                <ol className="my-2">
                  {/* Head */}
                  <li className="grid grid-cols-5 gap-1">
                    <span className="font-semibold">Set #</span>
                    <span className="font-semibold">Weight</span>
                    <span className="font-semibold">Reps</span>
                    <span className="font-semibold flex items-center">
                      WI
                      <Popover>
                        <PopoverTrigger className="ml-3">
                          <QuestionMarkCircleIcon
                            className="text-cyan-300"
                            height={16}
                            width={16}
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          WI = Working Interval (s) or the time taken to
                          complete the set.
                        </PopoverContent>
                      </Popover>
                    </span>
                    <span className="font-semibold flex items-center">
                      RI
                      <Popover>
                        <PopoverTrigger className="ml-3">
                          <QuestionMarkCircleIcon
                            className="text-cyan-300"
                            height={16}
                            width={16}
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          RI = Rest Interval (s) or the time taken since
                          completing the previous set.
                        </PopoverContent>
                      </Popover>
                    </span>
                  </li>
                  {exerciseData.sets.map((set, index) => {
                    return (
                      <li className="grid grid-cols-5 gap-1" key={index}>
                        <span>{index + 1}</span>
                        <span>{set.weight} kg</span>
                        <span>{set.reps}</span>
                        <span>
                          {formattedTimeDiffSeconds(set.startedAt, set.endedAt)}
                        </span>
                        <span>
                          {set.restInterval !== undefined
                            ? `${(set.restInterval / 1000).toFixed(2)} s`
                            : null}
                        </span>
                      </li>
                    );
                  })}
                </ol>
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
                      const lastSet =
                        exerciseData.sets[exerciseData.sets.length - 1];
                      if (lastSet !== undefined) {
                        setExerciseData({
                          ...exerciseData,
                          sets: [
                            ...exerciseData.sets.slice(
                              0,
                              exerciseData.sets.length - 1
                            ),
                            {
                              ...lastSet,
                              restInterval:
                                new Date().getTime() -
                                lastSet.endedAt.getTime(),
                            },
                          ],
                        });
                      }

                      // Set the current set based on the last set if it exists,
                      // this allows ease to default set weight and rep
                      // to lower user input where possible.
                      setCurrentSet({
                        startedAt: new Date(),
                        weight: lastSet?.weight ?? targetWeight,
                        reps: lastSet?.reps ?? undefined,
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
                              weight:
                                e.target.value !== ""
                                  ? Number(e.target.value)
                                  : undefined,
                            });
                          }}
                        ></input>
                        <label className="font-semibold">Reps</label>
                        <input
                          className="white-input"
                          type="number"
                          value={currentSet.reps ?? ""}
                          onChange={(e) => {
                            setCurrentSet({
                              ...currentSet,
                              reps:
                                e.target.value !== ""
                                  ? Number(e.target.value)
                                  : undefined,
                            });
                          }}
                        ></input>
                      </div>
                    }
                    onClose={() => {
                      const newSet: Set = {
                        startedAt: currentSet.startedAt,
                        endedAt: currentSet.endedAt ?? new Date(),
                        reps: currentSet.reps ?? 0,
                        weight: currentSet.weight,
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
