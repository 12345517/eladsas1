import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { connectDB } from "@/lib/db"
import UserModel, { IUser } from '@/types/User'

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos")
        }

        await connectDB()
        const user = await UserModel.findOne({ email: credentials.email }) as IUser | null

        if (!user || !(await compare(credentials.password, user.password))) {
          throw new Error("Credenciales inválidas")
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as ExtendedUser).role
        token.isApproved = (user as ExtendedUser).isApproved
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isApproved = token.isApproved as boolean
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

import NextAuth from "next-auth"
export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

