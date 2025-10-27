-- Create storage bucket for banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for banner uploads
CREATE POLICY "Admins can upload banners"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'banners' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update banners"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'banners' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete banners"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'banners' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Anyone can view banners"
ON storage.objects
FOR SELECT
USING (bucket_id = 'banners');

-- Add new settings for editable page content
INSERT INTO public.settings (key, value)
VALUES 
  ('page_title', 'Congresso de Homens 2025'),
  ('page_subtitle', 'Escolha o Hino que Mais Tocou Seu Coração!'),
  ('page_description', 'Vote no seu hino favorito e ajude-nos a celebrar a fé e a música.'),
  ('voting_enabled', 'true')
ON CONFLICT (key) DO NOTHING;