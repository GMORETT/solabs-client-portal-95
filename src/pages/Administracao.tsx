import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Building, Mail, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface Cliente {
  id: string
  nome: string
  email_contato: string
  created_at: string
  updated_at: string
}

interface AppUser {
  name: string
  email: string
}

interface AdministracaoProps {
  user: AppUser
}

export function Administracao({ user }: AdministracaoProps) {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: ""
  })

  
  // Verificar se é admin e redirecionar se não for
  useEffect(() => {
    if (user.email !== "admin@solabs.com.br") {
      navigate('/dashboard', { replace: true })
    }
  }, [user.email, navigate])

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClientes(data || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      toast.error('Erro ao carregar clientes')
    }
  }

  const handleCreateClient = async () => {
    if (!formData.nome || !formData.email || !formData.password) {
      toast.error('Todos os campos são obrigatórios')
      return
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }


    try {
      // Chamar a edge function para criar cliente com usuário
      const { data, error } = await supabase.functions.invoke('create-client-user', {
        body: {
          client_name: formData.nome,
          user_email: formData.email,
          user_password: formData.password
        }
      })

      if (error) {
        console.error('Erro ao criar cliente:', error)
        toast.error(`Erro ao criar cliente: ${error.message}`)
        return
      }

      if (data?.error) {
        toast.error(data.error)
        return
      }

      toast.success(data?.message || 'Cliente e usuário criados com sucesso!')
      setIsDialogOpen(false)
      setFormData({ nome: "", email: "", password: "" })
      loadClientes()
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error)
      toast.error(`Erro ao criar cliente: ${error.message}`)
    }
  }


  return (
    <div className="h-full bg-background overflow-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Administração de Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie todos os clientes e suas contas de acesso
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Preencha as informações do cliente e do usuário de acesso.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome da Empresa</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Digite o nome da empresa"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="usuario@empresa.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Digite a senha (mínimo 6 caracteres)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateClient}>
                  Criar Cliente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clientes.filter(cliente => {
                  const created = new Date(cliente.created_at)
                  const now = new Date()
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              Todos os clientes cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {cliente.email_contato}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Ativo</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}