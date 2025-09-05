
import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Shield,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useClientContext } from "@/hooks/use-client-context"
import solabsLogo from "@/assets/solabs-logo-new.png"

interface SidebarProps {
  onLogout: () => void
  user: { name: string; email: string }
}

export function Sidebar({ onLogout, user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const { selectedClientName, isAdmin } = useClientContext()

  // Para clientes, usar o nome da empresa; para admin, usar o nome do usuário
  const displayName = !isAdmin && selectedClientName ? selectedClientName : user.name
  const displayInitial = displayName.charAt(0).toUpperCase()

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Leads",
      href: "/leads",
      icon: Users,
    },
    {
      name: "Mensageria",
      href: "/mensageria", 
      icon: MessageSquare,
    },
    {
      name: "Relatórios",
      href: "/relatorios",
      icon: BarChart3,
    },
    ...(user.email === "admin@solabs.com.br" ? [{
      name: "Administração",
      href: "/administracao",
      icon: Shield,
    }] : []),
    {
      name: "Configurações",
      href: "/configuracoes",
      icon: Settings,
    },
  ]

  const isActive = (path: string) => location.pathname === path

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">
                SOLABS
              </span>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent p-2"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
            {displayInitial}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {displayName}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive(item.href)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={onLogout}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-sidebar text-sidebar-foreground"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
          // Desktop
          "hidden lg:flex",
          isCollapsed ? "w-20" : "w-64",
          // Mobile
          "lg:static lg:translate-x-0",
          isMobileOpen && "fixed inset-y-0 left-0 z-50 flex w-64 translate-x-0"
        )}
      >
        {/* Mobile Close Button */}
        {isMobileOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 lg:hidden text-sidebar-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        
        <SidebarContent />
      </aside>
    </>
  )
}
