-- Configurar storage para imagens das memórias
-- Este script deve ser executado no Supabase Dashboard > Storage

-- Criar bucket para memórias
INSERT INTO storage.buckets (id, name, public)
VALUES ('memories', 'memories', true);

-- Política para permitir upload de imagens
CREATE POLICY "Users can upload their own memories" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'memories' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir visualização pública das imagens
CREATE POLICY "Anyone can view memories" ON storage.objects
FOR SELECT USING (bucket_id = 'memories');

-- Política para permitir que usuários deletem suas próprias imagens
CREATE POLICY "Users can delete their own memories" ON storage.objects
FOR DELETE USING (
  bucket_id = 'memories' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Mensagem de sucesso
SELECT 'Storage configurado para memórias! 📸' as status;
