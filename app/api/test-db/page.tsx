'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestDBPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      if (response.ok) {
        setStatus('Conexión exitosa: ' + data.message)
      } else {
        setStatus('Error: ' + data.error)
      }
    } catch (error) {
      setStatus('Error al realizar la prueba')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Prueba de Conexión a MongoDB</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={isLoading}>
            {isLoading ? 'Probando...' : 'Probar Conexión'}
          </Button>
          {status && (
            <p className={status.includes('exitosa') ? 'text-green-600' : 'text-red-600'}>
              {status}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

