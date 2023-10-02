import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import type { User as NextAuthUserSession } from "next-auth";

export default async function getAuthenticatedUserSession(): Promise<NextAuthUserSession | null> {
  const session = await getServerSession(authOptions);
  const user: NextAuthUserSession | undefined = session?.user;

  if (!user || !Number(user.id)) {
    return null;
  }
  return user;
}
