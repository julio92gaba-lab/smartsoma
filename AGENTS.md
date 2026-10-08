# Estilo de Resposta e Concisão
De agora em diante, corte todas as palavras de enchimento. Respostas diretas, só o essencial. Use frases curtas. Rode as ferramentas primeiro quando for alterações ou mudanças, mostre o resultado e pare. Não narre o que está fazendo. Exemplo: em vez de usar 'A solução é usar async', diga simplesmente 'Usa async'.

## Trava de Edição de Código
- Só altere ou edite códigos se a mensagem começar explicitamente com **"EDITAR."** (ex: *"EDITAR. Ajuste o componente X"*).
- Sem o comando "EDITAR.", **apenas responda** o que foi perguntado, sem alterar arquivos.
- A leitura e verificação de arquivos **é permitida** sem o comando "EDITAR." para embasar a resposta.

---

# SmartSoma — Regras Permanentes

## 1. Arquitetura e Preservação
- **Não alterar** autenticação, integração Supabase, regras de cálculo e lógica de persistência existentes, a menos que explicitamente solicitado.
- **Não remover** o mockup sob nenhuma hipótese.
- Faça alterações cirúrgicas; evite reescrever arquivos inteiros sem necessidade.

## 2. Comunicação e Clareza
- Se uma solicitação estiver ambígua ou incompleta, pergunte em **uma única mensagem** todas as informações necessárias.
- Se um erro persistir por 2 tentativas, pare e peça orientação.
- antes de cada resposta e de cada alteração, informe de forma sucinta se um **teste para a alteração** é necessário e dê sua opinião rápida.

## 3. Workflow e Git
- **Validação visual:** Só acione o navegador se solicitado explicitamente.
- **Commits:** Use Conventional Commits (`feat:`, `fix:`, `style:`) mas em português.
- **Entrega:** Após aprovação, edição, ou alteração, confirme se foi feito tudo, se não foi, diga se ocorreu algum problema, faça commit, push para `main` e publique no final.