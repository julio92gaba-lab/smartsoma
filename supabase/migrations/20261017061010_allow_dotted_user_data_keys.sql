-- O perfil usa a chave histórica `mydocs.profile`; o ponto é literal e não
-- permite caminhos, espaços ou outros caracteres fora da lista segura.
ALTER TABLE public.user_data
  DROP CONSTRAINT user_data_key_format,
  ADD CONSTRAINT user_data_key_format
    CHECK (key ~ '^[A-Za-z0-9:._-]{1,120}$') NOT VALID;
