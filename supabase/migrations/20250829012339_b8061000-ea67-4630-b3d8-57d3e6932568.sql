-- Corrigir o registro existente que foi criado incorretamente
UPDATE public.profiles 
SET cliente_id = (
  SELECT id FROM public.clientes 
  WHERE email_contato = 'gabriel.morett@pareto.plus' 
  LIMIT 1
)
WHERE email = 'gabriel.morett@pareto.plus' AND cliente_id IS NULL;

-- Vamos também criar um trigger para garantir que isso não aconteça no futuro
-- Quando um usuário se registra, automaticamente criar o perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tipo_usuario, role)
  VALUES (NEW.id, NEW.email, 'admin', 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Recriar o trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();