-- Criar tabela de clientes/empresas
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email_contato TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Modificar tabela profiles para incluir cliente_id e tipo de usuário
ALTER TABLE public.profiles 
ADD COLUMN cliente_id UUID REFERENCES public.clientes(id),
ADD COLUMN tipo_usuario TEXT NOT NULL DEFAULT 'cliente' CHECK (tipo_usuario IN ('admin', 'cliente'));

-- Inserir cliente SOLABS
INSERT INTO public.clientes (id, nome, email_contato) 
VALUES ('00000000-0000-0000-0000-000000000001', 'SOLABS', 'admin@solabs.com.br');

-- Atualizar o perfil do admin para referenciar a SOLABS
UPDATE public.profiles 
SET cliente_id = '00000000-0000-0000-0000-000000000001', 
    tipo_usuario = 'admin'
WHERE email = 'admin@solabs.com.br';

-- Modificar tabelas existentes para incluir cliente_id
ALTER TABLE public.leads ADD COLUMN cliente_id UUID REFERENCES public.clientes(id);
ALTER TABLE public.human_chat_histories ADD COLUMN cliente_id UUID REFERENCES public.clientes(id);
ALTER TABLE public.n8n_chat_histories ADD COLUMN cliente_id UUID REFERENCES public.clientes(id);

-- Enable RLS nas tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clientes
CREATE POLICY "Admins can access all clients" 
ON public.clientes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND tipo_usuario = 'admin'
  )
);

CREATE POLICY "Clients can view their own data" 
ON public.clientes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND cliente_id = clientes.id AND tipo_usuario = 'cliente'
  )
);

-- Atualizar políticas das outras tabelas para considerar cliente_id
DROP POLICY IF EXISTS "Only admin can access leads" ON public.leads;
CREATE POLICY "Access leads by client" 
ON public.leads 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (
      (tipo_usuario = 'admin') OR 
      (tipo_usuario = 'cliente' AND cliente_id = leads.cliente_id)
    )
  )
);

DROP POLICY IF EXISTS "Only admin can access chat histories" ON public.human_chat_histories;
CREATE POLICY "Access chat histories by client" 
ON public.human_chat_histories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (
      (tipo_usuario = 'admin') OR 
      (tipo_usuario = 'cliente' AND cliente_id = human_chat_histories.cliente_id)
    )
  )
);

DROP POLICY IF EXISTS "Only admin can access n8n histories" ON public.n8n_chat_histories;
CREATE POLICY "Access n8n histories by client" 
ON public.n8n_chat_histories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (
      (tipo_usuario = 'admin') OR 
      (tipo_usuario = 'cliente' AND cliente_id = n8n_chat_histories.cliente_id)
    )
  )
);

-- Atualizar política do profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.tipo_usuario = 'admin'
  )
);

-- Função para criar novo cliente e usuário
CREATE OR REPLACE FUNCTION public.create_client_user(
  client_name TEXT,
  client_email TEXT,
  user_email TEXT,
  user_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_client_id UUID;
  new_user_id UUID;
  result JSON;
BEGIN
  -- Verificar se é admin quem está chamando
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND tipo_usuario = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem criar clientes';
  END IF;

  -- Criar cliente
  INSERT INTO public.clientes (nome, email_contato)
  VALUES (client_name, client_email)
  RETURNING id INTO new_client_id;

  -- Criar usuário no auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Criar perfil
  INSERT INTO public.profiles (id, email, tipo_usuario, cliente_id)
  VALUES (new_user_id, user_email, 'cliente', new_client_id);

  result := json_build_object(
    'client_id', new_client_id,
    'user_id', new_user_id,
    'success', true
  );

  RETURN result;
END;
$$;