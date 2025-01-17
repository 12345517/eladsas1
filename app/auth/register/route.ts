import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { connectDB } from '@/lib/db'
import UserModel from '@/models/User'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    await connectDB()

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      isApproved: false,
    })

    await newUser.save()

    return NextResponse.json({ message: 'Usuario registrado exitosamente' }, { status: 201 })
  } catch (error) {
    console.error('Error en el registro:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

