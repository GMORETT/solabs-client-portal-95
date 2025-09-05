import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle
} from "lucide-react"
import { useClientContext } from "@/hooks/use-client-context"
import { ClientDashboard } from "./ClientDashboard"
import { useNavigate } from "react-router-dom"

interface DashboardProps {
  user: { name: string; email: string }
}

export function Dashboard({ user }: DashboardProps) {
  const { selectedClientName, isAdmin } = useClientContext()
  const navigate = useNavigate()
  
  // Se não for admin, mostrar dashboard de cliente
  if (!isAdmin) {
    return <ClientDashboard user={user} />
  }
  const [stats] = useState({
    totalUsers: 1247,
    activeProjects: 23,
    monthlyGrowth: 12.5,
    messagesCount: 156
  })

  const recentActivities = [
    {
      id: 1,
      type: "message",
      title: "Nova mensagem recebida",
      description: "Suporte técnico respondeu sua solicitação",
      time: "2 min atrás",
      status: "new"
    },
    {
      id: 2,
      type: "project",
      title: "Relatório mensal disponível",
      description: "Métricas de performance do mês atual",
      time: "1 hora atrás",
      status: "completed"
    },
    {
      id: 3,
      type: "update",
      title: "Atualização do sistema",
      description: "Novos recursos implementados na plataforma",
      time: "2 horas atrás",
      status: "info"
    }
  ]

  const handleMessagingNavigation = () => {
    navigate("/mensageria")
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {selectedClientName 
            ? `Painel Admin - ${selectedClientName}` 
            : `Painel Administrativo`
          }
        </h1>
        <p className="text-muted-foreground">
          {selectedClientName 
            ? `Administrando dados de ${selectedClientName} - Sistema SOLABS`
            : "Painel de administração geral - Selecione um cliente para visualizar seus dados"
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs opacity-80">
              +180 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Ativos
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              +3 novos projetos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Crescimento Mensal
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{stats.monthlyGrowth}%
            </div>
            <p className="text-xs text-muted-foreground">
              Comparado ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mensagens
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messagesCount}</div>
            <p className="text-xs text-muted-foreground">
              12 não lidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mensageria Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Central de Mensageria
            </CardTitle>
            <CardDescription>
              Acesse sua central de comunicação integrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-primary/10 border border-primary/20 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Central de Mensageria
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gerencie todas suas conversas, tickets de suporte e comunicação com clientes 
                    em uma única plataforma integrada.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Integrado
                </Badge>
                <Badge variant="outline">
                  Tempo real
                </Badge>
                <Badge variant="outline">
                  Multi-canal
                </Badge>
              </div>

              <Button 
                onClick={handleMessagingNavigation}
                className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Abrir Mensageria
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.status === 'new' ? 'bg-primary' :
                    activity.status === 'completed' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Relatórios</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={handleMessagingNavigation}
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Mensagens</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Agenda</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Equipe</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}