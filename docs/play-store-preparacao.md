# Preparação da ficha da Google Play

## Rascunho de descrição

**Nome:** SmartSoma

**Descrição curta:** Regista ganhos, despesas e quilómetros e acompanha os teus resultados.

**Descrição longa:**

O SmartSoma ajuda motoristas e estafetas a acompanhar os seus ganhos e despesas num só lugar.

- Regista ganhos por plataforma e despesas do dia a dia.
- Acompanha distâncias, totais e resultados por período.
- Define metas semanais e acompanha a sua evolução.
- Consulta o histórico e gera relatórios PDF.
- Sincroniza os teus dados entre dispositivos com a tua conta.

Os detalhes de subscrição, preços e disponibilidade serão apresentados na Google Play antes da confirmação da compra.

O texto é um rascunho e deve ser revisto após a integração de pagamentos e as decisões comerciais. Não incluir resultados garantidos nem fotografias ou dados reais de utilizadores nas imagens.

## Privacidade e eliminação

- A página pública preparada para pedidos de eliminação é `/eliminar-conta` (ainda precisa de ser publicada e testada).
- O titular confirmou que `contacto@smartsoma.pt` está ativo; verificar também o envio de respostas e o tratamento dos pedidos, sem pedir palavras-passe. A página permite pedido por email ou na aplicação.
- A política existente identifica o responsável como pendente de identificação fiscal e forma jurídica: o titular deve completar e rever essa informação com apoio adequado. A política atual refere-se à web e ao Creem; atualizar a política e os termos para Android e Google Play somente quando os tratamentos e as condições reais estiverem definidos.
- Rever dados realmente recolhidos por todas as bibliotecas e fornecedores, retenção, processamento, transferências e práticas de segurança antes de preencher a declaração de segurança dos dados. Não presumir conformidade automática.
- Para compras Google, adaptar primeiro a eliminação e o cancelamento. A exclusão atual apenas trata o Creem.

### Inventário preliminar para a declaração de segurança dos dados

Isto é um rascunho de trabalho, não respostas prontas para a Play Console. As categorias e opções finais dependem das funcionalidades efetivamente ativadas, do comportamento dos fornecedores e da revisão do responsável.

| Dados a verificar | Uso identificado no projeto | Situação a confirmar |
| --- | --- | --- |
| Nome, email e dados de autenticação | Conta Supabase e, quando escolhido, login Google | Dados e prazos efetivamente tratados pelos fornecedores. |
| Foto de perfil opcional | Imagem na conta e no Supabase Storage | Conservação, eliminação e eventual exposição da imagem. |
| Ganhos, despesas, distâncias e metas introduzidos | Registos, sincronização e relatórios PDF | Categoria adequada na declaração e retenção nos sistemas e cópias de segurança. |
| Sessão, preferências e alterações pendentes | Guardadas localmente para funcionamento e acesso offline | Cópias de segurança Android: o manifesto atual permite backup; avaliar o impacto para dados locais e para alterações ainda não sincronizadas. |
| Estado e identificadores de subscrição | Creem na web; Google Play está em preparação, sem compras ativas | Dados reais partilhados com cada fornecedor e conservação após cancelamento ou eliminação. |
| Dados técnicos e segurança | Autenticação, alojamento e prevenção de abuso | Logs reais, fornecedores, partilha e prazos de retenção. |

O formulário da Google inclui também os dados recolhidos por SDKs. Rever a versão final do Android e a documentação de cada dependência antes de declarar recolha ou partilha. O responsável deve confirmar a identificação legal, os prazos de conservação, o tratamento de backups e se os compromissos já descritos na política correspondem à configuração real. A política não deve dizer que o Google Play processa compras até a funcionalidade existir.

Na compilação atual, o manifesto final combinado declara Internet, estado da rede, Google Play Billing, notificações e uma permissão interna protegida por assinatura. A permissão de notificações é opcional e, no Android 13 ou posterior, é solicitada após guardar um PDF; se for recusada, o ficheiro continua a ser guardado. `allowBackup` continua ativo. Não há permissão de identificador de publicidade no manifesto observado; isto não dispensa verificar os SDKs e o pacote final no momento da publicação. O projeto aponta para Android 16 (API 36), que satisfaz o [requisito atual para novas apps](https://support.google.com/googleplay/android-developer/answer/11926878); confirmar novamente perto do envio.

### Rascunho para revisão antes de ativar a Google Play

- **Privacidade:** quando a funcionalidade for ativada, descrever os identificadores da compra e da conta ofuscada, o estado e o prazo da subscrição, as finalidades de validação e prevenção de fraude e o papel da Google Play. Confirmar retenção, eventuais transferências e eliminação.
- **Termos:** indicar que as compras Android são geridas pela Google Play e as compras web pelo Creem; apresentar preços, período experimental, renovação e condições de cancelamento conforme o plano realmente criado, sem prometer um trial específico antes da configuração.
- **Eliminação:** explicar o que acontece à conta, aos dados locais e à subscrição em cada fornecedor, sem prometer cancelamento automático até o fluxo estar integrado e testado. Confirmar se os dados de faturação devem ser retidos e durante quanto tempo.
- **Testes:** fazer capturas com dados fictícios; testar instalação, login, recuperação, offline, sincronização, PDF, subscrição, restauro, cancelamento e eliminação. Para uma conta pessoal nova, preparar pelo menos 12 participantes para o teste fechado exigido pela Google, após a conta e o registo da app estarem disponíveis.

## Imagens e assinatura

- Há um ícone de 512 × 512 existente (`icon-512.png`); verificar visualmente e confirmar os requisitos atuais antes de o enviar. As capturas devem ser feitas com dados fictícios ou autorizados, após concluir a interface Android.
- Confirmar `pt.smartsoma.app` como identificador final antes de criar o registo, configurar OAuth e gerar o AAB. Não alterar um identificador já publicado sem avaliar o impacto.
- Para lançamento, criar uma chave de upload própria e guardar a chave e as credenciais num local seguro e com cópia de recuperação; usar Play App Signing conforme as instruções da Google. Não guardar keystore ou passwords no repositório. A chave de depuração usada no APK de testes não é uma chave de publicação.
- Gerar e validar o AAB de release assinado quando a chave estiver disponível. Não publicar builds de teste como produção.

Fontes: [eliminação de conta](https://support.google.com/googleplay/android-developer/answer/13327111), [assinatura de apps](https://developer.android.com/studio/publish/app-signing), [segurança dos dados](https://support.google.com/googleplay/android-developer/answer/10787469), [testes de contas pessoais](https://support.google.com/googleplay/android-developer/answer/14151465).
