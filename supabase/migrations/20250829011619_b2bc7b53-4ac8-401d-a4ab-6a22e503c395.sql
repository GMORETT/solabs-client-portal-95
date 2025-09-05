-- Corrigir a função que criamos para ter search_path fixo
DROP FUNCTION IF EXISTS public.get_current_user_tipo();

CREATE OR REPLACE FUNCTION public.get_current_user_tipo()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT tipo_usuario FROM public.profiles WHERE id = auth.uid();
$$;