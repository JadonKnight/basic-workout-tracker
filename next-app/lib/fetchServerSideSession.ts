import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Session, DefaultUser } from "next-auth";

export interface DefaultUserSession extends Session {
  user: DefaultUser
}

export default async function fetchServerSideSession() {
  const session: DefaultUserSession | null = await getServerSession(authOptions);
  return session;
}
