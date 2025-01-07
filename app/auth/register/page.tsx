'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    sponsorId: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    paymentProof: null as File | null
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (step === 1) {
      if (!formData.sponsorId) {
        setError('Por favor ingrese el ID del patrocinador')
        return
      }
      setStep(2)
    } else {
      setIsLoading(true)
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          router.push('/auth/login')
        } else {
          const data = await response.json()
          setError(data.message || 'Error al registrar. Por favor, intente nuevamente.')
        }
      } catch (error) {
        setError('Error de conexión. Por favor, intente nuevamente.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">ELAD SAS</h1>
          <p className="text-sm text-gray-500">Sistema de Referidos</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center text-rose-600">REGISTRO</CardTitle>
            <CardDescription className="text-center">
              {step === 1 ? 'Información del Patrocinador' : 'Información Personal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContinue} className="space-y-4">
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="sponsorId" className="text-sm font-medium text-gray-700">
                      ID del Patrocinador <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="sponsorId"
                      type="text"
                      value={formData.sponsorId}
                      onChange={(e) => setFormData({ ...formData, sponsorId: e.target.value })}
                      placeholder="Ingrese el ID del patrocinador"
                      className="w-full"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Nombre completo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="tel"
                      placeholder="Teléfono"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Comprobante de pago
                    </label>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFormData({ ...formData, paymentProof: e.target.files?.[0] || null })}
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="text-sm text-red-500 text-center">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button 
                  type="submit" 
                  className="w-full bg-amber-500 hover:bg-amber-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : (step === 1 ? 'Continuar' : 'Registrarse')}
                </Button>
                <Link href="/auth/login" className="text-center">
                  <Button variant="outline" type="button" className="w-full">
                    Ir al Login
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}