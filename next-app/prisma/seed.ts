import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

import seedExercises from "./seed-exercises";

async function main() {
  // Always seed exercises for both development and production
  await seedExercises(prisma);

  if (process.env.NODE_ENV === "production") {
    console.log("Running production seed script");
    return;
  }

  console.log("Running development seed script");

  // Dummy development accounts
  await prisma.profile.upsert({
    where: {
      email: "jadon.knight@outlook.com",
    },
    update: {},
    create: {
      user: {
        create: {
          username: "admin",
          password: await bcrypt.hash("administrator", 10),
        },
      },
      name: "admin",
      email: "jadon.knight@outlook.com",
      avatar: "",
    },
  });

  const dummyAccounts = Array.from({ length: 10 }, () => ({
    username: faker.internet.userName(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: "",
  }));

  for (const account of dummyAccounts) {
    const profile = await prisma.profile.upsert({
      where: {
        email: account.email,
      },
      update: {},
      create: {
        user: {
          create: {
            username: account.username,
            password: await bcrypt.hash(account.password, 10),
          },
        },
        name: account.name,
        email: account.email,
        avatar: account.avatar,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: profile.userId,
      },
    });

    const workouts = [
      { name: "Chest Day", daysOfWeek: 1 }, // Sunday
      { name: "Leg Day", daysOfWeek: 32 }, // Wednesday
      { name: "Back Day", daysOfWeek: 2 }, // Monday
    ];

    for (const workout of workouts) {
      if (!user || !user.id) throw new Error("User not found");
      const createdWorkout = await prisma.workout.create({
        data: {
          name: workout.name,
          daysOfWeek: workout.daysOfWeek,
          userId: user.id,
        },
      });

      // TODO: Create at least 3 exercises for each workout
      const workoutExercise1 = await prisma.workoutExercise.create({
        data: {
          workoutId: createdWorkout.id,
          exerciseId: 1,
        },
      });
      const workoutExercise2 = await prisma.workoutExercise.create({
        data: {
          workoutId: createdWorkout.id,
          exerciseId: 2,
        },
      });
      const workoutExercise3 = await prisma.workoutExercise.create({
        data: {
          workoutId: createdWorkout.id,
          exerciseId: 3,
        },
      });

      const sessionStart = new Date(faker.date.recent());
      // Generate a random amount of minutes between 15 and 120
      const sessionDuration = Math.random() * (120 - 15) + 15;
      const sessionEnd = new Date(sessionStart.getTime() + sessionDuration * 60000);

      const workoutSession = await prisma.workoutSession.create({
        data: {
          workoutId: createdWorkout.id,
          // TODO: Create a random date between 1 and 7 days ago
          startedAt: sessionStart,
          endedAt: sessionEnd
        },
      });

      // Create at least 3 sets for each exercise for each workout session
      const workoutSessionExercise = await prisma.workoutSet.createMany({
        // TODO: Better randomise this.
        data: [
          {
            workoutSessionId: workoutSession.id,
            workoutExerciseId: workoutExercise1.id,
            reps: 10,
            weight: 100,
            workingInterval: 60,
            restInterval: 30,
          },
          {
            workoutSessionId: workoutSession.id,
            workoutExerciseId: workoutExercise2.id,
            reps: 10,
            weight: 100,
            workingInterval: 60,
            restInterval: 30,
          },
          {
            workoutSessionId: workoutSession.id,
            workoutExerciseId: workoutExercise3.id,
            reps: 10,
            weight: 100,
            workingInterval: 60,
            restInterval: 30,
          },
        ],
      });
    }
  }

  console.log("The following users have been seeded:", dummyAccounts);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
