import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  Phone,
  Mail
} from "lucide-react"
import { useClientContext } from "@/hooks/use-client-context"

interface ClientDashboardProps {
  user: { name: string; email: string }
}

export function ClientDashboard({ user }: ClientDashboardProps) {
  const { selectedClientName } = useClientContext()
  const [stats] = useState({
    totalLeads: 156,
    activeChats: 12,
    monthlyMessages: 2340,
    conversionRate: 8.5
  })

  const recentActivities = [
    {
      id: 1,
      type: "lead",
      title: "Novo lead qualificado",
      description: "Lead interessado em produto premium",
      time: "5 min atrás",
      status: "new"
    },
    {
      id: 2,
      type: "message",
      title: "Conversa finalizada",
      description: "Cliente satisfeito com atendimento",
      time: "15 min atrás",
      status: "completed"
    },
    {
      id: 3,
      type: "report",
      title: "Relatório semanal disponível",
      description: "Métricas de performance da semana",
      time: "1 hora atrás",
      status: "available"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-green-500"
      case "completed": return "bg-blue-500"
      case "available": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "lead": return <Users className="h-4 w-4" />
      case "message": return <MessageSquare className="h-4 w-4" />
      case "report": return <BarChart3 className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Cliente</h2>
        <p className="text-muted-foreground">
          Bem-vindo, {selectedClientName || "Cliente"}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chats Ativos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeChats}</div>
            <p className="text-xs text-muted-foreground">
              Conversas em andamento
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens/Mês</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas atualizações do seu sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full text-white ${getStatusColor(activity.status)}`}>
                  {getStatusIcon(activity.type)}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Funcionalidades principais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="text-sm font-medium">Mensageria</h4>
                    <p className="text-xs text-muted-foreground">Gerencie conversas</p>
                  </div>
                </div>
                <Badge variant="secondary">12 ativas</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="text-sm font-medium">Relatórios</h4>
                    <p className="text-xs text-muted-foreground">Visualize métricas</p>
                  </div>
                </div>
                <Badge variant="secondary">Novo</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-500" />
                  <div>
                    <h4 className="text-sm font-medium">Leads</h4>
                    <p className="text-xs text-muted-foreground">Acompanhe prospects</p>
                  </div>
                </div>
                <Badge variant="secondary">{stats.totalLeads}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}