import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

async function main() {
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

  const exercises = [
    {
      name: "Bench Press",
      description:
        "Lay on your back and lift the barbell off the rack. Hold the barbell with an overhand grip, slightly wider than shoulder-width apart. Lower the barbell to your chest. Press the barbell back up to the starting position.",
    },
    {
      name: "Deadlift",
      description:
        "Stand with your feet shoulder-width apart, toes under the bar. Bend down and grab the bar with an overhand grip. Lift the bar off the ground by pushing through your heels and extending your legs. Lower the bar back down to the ground.",
    },
    {
      name: "Squat",
      description:
        "Stand with your feet shoulder-width apart, toes pointing forward. Bend your knees and lower your hips until your thighs are parallel to the ground. Stand back up to the starting position.",
    },
    {
      name: "Pull-up",
      description:
        "Hang from a pull-up bar with your hands shoulder-width apart, palms facing away from you. Pull your body up towards the bar until your chin is above the bar. Lower your body back down to the starting position.",
    },
    {
      name: "Push-up",
      description:
        "Start in a plank position with your hands slightly wider than shoulder-width apart. Lower your body down to the ground by bending your elbows. Push your body back up to the starting position.",
    },
    {
      name: "Lunges",
      description:
        "Stand with your feet hip-width apart. Step forward with one foot and lower your body until your front knee is bent at a 90-degree angle. Push back up to the starting position and repeat with the other foot.",
    },
    {
      name: "Shoulder Press",
      description:
        "Stand with your feet shoulder-width apart and hold dumbbells at shoulder level. Press the dumbbells up overhead until your arms are fully extended. Lower the dumbbells back down to shoulder level.",
    },
    {
      name: "Bicep Curl",
      description:
        "Stand with your feet hip-width apart and hold dumbbells at your sides with your palms facing forward. Curl the dumbbells up towards your shoulders. Lower the dumbbells back down to your sides.",
    },
    {
      name: "Tricep Extension",
      description:
        "Hold a dumbbell with both hands and raise it above your head. Lower the dumbbell behind your head by bending your elbows. Raise the dumbbell back up to the starting position.",
    },
    {
      name: "Leg Press",
      description:
        "Sit in a leg press machine with your feet shoulder-width apart on the platform. Push the platform away from you with your legs until they are fully extended. Lower the platform back down to the starting position.",
    },
    {
      name: "Plank",
      description:
        "Start in a push-up position and lower your body down onto your forearms. Hold your body in a straight line from head to heels.",
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: {
        name: exercise.name,
      },
      update: {},
      create: {
        name: exercise.name,
        description: exercise.description,
        createdById: 1,
        createdAt: new Date(),
      },
    });
  }

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
