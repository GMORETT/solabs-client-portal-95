-- Inserir o usuário admin diretamente na tabela auth.users
-- Primeiro, vamos verificar se o usuário já existe e criar apenas se não existir

DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'admin@solabs.com.br';
    admin_password TEXT := 'Solabs123!';
BEGIN
    -- Check if user already exists
    SELECT id INTO admin_user_id FROM auth.users WHERE email = admin_email;
    
    IF admin_user_id IS NULL THEN
        -- Create the admin user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
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
            admin_email,
            crypt(admin_password, gen_salt('bf')),
            now(),
            null,
            null,
            '{"provider":"email","providers":["email"]}',
            '{}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
        
        RAISE NOTICE 'Admin user created successfully';
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;
END $$;