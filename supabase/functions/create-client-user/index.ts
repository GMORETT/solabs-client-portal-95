import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { client_name, user_email, user_password } = await req.json()

    if (!client_name || !user_email || !user_password) {
      return new Response(
        JSON.stringify({ error: 'Todos os campos são obrigatórios' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (user_password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'A senha deve ter pelo menos 6 caracteres' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Primeiro criar o cliente
    const { data: clientData, error: clientError } = await supabaseClient
      .from('clientes')
      .insert({
        nome: client_name,
        email_contato: user_email
      })
      .select()
      .single()

    if (clientError) {
      console.error('Erro ao criar cliente:', clientError)
      return new Response(
        JSON.stringify({ error: `Erro ao criar cliente: ${clientError.message}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Agora criar o usuário usando a Admin API
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email: user_email,
      password: user_password,
      email_confirm: true // Confirma automaticamente o email
    })

    if (authError) {
      console.error('Erro ao criar usuário:', authError)
      return new Response(
        JSON.stringify({ error: `Erro ao criar usuário: ${authError.message}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (authData.user) {
      // Criar o perfil do usuário
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: user_email,
          tipo_usuario: 'cliente',
          cliente_id: clientData.id
        })

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        return new Response(
          JSON.stringify({ error: `Erro ao criar perfil: ${profileError.message}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        client_id: clientData.id,
        user_id: authData.user?.id,
        message: 'Cliente e usuário criados com sucesso!'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Erro geral:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})