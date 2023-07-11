import { useState } from "react";

interface Set {
  weight: number;
  reps: number;
  workingInterval: number;
  restInterval: number;
}

interface TrackSetsProps {
  exerciseName: string;
  onUpdate?: (sets: Set[]) => void;
}

export default function TrackSets({ exerciseName, onUpdate }: TrackSetsProps) {
  const [prevSets, setPrevSets] = useState<Set[]>([]);
  const [currentSet, setCurrentSet] = useState<Set>({
    weight: 0,
    reps: 0,
    workingInterval: 0,
    restInterval: 0,
  });

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

  return (
    <div className="flex flex-col justify-between bg-white my-2 p-3 rounded">
      <h3 className="text-xl my-2">{exerciseName}</h3>

      {/* Display any existing reps */}
      {prevSets.map((set, index) => (
        <div className="flex flex-col my-2" key={index}>
          <div className="flex justify-end">
            <span className="w-fit items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              #{index + 1}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <label className="flex flex-col">
              <span className="text-sm sm:text-base">Weight</span>
              <input
                type="number"
                className="black-input"
                placeholder="(kg)"
                value={set.weight || ""}
                onChange={(e) => {
                  const newPrevSets = [...prevSets];
                  newPrevSets[index].weight = Number(e.target.value);
                  onPrevUpdate(newPrevSets);
                }}
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm sm:text-base">Reps</span>
              <input
                type="number"
                className="black-input"
                placeholder="(num)"
                value={set.reps || ""}
                onChange={(e) => {
                  const newPrevSets = [...prevSets];
                  newPrevSets[index].reps = Number(e.target.value);
                  onPrevUpdate(newPrevSets);
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
                value={set.workingInterval || ""}
                onChange={(e) => {
                  const newPrevSets = [...prevSets];
                  newPrevSets[index].workingInterval = Number(e.target.value);
                  onPrevUpdate(newPrevSets);
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
                value={set.restInterval || ""}
                onChange={(e) => {
                  const newPrevSets = [...prevSets];
                  newPrevSets[index].restInterval = Number(e.target.value);
                  onPrevUpdate(newPrevSets);
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
            #{prevSets.length + 1}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <label className="flex flex-col">
            <span className="text-sm sm:text-base">Weight</span>
            <input
              type="number"
              className="black-input"
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
              className="black-input"
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
            <span className="flex items-center text-sm sm:text-base">
              <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
              {window.innerWidth < 640 ? "WI" : "Working Interval"}
            </span>
            <input
              type="number"
              className="black-input"
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
            <span className="flex items-center text-sm sm:text-base">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              {window.innerWidth < 640 ? "RI" : "Rest Interval"}
            </span>
            <input
              type="number"
              className="black-input"
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
        className="w-full md:w-fit bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={() => {
          // Don't add empty reps
          if (currentSet.weight === 0 && currentSet.reps === 0) return;

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
