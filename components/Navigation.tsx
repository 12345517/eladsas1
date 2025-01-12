import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function Navigation() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold">ELAD SAS</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
            <Link href="/backoffice" className="text-gray-700 hover:text-gray-900">Backoffice</Link>
            {session?.user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 hover:text-gray-900">Admin</Link>
            )}
            {session ? (
              <Button onClick={() => signOut()}>Cerrar Sesión</Button>
            ) : (
              <Link href="/auth/login" passHref>
                <Button>Iniciar Sesión</Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden py-4 space-y-4">
          <Link href="/dashboard" className="block text-gray-700 hover:text-gray-900">Dashboard</Link>
          <Link href="/backoffice" className="block text-gray-700 hover:text-gray-900">Backoffice</Link>
          {session?.user?.role === 'admin' && (
            <Link href="/admin" className="block text-gray-700 hover:text-gray-900">Admin</Link>
          )}
          {session ? (
            <Button onClick={() => signOut()} className="w-full">Cerrar Sesión</Button>
          ) : (
            <Link href="/auth/login" passHref>
              <Button className="w-full">Iniciar Sesión</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

