import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Eye,
  EyeOff
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConfiguracoesProps {
  user: { name: string; email: string }
}

export function Configuracoes({ user }: ConfiguracoesProps) {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    darkMode: false,
    autoSave: true
  })

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    })
  }

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações de conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  defaultValue={user.name}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user.email}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                defaultValue="SOLabs Client"
                placeholder="Nome da empresa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="+55 (11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90 text-white">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tipo</span>
                <Badge className="bg-gradient-primary text-white">Admin</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Verificado</span>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sim</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">2FA</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Último login</span>
                <span className="text-xs text-muted-foreground">Hoje</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como você deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-base">
                Notificações por e-mail
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba atualizações importantes por e-mail
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="text-base">
                Notificações push
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações no navegador
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="security-alerts" className="text-base">
                Alertas de segurança
              </Label>
              <p className="text-sm text-muted-foreground">
                Notificações sobre atividades de segurança
              </p>
            </div>
            <Switch
              id="security-alerts"
              checked={settings.securityAlerts}
              onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Preferências
          </CardTitle>
          <CardDescription>
            Personalize sua experiência na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save" className="text-base">
                Salvamento automático
              </Label>
              <p className="text-sm text-muted-foreground">
                Salvar automaticamente as alterações
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-base">
                Modo escuro
              </Label>
              <p className="text-sm text-muted-foreground">
                Alternar entre tema claro e escuro
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}