'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { GenealogyTree } from '@/components/GenealogyTree'
import { User } from '@/types/User'

interface UserData {
  user: User;
  directReferrals: User[];
  secondLevelReferrals: { [key: string]: User[] };
}

export default function BackofficePage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/referrals')
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        } else {
          console.error('Failed to fetch user data')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (session) {
      fetchUserData()
    }
  }, [session])

  if (!session) {
    return <div>Please sign in to access the backoffice.</div>
  }

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Backoffice</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Información del Usuario</h2>
          </CardHeader>
          <CardContent>
            <p>Nombre: {userData.user.name}</p>
            <p>Email: {userData.user.email}</p>
            <p>ID: {userData.user.id}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Estadísticas</h2>
          </CardHeader>
          <CardContent>
            <p>Referidos Directos: {userData.directReferrals.length}</p>
            <p>Referidos de Segundo Nivel: {Object.values(userData.secondLevelReferrals).flat().length}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">Árbol Genealógico</h2>
        </CardHeader>
        <CardContent>
          <GenealogyTree
            user={userData.user}
            directReferrals={userData.directReferrals}
            secondLevelReferrals={userData.secondLevelReferrals}
          />
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">Lista de Referidos</h2>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Referidos Directos</h3>
          <ul>
            {userData.directReferrals.map((referral) => (
              <li key={referral.id}>
                {referral.name} - {referral.email}
                <ul>
                  <li>
                    Referidos: {userData.secondLevelReferrals[referral.id]?.length || 0}
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

