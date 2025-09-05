-- Recriar a função com CASCADE para remover dependências e depois recriar tudo
DROP FUNCTION IF EXISTS public.get_current_user_tipo() CASCADE;

-- Criar a função corretamente com search_path fixo
CREATE OR REPLACE FUNCTION public.get_current_user_tipo()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT tipo_usuario FROM public.profiles WHERE id = auth.uid();
$$;

-- Recriar as políticas que foram removidas pelo CASCADE
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