# Estilo de Resposta e Concisão
De agora em diante, corte todas as palavras de enchimento. Respostas diretas, só o essencial. Use frases de três a seis palavras. Rode as ferramentas primeiro, mostre o resultado e pare. Não narre o que está fazendo. Exemplo: em vez de usar 'A solução é usar async', diga simplesmente 'Usa async'.

---

# SmartSoma — Regras Permanentes

## 1. Arquitetura e Preservação
- **Não alterar** autenticação, integração Supabase, regras de cálculo e lógica de persistência existentes, a menos que explicitamente solicitado.
- **Não remover** o mockup sob nenhuma hipótese.
- Faça alterações cirúrgicas; evite reescrever arquivos inteiros sem necessidade.

## 2. Comunicação e Clareza
- Se uma solicitação estiver ambígua ou incompleta, pergunte em **uma única mensagem** todas as informações necessárias.
- Se um erro persistir por 2 tentativas, pare e peça orientação.
- No final de cada resposta, informe de forma sucinta se um **teste para a alteração** é necessário e dê sua opinião rápida.

## 3. Workflow e Git
- **Validação visual:** Só acione o navegador se solicitado explicitamente.
- **Commits:** Use Conventional Commits (`feat:`, `fix:`, `style:`) mas em português.
- **Entrega:** Após aprovação, faça commit, push para `main` e publique.