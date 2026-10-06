# Migração visual SmartSoma

## Referência e proteção

- Base local/remota: `bdff00f4da2096cb0212bc4a05cf18878d1cc128`.
- Produção anterior: `https://smartsoma-in8x51ljv-smart-soma.vercel.app`.
- Trabalho isolado: `codex/interface-migration`.
- O mockup é referência visual, não uma fonte de regras de negócio.
- Manter login, recuperação, OAuth, subscrição/Creem, permissões, fila offline,
  chaves persistidas, fórmulas e relatórios existentes.
- Sem migrações de base de dados, alterações de políticas ou funções Supabase.

## Etapas

1. Referência versionada e testes de regressão da implementação existente.
2. Identidade visual, navegação e layouts responsivos sobre os componentes reais.
3. Visão geral, gráfico bruto/líquido, registo rápido e páginas auxiliares.
4. Regressão automática, verificação visual, versão de pré-produção.
5. Publicação da versão verificada e verificação dos URLs de produção.

Cada etapa tem um commit independente. Qualquer falha interrompe a passagem
para a etapa seguinte até ser corrigida ou documentada como bloqueio.

## Contratos que não podem mudar

- `cloud-init.js` continua a autenticar e hidratar antes de executar `app.js`.
- `homeBadgeValores:AAAA-MM-DD`: um valor diário por plataforma; corrigir
  substitui o valor, não cria uma segunda receita.
- `despesasDiarias:*`, `despesasFixas`, vigência e opção de ignorar a semana
  continuam a ser lidas pelo motor original.
- Distância total e odómetro inicial/final conservam validações e persistência.
- IDs dos elementos originais e listeners são preservados.
- Eliminações, alteração de email/password e subscrição usam os fluxos reais.

## Verificação

Os testes DOM usam dados em memória, sem chamadas ao Supabase. Não constituem
prova de uma cobrança real ou de uma sessão autenticada em produção. Esses
limites devem ser explicitados no relatório, sem chamar simulação de teste E2E.

## Reversão

Manter disponível o deployment anterior. Em caso de regressão de produção,
repor esse deployment na Vercel e corrigir antes de nova promoção. Os dados
persistidos não precisam de migração reversa, pois o seu formato não muda.
