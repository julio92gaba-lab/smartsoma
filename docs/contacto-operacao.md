# Operação do formulário de contacto — preparação

O formulário exige ligação à internet. O proprietário confirmou o aviso prévio aos utilizadores e pretende realizar pessoalmente o primeiro teste de envio e receção no Android.

Cada pedido é guardado na tabela `support_contacts` do Supabase. O aviso enviado ao endereço de suporte contém a referência do pedido, não o conteúdo. Para responder:

1. Entrar no painel autorizado do projeto Supabase e abrir **Table Editor → support_contacts**.
2. Procurar a referência recebida no campo `id`, ler o assunto e a mensagem e responder ao `sender_email` pelo email de suporte.
3. Se `attachment_path` estiver preenchido, abrir **Storage → support-attachments**, procurar o ficheiro indicado e descarregá-lo apenas para análise do pedido. O bucket é privado; restringir o acesso ao painel e tratar os ficheiros recebidos como potencialmente perigosos.

O formulário aceita um ficheiro por mensagem, até 10 MB, em JPEG, PNG, WebP, MP4, MOV ou WebM. Não funciona sem ligação à internet. Existe um limite de dez tentativas por conta e por hora.

Se a mensagem for guardada mas o envio do aviso não for confirmado, a pessoa vê um erro e pode tentar novamente ou contactar diretamente por email. Não existe uma fila automática de reenvio. `notification_sent_at` indica apenas que o Resend aceitou o pedido, não garante a entrega; verificar os registos do Resend e consultar periodicamente as mensagens pendentes no Supabase.

Foi escolhido um prazo de 90 dias após o envio. A função `support-cleanup` está publicada, mas não está configurada nem agendada: o proprietário decidiu deixar a limpeza automática pendente. Até à sua ativação, o responsável deve verificar diariamente os pedidos com 90 dias, remover primeiro os respetivos anexos privados pelo Storage e depois os registos correspondentes em `support_contacts`, verificando as falhas. As cópias de segurança devem ser tratadas segundo os prazos efetivamente aplicáveis.

Para ativar posteriormente a limpeza automática, configurar e validar um agendador autenticado. A função exige `SUPPORT_CLEANUP_SECRET` com pelo menos 32 caracteres aleatórios e o mesmo valor no cabeçalho `x-support-cleanup-secret`; armazenar o valor no segredo da função e no Supabase Vault, nunca no repositório. Seguir a documentação de [agendamento de Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions). As duas funções desativam a verificação JWT do gateway: o contacto valida o utilizador com `auth.getUser`, e a limpeza valida o segredo privado no código. Sem esse segredo, a limpeza recusa pedidos; não usar uma chave pública como autenticação para eliminar dados.

Manter as verificações diárias, acompanhar falhas e atrasos, considerar dados órfãos e confirmar o tratamento de backups. A remoção automática deve ser validada antes de substituir o procedimento manual.
