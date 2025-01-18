import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'

export async function GET() {
  try {
    await connectDB()
    return NextResponse.json({ message: 'Conexión a MongoDB exitosa' }, { status: 200 })
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error)
    return NextResponse.json({ error: 'Error al conectar con MongoDB' }, { status: 500 })
  }
}

