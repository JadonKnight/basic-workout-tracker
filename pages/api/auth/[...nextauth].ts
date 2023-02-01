import NextAuth, { DefaultUser } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare as passwordCompare } from "../../../lib/password"
import prisma from "../../../lib/prisma"

export default NextAuth({
  secret: process.env.TOKEN_SECRET || 'somesecretstring',
  providers: [
    CredentialsProvider({
      name: 'your account',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
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
        })

        if (!user) {
          return null;
        }

        const passwordMatch = await passwordCompare(credentials.password, user.password)
        if (!passwordMatch) {
          return null;
        }

        const userDefault: DefaultUser = {
          id: user.id.toString(),
          name: user.username,
          email: null,
          image: null,
        }

        return userDefault;
      }
    })
  ],
  callbacks: {
    async jwt({ user, token, account, profile }) {
      return token
    },
    async session({ session, token, user }) {
      return session
    }
  },
  // TODO: Add the custom login later
  pages: {}
})
