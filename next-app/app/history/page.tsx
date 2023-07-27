import fetchWorkoutSessions from "@/lib/workoutSessions";
import fetchServerSideSession from "@/lib/fetchServerSideSession";
import fetchWorkouts from "@/lib/workouts";
import { redirect } from "next/navigation";
import { ClockIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { unmaskDaysOfWeek } from "@/lib/day-bitmask";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Page() {
  const session = await fetchServerSideSession();

  if (!session) {
    redirect("/");
  }

  function getBeginningOfWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday (0) as the first day of the week
    return new Date(now.setDate(diff));
  }

  // Fetch workout data
  const workoutSessions = await fetchWorkoutSessions(Number(session.user.id), {
    fromDate: getBeginningOfWeek(),
    toDate: new Date(),
  });
  const workouts = await fetchWorkouts(Number(session.user.id));

  const workoutSchedule = workouts.map((workout) => {
    return {
      id: workout.id,
      perWeek: Object.values(unmaskDaysOfWeek(workout.daysOfWeek)).filter(
        (val) => val
      ).length,
      completed: workoutSessions.filter(
        (session) => session.workout.id === workout.id
      ).length,
    };
  });

  const uniqueSessions = workoutSchedule.reduce((acc: number, curr) => {
    return acc + Math.min(curr.perWeek, curr.completed);
  }, 0);

  const weeklyWorkoutSessions = workouts.reduce((acc, curr) => {
    const daysOfWeek = unmaskDaysOfWeek(curr.daysOfWeek);
    const dayCount = Object.values(daysOfWeek).filter((val) => val).length;
    return acc + dayCount;
  }, 0);

  const minutesWorkedOut = Math.round(
    workoutSessions.reduce((acc, curr) => {
      if (!curr.startedAt || !curr.endedAt) return acc;
      const start = new Date(curr.startedAt);
      const end = new Date(curr.endedAt);
      const duration = (end.getTime() - start.getTime()) / 1000; // Duration in seconds
      return acc + duration;
    }, 0) / 60
  );

  const progressWidth = Math.min(
    (uniqueSessions / weeklyWorkoutSessions) * 100,
    100
  );

  function getDuration(startedAt: Date, endedAt: Date) {
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const duration = (end.getTime() - start.getTime()) / 1000; // Duration in seconds

    // Format the duration as desired (e.g., hours and minutes)
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const durationString = `${hours}h ${minutes}m`;
    return durationString;
  }

  function formatTime(minutes: number) {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${
        hours !== 1 ? "s" : ""
      } and ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
    }
  }

  return (
    <div className="flex flex-col justify-center">
      <h2 className="flex flex-col text-2xl font-bold text-left p-3 text-white">
        Hey
        <div className="text-gray-300">{session.user.name}</div>
      </h2>
      <div className="flex items-center text-xl text-left p-3 text-white">
        Progress for week of
        <span className="ml-2 w-fit whitespace-nowrap rounded-full bg-pink-600 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-neutral-50 dark:bg-neutral-900">
          {getBeginningOfWeek().toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-col w-full items-center justify-center p-3">
        <Tabs
          defaultValue="statistics"
          className="flex items-center w-full flex-col"
        >
          <TabsList className="bg-black bg-opacity-50">
            <TabsTrigger
              className="text-white font-semibold"
              value="statistics"
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger className="text-white font-semibold" value="history">
              History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="statistics" className="w-full">
            <div className="flex flex-col w-full p-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="flex flex-col items-center text-center p-3 rounded text-white bg-opacity-50 bg-black">
                  <span className="text-2xl font-bold">
                    {uniqueSessions} of {weeklyWorkoutSessions}
                  </span>
                  <span className="text-xl">Workouts Completed</span>
                  <div className="flex items-center w-full p-3">
                    <div className="relative w-full bg-gray-300 rounded">
                      <div
                        className="h-6 rounded bg-green-500"
                        style={{ width: `${progressWidth}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between text-center p-3 rounded text-white bg-opacity-50 bg-black">
                  <ClockIcon
                    width={48}
                    height={48}
                    className="text-green-500"
                  />
                  <span className="text-2xl font-bold">
                    {formatTime(minutesWorkedOut)}
                  </span>
                  <span className="text-xl">Working Out</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history" className="w-full">
            <div className="flex flex-col w-full p-3">
              <div className="shadow-xl bg-black bg-opacity-50 rounded p-4">
                <div className="text-white text-center font-bold text-xl">
                  Past Workouts
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                  {workoutSessions.length > 0 ? (
                    workoutSessions.map((session) => (
                      <li key={session.id}>
                        <div className="flex flex-col items-center text-center p-3 bg-gradient-to-b text-white from-purple-400 to-purple-700 rounded">
                          <div className="flex w-full justify-start font-semibold text-lg">
                            {session.workout.name}
                          </div>
                          {session.startedAt && session.endedAt ? (
                            <div className="flex flex-row justify-between w-full p-4">
                              <span className="flex flex-col text-green-300">
                                <ClockIcon height={32} width={32} />
                                {getDuration(
                                  session.startedAt,
                                  session.endedAt
                                )}
                              </span>
                              <span className="flex flex-col text-green-300">
                                <CalendarDaysIcon height={32} width={32} />
                                {new Date(
                                  session.startedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-center">
                      No previous workout sessions this week
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
