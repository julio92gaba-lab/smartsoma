-- Mensagens de contacto são criadas e consultadas apenas pelo servidor.
CREATE TABLE public.support_contacts (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL CHECK (char_length(sender_name) BETWEEN 1 AND 120),
  sender_email text NOT NULL CHECK (char_length(sender_email) BETWEEN 3 AND 254),
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 1 AND 120),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  attachment_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  notification_sent_at timestamptz
);

ALTER TABLE public.support_contacts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.support_contacts FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_contacts TO service_role;
CREATE INDEX support_contacts_user_id_idx ON public.support_contacts (user_id);
CREATE INDEX support_contacts_created_at_idx ON public.support_contacts (created_at);

-- Os anexos não são públicos nem acessíveis diretamente pelos clientes.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'support-attachments', 'support-attachments', false, 10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm']
);
