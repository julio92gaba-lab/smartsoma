# Preparação Capacitor

- Capacitor 8 instalado; a fonte web continua na raiz do projeto.
- `npm run capacitor:prepare` copia apenas os ficheiros públicos necessários para `capacitor-web/`, diretório gerado e não publicado na Vercel.
- O projeto Android está em `android/`. Executar `npm run capacitor:sync` após alterar os ficheiros web para atualizar os recursos do projeto nativo.
- `pt.smartsoma.app` é um identificador provisório para desenvolvimento; confirme-o antes de publicar a aplicação Android.
- A configuração inicial usa o ícone existente, um ecrã inicial escuro e apenas a permissão de Internet.
- O Android abre a aplicação diretamente e não regista o service worker da PWA; o website mantém o seu comportamento original.
- O APK de depuração foi instalado e testado num dispositivo Android, incluindo login Google, recuperação de senha, PDF e funcionamento sem rede. Usa a configuração Supabase de produção; testes com contas, pagamentos ou exclusões reais têm efeitos reais.
- A subscrição continua a usar o Creem na web. A integração com Google Play Billing, os testes de compra e a validação para publicação Android ainda estão pendentes.
- Antes da publicação, confirmar o identificador, preparar a assinatura e gerar o AAB, verificar privacidade e requisitos da Play Store e realizar os testes pela Google Play.
- A assinatura de upload está preparada para receber, no ambiente seguro do processo, `SMARTSOMA_UPLOAD_STORE_FILE` (caminho absoluto), `SMARTSOMA_UPLOAD_STORE_PASSWORD`, `SMARTSOMA_UPLOAD_KEY_ALIAS` e `SMARTSOMA_UPLOAD_KEY_PASSWORD`. Fornecer as quatro variáveis; uma configuração parcial falha. Sem variáveis, o AAB gerado é **não assinado** e não pode ser publicado. Guardar a chave real fora do projeto, proteger e testar uma cópia de recuperação, e nunca enviar passwords ou chaves no chat ou no Git. A configuração foi testada com uma chave fictícia descartável; a chave real ainda não foi criada.
- O identificador `pt.smartsoma.app` já foi usado num dispositivo com o APK de depuração. Preservar a chave de depuração existente: a Google poderá pedir prova da chave anteriormente usada ao registar o identificador. Não usar a chave de depuração como chave de publicação. Ver [guia da Google para verificação de programadores](https://developer.android.com/developer-verification/guides/pdf-guides/pdc-guide.pdf).
- Um APK assinado para lançamento normalmente não atualiza uma instalação de depuração com assinatura diferente. Antes de trocar versões, confirmar a sincronização dos dados; desinstalar pode apagar alterações locais não sincronizadas.
- Para compilar é necessário ter o SDK Android instalado e configurado no Android Studio; a instalação e as licenças são tratadas pelo utilizador.
- Não incluir ficheiros de ambiente, funções de servidor, testes ou cópias de segurança no diretório gerado.
