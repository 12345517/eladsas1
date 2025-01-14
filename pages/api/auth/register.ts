import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import UserModel from '@/models/User'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      isApproved: false,
    })

    await newUser.save()

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error in signup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

