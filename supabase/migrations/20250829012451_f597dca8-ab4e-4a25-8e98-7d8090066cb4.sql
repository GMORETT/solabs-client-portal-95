-- Confirmar o email do usuário existente para ele poder fazer login
UPDATE auth.users 
SET email_confirmed_at = now(), confirmed_at = now()
WHERE email = 'gabriel.morett@pareto.plus' AND email_confirmed_at IS NULL;