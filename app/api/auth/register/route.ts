import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isApproved: false,
      },
    })

    return NextResponse.json({ message: "Usuario registrado exitosamente", userId: newUser.id }, { status: 201 })
  } catch (error) {
    console.error("Error en el registro:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

