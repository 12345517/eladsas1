import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'
import { connectDB } from '@/lib/db'
import UserModel from '@/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    await connectDB()

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await hash(password, 12)

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      isApproved: false,
    })

    await newUser.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

