import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export interface UserRepository<T> {
  findUserById: (id: number) => Promise<T | null>;
}

export class PrismaUserRepository implements UserRepository<User> {
  async findUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    return user;
  }
}
