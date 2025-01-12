import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">ELAD SAS</h1>
      <div className="flex space-x-4">
        <Link href="/auth/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Registro
        </Link>
        <Link href="/auth/login" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Iniciar Sesión
        </Link>
      </div>
    </main>
  )
}



