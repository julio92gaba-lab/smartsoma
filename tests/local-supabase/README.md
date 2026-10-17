# Supabase de testes local

Este diretório contém uma configuração separada da configuração vinculada à
produção. A instância está parada: o Docker publicou a porta da base em todas
as interfaces mesmo com uma rede configurada para localhost. Não volte a
iniciá-la até esta exposição ter sido resolvida e verificada.

A base começa vazia, sem dados reais, sem migrações e sem funções de pagamento.
Ainda não reproduz a estrutura da aplicação nem está ligada ao frontend: não
serve para validar autenticação, sincronização ou pagamentos. A configuração
normal do frontend continua a apontar para a produção; não a use para testes.

Para verificações visuais isoladas, use `node tests/serve-ui.cjs` e abra apenas
`http://127.0.0.1:4175/__ui-test`. Esta página usa dados fictícios e bloqueia
ligações de rede do próprio documento; não substitui testes de integração.

Não execute comandos de migração ou de ligação ao projeto remoto como parte
deste ambiente. A estrutura inicial ainda precisa de ser conciliada com as
migrações e validada antes de ser utilizada nos testes. Foi obtida uma exportação apenas
da estrutura pública, mas ainda não foi validada nem aplicada localmente.
