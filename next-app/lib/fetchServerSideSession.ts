import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Session } from "next-auth";

export default async function fetchServerSideSession() {
  const session: Session | null = await getServerSession(authOptions);
  return session;
}
