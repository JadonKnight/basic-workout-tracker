import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";
import Layout from "@/components/layout";
import { useEffect, useState } from "react";

import type { SessionData } from "@/pages/api/workouts/sessions";

// FIXME: Naming is a bit confusing with Session as the client session and also workout session.
export default function History({ session }: { session: Session }) {
  const [workoutSessions, setWorkoutSessions] = useState<SessionData[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<number>(0);
  const [minutesWorkedOut, setMinutesWorkedOut] = useState<number>(0);
  const [averageSetsPerWorkout, setAverageSetsPerWorkout] = useState<number>(0);
  const [averageRepsPerWorkout, setAverageRepsPerWorkout] = useState<number>(0);

  useEffect(() => {
    const fetchWorkoutSessions = async () => {
      const res = await fetch("/api/workouts/sessions");

      if (!res.ok) {
        console.error("Failed to fetch workout sessions");
        return;
      }

      const { workoutSessions }: { workoutSessions: SessionData[] } =
        await res.json();

      setWorkoutSessions(workoutSessions);
      // set completedWorkouts
      setCompletedWorkouts(workoutSessions.length);
      setMinutesWorkedOut(
        Math.round(
        workoutSessions.reduce((acc, curr) => {
          if (!curr.startedAt || !curr.endedAt) return acc;
          const start = new Date(curr.startedAt);
          const end = new Date(curr.endedAt);
          const duration = (end.getTime() - start.getTime()) / 1000; // Duration in seconds
          return acc + duration;
        }, 0) / 60)
      );
    };
    fetchWorkoutSessions();
  }, []);

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

  return (
    <Layout session={session}>
      <div className="flex justify-center">
        <div className="flex flex-col max-w-2xl mx-auto p-3 items-center">
          <h1 className="text-3xl font-bold p-3 text-center">
            Your Workout History
          </h1>
          <div className="flex flex-col w-full p-3">
            <div className="shadow-lg bg-white rounded p-4">
              <div className="text-center">
                Hey <span className="font-bold">{session.user?.name}</span>,
                here is how you have performed so far this week!
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                <div className="flex flex-row items-center justify-between text-center p-3 text-white bg-gradient-to-r from-cyan-400 to-violet-600 rounded shadow-slate-500 shadow-md">
                  Workouts completed
                  <span className="text-2xl font-bold">{completedWorkouts}</span>
                </div>
                <div className="flex flex-row items-center justify-between text-center p-3 text-white bg-gradient-to-r from-cyan-400 to-violet-600 rounded shadow-slate-500 shadow-md">
                  Minutes working out
                  <span className="text-2xl font-bold">{minutesWorkedOut}</span>
                </div>
                <div className="flex flex-row items-center justify-between text-center p-3 text-white bg-gradient-to-r from-cyan-400 to-violet-600 rounded shadow-slate-500 shadow-md">
                  Average Sets Per Session{" "}
                  {/* <span className="text-2xl font-bold">{averageSetsPerWorkout}</span> */}
                  {/* TODO: Do these calculations server side */}
                  <span className="text-2xl font-bold">N/A</span>
                </div>
                <div className="flex flex-row items-center justify-between text-center p-3 text-white bg-gradient-to-r from-cyan-400 to-violet-600 rounded shadow-slate-500 shadow-md">
                  Average Reps Per Session{" "}
                  {/* <span className="text-2xl font-bold">{averageRepsPerWorkout}</span> */}
                  {/* TODO: Calc server side */}
                  <span className="text-2xl font-bold">N/A</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full p-3">
            <div className="shadow-xl bg-white rounded p-4">
              <div className="text-center">Past Workouts</div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                {workoutSessions.length > 0 ? (
                  workoutSessions.map((session) => (
                    <li key={session.id}>
                      <div
                        className="flex flex-row items-center justify-between text-center p-3 text-white bg-gradient-to-r from-cyan-400
                      to-violet-600 rounded shadow-slate-500 shadow-md"
                      >
                        {session.workout.name}
                        {session.startedAt && session.endedAt && (
                          <div className="flex-col text-sm font-bold">
                            <span className="flex font-normal">
                              Duration:{" "}
                              {getDuration(session.startedAt, session.endedAt)}
                            </span>
                            <span className="flex font-normal">
                              Date:{" "}
                              {new Date(session.startedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="text-center">
                    No previous workout sessions
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Check if user is logged in
// If logged in, redirect to dashboard
export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ session: Session }>> {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

/**
 * Suggestions from chat gippity:

    Workout List: Provide a list of the user's past workouts, showing the date, workout name, and a summary of key metrics (e.g., total reps, sets, or duration). This allows users to quickly scan their workout history and identify specific sessions they want to explore further.

    Detailed Workout View: When a user selects a specific workout from the list, display a detailed view showing all the recorded data for that workout session. Include information such as exercise names, reps, sets, weights, working intervals, rest intervals, and any additional custom metrics. This view provides users with a comprehensive overview of their performance for a particular workout.

    Progress Charts: Use charts or graphs to visually represent the user's progress over time. For example, you could display line charts showing how their reps, weights, or duration have changed over the course of multiple workouts. This visual representation helps users track their improvement and identify trends in their performance.

    Summary Statistics: Show summary statistics for the user's workout history, such as the average reps, sets, or weights lifted, the total duration of workouts, or the most frequently performed exercises. These statistics provide users with a quick snapshot of their overall progress and accomplishments.

    Achievement Badges: Introduce achievement badges or milestones to reward users for reaching specific goals or milestones in their workout history. For example, you could award badges for completing a certain number of workouts, achieving personal bests, or maintaining a consistent workout routine. This gamification element adds an element of fun and motivation to the workout history experience.

    Filtering and Sorting: Allow users to filter and sort their workout history based on different criteria. For example, they can filter workouts by date range, exercise type, or specific metrics. Sorting options can include sorting by date, duration, reps, or any other relevant data. This flexibility helps users find the specific information they're looking for and analyze their workout history in a customized way.
 */
