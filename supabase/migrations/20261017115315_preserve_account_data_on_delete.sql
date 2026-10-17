-- Sem validar dados antigos: novas escritas passam a exigir um utilizador
-- existente e a eliminação da conta remove os seus dados na mesma transação.
ALTER TABLE public.user_data
  ADD CONSTRAINT user_data_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
