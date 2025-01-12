import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegistroExitoso() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro Exitoso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Tu registro ha sido exitoso. Un administrador revisará y aprobará tu cuenta pronto.
          </p>
          <p className="mb-4">
            Te notificaremos por correo electrónico cuando tu cuenta haya sido aprobada.
          </p>
          <Link href="/" className="text-blue-500 hover:underline">
            Volver a la página principal
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

