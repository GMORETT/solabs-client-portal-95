import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

interface ClientContextType {
  selectedClientId: string | null
  selectedClientName: string | null
  isAdmin: boolean
  setSelectedClient: (clientId: string, clientName: string) => void
  clearSelectedClient: () => void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

interface ClientProviderProps {
  children: ReactNode
  userEmail: string
}

export function ClientProvider({ children, userEmail }: ClientProviderProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Don't render children until we have a valid userEmail
  if (!userEmail) {
    return null
  }

  useEffect(() => {
    checkUserType()
  }, [userEmail])

  const checkUserType = async () => {
    if (!userEmail) {
      console.log('ClientProvider: No userEmail provided')
      setIsLoading(false)
      return
    }
    
    try {
      console.log('ClientProvider: Starting user type check for:', userEmail)
      setIsLoading(true)
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      )
      
      const queryPromise = supabase
        .from('profiles')
        .select('tipo_usuario, cliente_id, clientes!inner(nome)')
        .eq('email', userEmail)
        .single()

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any

      if (error) {
        console.error('ClientProvider: Database error:', error)
        // Se a tabela profiles não existir, assume admin
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('ClientProvider: Profiles table not found, assuming admin user')
          setIsAdmin(true)
          setIsLoading(false)
          return
        }
        throw error
      }

      console.log('ClientProvider: User data retrieved:', data)
      const isAdminUser = data.tipo_usuario === 'admin'
      setIsAdmin(isAdminUser)

      // Se não for admin, automaticamente seleciona o cliente dele
      if (!isAdminUser && data.cliente_id) {
        setSelectedClientId(data.cliente_id)
        setSelectedClientName(data.clientes.nome)
        console.log('ClientProvider: Non-admin user, auto-selected client:', data.clientes.nome)
      }
    } catch (error) {
      console.error('ClientProvider: Error checking user type:', error)
      // Em caso de erro, assume admin para permitir acesso
      console.log('ClientProvider: Defaulting to admin access due to error')
      setIsAdmin(true)
    } finally {
      setIsLoading(false)
      console.log('ClientProvider: Loading completed')
    }
  }

  const setSelectedClient = (clientId: string, clientName: string) => {
    setSelectedClientId(clientId)
    setSelectedClientName(clientName)
    // Salvar no localStorage para persistir a seleção
    localStorage.setItem('selectedClientId', clientId)
    localStorage.setItem('selectedClientName', clientName)
  }

  const clearSelectedClient = () => {
    setSelectedClientId(null)
    setSelectedClientName(null)
    localStorage.removeItem('selectedClientId')
    localStorage.removeItem('selectedClientName')
  }

  // Recuperar seleção do localStorage se for admin
  useEffect(() => {
    if (isAdmin) {
      const savedClientId = localStorage.getItem('selectedClientId')
      const savedClientName = localStorage.getItem('selectedClientName')
      if (savedClientId && savedClientName) {
        setSelectedClientId(savedClientId)
        setSelectedClientName(savedClientName)
      }
    }
  }, [isAdmin])

  // Show loading while checking user type
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ClientContext.Provider value={{
      selectedClientId,
      selectedClientName,
      isAdmin,
      setSelectedClient,
      clearSelectedClient
    }}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClientContext() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error('useClientContext must be used within a ClientProvider')
  }
  return context
}