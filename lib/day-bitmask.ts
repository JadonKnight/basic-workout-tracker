/**
 * This module uses a bitmask to represent the days of the week.
 * TODO: Unit test this
 */

import { DaysOfWeekSelection } from "@/types/interfaces";

type DaysOfWeek = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
type DaysOfWeekBitmaskValues = 1 | 2 | 4 | 8 | 16 | 32 | 64;
type DaysOfWeekBitmaskMap = Map<DaysOfWeekBitmaskValues, DaysOfWeek>;

const daysOfWeekMap: DaysOfWeekBitmaskMap = new Map();
daysOfWeekMap.set(1, "Sunday");
daysOfWeekMap.set(2, "Monday");
daysOfWeekMap.set(4, "Tuesday");
daysOfWeekMap.set(8, "Wednesday");
daysOfWeekMap.set(16, "Thursday");
daysOfWeekMap.set(32, "Friday");
daysOfWeekMap.set(64, "Saturday");

export const maskDaysOfWeek = (daysOfWeekSelection: DaysOfWeekSelection) => {
  let bitmask = 0;
  for (const [key, value] of daysOfWeekMap) {
    if (daysOfWeekSelection[value]) {
      bitmask += key;
    }
  }
  return bitmask;
};

export const unmaskDaysOfWeek = (daysOfWeek: number) => {
  const daysOfWeekSelection: DaysOfWeekSelection = {
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false
  };

  for (const [key, value] of daysOfWeekMap) {
    if ((daysOfWeek & key) === key) {
      daysOfWeekSelection[value] = true;
    }
  }

  return daysOfWeekSelection;
};
