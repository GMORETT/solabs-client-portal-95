import { useState, useEffect } from "react"
import { Building } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"

interface Cliente {
  id: string
  nome: string
  email_contato: string
}

interface ClientSelectorProps {
  selectedClientId: string | null
  onClientSelect: (clientId: string, clientName: string) => void
}

export function ClientSelector({ selectedClientId, onClientSelect }: ClientSelectorProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome')

      if (error) throw error
      setClientes(data || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Building className="h-5 w-5" />
        <span className="font-medium">Cliente:</span>
      </div>
      
      <Select value={selectedClientId || ""} onValueChange={(value) => {
        const client = clientes.find(c => c.id === value)
        if (client) {
          onClientSelect(client.id, client.nome)
        }
      }}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Selecione um cliente" />
        </SelectTrigger>
        <SelectContent>
          {clientes.map((cliente) => (
            <SelectItem key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}