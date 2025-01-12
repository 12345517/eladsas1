'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface FormData {
  sponsorId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  paymentProof: File | null;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    sponsorId: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    paymentProof: null
  })
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value)
      }
    })

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password
        })

        if (result?.error) {
          setError(result.error)
        } else {
          router.push('/dashboard')
        }
      } else {
        const data = await response.json()
        setError(data.message || 'Error en el registro')
      }
    } catch (error) {
      setError('Error en el registro')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>Crea tu cuenta en ELAD SAS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="sponsorId">ID del Patrocinador</label>
              <Input
                id="sponsorId"
                name="sponsorId"
                value={formData.sponsorId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="name">Nombre</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="phone">Teléfono</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Contraseña</label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="paymentProof">Comprobante de Pago</label>
              <Input
                id="paymentProof"
                name="paymentProof"
                type="file"
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full">Registrarse</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

