import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { connectDB } from "@/lib/db"
import UserModel from '@/models/User'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email y contraseña son requeridos")
          }

          await connectDB()
          const user = await UserModel.findOne({ email: credentials.email })

          if (!user || !(await compare(credentials.password, user.password))) {
            throw new Error("Credenciales inválidas")
          }

          if (!user.isApproved) {
            throw new Error("Tu cuenta aún no ha sido aprobada por un administrador")
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved
          }
        } catch (error) {
          console.error('Error en la autenticación:', error)
          throw error
        }
      }
    })
  ],
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
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

