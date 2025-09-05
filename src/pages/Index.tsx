import { useState, useEffect } from "react"
import { LoginForm } from "@/components/ui/login-form"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Dashboard } from "./Dashboard"
import { Mensageria } from "./Mensageria"
import { Relatorios } from "./Relatorios"
import { Configuracoes } from "./Configuracoes"
import { Administracao } from "./Administracao"
import { Leads } from "./Leads"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { User, Session } from "@supabase/supabase-js"
import { ClientProvider } from "@/hooks/use-client-context"

interface AppUser {
  name: string
  email: string
  isAuthenticated: boolean
}

const Index = () => {
  const [user, setUser] = useState<AppUser>({
    name: "",
    email: "",
    isAuthenticated: false
  })
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setSupabaseUser(session?.user ?? null)
        
        if (session?.user) {
          // Permite acesso para usuários autenticados
          const userName = session.user.email === "admin@solabs.com.br" ? "Admin" : session.user.email?.split('@')[0] || "Usuário"
          setUser({
            name: userName,
            email: session.user.email || "",
            isAuthenticated: true
          })
        } else {
          setUser({
            name: "",
            email: "",
            isAuthenticated: false
          })
        }
        setLoading(false)
      }
    )

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setSupabaseUser(session?.user ?? null)
      
      if (session?.user) {
        const userName = session.user.email === "admin@solabs.com.br" ? "Admin" : session.user.email?.split('@')[0] || "Usuário"
        setUser({
          name: userName,
          email: session.user.email || "",
          isAuthenticated: true
        })
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = (success: boolean) => {
    // A autenticação é gerenciada pelo useEffect acima
    if (!success) {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser({
      name: "",
      email: "",
      isAuthenticated: false
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user.isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <ClientProvider userEmail={user.email}>
        <DashboardLayout onLogout={handleLogout} user={user}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/mensageria" element={<Mensageria />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/administracao" element={<Administracao user={user} />} />
            <Route path="/configuracoes" element={<Configuracoes user={user} />} />
          </Routes>
        </DashboardLayout>
      </ClientProvider>
    </BrowserRouter>
  )
};

export default Index;
