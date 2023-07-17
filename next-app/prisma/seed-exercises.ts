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
        createdById: undefined,
        createdAt: new Date(),
      },
    });
  }
}
