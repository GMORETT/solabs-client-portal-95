import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Settings } from "lucide-react"

export function Mensageria() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Central de Mensageria
        </h1>
        <p className="text-muted-foreground">
          Sistema de comunicação e suporte
        </p>
      </div>

      {/* Em Desenvolvimento */}
      <Card className="bg-gradient-secondary text-white border-0 shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <Settings className="h-8 w-8 animate-spin" />
          </div>
          <CardTitle className="text-2xl">
            Em Desenvolvimento
          </CardTitle>
          <CardDescription className="text-white/80">
            A Central de Mensageria está sendo desenvolvida
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-white/10 rounded-lg p-4">
            <Badge variant="secondary" className="mb-2">Em Breve</Badge>
            <p className="text-sm text-white/80">
              Esta funcionalidade será implementada em breve com todos os recursos de mensageria
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Funcionalidades Planejadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Chat em Tempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sistema de chat integrado para comunicação instantânea
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Gerenciamento de Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sistema completo de suporte e atendimento ao cliente
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Alertas e notificações em tempo real
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}