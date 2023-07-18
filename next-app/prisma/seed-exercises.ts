import { PrismaClient } from "@prisma/client";

export default async function seedExercises(prisma: PrismaClient) {
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
      name: "Overhead Shoulder Press",
      description:
        "Stand with your feet shoulder-width apart and hold dumbbells at shoulder level. Press the dumbbells up overhead until your arms are fully extended. Lower the dumbbells back down to shoulder level.",
    },
    {
      name: "Incline Dumbbell Bench Press",
      description:
        "Lay on an incline bench and hold dumbbells at shoulder level. Press the dumbbells up overhead until your arms are fully extended. Lower the dumbbells back down to shoulder level.",
    },
    {
      name: "Decline Barbell Bench Press",
      description:
        "Lay on a decline bench and hold a barbell with an overhand grip, slightly wider than shoulder-width apart. Lower the barbell to your chest. Press the barbell back up to the starting position.",
    },
    {
      name: "Lat Raise",
      description:
        "Stand with your feet shoulder-width apart and hold dumbbells at your sides with your palms facing your body. Raise the dumbbells up and out to the sides until your arms are parallel to the ground. Lower the dumbbells back down to your sides.",
    },
    {
      name: "Tricep Pushdown",
      description:
        "Stand with your feet shoulder-width apart and hold a rope attachment with an overhand grip. Push the rope down until your arms are fully extended. Raise the rope back up to the starting position.",
    },
    {
      name: "Dips",
      description:
        "Stand between two parallel bars and hold onto the bars with an overhand grip. Lower your body down until your elbows are bent at a 90-degree angle. Push your body back up to the starting position.",
    },
    {
      name: "Bar Bell Curl",
      description:
        "Stand with your feet shoulder-width apart and hold a barbell with an underhand grip, slightly wider than shoulder-width apart. Curl the barbell up towards your shoulders. Lower the barbell back down to your sides.",
    },
    {
      name: "Dumbbell Bench Row",
      description:
        "Lay on a bench and hold dumbbells at your sides with your palms facing your body. Raise the dumbbells up and out to the sides until your arms are parallel to the ground. Lower the dumbbells back down to your sides.",
    },
    {
      name: "Hammer Curl",
      description:
        "Stand with your feet shoulder-width apart and hold dumbbells at your sides with your palms facing your body. Raise the dumbbells up and out to the sides until your arms are parallel to the ground. Lower the dumbbells back down to your sides.",
    },
    {
      name: "Front Squat",
      description:
        "Stand with your feet shoulder-width apart and hold a barbell with an overhand grip, slightly wider than shoulder-width apart. Lower the barbell to your chest. Press the barbell back up to the starting position.",
    },
    {
      name: "Bulgarian Split Squat",
      description:
        "Stand with your feet shoulder-width apart and hold dumbbells at your sides with your palms facing your body. Raise the dumbbells up and out to the sides until your arms are parallel to the ground. Lower the dumbbells back down to your sides.",
    },
    {
      name: "Romanian Deadlift",
      description:
        "Stand with your feet shoulder-width apart and hold a barbell with an overhand grip, slightly wider than shoulder-width apart. Lower the barbell to your chest. Press the barbell back up to the starting position.",
    },
    {
      name: "Hanging Leg Raise",
      description:
        "Hang from a pull-up bar with your hands shoulder-width apart, palms facing away from you. Pull your body up towards the bar until your chin is above the bar. Lower your body back down to the starting position.",
    },
    {
      name: "Farmers Walk",
      description:
        "Stand with your feet shoulder-width apart and hold dumbbells at your sides with your palms facing your body. Raise the dumbbells up and out to the sides until your arms are parallel to the ground. Lower the dumbbells back down to your sides.",
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
        createdById: undefined,
        createdAt: new Date(),
      },
    });
  }
}
