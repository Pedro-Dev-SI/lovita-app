-- Adicionar usuário de teste para desenvolvimento
-- Este script deve ser executado APÓS criar o usuário através da autenticação do Supabase

-- Primeiro, você precisa fazer login uma vez no app para criar o registro na tabela auth.users
-- Depois execute este script para atualizar o plano

-- Atualizar o usuário Pedro Selvate para o plano "Para Sempre"
UPDATE public.users 
SET 
  subscription_plan = 'forever',
  subscription_start_date = NOW(),
  subscription_end_date = NULL, -- Para sempre não tem data de fim
  max_images = 8,
  has_music = true,
  has_dynamic_background = true,
  has_exclusive_animations = true,
  full_name = 'Pedro Selvate'
WHERE email = 'pedroselvate72@gmail.com';

-- Verificar se a atualização foi bem-sucedida
SELECT 
  email,
  full_name,
  subscription_plan,
  max_images,
  has_music,
  has_dynamic_background,
  has_exclusive_animations,
  created_at
FROM public.users 
WHERE email = 'pedroselvate72@gmail.com';

-- Mensagem de sucesso
SELECT 'Usuário Pedro Selvate configurado com plano Para Sempre! 🎉' as status;
