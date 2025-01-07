import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Panel de Control ELAD SAS</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">123</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Referidos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Puntos Acumulados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1500</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}