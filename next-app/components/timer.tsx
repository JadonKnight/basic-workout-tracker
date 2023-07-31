"use client";

import { useEffect, useState, useMemo } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

export default function Timer() {
  const startDate = useMemo(() => {
    return new Date();
  }, []);

  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  const [active, setActive] = useState<boolean>(false);

  function msToTime(s: number) {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    // We do this to prevent 100 ms causing the display of the ms to increase
    // the width of the UI element for a brief ms causing a poor graphical appearance
    if (Math.round(ms / 10) === 100) {
      ms = 0;
    }

    return (
      hrs.toString() +
      ":" +
      mins.toString().padStart(2, "0") +
      ":" +
      secs.toString().padStart(2, "0") +
      "." +
      Math.round(ms / 10)
        .toString()
        .padStart(2, "0")
    );
  }

  useEffect(() => {
    function updateTimer() {
      const newDate = new Date();
      setSecondsElapsed(Math.abs(newDate.getTime() - startDate.getTime()));
    }

    if (!active) {
      setActive(true);
      setInterval(() => {
        updateTimer();
      }, 10);
    }
  }, [active, startDate]);

  const formattedTime = useMemo(
    () => msToTime(secondsElapsed),
    [secondsElapsed]
  );

  return (
    <span className="p-2 flex flex-row font-mono items-center justify-center mt-1 whitespace-nowrap rounded-full bg-gradient-to-br from-red-500 to-fuchsia-500 text-center font-bold leading-none text-neutral-50 dark:bg-neutral-900">
      <ClockIcon className="mr-1 align-middle" height={16} width={16} />
      {/* Custom height and padding since the mono-font causes alignment issues */}
      <span className="h-[16px] pt-[2px]">{formattedTime}</span>
    </span>
  );
}
