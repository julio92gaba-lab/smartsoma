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
- Para compilar é necessário ter o SDK Android instalado e configurado no Android Studio; a instalação e as licenças são tratadas pelo utilizador.
- Não incluir ficheiros de ambiente, funções de servidor, testes ou cópias de segurança no diretório gerado.
