import NextAuth, { DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare as passwordCompare } from "../../../lib/password";
import prisma from "../../../lib/prisma";

export default NextAuth({
  secret: process.env.TOKEN_SECRET || "somesecretstring",
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "your account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username
          },
          select: {
            id: true,
            username: true,
            password: true
          }
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await passwordCompare(credentials.password, user.password);
        if (!passwordMatch) {
          return null;
        }

        const userDefault: DefaultUser = {
          id: user.id.toString(),
          name: user.username,
          email: null,
          image: null,
        };

        // Set the last login field and then return the userDefault
        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            lastLogin: new Date()
          }
        });

        return userDefault;
      }
    })
  ],
  pages: {
    signIn: "/signin",
  }
});
