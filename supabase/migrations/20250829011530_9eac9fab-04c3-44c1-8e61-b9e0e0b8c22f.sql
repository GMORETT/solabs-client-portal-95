-- Primeiro, vamos criar uma função security definer para verificar o tipo de usuário
-- sem causar recursão infinita
CREATE OR REPLACE FUNCTION public.get_current_user_tipo()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT tipo_usuario FROM public.profiles WHERE id = auth.uid();
$$;

-- Agora vamos recriar as políticas da tabela profiles sem recursão
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Política para visualizar profiles
CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id OR public.get_current_user_tipo() = 'admin'
);

-- Política para atualizar o próprio perfil
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Política para admins poderem inserir novos profiles (para criação de clientes)
CREATE POLICY "Admins can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (public.get_current_user_tipo() = 'admin');

-- Agora vamos verificar as políticas da tabela clientes também
-- e corrigir se necessário
DROP POLICY IF EXISTS "Admins can access all clients" ON public.clientes;
DROP POLICY IF EXISTS "Clients can view their own data" ON public.clientes;

-- Política para admins acessarem todos os clientes
CREATE POLICY "Admins can access all clients" 
ON public.clientes 
FOR ALL 
USING (public.get_current_user_tipo() = 'admin');

-- Política para clientes verem apenas seus próprios dados
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