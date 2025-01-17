import { Inter } from 'next/font/google'
import { NextAuthProvider } from '@/components/providers/NextAuthProvider'
import { Toaster } from "@/components/ui/toaster"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ELAD SAS',
  description: 'Sistema de Referidos y Árbol Genealógico',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  )
}

