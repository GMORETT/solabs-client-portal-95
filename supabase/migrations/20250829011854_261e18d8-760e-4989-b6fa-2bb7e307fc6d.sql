-- Remover todas as políticas existentes das tabelas profiles e clientes
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can access all clients" ON public.clientes;
DROP POLICY IF EXISTS "Clients can view their own data" ON public.clientes;

-- Criar a função para verificar tipo de usuário
CREATE OR REPLACE FUNCTION public.get_current_user_tipo()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT tipo_usuario FROM public.profiles WHERE id = auth.uid();
$$;

-- Recriar as políticas corretas
CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id OR public.get_current_user_tipo() = 'admin'
);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (public.get_current_user_tipo() = 'admin');

CREATE POLICY "Admins can access all clients" 
ON public.clientes 
FOR ALL 
USING (public.get_current_user_tipo() = 'admin');

CREATE POLICY "Clients can view their own data" 
ON public.clientes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.cliente_id = clientes.id 
    AND profiles.tipo_usuario = 'cliente'
  )
);