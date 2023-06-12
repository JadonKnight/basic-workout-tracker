import { maskDaysOfWeek, unmaskDaysOfWeek } from "@/lib/day-bitmask";

describe("maskDaysOfWeek", () => {
  it("should return the correct bitmask for selected days", () => {
    const daysOfWeekSelection = {
      Sunday: true,
      Monday: false,
      Tuesday: true,
      Wednesday: false,
      Thursday: true,
      Friday: false,
      Saturday: true,
    };

    const expectedBitmask = 1 + 4 + 16 + 64; // 85
    const result = maskDaysOfWeek(daysOfWeekSelection);

    expect(result).toBe(expectedBitmask);
  });

  it("should return 0 when no days are selected", () => {
    const daysOfWeekSelection = {
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    };

    const result = maskDaysOfWeek(daysOfWeekSelection);

    expect(result).toBe(0);
  });
});

describe("unmaskDaysOfWeek", () => {
  it("should return the correct days of the week based on the bitmask", () => {
    const bitmask = 1 + 4 + 16 + 64; // 85
    const expectedDaysOfWeek = {
      Sunday: true,
      Monday: false,
      Tuesday: true,
      Wednesday: false,
      Thursday: true,
      Friday: false,
      Saturday: true,
    };

    const result = unmaskDaysOfWeek(bitmask);

    expect(result).toEqual(expectedDaysOfWeek);
  });

  it("should return all days as false when bitmask is 0", () => {
    const bitmask = 0;
    const expectedDaysOfWeek = {
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    };

    const result = unmaskDaysOfWeek(bitmask);

    expect(result).toEqual(expectedDaysOfWeek);
  });
});
