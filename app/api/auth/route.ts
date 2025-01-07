import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import clientPromise from "@/lib/db"
import { User } from "@/types/user"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Credenciales incompletas')
          }

          const client = await clientPromise
          const db = client.db()
          const user = await db.collection<User>("users").findOne({ 
            email: credentials.email.toLowerCase()
          })

          if (!user) {
            throw new Error('Usuario no encontrado')
          }

          if (!user.isApproved) {
            throw new Error('Usuario pendiente de aprobación')
          }

          const isPasswordValid = await compare(credentials.password, user.password)
          if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.membership,
            isApproved: user.isApproved
          }
        } catch (error) {
          console.error('Error en autorización:', error)
          throw error
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isApproved = user.isApproved
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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }