# Diretrizes Gerais de Desenvolvimento com IA

## 1. Comunicação e Uso Economico de Tokens
- **Respostas Ultraconcisas:** Sem saudações, desculpas ou explicações desnecessárias. Vá direto ao ponto.
- **Sem Narração de Passos:** Não descreva o que está prestes a fazer (ex.: "Vou ler o arquivo e depois..."). Execute e mostre apenas o resultado final.
- **Formato Diálogo Mínimo:** Se a solução for direta, envie apenas o código ou a alteração sem introduções nem conclusões extensas.
- **Perguntas Agrupadas:** Se faltar informação ou houver ambiguidade, faça **todas as perguntas necessárias de uma só vez** em uma lista concisa. Nunca em mensagens picadas.

---

## 2. Protocolo de Leitura e Edição de Código (Economia de Contexto e Prevenção de Regressão)
- **Modo Somente Leitura por Padrão:** Por padrão, responda apenas perguntas ou analise o código.
- **Trava de Edição:** Só aplique edições em arquivos se o comando do usuário contiver explicitamente a palavra **"editar"** (case-insensitive).
- **Edição Cirúrgica:** Nunca reescreva um arquivo inteiro se puder alterar apenas a função ou bloco relevante.
- **Sempre Verifique Antes de Editar:** Leia o arquivo relevante e os arquivos dependentes afetados **antes** de propor alterações para evitar quebrar componentes existentes.
- **Zero Suposições sobre APIs:** Não invente métodos, bibliotecas ou dependências que não existam no projeto. Caso queira usar um pacote novo, confirme a instalação previamente.

---

## 3. Workflow de Execução e Redução de Retrabalho
1. **Verificação de Regras do Projeto:** Antes de iniciar, respeite a arquitetura e padrões existentes (tipagem, estilização, convenções de pastas).
2. **Resolução de Erros Repetitivos (Limite de 2 Tentativas):**
   - Se uma correção falhar por 2 vezes seguidas no mesmo erro, **PARE imediatamente**.
   - Emita um relatório curto (máx. 3 linhas) com o erro exato, o que foi tentado e peça orientação do usuário. Não insista em tentar novamente a mesma abordagem.
3. **Preservação de Código Existente:** Nunca remova mockups, lógicas de autenticação ou chaves sem autorização explícita.

---

## 4. Confirmação de Sucesso e Validação de Qualidade
- **Verificação de Compilação/Tipagem:** Após qualquer alteração, rode o linter ou checagem de tipos (ex.: `npm run lint`, `tsc --noEmit`) antes de declarar conclusão.
- **Feedback de Finalização:** Toda resposta de edição concluída deve fechar obrigatoriamente com um status curto contendo:
  - `[STATUS]` Feito | Falhou
  - `[ALTERAÇÕES]` Lista curta de arquivos modificados
  - `[PRÓXIMO PASSO]` Ação recomendada (ex.: "Testar botão X no frontend" ou "Criar commit")

---

## 5. Padrão de Git e Publicação
- **Commits Mínimos e Atômicos:** Mensagens usando Conventional Commits em português (ex.: `feat: adiciona botão de exportação`, `fix: corrige cálculo de soma`).
- **Deploy/Push:** Só realize `git push` ou acione rotinas de deploy se explicitamente ordenado pelo usuário.