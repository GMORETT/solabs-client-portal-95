import { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { ClientSelector } from "@/components/admin/client-selector"
import { useClientContext } from "@/hooks/use-client-context"

interface DashboardLayoutProps {
  children: ReactNode
  onLogout: () => void
  user: { name: string; email: string }
}

export function DashboardLayout({ children, onLogout, user }: DashboardLayoutProps) {
  const { isAdmin, selectedClientId, setSelectedClient } = useClientContext()

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar onLogout={onLogout} user={user} />
      <main className="flex-1 lg:ml-0 bg-background h-full overflow-auto">
        {isAdmin && (
          <div className="border-b bg-card p-4 flex-shrink-0">
            <ClientSelector 
              selectedClientId={selectedClientId}
              onClientSelect={setSelectedClient}
            />
          </div>
        )}
        <div className="h-full bg-background">
          {children}
        </div>
      </main>
    </div>
  )
}