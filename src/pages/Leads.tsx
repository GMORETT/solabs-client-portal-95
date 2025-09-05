import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone, Mail, Calendar, Filter, Eye, Edit, MoreHorizontal } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useClientContext } from "@/hooks/use-client-context"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Lead {
  telefone: number
  nome: string | null
  email: string | null
  status: string | null
  criado_em: string | null
  data_qualificacao: string | null
  ultima_mensagem_lead: string | null
  site_empresa: string | null
  resumo_empresa: string | null
  deal_id: string | null
  event_id: string | null
  chatwoot: string | null
  rollout: boolean | null
  cliente_id: string | null
}

export function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { selectedClientId, isAdmin } = useClientContext()
  const { toast } = useToast()

  useEffect(() => {
    fetchLeads()
  }, [selectedClientId])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      let query = supabase.from('leads').select('*')

      // Se não for admin e tiver cliente selecionado, filtrar por cliente
      if (!isAdmin && selectedClientId) {
        query = query.eq('cliente_id', selectedClientId)
      }
      // Se for admin e tiver cliente selecionado, filtrar por cliente
      else if (isAdmin && selectedClientId) {
        query = query.eq('cliente_id', selectedClientId)
      }

      const { data, error } = await query.order('criado_em', { ascending: false })

      if (error) {
        throw error
      }

      setLeads(data || [])
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os leads",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.toString().includes(searchTerm)

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      "novo": { label: "Novo", variant: "default" as const },
      "qualificado": { label: "Qualificado", variant: "default" as const },
      "em_andamento": { label: "Em Andamento", variant: "secondary" as const },
      "fechado": { label: "Fechado", variant: "default" as const },
      "perdido": { label: "Perdido", variant: "destructive" as const }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status || "N/A", variant: "outline" as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR })
    } catch {
      return "Data inválida"
    }
  }

  const formatPhone = (phone: number) => {
    const phoneStr = phone.toString()
    if (phoneStr.length === 11) {
      return `(${phoneStr.substring(0, 2)}) ${phoneStr.substring(2, 7)}-${phoneStr.substring(7)}`
    }
    return phoneStr
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe seus prospects e oportunidades
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm">
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => lead.status === "qualificado").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => lead.status === "em_andamento").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fechados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => lead.status === "fechado").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="qualificado">Qualificado</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
                <SelectItem value="perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
          <CardDescription>
            {filteredLeads.length} lead(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Última Mensagem</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead, index) => (
                <TableRow key={`${lead.telefone}-${index}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.nome || "Nome não informado"}</div>
                      {lead.resumo_empresa && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {lead.resumo_empresa}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">{formatPhone(lead.telefone)}</span>
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span className="text-sm">{lead.email}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(lead.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">{formatDate(lead.criado_em)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatDate(lead.ultima_mensagem_lead)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('Visualizar lead:', lead.telefone)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('Editar lead:', lead.telefone)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('Mais opções para lead:', lead.telefone)
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      Nenhum lead encontrado com os filtros aplicados
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}