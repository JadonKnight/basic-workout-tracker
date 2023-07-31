"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export interface Set {
  weight: number;
  reps: number;
  workingInterval: number;
  restInterval: number;
}

interface TrackSetsProps {
  exerciseName: string;
  onUpdate?: (sets: Set[]) => void;
  prevSessionSets?: Set[];
}

// TODO: Refactor this to allow all set vals to be undefined instead of considering 0 weight as empty.
// This way a user can define 0 weight for body weight workouts.

export default function TrackSets({
  exerciseName,
  onUpdate,
  prevSessionSets,
}: TrackSetsProps) {
  const [prevSets, setPrevSets] = useState<Set[]>(
    prevSessionSets
      ? new Array(prevSessionSets.length).fill({
          weight: 0,
          reps: 0,
          workingInterval: 0,
          restInterval: 0,
        })
      : []
  );
  const [currentSet, setCurrentSet] = useState<Set>({
    weight: 0,
    reps: 0,
    workingInterval: 0,
    restInterval: 0,
  });

  const [localPrevSessionSets] = useState<Set[]>(prevSessionSets || []);

  const includeCurrentSet = (_currentSet?: Set) => {
    if (!_currentSet) _currentSet = currentSet;
    if (_currentSet.weight > 0 && _currentSet.reps > 0) {
      return true;
    }
    return false;
  };

  const onPrevUpdate = (sets: Set[]) => {
    // Filter invalid sets
    setPrevSets(sets);
    sets = sets.filter((set) => set.weight > 0 && set.reps > 0);
    if (onUpdate) {
      onUpdate(includeCurrentSet() ? [...sets, currentSet] : sets);
    }
  };

  const onCurrentUpdate = (set: Set) => {
    setCurrentSet(set);
    if (onUpdate) {
      onUpdate(includeCurrentSet(set) ? [...prevSets, set] : prevSets);
    }
  };

  const [innerWidth, setInnerWidth] = useState<number>(
    typeof window === "undefined" ? 0 : window.innerWidth
  );

  const handleResize = () => {
    if (typeof window === "undefined") return;

    setInnerWidth(window.innerWidth);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col justify-between bg-black bg-opacity-30 my-2 p-3 rounded text-white">
      <h3 className="text-xl my-2">{exerciseName}</h3>
      {/* Display any existing reps */}
      {prevSets.map((set, index) => (
        <div className="flex flex-col my-2" key={index}>
          <div className="flex justify-end">
            <span className="mb-2 w-fit items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
              #{index + 1}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col">
              <label className="flex flex-col">
                <span className="text-sm sm:text-base">Weight</span>
                <input
                  type="number"
                  className="white-input text-black"
                  placeholder="(kg)"
                  value={set.weight || ""}
                  onChange={(e) => {
                    // Apparently, this is the only way to deep copy an array of objects
                    // without weirdness happening.
                    const newPrevSets = JSON.parse(JSON.stringify(prevSets));
                    newPrevSets[index].weight = Number(e.target.value);
                    onPrevUpdate(newPrevSets);
                  }}
                />
              </label>
              {localPrevSessionSets[index]?.weight && (
                <span className="text-sm sm:text-base text-center">
                  <span className="mt-1 w-full inline-flex justify-center items-center rounded-md font-semibold bg-cyan-500 px-2 py-1 text-xs text-white ring-1 ring-inset ring-cyan-700/10">
                    {localPrevSessionSets[index]?.weight}kg
                  </span>
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="flex flex-col">
                <span className="text-sm sm:text-base">Reps</span>
                <input
                  type="number"
                  className="white-input text-black"
                  placeholder="(num)"
                  value={set.reps || ""}
                  onChange={(e) => {
                    const newPrevSets = JSON.parse(JSON.stringify(prevSets));
                    newPrevSets[index].reps = Number(e.target.value);
                    onPrevUpdate(newPrevSets);
                  }}
                />
              </label>
              {localPrevSessionSets[index]?.reps && (
                <span className="text-sm sm:text-base text-center">
                  <span className="mt-1 w-full inline-flex justify-center items-center rounded-md font-semibold bg-cyan-500 px-2 py-1 text-xs text-white ring-1 ring-inset ring-cyan-700/10">
                    {localPrevSessionSets[index]?.reps} reps
                  </span>
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="flex flex-col">
                <span className="flex justify-between items-center text-sm sm:text-base">
                  {innerWidth < 640 ? "WI" : "Working Interval"}
                  {innerWidth < 640 ? (
                    <Popover>
                      <PopoverTrigger>
                        <QuestionMarkCircleIcon
                          className="text-cyan-300"
                          height={16}
                          width={16}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="border-none text-white bg-cyan-500">
                        WI = Working Interval (s)
                      </PopoverContent>
                    </Popover>
                  ) : null}
                </span>
                <input
                  type="number"
                  className="white-input text-black"
                  placeholder="(s)"
                  value={set.workingInterval || ""}
                  onChange={(e) => {
                    const newPrevSets = JSON.parse(JSON.stringify(prevSets));
                    newPrevSets[index].workingInterval = Number(e.target.value);
                    onPrevUpdate(newPrevSets);
                  }}
                />
              </label>
              {localPrevSessionSets[index]?.workingInterval ? (
                <span className="text-sm sm:text-base text-center">
                  <span className="mt-1 w-full inline-flex justify-center items-center rounded-md font-semibold bg-cyan-500 px-2 py-1 text-xs text-white ring-1 ring-inset ring-cyan-700/10">
                    {localPrevSessionSets[index]?.workingInterval}s
                  </span>
                </span>
              ) : null}
            </div>

            <div className="flex flex-col">
              <label className="flex flex-col">
                <span className="flex justify-between items-center text-sm sm:text-base">
                  {innerWidth < 640 ? "RI" : "Rest Interval"}
                  {innerWidth < 640 ? (
                    <Popover>
                      <PopoverTrigger>
                        <QuestionMarkCircleIcon
                          className="text-cyan-300"
                          height={16}
                          width={16}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="border-none text-white bg-cyan-500">
                        RI = Rest Interval (s)
                      </PopoverContent>
                    </Popover>
                  ) : null}
                </span>
                <input
                  type="number"
                  className="white-input text-black"
                  placeholder="(s)"
                  value={set.restInterval || ""}
                  onChange={(e) => {
                    const newPrevSets = JSON.parse(JSON.stringify(prevSets));
                    newPrevSets[index].restInterval = Number(e.target.value);
                    onPrevUpdate(newPrevSets);
                  }}
                />
              </label>

              {localPrevSessionSets[index]?.restInterval ? (
                <span className="text-sm sm:text-base text-center">
                  <span className="mt-1 w-full inline-flex justify-center items-center rounded-md font-semibold bg-cyan-500 px-2 py-1 text-xs text-white ring-1 ring-inset ring-cyan-700/10">
                    {localPrevSessionSets[index]?.restInterval}s
                  </span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ))}

      {/* Base entry point for adding reps */}
      <div className="flex flex-col my-2">
        <div className="flex justify-end">
          <span className="w-fit mb-2 items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            #{prevSets.length + 1}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <label className="flex flex-col">
            <span className="text-sm sm:text-base">Weight</span>
            <input
              type="number"
              className="white-input text-black"
              value={currentSet.weight || ""}
              placeholder="(kg)"
              onChange={(e) => {
                const newCurrentSet = {
                  ...currentSet,
                  weight: Number(e.target.value),
                };
                onCurrentUpdate(newCurrentSet);
              }}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm sm:text-base">Reps</span>
            <input
              type="number"
              className="white-input text-black"
              placeholder="(num)"
              value={currentSet.reps || ""}
              onChange={(e) => {
                const newCurrentSet = {
                  ...currentSet,
                  reps: Number(e.target.value),
                };
                onCurrentUpdate(newCurrentSet);
              }}
            />
          </label>
          <label className="flex flex-col">
            <span className="flex justify-between items-center text-sm sm:text-base">
              {innerWidth < 640 ? "WI" : "Working Interval"}
              {innerWidth < 640 ? (
                    <Popover>
                      <PopoverTrigger>
                        <QuestionMarkCircleIcon
                          className="text-cyan-300"
                          height={16}
                          width={16}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="border-none text-white bg-cyan-500">
                        WI = Working Interval (s)
                      </PopoverContent>
                    </Popover>
                  ) : null}
            </span>
            <input
              type="number"
              className="white-input text-black"
              value={currentSet.workingInterval || ""}
              placeholder="(s)"
              onChange={(e) => {
                const newCurrentSet = {
                  ...currentSet,
                  workingInterval: Number(e.target.value),
                };
                onCurrentUpdate(newCurrentSet);
              }}
            />
          </label>
          <label className="flex flex-col">
          <span className="flex justify-between items-center text-sm sm:text-base">
              {innerWidth < 640 ? "RI" : "Rest Interval"}
              {innerWidth < 640 ? (
                    <Popover>
                      <PopoverTrigger>
                        <QuestionMarkCircleIcon
                          className="text-cyan-300"
                          height={16}
                          width={16}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="border-none text-white bg-cyan-500">
                        RI = Rest Interval (s)
                      </PopoverContent>
                    </Popover>
                  ) : null}
            </span>
            <input
              type="number"
              className="white-input text-black"
              value={currentSet.restInterval || ""}
              placeholder="(s)"
              onChange={(e) => {
                const newCurrentSet = {
                  ...currentSet,
                  restInterval: Number(e.target.value),
                };
                onCurrentUpdate(newCurrentSet);
              }}
            />
          </label>
        </div>
      </div>
      {/* Add rep button */}
      <button
        className="w-full md:w-fit bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={() => {
          // Don't add empty reps
          if (currentSet.weight === 0 || currentSet.reps === 0) return;

          setPrevSets([...prevSets, currentSet]);
          setCurrentSet({
            weight: 0,
            reps: 0,
            workingInterval: 0,
            restInterval: 0,
          });
        }}
      >
        Add Rep
      </button>
    </div>
  );
}
