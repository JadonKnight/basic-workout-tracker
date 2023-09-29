import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import type { User } from "next-auth";

export default async function getAuthenticatedUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  if (!user || !Number(user.id)) {
    return null;
  }
  return user;
}
