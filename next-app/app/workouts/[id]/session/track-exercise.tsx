"use client";

import { useState, useRef } from "react";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  // QuestionMarkCircleIcon,
  StopIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export interface Set {
  weight: number;
  reps: number;
  workingInterval: number;
  restInterval: number;
  startedAt: Date;
  endedAt: Date;
}

export interface TrackExerciseData {
  startedAt: Date;
  finishedAt: Date;
  sets: Set[]
}

interface TrackExerciseProps {
  exerciseName: string;
  onUpdate?: (sets: Set[]) => void;
  prevSessionSets?: Set[];
}

// TODO: Refactor this to allow all set vals to be undefined instead of considering 0 weight as empty.
// This way a user can define 0 weight for body weight workouts.

// NOTE FOR RETURNING: I got to this point where I am now refactoring the
// data structures for track sets such that we can account for users having
// 0 weight by allowing a set to either exist or be undefined rather than
// defining it's existence by the existence of certain properties which just
// seems like poor design.

// NOTE: This is in a complete re-write phase, we are changing the UI to come in line with the design file
export default function TrackExercise({
  exerciseName,
  // onUpdate,
  // prevSessionSets,
}: TrackExerciseProps) {
  const _sets = useRef<Set[]>([]);

  // const [innerWidth, setInnerWidth] = useState<number>(
  //   typeof window === "undefined" ? 0 : window.innerWidth
  // );

  // const handleResize = () => {
  //   if (typeof window === "undefined") return;

  //   setInnerWidth(window.innerWidth);
  // };

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const [workoutComplete, _setWorkoutComplete] = useState(false);

  return (
    <div className="flex flex-col bg-black bg-opacity-30 my-2 p-3 rounded text-white">
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
              ) : (
                <StopIcon className="text-slate-500" height={32} width={32} />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label htmlFor="weight-input">Target Set Weight (kg)</label>
                <input
                  id="weight-input"
                  className="white-input"
                  type="number"
                ></input>
              </div>
              <div className="flex flex-col">
                <label htmlFor="target-set-input">Target Set Number</label>
                <input
                  id="target-set-input"
                  className="white-input"
                  type="number"
                ></input>
              </div>
              <button
                className="w-full md:w-fit bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded mt-4"
                // TODO: Next thing todo will be setup state of of exercise data which should change the component UI
              >
                Start Exercise
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
