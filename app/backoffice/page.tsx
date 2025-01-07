'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { GenealogyTree } from '@/components/GenealogyTree'
import { User } from '@/types/user'
import { useToast } from '@/components/ui/useToast'

export default function BackofficePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<{
    user: User;
    directReferrals: User[];
    secondLevelReferrals: { [key: string]: User[] };
  } | null>(null)

  useEffect(() => {
    if (session) {
      fetchReferralData()
    }
  }, [session])

  const fetchReferralData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/referrals')
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos')
      }

      const data = await response.json()
      setUserData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de referidos. Por favor, intente nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return <div>Por favor, inicie sesión para ver esta página.</div>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p>No se pudieron cargar los datos. Por favor, actualice la página.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mi Red de Referidos</h1>
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Árbol Genealógico</h2>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[800px]">
            <GenealogyTree 
              user={userData.user}
              directReferrals={userData.directReferrals}
              secondLevelReferrals={userData.secondLevelReferrals}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Mis Referidos Directos</h2>
        </CardHeader>
        <CardContent>
          {userData.directReferrals.length === 0 ? (
            <p>Aún no tienes referidos directos.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userData.directReferrals.map((referral) => (
                <Card key={referral._id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">{referral.email}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span>Puntos: {referral.points}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        referral.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {referral.isApproved ? 'Activo' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-sm">
                      Referidos: {userData.secondLevelReferrals[referral._id]?.length || 0}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}