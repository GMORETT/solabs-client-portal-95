import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Calendar,
  FileText,
  PieChart,
  LineChart,
  Activity
} from "lucide-react"

export function Relatorios() {
  const reports = [
    {
      id: 1,
      title: "Relatório Mensal",
      description: "Métricas completas do mês atual",
      type: "monthly",
      status: "ready",
      date: "Março 2024",
      icon: BarChart3
    },
    {
      id: 2,
      title: "Análise de Performance",
      description: "Indicadores de performance e crescimento",
      type: "performance",
      status: "processing",
      date: "Último trimestre",
      icon: TrendingUp
    },
    {
      id: 3,
      title: "Relatório de Atividades",
      description: "Log detalhado de todas as atividades",
      type: "activity",
      status: "ready",
      date: "Últimos 30 dias",
      icon: Activity
    },
    {
      id: 4,
      title: "Análise Financeira",
      description: "Demonstrativo financeiro e investimentos",
      type: "financial",
      status: "scheduled",
      date: "Abril 2024",
      icon: PieChart
    }
  ]

  const quickStats = [
    {
      title: "Total de Relatórios",
      value: "156",
      change: "+12",
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "Downloads este mês",
      value: "89",
      change: "+23%",
      icon: Download,
      color: "text-green-600"
    },
    {
      title: "Relatórios Automáticos",
      value: "12",
      change: "Ativos",
      icon: Calendar,
      color: "text-blue-600"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pronto</Badge>
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Processando</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Agendado</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Relatórios e Análises
        </h1>
        <p className="text-muted-foreground">
          Acesse seus relatórios personalizados e métricas de performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>
            Seus relatórios personalizados e análises de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => {
              const Icon = report.icon
              return (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {report.description}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {report.date}
                      </div>
                      <Button 
                        size="sm" 
                        disabled={report.status !== 'ready'}
                        className="bg-gradient-primary hover:opacity-90 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chart Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Tendência de Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Gráfico de tendências</p>
                <p className="text-xs">Em desenvolvimento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Gráfico de distribuição</p>
                <p className="text-xs">Em desenvolvimento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}