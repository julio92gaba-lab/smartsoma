# Preparação do Google Play Billing

O módulo `lib/google-play-entitlement.cjs` prepara a consulta direta à Google, a interpretação da resposta, um identificador de conta ofuscado e o pedido de confirmação no servidor. Está isolado: não processa compras, não altera a base de dados e não muda o acesso atual pelo Creem. A consulta e a confirmação ainda precisam de credenciais OAuth e permissões configuradas no servidor. O Android inclui a biblioteca oficial, consulta de produtos e compras existentes e um fluxo de compra preparado, mas desativado por uma constante no código e não ligado à interface. Não alterar essa constante antes de completar e testar todos os passos abaixo.

Antes de ativar compras Android, ainda é necessário:

1. Confirmar o identificador Android e criar os produtos, preços, planos e eventual período experimental na Play Console.
2. Concluir a integração Android: ligar o fluxo preparado à interface, obter o identificador de conta no servidor autenticado e tratar compras pendentes, retorno à app e restauro. Nenhuma das pontes nativas está ligada à interface.
3. Autenticar o utilizador e validar o token diretamente na Google Play Developer API no servidor. Guardar a associação exclusiva entre token e conta, tratar tokens ligados, impedir reutilização e confirmar as compras válidas. Nunca confiar numa resposta enviada pelo cliente. O identificador ofuscado deve ser gerado a partir do ID autenticado e de um segredo aleatório de 32 bytes em hexadecimal, mantido estável e protegido no servidor; a sua substituição sem migração impediria associar compras existentes. A confirmação deve ocorrer somente depois da associação ser durável, com novas tentativas persistentes em caso de falha.
4. Guardar as subscrições dos dois fornecedores separadamente e calcular o acesso a partir de ambas. A tabela atual tem uma linha por utilizador e os webhooks Creem fazem upsert nela: escrever a Google nessa mesma linha pode sobrescrever uma subscrição válida.
5. Tratar notificações de alteração, renovação, suspensão, reembolso, cancelamento e reconciliação; manter o acesso offline limitado pela validade verificada.
6. Adaptar a gestão e eliminação de conta: a eliminação existente cancela apenas o Creem. Não prometer o cancelamento da Google até esse fluxo estar implementado e testado.
7. Testar com contas de licença e uma versão distribuída pela Play, sem usar cartão real.

O módulo falha em segurança para estados desconhecidos, conta ou produto incorretos, datas inválidas e compras com múltiplos itens. Essas situações precisam de tratamento adicional; as funções não são, por si só, uma verificação de compra nem proteção contra reutilização de tokens. O fluxo nativo também precisa de testes reais, reconciliação após interrupção e proteção de concorrência antes de ser ativado.

Referências: [segurança do Google Play Billing](https://developer.android.com/google/play/billing/security), [ciclo de vida das subscrições](https://developer.android.com/google/play/billing/lifecycle/subscriptions), [recurso subscriptionsv2](https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2).
