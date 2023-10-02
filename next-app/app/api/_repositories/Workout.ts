import prisma from "@/lib/prisma";
import { Workout } from "@prisma/client";

export interface WorkoutRepository<T> {
  findActiveUserWorkoutById: (id: number, userId: number) => Promise<T | null>;
}

export class PrismaWorkoutRepository implements WorkoutRepository<Workout> {
  async findActiveUserWorkoutById(id: number, userId: number) {
    const workout = await prisma.workout.findFirst({
      where: { id: id, userId: userId, deletedAt: null },
    });

    return workout;
  }
}
