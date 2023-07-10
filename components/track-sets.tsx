import { useState } from "react";

interface Rep {
  weight: number;
  workingInterval: number;
  restInterval: number;
}

interface TrackSetsProps {
  exerciseName: string;
  onUpdate?: (set: Rep[]) => void;
}

export default function TrackSets({ exerciseName, onUpdate }: TrackSetsProps) {
  const [prevReps, setPrevReps] = useState<Rep[]>([]);
  const [currentRep, setCurrentRep] = useState<Rep>({
    weight: 0,
    workingInterval: 0,
    restInterval: 0,
  });

  return (
    <div className="flex flex-col justify-between bg-white my-2 p-3 rounded">
      <h3 className="text-xl my-2">{exerciseName}</h3>

      {/* Display any existing reps */}
      {prevReps.map((rep, index) => (
        <div className="flex flex-col my-2" key={index}>
          <div className="flex justify-end">
            <span className="w-fit items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              #{index + 1}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <label className="flex flex-col">
              <span className="text-sm sm:text-base">Weight</span>
              <input
                type="number"
                className="black-input"
                placeholder="(kg)"
                value={rep.weight || ""}
                onChange={(e) => {
                  const newReps = [...prevReps];
                  newReps[index].weight = Number(e.target.value);
                  setPrevReps(newReps);
                }}
              />
            </label>
            <label className="flex flex-col">
              <span className="flex items-center text-sm sm:text-base">
                <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                {window.innerWidth < 640 ? "WI" : "Working Interval"}
              </span>
              <input
                type="number"
                className="black-input"
                placeholder="(s)"
                value={rep.workingInterval || ""}
                onChange={(e) => {
                  const newReps = [...prevReps];
                  newReps[index].workingInterval = Number(e.target.value);
                  setPrevReps(newReps);
                }}
              />
            </label>
            <label className="flex flex-col">
              <span className="flex items-center text-sm sm:text-base">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                {window.innerWidth < 640 ? "RI" : "Rest Interval"}
              </span>
              <input
                type="number"
                className="black-input"
                placeholder="(s)"
                value={rep.restInterval || ""}
                onChange={(e) => {
                  const newReps = [...prevReps];
                  newReps[index].restInterval = Number(e.target.value);
                  setPrevReps(newReps);
                }}
              />
            </label>
          </div>
        </div>
      ))}

      {/* Base entry point for adding reps */}
      <div className="flex flex-col my-2">
        <div className="flex justify-end">
          <span className="w-fit items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
            #{prevReps.length + 1}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <label className="flex flex-col">
            <span className="text-sm sm:text-base">Weight</span>
            <input
              type="number"
              className="black-input"
              value={currentRep.weight || ""}
              placeholder="(kg)"
              onChange={(e) => {
                setCurrentRep({
                  ...currentRep,
                  weight: Number(e.target.value),
                });
              }}
            />
          </label>
          <label className="flex flex-col">
            <span className="flex items-center text-sm sm:text-base">
              <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
              {window.innerWidth < 640 ? "WI" : "Working Interval"}
            </span>
            <input
              type="number"
              className="black-input"
              value={currentRep.workingInterval || ""}
              placeholder="(s)"
              onChange={(e) => {
                setCurrentRep({
                  ...currentRep,
                  workingInterval: Number(e.target.value),
                });
              }}
            />
          </label>
          <label className="flex flex-col">
            <span className="flex items-center text-sm sm:text-base">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              {window.innerWidth < 640 ? "RI" : "Rest Interval"}
            </span>
            <input
              type="number"
              className="black-input"
              value={currentRep.restInterval || ""}
              placeholder="(s)"
              onChange={(e) => {
                setCurrentRep({
                  ...currentRep,
                  restInterval: Number(e.target.value),
                });
              }}
            />
          </label>
        </div>
      </div>
      {/* Add rep button */}
      <button
        className="w-full md:w-fit bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={() => {
          // Don't add empty reps
          if (currentRep.weight === 0) return;

          setPrevReps([...prevReps, currentRep]);
          setCurrentRep({
            weight: 0,
            workingInterval: 0,
            restInterval: 0,
          });
          if (onUpdate) {
            onUpdate([...prevReps, currentRep]);
          }
        }}
      >
        Add Rep
      </button>
    </div>
  );
}
