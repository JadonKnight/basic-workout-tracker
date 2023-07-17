import NextAuth, { DefaultUser, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare as passwordCompare } from "../../../lib/password";
import prisma from "../../../lib/prisma";
const sessionStrategy: SessionStrategy = "jwt";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "somesecretstring",
  session: {
    strategy: sessionStrategy,
  },
  providers: [
    CredentialsProvider({
      name: "your account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
          select: {
            id: true,
            username: true,
            password: true,
            profile: {
              select: {
                email: true,
              },
            },
          },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await passwordCompare(
          credentials.password,
          user.password
        );
        if (!passwordMatch) {
          return null;
        }

        const userDefault: DefaultUser = {
          id: user.id.toString(),
          name: user.username,
          email: user.profile?.email,
          image: null,
        };

        // Set the last login field and then return the userDefault
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            lastLogin: new Date(),
          },
        });

        return userDefault;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({
      session,
      // We disable this line since authOptions requires it but we don't use it.
      // eslint-disable-next-line
      user,
      token,
    }: unknown) {
      if (session.user) {
        // Janky workaround for adding user id to session.
        // Probably need to change strategy to database sessions
        // but still learning.
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
