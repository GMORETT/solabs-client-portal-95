-- Primeiro, vamos corrigir a função create_client_user para evitar conflitos de ID
DROP FUNCTION IF EXISTS public.create_client_user(text, text, text, text);

CREATE OR REPLACE FUNCTION public.create_client_user(client_name text, user_email text, user_password text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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

  -- Verificar se o email já existe
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE email = user_email
  ) THEN
    RAISE EXCEPTION 'Este email já está em uso';
  END IF;

  -- Criar cliente
  INSERT INTO public.clientes (nome, email_contato)
  VALUES (client_name, user_email)
  RETURNING id INTO new_client_id;

  -- Usar a função de signup do Supabase Auth para criar o usuário
  -- Isso será feito via JavaScript no frontend para evitar problemas de ID duplicado
  
  result := json_build_object(
    'client_id', new_client_id,
    'success', true,
    'message', 'Cliente criado. Agora criando usuário...'
  );

  RETURN result;
END;
$function$;