/* ===================================================================
       i18n — sistema de idiomas da aplicação (Português /
       English). O dicionário abaixo guarda TODOS os textos da app; os
       elementos estáticos do HTML são marcados com data-i18n (texto),
       data-i18n-html (bloco HTML), data-i18n-ph (placeholder),
       data-i18n-aria (aria-label) e data-i18n-alt (alt). Os textos
       gerados por JavaScript usam I18N.t('chave', { ...parametros }).
       O idioma escolhido fica guardado em localStorage e é aplicado
       antes de qualquer outro script correr, para que nada apareça
       primeiro em português e só depois mude.
       =================================================================== */
    /* Limites e codificação aplicados a toda entrada que a app persiste ou
       volta a mostrar. A validação no banco é a barreira autoritativa; estas
       funções evitam enviar conteúdo inválido e impedem XSS no cliente. */
    window.SmartSomaSecurity = (function () {
      var MAX_TEXT_LENGTH = 60;
      var ALLOWED_IMAGE_TYPES = {
        'image/jpeg': true,
        'image/png': true,
        'image/webp': true,
        'image/heic': true,
        'image/heif': true
      };

      function cleanText(value, maxLength) {
        return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength || MAX_TEXT_LENGTH);
      }
      function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
      }
      function isSafeImageUrl(value) {
        return typeof value === 'string' && (value.indexOf('data:image/jpeg;base64,') === 0 || /^https:\/\//i.test(value)) && value.length <= 400000;
      }
      async function validateImageFile(file) {
        if (!file || file.size < 1) return false;
        var bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
        var jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
        var png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
        var webp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
        var brand = String.fromCharCode.apply(null, Array.from(bytes.slice(8, 12))).toLowerCase();
        var heic = bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70 &&
          ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'].indexOf(brand) !== -1;
        var extension = String(file.name || '').split('.').pop().toLowerCase();
        var declaredType = ALLOWED_IMAGE_TYPES[String(file.type || '').toLowerCase()];
        return !!((jpeg || png || webp || heic) && (declaredType || ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].indexOf(extension) !== -1));
      }
      return { cleanText: cleanText, escapeHtml: escapeHtml, isSafeImageUrl: isSafeImageUrl, validateImageFile: validateImageFile };
    })();

    (function () {
      var LANG_KEY = 'appLang';
      var DEFAULT_LANG = 'pt';

      var DICT = {
"pt": {
"lang.code": "pt-PT",
"lang.name": "Português",
"months.full": [
"Janeiro",
"Fevereiro",
"Março",
"Abril",
"Maio",
"Junho",
"Julho",
"Agosto",
"Setembro",
"Outubro",
"Novembro",
"Dezembro"
],
"months.lower": [
"janeiro",
"fevereiro",
"março",
"abril",
"maio",
"junho",
"julho",
"agosto",
"setembro",
"outubro",
"novembro",
"dezembro"
],
"months.abbr": [
"jan",
"fev",
"mar",
"abr",
"mai",
"jun",
"jul",
"ago",
"set",
"out",
"nov",
"dez"
],
"months.abbrCap": [
"Jan",
"Fev",
"Mar",
"Abr",
"Mai",
"Jun",
"Jul",
"Ago",
"Set",
"Out",
"Nov",
"Dez"
],
"weekday.abbr": [
"Seg",
"Ter",
"Qua",
"Qui",
"Sex",
"Sáb",
"Dom"
],
"weekday.full": [
"Segunda",
"Terça",
"Quarta",
"Quinta",
"Sexta",
"Sábado",
"Domingo"
],
"weekday.letters": [
"S",
"T",
"Q",
"Q",
"S",
"S",
"D"
],
"fmt.dayMonth": "{d} de {m}",
"fmt.monthYear": "{m} de {y}",
"fmt.rangeSameMonth": "{d1} a {d2} de {m}",
"fmt.rangeCrossMonth": "{d1} de {m1} a {d2} de {m2}",
"fmt.rangeSameMonthDot": "{d1} a {d2} de {m}.",
"fmt.rangeCrossMonthDot": "{d1} de {m1}. a {d2} de {m2}.",
"fmt.rangeCrossMonthDot2": "{d1} de {m1}. à {d2} de {m2}.",
"fmt.rangeFullSameMonth": "{d1} a {d2} de {m} de {y}",
"fmt.rangeFullCrossMonth": "{d1} de {m1} a {d2} de {m2} de {y}",
"fmt.compactSameMonth": "{d1}–{d2} {m}",
"fmt.dpDate": "{d} {m} de {y}",
"fmt.todayIs": "Hoje: {d} de {m}",
"app.save": "Guardar",
"app.cancel": "Cancelar",
"app.delete": "Excluir",
"app.close": "Fechar",
"app.back": "Voltar",
"app.today": "Hoje",
"header.menuAria": "Abrir menu principal",
"header.themeAria": "Alternar tema claro ou escuro",
"header.logoAria": "Rolar para o início da página",
"header.slogan": "Para Estafetas e Motoristas de App.",
"sub.ganhosEm": "Ganhos em..",
"sub.resumo": "Resumo Financeiro",
"sub.semana": "Detalhes da Semana",
"sub.relatorio": "Download Relatório",
"sub.backAria": "Voltar para Ganhos",
"sub.viewListAria": "Ver em lista",
"sub.viewTableAria": "Ver em tabela",
"ganhos.registroDoDia": "Registro do dia",
"ganhos.hint": "Insira aqui seus ganhos e despesas.",
"ganhos.uber": "Ganhos Uber",
"ganhos.bolt": "Ganhos Bolt",
"ganhos.addPlataforma": "Adicionar plataforma",
"ganhos.despesas": "Despesas",
"ganhos.despesasSub": "Despesas fixas entram na segunda-feira.",
"ganhos.distancia": "Distância",
"ganhos.distanciaAria": "Distância percorrida",
"ganhos.distanciaSub": "Escolha entre 'início e fim' ou 'km total'.",
"ganhos.verResumo": "Ver meu resumo",
"ganhos.registrar": "Registrar ganhos",
"resumo.dia": "Dia",
"resumo.semana": "Semana",
"resumo.mes": "Mês",
"resumo.prevAria": "Período anterior",
"resumo.nextAria": "Próximo período",
"resumo.liquido": "Líquido",
"resumo.bruto": "Bruto",
"resumo.despesas": "Despesas",
"resumo.distancia": "Distância",
"resumo.metaSemanal": "Meta Semanal",
"resumo.metaExemplo": "200 euros brutos",
"resumo.percentConcluida": "{p}% concluída",
"resumo.definir": "Definir ➚",
"semana.prevMesAria": "Mês anterior",
"semana.nextMesAria": "Próximo mês",
"semana.th.data": "Data",
"semana.th.uber": "Uber",
"semana.th.bolt": "Bolt",
"semana.th.despesas": "Despesas",
"semana.th.km": "Km",
"semana.th.total": "Total",
"semana.th.liquido": "Líquido",
"semana.weekNum": "SEM. {n}",
"semana.ganhosDoDia": "Ganhos do dia",
"semana.liquido": "Líquido",
"semana.verDespesas": "ver despesas",
"semana.verGanhos": "Ganhos",
"semana.scrollUpAria": "Ver despesas anteriores",
"semana.scrollDownAria": "Ver mais despesas",
"semana.tileGanhos": "Ganhos",
"semana.tileDespesas": "Despesas",
"semana.tileDistancia": "Distância",
"semana.totalLiquido": "Total líquido da semana",
"semana.despesasTitle": "Despesas",
"semana.dth.dia": "Dia",
"semana.dth.valor": "Valor",
"semana.dth.desc": "Descrição",
"semana.rowUber": "Uber:",
"semana.rowBolt": "Bolt:",
"semana.rowDespesas": "Despesas:",
"semana.rowDistancia": "Distância:",
"nav.quickAria": "Abrir menu rápido de páginas",
"nav.rendimentos": "Ganhos diários",
"nav.resumo": "Resumo Financeiro",
"nav.semana": "Detalhes da Semana",
"nav.relatorio": "Download Relatório",
"metacard.label": "Meta semanal",
"metacard.suffix": " concluída",
"metacard.porDefinir": "Por definir",
"relatorio.title": "Download Relatório",
"relatorio.pageTitle": "Relatório mensal",
"relatorio.intro": "O relatório reúne os detalhes diários do mês escolhido, todos juntos em um único PDF. Selecione o mês desejado no filtro abaixo.",
"relatorio.driver.tag": "EM BREVE",
"relatorio.driver.title": "Cada viagem, uma decisão melhor.",
"relatorio.driver.copy": "O SS Driver será a tua calculadora de viagens. Define a tua meta e vê, antes de aceitar, se cada corrida aproxima o teu objetivo.",
"relatorio.driver.noteTitle": "Calculadora de viagens",
"relatorio.driver.noteCopy": "Feito à medida para motoristas TVDE e estafetas.",
"relatorio.archive.kicker": "ARQUIVO",
"relatorio.archive.title": "Relatórios anteriores",
"relatorio.archive.copy": "Os meses com registos ficam disponíveis aqui para gerar novamente.",
"relatorio.archive.empty": "Ainda não há meses com dados para arquivar.",
"relatorio.archive.generate": "Gerar PDF",
"relatorio.download": "Baixar PDF",
"relatorio.preview.kicker": "PRÉ-VISUALIZAÇÃO",
"relatorio.preview.title": "O que será incluído",
"relatorio.preview.ready": "Pronto para gerar",
"relatorio.preview.summary": "Resumo financeiro",
"relatorio.preview.summaryText": "Totais mensais de ganhos, despesas e resultado líquido.",
"relatorio.preview.platforms": "Por plataforma",
"relatorio.preview.platformsText": "Ganhos organizados por Uber, Bolt e plataformas adicionais.",
"relatorio.preview.days": "Detalhe diário",
"relatorio.preview.daysText": "Registos, quilometragem, despesas e resumo semanal.",
"relatorio.preview.pdf": "Relatório mensal completo",
"relatorio.highlight.dia": "Detalhe por dia",
"relatorio.highlight.semana": "Resumo semanal",
"relatorio.highlight.despesas": "Despesas detalhadas",
"relatorio.pdf.aGerar": "A gerar...",
"relatorio.pdf.erro": "Não foi possível gerar o PDF. Tente novamente.",
"relatorio.pdf.subtitulo": "Relatório mensal de ganhos e despesas",
"relatorio.pdf.geradoEm": "Gerado em {v}",
"relatorio.pdf.resumo": "Resumo do mês",
"relatorio.pdf.bruto": "Bruto",
"relatorio.pdf.despesas": "Despesas",
"relatorio.pdf.liquido": "Líquido",
"relatorio.pdf.distancia": "Distância",
"relatorio.pdf.porPlataforma": "Por plataforma",
"relatorio.pdf.detalheDiario": "Detalhe diário",
"relatorio.pdf.subtotalSemana": "Subtotal da semana",
"relatorio.pdf.kmAbbr": "Km",
"relatorio.pdf.detalheDespesas": "Detalhe das despesas",
"relatorio.pdf.data": "Data",
"relatorio.pdf.descricao": "Descrição",
"relatorio.pdf.tipo": "Tipo",
"relatorio.pdf.valor": "Valor",
"relatorio.pdf.avulsa": "Avulsa",
"relatorio.pdf.fixa": "Fixa",
"relatorio.pdf.fixasCadastradas": "Despesas fixas ativas no período",
"relatorio.pdf.valorFixo": "Valor fixo",
"relatorio.pdf.percentBruto": "% do bruto",
"relatorio.pdf.nome": "Nome",
"relatorio.pdf.email": "Email",
"relatorio.pdf.plano": "Plano",
"relatorio.pdf.semDespesas": "Sem despesas lançadas neste mês.",
"relatorio.pdf.resumoSemanal": "Resumo semanal",
"relatorio.pdf.periodo": "Período",
"relatorio.pdf.diferenca": "Diferença",
"sheet.title": "Ajustes",
"sheet.installApp": "Instalar App",
"sheet.ariaLabel": "Perfil e configurações",
"sheet.defaultUser": "Utilizador",
"sheet.daysZero": "0 dias nos Apps.",
"sheet.perfil": "Perfil e Dados da Conta",
"sheet.despesasFixas": "Despesas Fixas",
"sheet.multiplataforma": "Multiplataforma",
"mp.atuais": "Atuais:",
"mp.adicionar": "Adicionar",
"mp.novaPh": "NOME (máx. 9)",
"mp.novaAria": "Nome da nova plataforma",
"mp.deleteAria": "Excluir plataforma",
"mp.confirmTitle": "Excluir plataforma",
"mp.confirmText": "Tem certeza que deseja excluir esta plataforma?",
"mp.confirmNamed": "Tem certeza que deseja excluir \"{n}\"?",
"mp.avisoAtualLabel": "Esta semana:",
"mp.avisoAtual": "os valores lançados nesta plataforma serão apagados.",
"mp.avisoAntLabel": "Semanas anteriores:",
"mp.avisoAnt": "os valores ficam guardados, junto com os dados das tabelas, para controle e conferência.",
"plat.title": "Rendimentos {n}",
"plat.valorAria": "Valor recebido na plataforma",
"sheet.idioma": "Idioma",
"sheet.tamanho": "Tamanho da fonte",
"sheet.tamanhoPequeno": "Normal",
"sheet.tamanhoGrande": "Grande",
"tamanho.popupTitle": "Tamanho da fonte",
"tamanho.popupTexto": "Escolha para aumentar ou diminuir a fonte e os elementos em todo o app.",
"tamanho.concluir": "Concluído",
"sheet.ajuda": "Ajuda e FAQ",
"sheet.termosPrivacidade": "Termos e Privacidade",
"sheet.apagarDados": "Apagar dados",
"apagar.aviso": "A eliminação dos dados é permanente e irreversível. São apagados apenas os valores inseridos e os cálculos das tabelas. A sua conta de utilizador permanece ativa.",
"apagar.periodo": "Selecionar período",
"apagar.estaSemana": "Esta semana",
"apagar.esteMes": "Este mês",
"apagar.todos": "Todos os dados",
"apagar.btn": "Apagar",
"apagar.aguarde": "A apagar...",
"apagar.confirmTitle": "Apagar dados",
"apagar.confirm.semana": "Vai apagar todos os valores e despesas (fixas ou não) inseridos nesta semana. Esta ação é permanente e não pode ser desfeita.",
"apagar.confirm.mes": "Vai apagar todos os valores e despesas (fixas ou não) inseridos neste mês, nas semanas que pertencem a ele. Esta ação é permanente e não pode ser desfeita.",
"apagar.confirm.todos": "Vai apagar TODOS os valores, despesas (incluindo as despesas fixas cadastradas) e metas semanais. A sua conta, foto, email e senha não são afetados. Esta ação é permanente e não pode ser desfeita.",
"sheet.sair": "Sair",
"idioma.title": "Idioma",
"idioma.intro": "Escolha o idioma da aplicação. Todos os textos serão apresentados no idioma selecionado.",
"idioma.save": "Guardar",
"dp.upload": "Carregar imagem..",
"dp.nome": "Nome",
"dp.nomePh": "Seu nome",
"dp.email": "Email",
"dp.desdeQuando": "Desde quando trabalha com apps?",
"dp.selecionarData": "Selecionar data",
"dp.atualizarDados": "Atualizar Dados Pessoais",
"dp.atualizarPassword": "Atualizar Password",
"emailChange.title": "Confirmar novo email",
"emailChange.notice": "Para trocar o email é preciso confirmar a sua password atual. Os seus dados continuam guardados e acessíveis; só falta confirmar o novo endereço através do link que vamos enviar para ele.",
"emailChange.passwordLabel": "Password atual",
"emailChange.passwordPh": "A sua password",
"emailChange.continuar": "Continuar",
"emailChange.aguarde": "A confirmar...",
"emailChange.erroSenha": "Password incorreta.",
"emailChange.erroGenerico": "Não foi possível concluir. Tente novamente.",
"emailChange.sucessoTitulo": "Confirme o novo email",
"emailChange.sucessoTexto": "Enviámos um link de confirmação para o novo endereço. O email só muda depois de confirmar por lá.",
"emailChange.entendi": "Entendi",
"pwdChange.title": "Alterar password",
"pwdChange.atual": "Password atual",
"pwdChange.atualPh": "A sua password atual",
"pwdChange.nova": "Nova password",
"pwdChange.novaPh": "Mínimo 10 caracteres",
"pwdChange.confirmar": "Confirmar nova password",
"pwdChange.confirmarPh": "Repita a nova password",
"pwdChange.concluir": "Concluir",
"pwdChange.aguarde": "A concluir...",
"pwdChange.erroSenha": "Password atual incorreta.",
"pwdChange.erroCurta": "Usa pelo menos 10 caracteres, com maiúscula, minúscula e número.",
"pwdChange.erroDiferente": "As duas passwords novas não coincidem.",
"pwdChange.erroGenerico": "Não foi possível concluir. Tente novamente.",
"pwdChange.sucesso": "Password atualizada com sucesso.",
"dp.daysOnApps": "{n} dias nos Apps.",
"dp.yearOne": "{n} ano",
"dp.yearMany": "{n} anos",
"dp.monthOne": "{n} mês",
"dp.monthMany": "{n} meses",
"dp.join": " e ",
"dp.onApps": " nos Apps.",
"ajuda.intro": "Para qualquer questão, escreve-nos para <a href=\"mailto:contacto@smartsoma.pt\">contacto@smartsoma.pt</a>, entraremos em contacto o mais breve possível.",
"wheel.title": "Desde quando é motorista?",
"photo.title": "Alterar foto de perfil",
"photo.hint": "Arraste para posicionar e use o controle para dar zoom.",
"photo.previewAlt": "Pré-visualização da foto",
"photo.avatarAlt": "Foto de perfil",
"photo.zoomAria": "Zoom",
"photo.aplicar": "Aplicar",
"photo.viewAria": "Ver foto de perfil",
"photo.changeImage": "Alterar imagem",
"fixas.title": "Despesas Fixas",
"fixas.helper": "Despesas que se repetem toda SEMANA (ex: Aluguel do carro, Taxa plataforma). Escolha % do valor bruto (atualizado automaticamente conforme os ganhos são inseridos), ou valor fixo em €. Este valor é lançado na segunda feira de cada semana.",
"fixas.descPh": "DESCRIÇÃO",
"fixas.descAria": "Descrição da despesa",
"fixas.valorAria": "Valor da despesa",
"fixas.percentAria": "Percentual",
"fixas.euroAria": "Euro",
"fixas.semanal": "Semanal",
"fixas.listTitle": "Despesas Cadastradas",
"fixas.empty": "Sem despesas no momento.",
"fixas.cardSub": "{v} - Semanal (segunda)",
"fixas.deleteAria": "Excluir despesa",
"fixas.confirmTitle": "Excluir despesa",
"fixas.confirmText": "Tem certeza que deseja excluir esta despesa?",
"fixas.confirmNamed": "Tem certeza que deseja excluir \"{n}\"?",
"fixas.tagFixa": "Fixa",
"fixas.tagDia": "Do dia",
"fixas.oncePerWeek": "{v} € (1x por semana)",
"fixas.percentOfWeek": "{v} € ({p}% do bruto da semana)",
"fixas.weeklyShort": "{v} € (semanal)",
"fixas.sufixoFixa": "{d} (FIXA)",
"fixas.sufixoFixaPct": "{d} {p}% do Bruto (FIXA)",
"fixas.retroTitle": "Retroativo?",
"fixas.retroAria": "Adicionar despesa fixa retroativa",
"fixas.retroHint": "Insira despesas fixas na semana que quiser.",
"fixas.retroModalTitle": "Selecionar semana",
"fixas.retroModalHelper": "Escolha a semana em que esta despesa fixa deve começar.",
"fixas.retroWeeksAria": "Semanas do mês",
"fixas.retroSelected": "Despesa fixa adicionada na {week} semana de {month}, de {start} a {end} de {month}.",
"despesaEdit.title": "Editar despesa",
"despesaEdit.valorAria": "Valor da despesa",
"despesaEdit.delete": "Apagar despesa",
"despesaEdit.deleteTitle": "Apagar despesa",
"despesaEdit.deleteText": "Tem certeza que deseja apagar esta despesa?",
"despesaEdit.percent": "Percentagem",
"despesaEdit.euro": "Valor fixo",
"cal.title": "Selecionar Data",
"cal.prevAria": "Mês anterior",
"cal.nextAria": "Próximo mês",
"uber.title": "Rendimentos Uber",
"uber.valorAria": "Valor recebido na Uber",
"bolt.title": "Rendimentos Bolt",
"bolt.valorAria": "Valor recebido na Bolt",
"dia.title": "Despesas do dia",
"dia.helper": "Insira quantas despesas quiser.",
"dia.descPh": "DESCRIÇÃO",
"dia.descAria": "Descrição da despesa",
"dia.valorAria": "Valor gasto em despesas",
"dia.listTitle": "Despesas do dia",
"dia.cadastrarFixas": "Cadastrar despesas fixas",
"dist.title": "Quilometros Percorridos:",
"dist.modoTotal": "Km Total",
"dist.modoInicioFim": "Início e Fim",
"dist.helperTotal": "Insira os quilômetros percorridos durante o dia, apenas o valor total.",
"dist.helperInicioFim": "Insira os km iniciais do seu veículo, e volte quando terminar o dia para inserir o km finais, nós fazemos as contas.",
"dist.valorAria": "Distância percorrida em quilómetros",
"dist.kmInicio": "Km Início:",
"dist.kmFim": "Km Fim",
"dist.kmInicioAria": "Km inicial",
"dist.kmFimAria": "Km final",
"dist.kmInicioUpdAria": "Atualizar km início",
"dist.kmFimUpdAria": "Atualizar km fim",
"dist.insiraInicio": "Insira Km Início",
"dist.insiraFim": "Insira Km Fim",
"dist.percorridos": "{v} km percorridos",
"meta.title": "Meta Semanal",
"meta.welcome": "Defina sua meta de ganhos da semana na página inicial. Pode alterar sempre que quiser.",
"meta.welcomeKept": "A semana começou. Quer manter a meta de {v} € {t} ou zerá-la?",
"meta.valorAria": "Valor da meta semanal",
"meta.bruto": "Bruto",
"meta.liquido": "Líquido",
"meta.brutos": "Brutos",
"meta.liquidos": "Líquidos",
"meta.atual": "Meta atual",
"meta.nenhuma": "Nenhuma",
"meta.current": "{v} € {t} / {p}%",
"meta.fixasQuestion": "Manter as mesmas despesas fixas da semana passada?",
"meta.fixasEmpty": "Nenhuma despesa fixa cadastrada. Para usar esta opção, cadastre em Ajustes › Despesas Fixas.",
"meta.fixasManter": "Manter",
"meta.fixasZerar": "Zerar Despesas",
"meta.manterMeta": "Manter meta",
"meta.zerarMeta": "Zerar meta",
"meta.podeAlterar": "Pode alterar quando quiser.",
"meta.zerar": "Zerar",
"meta.fixasLinhaEuro": "{v} Eur",
"meta.fixasLinhaPct": "{v}% do valor bruto",
"meta.histNaoDefinida": "Meta não foi definida para esta semana.",
"meta.histDefinida": "Meta definida:",
"meta.histGanho": "Ganho no período:",
"meta.histAcima": "Você ultrapassou a meta, atingindo {p}% dela.",
"meta.histAbaixo": "Você atingiu {p}% da meta até então.",
"meta.retroTitle": "Meta Semanal Retroativa",
"meta.retroWelcome": "Defina a meta apenas para esta semana. Não altera outros períodos."
},
"en": {
"lang.code": "en",
"lang.name": "English",
"months.full": [
"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December"
],
"months.lower": [
"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December"
],
"months.abbr": [
"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun",
"Jul",
"Aug",
"Sep",
"Oct",
"Nov",
"Dec"
],
"months.abbrCap": [
"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun",
"Jul",
"Aug",
"Sep",
"Oct",
"Nov",
"Dec"
],
"weekday.abbr": [
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat",
"Sun"
],
"weekday.full": [
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday",
"Sunday"
],
"weekday.letters": [
"M",
"T",
"W",
"T",
"F",
"S",
"S"
],
"fmt.dayMonth": "{m} {d}",
"fmt.monthYear": "{m} {y}",
"fmt.rangeSameMonth": "{m} {d1}–{d2}",
"fmt.rangeCrossMonth": "{m1} {d1} – {m2} {d2}",
"fmt.rangeSameMonthDot": "{m} {d1}–{d2}",
"fmt.rangeCrossMonthDot": "{m1} {d1} – {m2} {d2}",
"fmt.rangeCrossMonthDot2": "{m1} {d1} – {m2} {d2}",
"fmt.rangeFullSameMonth": "{m} {d1}–{d2}, {y}",
"fmt.rangeFullCrossMonth": "{m1} {d1} – {m2} {d2}, {y}",
"fmt.compactSameMonth": "{m} {d1}–{d2}",
"fmt.dpDate": "{d} {m} {y}",
"fmt.todayIs": "Today: {m} {d}",
"app.save": "Save",
"app.cancel": "Cancel",
"app.delete": "Delete",
"app.close": "Close",
"app.back": "Back",
"app.today": "Today",
"header.menuAria": "Open main menu",
"header.themeAria": "Switch light or dark theme",
"header.logoAria": "Scroll to the top of the page",
"header.slogan": "For Couriers and Rideshare Drivers.",
"sub.ganhosEm": "Earnings on..",
"sub.resumo": "Financial Summary",
"sub.semana": "Week Details",
"sub.relatorio": "Download Report",
"sub.backAria": "Back to Earnings",
"sub.viewListAria": "List view",
"sub.viewTableAria": "Table view",
"ganhos.registroDoDia": "Today's entry",
"ganhos.hint": "Enter your earnings and expenses here.",
"ganhos.uber": "Uber Earnings",
"ganhos.bolt": "Bolt Earnings",
"ganhos.addPlataforma": "Add platform",
"ganhos.despesas": "Expenses",
"ganhos.despesasSub": "Fixed expenses are posted on Monday.",
"ganhos.distancia": "Distance",
"ganhos.distanciaAria": "Distance travelled",
"ganhos.distanciaSub": "Choose between 'start and end' or 'total km'.",
"ganhos.verResumo": "See my summary",
"ganhos.registrar": "Log earnings",
"resumo.dia": "Day",
"resumo.semana": "Week",
"resumo.mes": "Month",
"resumo.prevAria": "Previous period",
"resumo.nextAria": "Next period",
"resumo.liquido": "Net",
"resumo.bruto": "Gross",
"resumo.despesas": "Expenses",
"resumo.distancia": "Distance",
"resumo.metaSemanal": "Weekly Goal",
"resumo.metaExemplo": "200 euros gross",
"resumo.percentConcluida": "{p}% complete",
"resumo.definir": "Set ➚",
"semana.prevMesAria": "Previous month",
"semana.nextMesAria": "Next month",
"semana.th.data": "Date",
"semana.th.uber": "Uber",
"semana.th.bolt": "Bolt",
"semana.th.despesas": "Expenses",
"semana.th.km": "Km",
"semana.th.total": "Total",
"semana.th.liquido": "Net",
"semana.weekNum": "WEEK {n}",
"semana.ganhosDoDia": "Day's earnings",
"semana.liquido": "Net",
"semana.verDespesas": "view expenses",
"semana.verGanhos": "Earnings",
"semana.scrollUpAria": "See previous expenses",
"semana.scrollDownAria": "See more expenses",
"semana.tileGanhos": "Earnings",
"semana.tileDespesas": "Expenses",
"semana.tileDistancia": "Distance",
"semana.totalLiquido": "Total net for the week",
"semana.despesasTitle": "Expenses",
"semana.dth.dia": "Day",
"semana.dth.valor": "Amount",
"semana.dth.desc": "Description",
"semana.rowUber": "Uber:",
"semana.rowBolt": "Bolt:",
"semana.rowDespesas": "Expenses:",
"semana.rowDistancia": "Distance:",
"nav.quickAria": "Open quick page menu",
"nav.rendimentos": "Earnings",
"nav.resumo": "Financial Summary",
"nav.semana": "Week Details",
"nav.relatorio": "Download Report",
"metacard.label": "Weekly goal",
"metacard.suffix": " complete",
"metacard.porDefinir": "Not set",
"relatorio.title": "Download Report",
"relatorio.pageTitle": "Monthly report",
"relatorio.intro": "The report gathers the daily details of the chosen month, all together in a single PDF. Select the month you want in the filter below.",
"relatorio.driver.tag": "COMING SOON",
"relatorio.driver.title": "Every trip, a better decision.",
"relatorio.driver.copy": "SS Driver will be your trip calculator. Set your goal and see, before you accept, whether each trip moves you closer to it.",
"relatorio.driver.noteTitle": "Trip calculator",
"relatorio.driver.noteCopy": "Tailored for TVDE drivers and couriers.",
"relatorio.archive.kicker": "ARCHIVE",
"relatorio.archive.title": "Previous reports",
"relatorio.archive.copy": "Months with entries remain available here to generate again.",
"relatorio.archive.empty": "There are no months with data to archive yet.",
"relatorio.archive.generate": "Generate PDF",
"relatorio.download": "Download PDF",
"relatorio.preview.kicker": "PREVIEW",
"relatorio.preview.title": "What will be included",
"relatorio.preview.ready": "Ready to generate",
"relatorio.preview.summary": "Financial summary",
"relatorio.preview.summaryText": "Monthly totals for earnings, expenses and net result.",
"relatorio.preview.platforms": "By platform",
"relatorio.preview.platformsText": "Earnings organised by Uber, Bolt and additional platforms.",
"relatorio.preview.days": "Daily detail",
"relatorio.preview.daysText": "Entries, mileage, expenses and weekly summary.",
"relatorio.preview.pdf": "Complete monthly report",
"relatorio.highlight.dia": "Daily detail",
"relatorio.highlight.semana": "Weekly summary",
"relatorio.highlight.despesas": "Detailed expenses",
"relatorio.pdf.aGerar": "Generating...",
"relatorio.pdf.erro": "Could not generate the PDF. Please try again.",
"relatorio.pdf.subtitulo": "Monthly earnings and expenses report",
"relatorio.pdf.geradoEm": "Generated on {v}",
"relatorio.pdf.resumo": "Month summary",
"relatorio.pdf.bruto": "Gross",
"relatorio.pdf.despesas": "Expenses",
"relatorio.pdf.liquido": "Net",
"relatorio.pdf.distancia": "Distance",
"relatorio.pdf.porPlataforma": "By platform",
"relatorio.pdf.detalheDiario": "Daily detail",
"relatorio.pdf.subtotalSemana": "Week subtotal",
"relatorio.pdf.kmAbbr": "Km",
"relatorio.pdf.detalheDespesas": "Expense detail",
"relatorio.pdf.data": "Date",
"relatorio.pdf.descricao": "Description",
"relatorio.pdf.tipo": "Type",
"relatorio.pdf.valor": "Amount",
"relatorio.pdf.avulsa": "One-off",
"relatorio.pdf.fixa": "Fixed",
"relatorio.pdf.fixasCadastradas": "Fixed expenses active in the period",
"relatorio.pdf.valorFixo": "Fixed amount",
"relatorio.pdf.percentBruto": "% of gross",
"relatorio.pdf.nome": "Name",
"relatorio.pdf.email": "Email",
"relatorio.pdf.plano": "Plan",
"relatorio.pdf.semDespesas": "No expenses logged this month.",
"relatorio.pdf.resumoSemanal": "Weekly summary",
"relatorio.pdf.periodo": "Period",
"relatorio.pdf.diferenca": "Difference",
"sheet.title": "Settings",
"sheet.installApp": "Install app",
"sheet.ariaLabel": "Profile and settings",
"sheet.defaultUser": "User",
"sheet.daysZero": "0 days on the Apps.",
"sheet.perfil": "Profile and Account Details",
"sheet.despesasFixas": "Fixed Expenses",
"sheet.multiplataforma": "Multi-platform",
"mp.atuais": "Current:",
"mp.adicionar": "Add",
"mp.novaPh": "NAME (max. 9)",
"mp.novaAria": "New platform name",
"mp.deleteAria": "Delete platform",
"mp.confirmTitle": "Delete platform",
"mp.confirmText": "Are you sure you want to delete this platform?",
"mp.confirmNamed": "Are you sure you want to delete \"{n}\"?",
"mp.avisoAtualLabel": "This week:",
"mp.avisoAtual": "the amounts entered for this platform will be deleted.",
"mp.avisoAntLabel": "Previous weeks:",
"mp.avisoAnt": "amounts are kept, along with the table data, for control and verification.",
"plat.title": "{n} earnings",
"plat.valorAria": "Amount received on the platform",
"sheet.idioma": "Language",
"sheet.tamanho": "Font size",
"sheet.tamanhoPequeno": "Normal",
"sheet.tamanhoGrande": "Large",
"tamanho.popupTitle": "Font size",
"tamanho.popupTexto": "Choose to make the font and elements bigger or smaller across the whole app.",
"tamanho.concluir": "Done",
"sheet.ajuda": "Help and FAQ",
"sheet.termosPrivacidade": "Terms and Privacy",
"sheet.apagarDados": "Delete data",
"apagar.aviso": "Data deletion is permanent and irreversible. Only inserted values and table calculations are deleted. Your user account remains active.",
"apagar.periodo": "Select period",
"apagar.estaSemana": "This week",
"apagar.esteMes": "This month",
"apagar.todos": "All data",
"apagar.btn": "Delete",
"apagar.aguarde": "Deleting...",
"apagar.confirmTitle": "Delete data",
"apagar.confirm.semana": "This will delete all amounts and expenses (fixed or not) entered this week. This action is permanent and cannot be undone.",
"apagar.confirm.mes": "This will delete all amounts and expenses (fixed or not) entered this month, in the weeks that belong to it. This action is permanent and cannot be undone.",
"apagar.confirm.todos": "This will delete ALL amounts, expenses (including registered fixed expenses) and weekly goals. Your account, photo, email and password are not affected. This action is permanent and cannot be undone.",
"sheet.sair": "Log out",
"idioma.title": "Language",
"idioma.intro": "Choose the app language. All texts will be shown in the selected language.",
"idioma.save": "Save",
"dp.upload": "Upload image..",
"dp.nome": "Name",
"dp.nomePh": "Your name",
"dp.email": "Email",
"dp.desdeQuando": "How long have you been working with apps?",
"dp.selecionarData": "Select date",
"dp.atualizarDados": "Update Personal Details",
"dp.atualizarPassword": "Update Password",
"emailChange.title": "Confirm new email",
"emailChange.notice": "To change your email, confirm your current password first. Your data stays saved and accessible; you'll just need to confirm the new address via the link we'll send to it.",
"emailChange.passwordLabel": "Current password",
"emailChange.passwordPh": "Your password",
"emailChange.continuar": "Continue",
"emailChange.aguarde": "Confirming...",
"emailChange.erroSenha": "Incorrect password.",
"emailChange.erroGenerico": "Couldn't complete this. Please try again.",
"emailChange.sucessoTitulo": "Confirm the new email",
"emailChange.sucessoTexto": "We sent a confirmation link to the new address. The email only changes once you confirm it there.",
"emailChange.entendi": "Got it",
"pwdChange.title": "Change password",
"pwdChange.atual": "Current password",
"pwdChange.atualPh": "Your current password",
"pwdChange.nova": "New password",
"pwdChange.novaPh": "At least 10 characters",
"pwdChange.confirmar": "Confirm new password",
"pwdChange.confirmarPh": "Repeat the new password",
"pwdChange.concluir": "Done",
"pwdChange.aguarde": "Finishing...",
"pwdChange.erroSenha": "Current password is incorrect.",
"pwdChange.erroCurta": "Use at least 10 characters, including uppercase, lowercase and a number.",
"pwdChange.erroDiferente": "The two new passwords don't match.",
"pwdChange.erroGenerico": "Couldn't complete this. Please try again.",
"pwdChange.sucesso": "Password updated successfully.",
"dp.daysOnApps": "{n} days on the Apps.",
"dp.yearOne": "{n} year",
"dp.yearMany": "{n} years",
"dp.monthOne": "{n} month",
"dp.monthMany": "{n} months",
"dp.join": " and ",
"dp.onApps": " on the Apps.",
"ajuda.intro": "For any question, write to us at <a href=\"mailto:contacto@smartsoma.pt\">contacto@smartsoma.pt</a>, we'll get back to you as soon as possible.",
"wheel.title": "How long have you been driving?",
"photo.title": "Change profile photo",
"photo.hint": "Drag to position and use the slider to zoom.",
"photo.previewAlt": "Photo preview",
"photo.avatarAlt": "Profile photo",
"photo.zoomAria": "Zoom",
"photo.aplicar": "Apply",
"photo.viewAria": "View profile photo",
"photo.changeImage": "Change image",
"fixas.title": "Fixed Expenses",
"fixas.helper": "Expenses that repeat EVERY WEEK (e.g. car rental, platform fee). Choose % of the gross amount (updated automatically as earnings are entered), or a fixed amount in €. This amount is posted on the Monday of each week.",
"fixas.descPh": "DESCRIPTION",
"fixas.descAria": "Expense description",
"fixas.valorAria": "Expense amount",
"fixas.percentAria": "Percentage",
"fixas.euroAria": "Euro",
"fixas.semanal": "Weekly",
"fixas.listTitle": "Registered Expenses",
"fixas.empty": "No expenses at the moment.",
"fixas.cardSub": "{v} - Weekly (Monday)",
"fixas.deleteAria": "Delete expense",
"fixas.confirmTitle": "Delete expense",
"fixas.confirmText": "Are you sure you want to delete this expense?",
"fixas.confirmNamed": "Are you sure you want to delete \"{n}\"?",
"fixas.tagFixa": "Fixed",
"fixas.tagDia": "Of the day",
"fixas.oncePerWeek": "{v} € (1x per week)",
"fixas.percentOfWeek": "{v} € ({p}% of the week's gross)",
"fixas.weeklyShort": "{v} € (weekly)",
"fixas.sufixoFixa": "{d} (FIXED)",
"fixas.sufixoFixaPct": "{d} {p}% of Gross (FIXED)",
"fixas.retroTitle": "Retroactive?",
"fixas.retroAria": "Add retroactive fixed expense",
"fixas.retroHint": "Add fixed expenses to any week you choose.",
"fixas.retroModalTitle": "Select week",
"fixas.retroModalHelper": "Choose the week when this fixed expense should start.",
"fixas.retroWeeksAria": "Weeks of the month",
"fixas.retroSelected": "Fixed expense added in week {week} of {month}, from {start} to {end} {month}.",
"despesaEdit.title": "Edit expense",
"despesaEdit.valorAria": "Expense amount",
"despesaEdit.delete": "Delete expense",
"despesaEdit.deleteTitle": "Delete expense",
"despesaEdit.deleteText": "Are you sure you want to delete this expense?",
"despesaEdit.percent": "Percentage",
"despesaEdit.euro": "Fixed amount",
"cal.title": "Select Date",
"cal.prevAria": "Previous month",
"cal.nextAria": "Next month",
"uber.title": "Uber Earnings",
"uber.valorAria": "Amount received from Uber",
"bolt.title": "Bolt Earnings",
"bolt.valorAria": "Amount received from Bolt",
"dia.title": "Expenses of the day",
"dia.helper": "Enter as many expenses as you like.",
"dia.descPh": "DESCRIPTION",
"dia.descAria": "Expense description",
"dia.valorAria": "Amount spent on expenses",
"dia.listTitle": "Expenses of the day",
"dia.cadastrarFixas": "Register fixed expenses",
"dist.title": "Kilometres Travelled:",
"dist.modoTotal": "Total Km",
"dist.modoInicioFim": "Start and End",
"dist.helperTotal": "Enter the kilometres travelled during the day, the total amount only.",
"dist.helperInicioFim": "Enter your vehicle's starting km, and come back at the end of the day to enter the final km — we do the maths.",
"dist.valorAria": "Distance travelled in kilometres",
"dist.kmInicio": "Start Km:",
"dist.kmFim": "End Km",
"dist.kmInicioAria": "Starting km",
"dist.kmFimAria": "Final km",
"dist.kmInicioUpdAria": "Update start km",
"dist.kmFimUpdAria": "Update end km",
"dist.insiraInicio": "Enter Start Km",
"dist.insiraFim": "Enter End Km",
"dist.percorridos": "{v} km travelled",
"meta.title": "Weekly Goal",
"meta.welcome": "Set your weekly earnings goal on the home screen. You can change it whenever you like.",
"meta.welcomeKept": "A new week has started. Do you want to keep the {v} € {t} goal or clear it?",
"meta.valorAria": "Weekly goal amount",
"meta.bruto": "Gross",
"meta.liquido": "Net",
"meta.brutos": "Gross",
"meta.liquidos": "Net",
"meta.atual": "Current goal",
"meta.nenhuma": "None",
"meta.current": "{v} € {t} / {p}%",
"meta.fixasQuestion": "Keep the same fixed expenses as last week?",
"meta.fixasEmpty": "No fixed expenses registered. To use this option, register them in Settings › Fixed Expenses.",
"meta.fixasManter": "Keep",
"meta.fixasZerar": "Clear Expenses",
"meta.manterMeta": "Keep goal",
"meta.zerarMeta": "Clear goal",
"meta.podeAlterar": "You can change it whenever you like.",
"meta.zerar": "Clear",
"meta.fixasLinhaEuro": "{v} Eur",
"meta.fixasLinhaPct": "{v}% of the gross amount",
"meta.histNaoDefinida": "No goal was set for this week.",
"meta.histDefinida": "Goal set:",
"meta.histGanho": "Earned in the period:",
"meta.histAcima": "You went past the goal, reaching {p}% of it.",
"meta.histAbaixo": "You reached {p}% of the goal so far.",
"meta.retroTitle": "Retroactive Weekly Goal",
"meta.retroWelcome": "Set the goal only for this week. It does not change other periods."
}
};

      var FLAGS = {"pt": "<svg viewBox=\"0 0 30 20\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><rect width=\"12\" height=\"20\" fill=\"#046A38\"/><rect x=\"12\" width=\"18\" height=\"20\" fill=\"#DA291C\"/><circle cx=\"12\" cy=\"10\" r=\"5.2\" fill=\"#FFE800\" stroke=\"#fff\" stroke-width=\"0.5\"/><path d=\"M12 5.4a4.6 4.6 0 0 0 0 9.2 4.6 4.6 0 0 0 0-9.2Z\" fill=\"none\" stroke=\"#046A38\" stroke-width=\"0.7\"/><rect x=\"9.7\" y=\"7.3\" width=\"4.6\" height=\"5.6\" rx=\"1.2\" fill=\"#fff\" stroke=\"#DA291C\" stroke-width=\"0.8\"/><rect x=\"11\" y=\"8.6\" width=\"2\" height=\"3\" rx=\"0.5\" fill=\"#046A38\"/></svg>", "en": "<svg viewBox=\"0 0 60 30\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><rect width=\"60\" height=\"30\" fill=\"#012169\"/><path d=\"M0 0 L60 30 M60 0 L0 30\" stroke=\"#fff\" stroke-width=\"7\"/><path d=\"M0 0 L60 30 M60 0 L0 30\" stroke=\"#C8102E\" stroke-width=\"4\"/><path d=\"M30 0 V30 M0 15 H60\" stroke=\"#fff\" stroke-width=\"11\"/><path d=\"M30 0 V30 M0 15 H60\" stroke=\"#C8102E\" stroke-width=\"6.5\"/></svg>"};

      var ORDER = ['pt', 'en'];

      var lang = DEFAULT_LANG;
      try {
        var saved = localStorage.getItem(LANG_KEY);
        if (saved && DICT[saved]) lang = saved;
      } catch (e) {  }

      function raw (key) {
        var d = DICT[lang] || DICT[DEFAULT_LANG];
        if (d && d[key] !== undefined) return d[key];
        var f = DICT[DEFAULT_LANG];
        if (f && f[key] !== undefined) return f[key];
        return key;
      }

      // t('chave') devolve o texto; t('chave', {n: 3}) substitui {n} por 3.
      function t (key, params) {
        var v = raw(key);
        if (typeof v !== 'string') return v;
        if (params) {
          v = v.replace(/\{(\w+)\}/g, function (m, k) {
            return (params[k] !== undefined && params[k] !== null) ? params[k] : m;
          });
        }
        return v;
      }

      // Listas (meses, dias da semana). Devolve sempre uma cópia para que
      // quem receber não consiga alterar o dicionário sem querer.
      function list (key) {
        var v = raw(key);
        return (v && v.slice) ? v.slice() : [];
      }

      function getLang () { return lang; }
      function getFlag (code) { return FLAGS[code] || ''; }
      function getName (code) {
        var d = DICT[code];
        return (d && d['lang.name']) ? d['lang.name'] : code;
      }
      function getOrder () { return ORDER.slice(); }

      function applyStatic (root) {
        var scope = root || document;
        scope.querySelectorAll('[data-i18n]').forEach(function (el) {
          el.textContent = t(el.getAttribute('data-i18n'));
        });
        scope.querySelectorAll('[data-i18n-html]').forEach(function (el) {
          el.innerHTML = t(el.getAttribute('data-i18n-html'));
        });
        scope.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
          el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
        });
        scope.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
          el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
        });
        scope.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
          el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
        });
        // Iniciais dos dias da semana no calendário (S T Q Q S S D em pt).
        var weekdaysEl = scope.querySelector ? scope.querySelector('.mm-cal-weekdays') : null;
        if (weekdaysEl) {
          var letters = list('weekday.letters');
          var spans = weekdaysEl.querySelectorAll('span');
          spans.forEach(function (sp, i) { if (letters[i]) sp.textContent = letters[i]; });
        }
        try { document.documentElement.setAttribute('lang', t('lang.code')); } catch (e) {  }
      }

      function setLang (code) {
        if (!DICT[code] || code === lang) return false;
        lang = code;
        try { localStorage.setItem(LANG_KEY, code); } catch (e) {  }
        applyStatic();
        try {
          document.dispatchEvent(new CustomEvent('languageChanged', { detail: code }));
        } catch (e) {  }
        return true;
      }

      // Atalho usado em vários sítios: capitaliza a primeira letra
      // respeitando idiomas onde o mês já vem capitalizado (inglês).
      function capitalize (s) {
        if (!s) return s;
        return s.charAt(0).toUpperCase() + s.slice(1);
      }

      window.I18N = {
        t: t,
        list: list,
        getLang: getLang,
        setLang: setLang,
        getFlag: getFlag,
        getName: getName,
        getOrder: getOrder,
        applyStatic: applyStatic,
        capitalize: capitalize
      };
    })();



    /* Aplica o idioma guardado a todo o HTML estático ANTES de qualquer
       script da app correr — assim nenhum módulo guarda em cache um texto
       em português quando o utilizador escolheu outro idioma. */
    if (window.I18N) window.I18N.applyStatic();



    /* ---- Tamanho da fonte: Pequeno (padrão) e Grande ----
       Só troca a classe no <html>; como o CSS está em rem, o app inteiro
       redimensiona de uma vez. Aplicado cedo, ainda com o splash a cobrir
       o ecrã, para não haver nenhum "salto" visível. A escolha em si
       acontece num popup (ver openTamanhoBtn mais abaixo), com uma
       ilustração das letras P e G nos dois tamanhos. */
    (function () {
      var STORAGE_KEY = 'appTamanho';
      var saved = 'pequeno';
      try {
        var raw = (typeof cloudGet === 'function') ? cloudGet(STORAGE_KEY) : null;
        if (raw === 'medio') saved = 'medio';
      } catch (e) {  }
      document.documentElement.classList.toggle('tam-medio', saved === 'medio');

      function isGrande () { return document.documentElement.classList.contains('tam-medio'); }

      function refreshRowLabel () {
        var labelEl = document.getElementById('tamanhoCurrentLabel');
        if (labelEl) labelEl.textContent = I18N.t(isGrande() ? 'sheet.tamanhoGrande' : 'sheet.tamanhoPequeno');
      }

      function refreshPopupState () {
        var optP = document.getElementById('tamanhoOptionP');
        var optG = document.getElementById('tamanhoOptionG');
        if (!optP || !optG) return;
        optP.classList.toggle('is-active', !isGrande());
        optG.classList.toggle('is-active', isGrande());
      }

      function choose (size) {
        var grande = size === 'medio';
        if (isGrande() === grande) return;
        document.documentElement.classList.toggle('tam-medio', grande);
        try { if (typeof cloudSet === 'function') cloudSet(STORAGE_KEY, size); } catch (e) {  }
        refreshRowLabel();
        refreshPopupState();
      }

      function wireUI () {
        var openBtn    = document.getElementById('openTamanhoBtn');
        var optP       = document.getElementById('tamanhoOptionP');
        var optG       = document.getElementById('tamanhoOptionG');
        if (!openBtn) return;

        optP.addEventListener('click', function () { choose('pequeno'); });
        optG.addEventListener('click', function () { choose('medio'); });

        window.TamanhoScreen = { prepare: refreshPopupState };

        refreshRowLabel();
        document.addEventListener('languageChanged', function () {
          refreshRowLabel();
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireUI);
      } else {
        wireUI();
      }
    })();



    function closeAllOverlays () {
      if (window.SmartSomaReceivable && typeof window.SmartSomaReceivable.close === 'function') window.SmartSomaReceivable.close();
      if (window.SmartSomaExtras && typeof window.SmartSomaExtras.close === 'function') window.SmartSomaExtras.close();
      if (window.GanhosDate && typeof window.GanhosDate.close === 'function') window.GanhosDate.close();
      var entryDialog = document.getElementById('uiEntryDialog');
      if (entryDialog && entryDialog.open) entryDialog.close();
      document.querySelectorAll('.mm-backdrop.visible,.modal-backdrop.visible,.ui-entry-retro-backdrop.visible,.ui-extra-edit-backdrop.visible,.ui-extra-delete-backdrop.visible').forEach(function (b) {
        b.classList.remove('visible');
        b.querySelectorAll('input.mm-value-input, input.despesa-desc-input, input.despesa-valor-input').forEach(function (inp) {
          if (inp.id === 'distanciaKmInicioInput' || inp.id === 'distanciaKmFimInput') return;
          inp.value = '';
        });
      });
    }
    window.closeAllOverlays = closeAllOverlays;



    (function () {
      var modoTotalBtn      = document.getElementById('distanciaModoTotalBtn');
      var modoInicioFimBtn  = document.getElementById('distanciaModoInicioFimBtn');
      var helperText        = document.getElementById('distanciaModoHelperText');
      var totalForm         = document.getElementById('distanciaTotalForm');
      var inicioFimForm     = document.getElementById('distanciaInicioFimForm');
      var valorInput        = document.getElementById('distanciaValorInput');
      var kmInicioInput     = document.getElementById('distanciaKmInicioInput');
      var kmFimInput        = document.getElementById('distanciaKmFimInput');
      var kmInicioUpdateBtn = document.getElementById('distanciaKmInicioUpdateBtn');
      var kmFimUpdateBtn    = document.getElementById('distanciaKmFimUpdateBtn');
      var kmFimRow          = document.getElementById('distanciaKmFimRow');
      var statusText        = document.getElementById('distanciaStatusText');

      if (!modoTotalBtn || !modoInicioFimBtn) return;

      // Textos de ajuda: lidos do dicionário de idiomas a cada utilização,
      // para acompanharem a troca de idioma sem recarregar a app.
      function textoModo (isTotal) {
        return I18N.t(isTotal ? 'dist.helperTotal' : 'dist.helperInicioFim');
      }

      // Ao trocar de idioma, os textos deste popup são reescritos.
      document.addEventListener('languageChanged', function () {
        setModo(modo);
        if (!statusText) return;
        if (kmInicioCommitted !== null && kmFimCommitted !== null) updateFormulaText();
        else statusText.textContent = I18N.t(kmInicioCommitted === null ? 'dist.insiraInicio' : 'dist.insiraFim');
      });

      var modo = 'total';
      var kmInicioCommitted = null;
      var kmFimCommitted = null;

      // Persistência do modo "Início e Fim": o motorista insere o km
      // inicial de manhã e só volta a inserir o km final no fim do dia,
      // possivelmente depois de fechar a app por completo. Guardamos por
      // dia, para que cada dia mantenha os seus próprios valores.
      var DISTANCIA_STORAGE_PREFIX = 'distanciaInicioFim:';

      function pad2d (n) { return n < 10 ? '0' + n : String(n); }
      function distDateKey () {
        var d = (window.GanhosDate && typeof window.GanhosDate.get === 'function')
          ? window.GanhosDate.get()
          : new Date();
        return d.getFullYear() + '-' + pad2d(d.getMonth() + 1) + '-' + pad2d(d.getDate());
      }
      function distStorageKey () { return DISTANCIA_STORAGE_PREFIX + distDateKey(); }

      function saveInicioFimState () {
        try {
          if (kmInicioCommitted === null && kmFimCommitted === null) {
            cloudRemove(distStorageKey());
            return;
          }
          cloudSet(distStorageKey(), JSON.stringify({
            inicio: kmInicioCommitted,
            fim: kmFimCommitted
          }));
        } catch (e) {  }
      }

      function loadInicioFimState () {
        try {
          var raw = cloudGet(distStorageKey());
          if (!raw) return null;
          var parsed = JSON.parse(raw);
          return {
            inicio: (typeof parsed.inicio === 'number') ? parsed.inicio : null,
            fim: (typeof parsed.fim === 'number') ? parsed.fim : null
          };
        } catch (e) {  }
        return null;
      }

      function parseKm (input) {
        if (!input) return NaN;
        return parseFloat(String(input.value).replace(',', '.'));
      }

      function fmtKm (n) {
        return (Math.round(n * 10) / 10).toString();
      }

      function loadSavedTotalKm () {
        try {
          var raw = cloudGet('homeBadgeValores:' + distDateKey());
          if (!raw) return 0;
          var parsed = JSON.parse(raw);
          return Math.max(0, Number(parsed && parsed.distancia) || 0);
        } catch (e) {  }
        return 0;
      }

      function resetInicioFimState () {
        kmInicioCommitted = null;
        kmFimCommitted = null;
        if (kmInicioInput) kmInicioInput.value = '';
        if (kmFimInput) kmFimInput.value = '';
        if (kmFimRow) kmFimRow.classList.add('is-locked');
        if (kmFimInput) kmFimInput.disabled = true;
        if (kmFimUpdateBtn) kmFimUpdateBtn.disabled = true;
        if (statusText) statusText.textContent = I18N.t('dist.insiraInicio');
      }

      function setModo (novoModo) {
        modo = novoModo;
        var isTotal = modo === 'total';
        modoTotalBtn.classList.toggle('active', isTotal);
        modoTotalBtn.setAttribute('aria-pressed', isTotal ? 'true' : 'false');
        modoInicioFimBtn.classList.toggle('active', !isTotal);
        modoInicioFimBtn.setAttribute('aria-pressed', !isTotal ? 'true' : 'false');
        if (totalForm) totalForm.hidden = !isTotal;
        if (inicioFimForm) inicioFimForm.hidden = isTotal;
        if (helperText) helperText.textContent = textoModo(isTotal);
      }

      function updateFormulaText () {
        if (kmInicioCommitted === null || kmFimCommitted === null || !statusText) return;
        var diff = kmFimCommitted - kmInicioCommitted;
        if (diff < 0) diff = 0;
        statusText.textContent = I18N.t('dist.percorridos', { v: fmtKm(diff) });
      }

      modoTotalBtn.addEventListener('click', function () { setModo('total'); });
      modoInicioFimBtn.addEventListener('click', function () { setModo('inicio-fim'); });

      if (kmInicioUpdateBtn) {
        kmInicioUpdateBtn.addEventListener('click', function () {
          var valor = parseKm(kmInicioInput);
          if (isNaN(valor) || valor < 0) return;
          kmInicioCommitted = valor;
          if (kmFimRow) kmFimRow.classList.remove('is-locked');
          if (kmFimInput) kmFimInput.disabled = false;
          if (kmFimUpdateBtn) kmFimUpdateBtn.disabled = false;
          if (kmFimCommitted === null) {
            if (statusText) statusText.textContent = I18N.t('dist.insiraFim');
          } else {
            updateFormulaText();
          }
          saveInicioFimState();
        });
      }

      if (kmFimUpdateBtn) {
        kmFimUpdateBtn.addEventListener('click', function () {
          if (kmInicioCommitted === null) return;
          var valor = parseKm(kmFimInput);
          if (isNaN(valor) || valor < 0) return;
          kmFimCommitted = valor;
          updateFormulaText();
          saveInicioFimState();
        });
      }

      // Restaura o que já tinha sido inserido neste dia. Se o km inicial já
      // foi guardado, o popup abre diretamente no modo "Início e Fim", com
      // o campo do km final destrancado, pronto para fechar o dia.
      function restoreInicioFimState () {
        var saved = loadInicioFimState();
        if (!saved || saved.inicio === null) {
          resetInicioFimState();
          if (valorInput) {
            var totalKm = loadSavedTotalKm();
            valorInput.value = totalKm > 0 ? fmtKm(totalKm) : '';
          }
          setModo('total');
          return;
        }

        kmInicioCommitted = saved.inicio;
        kmFimCommitted = saved.fim;
        if (kmInicioInput) kmInicioInput.value = fmtKm(saved.inicio);
        if (kmFimRow) kmFimRow.classList.remove('is-locked');
        if (kmFimInput) {
          kmFimInput.disabled = false;
          kmFimInput.value = (saved.fim !== null) ? fmtKm(saved.fim) : '';
        }
        if (kmFimUpdateBtn) kmFimUpdateBtn.disabled = false;

        if (saved.fim !== null) {
          updateFormulaText();
        } else if (statusText) {
          statusText.textContent = I18N.t('dist.insiraFim');
        }
        setModo('inicio-fim');
      }

      function getComputedKm () {
        if (kmInicioCommitted === null || kmFimCommitted === null) return 0;
        var diff = kmFimCommitted - kmInicioCommitted;
        return diff < 0 ? 0 : diff;
      }

      window.DistanciaModo = {
        getModo: function () { return modo; },
        getComputedKm: getComputedKm,
        restore: restoreInicioFimState,
        resetAll: function () {
          resetInicioFimState();
          saveInicioFimState();
          setModo('total');
          if (valorInput) valorInput.value = '';
        }
      };

      restoreInicioFimState();

      document.addEventListener('DOMContentLoaded', function () {
        if (window.GanhosDate && typeof window.GanhosDate.onChange === 'function') {
          // Ao trocar de dia, carrega o estado guardado desse outro dia
          // (em vez de simplesmente limpar tudo).
          window.GanhosDate.onChange(function () {
            if (valorInput) valorInput.value = '';
            restoreInicioFimState();
          });
        }
      });
    })();



    (function () {
      function openDespesasModal () {
        var target = document.getElementById('sheetScreenDespesasFixas');
        if (typeof window.openProfileSheetPublic === 'function') window.openProfileSheetPublic();
        if (typeof window.openSheetScreenPublic === 'function' && target && I18N) {
          window.openSheetScreenPublic(target, I18N.t('sheet.despesasFixas'), { push: false });
        }
      }
      function closeDespesasModal () {
        var descEl = document.getElementById('despesaDescInput');
        var valEl  = document.getElementById('despesaValorInput');
        if (descEl) descEl.value = '';
        if (valEl) valEl.value = '';
        if (typeof window.goBackSheetScreenPublic === 'function') window.goBackSheetScreenPublic();
      }

      window.DespesasModal = { open: openDespesasModal, close: closeDespesasModal };
    })();

    (function () {
      var DESPESAS_STORAGE_KEY = 'despesasFixas';

      var descInput   = document.getElementById('despesaDescInput');
      var valorInput  = document.getElementById('despesaValorInput');
      var btnPercent  = document.getElementById('despesaTipoPercentBtn');
      var btnEuro     = document.getElementById('despesaTipoEuroBtn');
      var salvarBtn   = document.getElementById('despesaSalvarBtn');
      var listEl      = document.getElementById('despesaListEl');
      var retroSwitch = document.getElementById('fixasRetroSwitch');
      var retroHint   = document.getElementById('fixasRetroHint');
      var retroModal  = document.getElementById('fixasRetroPeriodModalBackdrop');
      var retroMonthPrev = document.getElementById('fixasRetroMonthPrev');
      var retroMonthNext = document.getElementById('fixasRetroMonthNext');
      var retroMonthLabel = document.getElementById('fixasRetroMonthLabel');
      var retroWeekList = document.getElementById('fixasRetroWeekList');

      var confirmBackdrop  = document.getElementById('despesaConfirmBackdrop');
      var confirmCancelBtn = document.getElementById('despesaConfirmCancelBtn');
      var confirmDeleteBtn = document.getElementById('despesaConfirmDeleteBtn');

      if (!descInput || !valorInput || !salvarBtn || !listEl) return;

      var tipoAtual = 'percentual';
      var despesas  = [];
      var despesaSeq = 0;
      var pendingDeleteId = null;
      var retroMonday = null;
      var retroYear = null;
      var retroMonth = null;

      // Cada despesa fixa é "carimbada" com a semana (segunda-feira) em
      // que foi cadastrada. Ao excluir, também carimbamos a semana da
      // exclusão em vez de apagar de fato: assim, semanas passadas
      // continuam mostrando as despesas fixas como elas eram na época,
      // mesmo que hoje o cadastro tenha mudado (ver uso em
      // fixaEstaAtivaNaSemana, no bloco que calcula os totais por dia).
      function pad2 (n) { return n < 10 ? '0' + n : String(n); }
      function semanaAtualKey () {
        var d = new Date();
        var day = d.getDay();
        var diff = (day === 0) ? -6 : 1 - day;
        var monday = new Date(d.getTime());
        monday.setDate(d.getDate() + diff);
        return monday.getFullYear() + '-' + pad2(monday.getMonth() + 1) + '-' + pad2(monday.getDate());
      }

      function dateKeyFor (d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
      function formatRetroHint () {
        if (!retroHint) return;
        if (!retroMonday) {
          retroHint.textContent = I18N.t('fixas.retroHint');
          retroHint.classList.remove('is-selected');
          return;
        }
        var sunday = new Date(retroMonday.getTime()); sunday.setDate(retroMonday.getDate() + 6);
        var months = I18N.list('months.lower');
        var owner = new Date(retroMonday.getTime()); owner.setDate(retroMonday.getDate() + 3);
        var weekIndex = window.SmartSomaWeeks ? window.SmartSomaWeeks.indexInMonth(retroMonday, owner.getFullYear(), owner.getMonth()) + 1 : 1;
        retroHint.textContent = I18N.t('fixas.retroSelected', {
          week: weekIndex, month: months[owner.getMonth()], start: retroMonday.getDate(), end: sunday.getDate()
        });
        retroHint.classList.add('is-selected');
      }
      function setRetroEnabled (enabled) {
        if (retroSwitch) retroSwitch.setAttribute('aria-checked', enabled ? 'true' : 'false');
        if (!enabled) retroMonday = null;
        formatRetroHint();
      }
      function closeRetroPicker (reset) {
        if (retroModal) retroModal.classList.remove('visible');
        if (reset && !retroMonday) setRetroEnabled(false);
      }
      function renderRetroPicker () {
        if (!retroWeekList || !retroMonthLabel || !window.SmartSomaWeeks) return;
        retroMonthLabel.textContent = I18N.capitalize(I18N.list('months.lower')[retroMonth]) + ' de ' + retroYear;
        retroWeekList.innerHTML = '';
        window.SmartSomaWeeks.weeksForMonth(retroYear, retroMonth).forEach(function (week, idx) {
          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'semana-period-week-option';
          button.setAttribute('role', 'option');
          button.innerHTML = '<span>Semana ' + (idx + 1) + ' <small>(' + window.SmartSomaWeeks.formatPeriod(week.monday, week.sunday) + ')</small></span>';
          button.addEventListener('click', function () {
            retroMonday = new Date(week.monday.getTime());
            setRetroEnabled(true);
            closeRetroPicker(false);
          });
          retroWeekList.appendChild(button);
        });
      }
      function openRetroPicker () {
        if (!retroModal || !window.SmartSomaWeeks) return;
        var owner = window.SmartSomaWeeks.ownerMonth(new Date());
        retroYear = owner.year; retroMonth = owner.month;
        renderRetroPicker();
        retroModal.classList.add('visible');
      }

      function loadDespesas () {
        try {
          var raw = cloudGet(DESPESAS_STORAGE_KEY);
          if (raw) {
            var parsed = JSON.parse(raw);
            despesas   = (parsed && parsed.items) || [];
            despesaSeq = (parsed && parsed.seq) || 0;
          }
        } catch (e) {
          despesas = [];
          despesaSeq = 0;
        }
      }

      function saveDespesas () {
        try {
          cloudSet(DESPESAS_STORAGE_KEY, JSON.stringify({ items: despesas, seq: despesaSeq }));
        } catch (e) {  }
      }

      function formatValor (item) {
        if (item.tipo === 'euro') {
          return Number(item.valor).toFixed(2) + ' €';
        }
        return Number(item.valor) + '%';
      }

      function setTipo (tipo) {
        tipoAtual = tipo;
        var isPercent = tipo === 'percentual';
        btnPercent.classList.toggle('active', isPercent);
        btnPercent.setAttribute('aria-pressed', isPercent ? 'true' : 'false');
        btnEuro.classList.toggle('active', !isPercent);
        btnEuro.setAttribute('aria-pressed', !isPercent ? 'true' : 'false');
        valorInput.placeholder = isPercent ? '%' : '0.00 €';
      }

      btnPercent.addEventListener('click', function () { setTipo('percentual'); });
      btnEuro.addEventListener('click', function () { setTipo('euro'); });

      valorInput.addEventListener('input', function () {
        var value = valorInput.value.replace(/[^0-9.,]/g, '');
        var firstSep = value.search(/[.,]/);
        if (firstSep !== -1) {
          value = value.slice(0, firstSep + 1) + value.slice(firstSep + 1).replace(/[.,]/g, '');
        }

        if (tipoAtual === 'euro') {
          var numeric = parseFloat(value.replace(',', '.'));
          if (!isNaN(numeric) && numeric > 999.99) {
            value = value.includes(',') ? '999,99' : '999.99';
          }
        }

        valorInput.value = value;
      });

      function renderDespesas () {
        listEl.innerHTML = '';

        var semanaAtual = semanaAtualKey();
        var ativas = despesas.filter(function (item) {
          return !item.retroativa && (!item.desde || item.desde <= semanaAtual) && (!item.ate || item.ate > semanaAtual);
        });

        if (ativas.length === 0) {
          var empty = document.createElement('p');
          empty.className = 'despesa-empty';
          empty.textContent = I18N.t('fixas.empty');
          listEl.appendChild(empty);
          return;
        }

        ativas.forEach(function (item) {
          var card = document.createElement('div');
          card.className = 'despesa-card';

          var desc = document.createElement('div');
          desc.className = 'despesa-card-desc';
          desc.textContent = item.descricao;

          var sub = document.createElement('div');
          sub.className = 'despesa-card-sub';
          sub.textContent = I18N.t('fixas.cardSub', { v: formatValor(item) });

          var delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'despesa-delete-btn';
          delBtn.setAttribute('aria-label', I18N.t('fixas.deleteAria'));
          delBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';
          delBtn.addEventListener('click', function () { openDeleteConfirm(item.id, item.descricao); });

          card.appendChild(desc);
          card.appendChild(sub);
          card.appendChild(delBtn);
          listEl.appendChild(card);
        });
      }

      salvarBtn.addEventListener('click', function () {
        var descricao = window.SmartSomaSecurity.cleanText(descInput.value);
        var valorNum  = parseFloat(valorInput.value.replace(',', '.'));

        if (!descricao || isNaN(valorNum) || valorNum <= 0 || (tipoAtual === 'percentual' && valorNum > 100)) return;



        if (tipoAtual === 'euro' && valorNum > 999.99) valorNum = 999.99;

        despesaSeq++;
        despesas.push({
          id: despesaSeq,
          descricao: descricao,
          valor: valorNum,
          tipo: tipoAtual,
          desde: retroMonday ? dateKeyFor(retroMonday) : semanaAtualKey(),
          retroativa: !!retroMonday
        });

        saveDespesas();
        renderDespesas();
        document.dispatchEvent(new CustomEvent('despesasFixasChanged'));

        descInput.value = '';
        valorInput.value = '';
        setRetroEnabled(false);
        document.dispatchEvent(new CustomEvent('fixedExpenseSaved'));
      });

      if (retroSwitch) retroSwitch.addEventListener('click', function () {
        var enabled = retroSwitch.getAttribute('aria-checked') === 'true';
        if (enabled) {
          setRetroEnabled(false);
          return;
        }
        openRetroPicker();
      });
      if (retroMonthPrev) retroMonthPrev.addEventListener('click', function () {
        retroMonth--; if (retroMonth < 0) { retroMonth = 11; retroYear--; }
        renderRetroPicker();
      });
      if (retroMonthNext) retroMonthNext.addEventListener('click', function () {
        retroMonth++; if (retroMonth > 11) { retroMonth = 0; retroYear++; }
        renderRetroPicker();
      });
      if (retroModal) retroModal.addEventListener('click', function (e) {
        if (e.target === retroModal) closeRetroPicker(true);
      });

      function openDeleteConfirm (id, descricao) {
        pendingDeleteId = id;
        var textEl = document.getElementById('despesaConfirmText');
        if (textEl) {
          textEl.textContent = I18N.t('fixas.confirmNamed', { n: descricao });
        }
        confirmBackdrop.classList.add('visible');
      }

      function closeDeleteConfirm () {
        pendingDeleteId = null;
        confirmBackdrop.classList.remove('visible');
      }

      if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', closeDeleteConfirm);
      }
      if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function () {
          if (pendingDeleteId !== null) {
            var semanaExclusao = semanaAtualKey();
            despesas.forEach(function (d) {
              if (d.id === pendingDeleteId) d.ate = semanaExclusao;
            });
            saveDespesas();
            renderDespesas();
            document.dispatchEvent(new CustomEvent('despesasFixasChanged'));
          }
          closeDeleteConfirm();
        });
      }
      if (confirmBackdrop) {
        confirmBackdrop.addEventListener('click', function (e) {
          if (e.target === confirmBackdrop) closeDeleteConfirm();
        });
      }
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && confirmBackdrop && confirmBackdrop.classList.contains('visible')) {
          closeDeleteConfirm();
        }
      });

      loadDespesas();
      renderDespesas();
      setTipo('percentual');
      document.addEventListener('languageChanged', function () { renderDespesas(); formatRetroHint(); });
      document.addEventListener('despesasFixasChanged', renderDespesas);
      document.addEventListener('smartSomaTransientStateReset', function () {
        closeRetroPicker(false);
        setRetroEnabled(false);
        closeDeleteConfirm();
      });

      // Exclui de vez todas as despesas fixas ainda ativas (mesma marca
      // .ate usada na exclusão manual, uma por uma, na página de Despesas
      // Fixas). Usado pelo "Zerar Despesas" do aviso de início de semana:
      // a pessoa não vai mais pagar essas despesas, então elas somem daqui
      // pra frente — sem mexer no histórico de semanas já passadas.
      function excluirTodasAtivas () {
        var semanaExclusao = semanaAtualKey();
        var mudou = false;
        despesas.forEach(function (d) {
          if (!d.ate) { d.ate = semanaExclusao; mudou = true; }
        });
        if (mudou) {
          saveDespesas();
          renderDespesas();
          document.dispatchEvent(new CustomEvent('despesasFixasChanged'));
        }
        return mudou;
      }

      window.DespesasCadastro = {
        isConfirmOpen: function () { return !!(confirmBackdrop && confirmBackdrop.classList.contains('visible')); },
        closeConfirm: closeDeleteConfirm,
        excluirTodasAtivas: excluirTodasAtivas
      };
    })();

    (function () {
      var STORAGE_PREFIX = 'despesasDiarias:';

      var descInput  = document.getElementById('despesasSemanaDescInput');
      var valorInput = document.getElementById('despesasSemanaValorInput');
      var salvarBtn  = document.getElementById('despesasSemanaSalvarBtn');
      var listEl     = document.getElementById('despesasDiariasListEl');

      var confirmBackdrop  = document.getElementById('despesaDiariaConfirmBackdrop');
      var confirmText      = document.getElementById('despesaDiariaConfirmText');
      var confirmCancelBtn = document.getElementById('despesaDiariaConfirmCancelBtn');
      var confirmDeleteBtn = document.getElementById('despesaDiariaConfirmDeleteBtn');

      if (!descInput || !valorInput || !salvarBtn || !listEl) return;

      var items = [];
      var seq = 0;
      var pendingDeleteId = null;
      var pendingDeleteDate = null;

      function pad2 (n) { return n < 10 ? '0' + n : String(n); }
      function dateKey () {
        var ref = window.GanhosDate ? window.GanhosDate.get() : new Date();
        return ref.getFullYear() + '-' + pad2(ref.getMonth() + 1) + '-' + pad2(ref.getDate());
      }

      function loadItems () {
        items = [];
        seq = 0;
        try {
          var raw = cloudGet(STORAGE_PREFIX + dateKey());
          if (raw) {
            var parsed = JSON.parse(raw);
            items = (parsed && parsed.items) || [];
            seq   = (parsed && parsed.seq) || 0;
          }
        } catch (e) {  }
      }

      function saveItems () {
        try {
          cloudSet(STORAGE_PREFIX + dateKey(), JSON.stringify({ items: items, seq: seq }));
        } catch (e) {  }
      }

      var DESPESAS_FIXAS_STORAGE_KEY = 'despesasFixas';

      function dateKeyFor (d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
      function weekMonday (date) {
        var day = date.getDay();
        var diff = (day === 0) ? -6 : 1 - day;
        var monday = new Date(date.getTime());
        monday.setDate(date.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
      }
      function refDate () { return window.GanhosDate ? window.GanhosDate.get() : new Date(); }
      function isMondayOfWeek () { return dateKeyFor(refDate()) === dateKeyFor(weekMonday(refDate())); }

      function loadDespesasFixas () {
        try {
          var raw = cloudGet(DESPESAS_FIXAS_STORAGE_KEY);
          if (raw) {
            var parsed = JSON.parse(raw);
            return (parsed && parsed.items) || [];
          }
        } catch (e) {  }
        return [];
      }

      var DESPESAS_FIXAS_SKIP_PREFIX = 'despesasFixasSkipSemana:';
      function isFixasSkippedForWeek (monday) {
        try {
          return cloudGet(DESPESAS_FIXAS_SKIP_PREFIX + dateKeyFor(monday)) === '1';
        } catch (e) {  }
        return false;
      }
      // Lista de despesas fixas "ativas" para uma semana: vazia se o
      // utilizador escolheu, no popup da Meta Semanal, não continuar com
      // as despesas fixas naquela semana específica (o cadastro em si
      // permanece intacto para as semanas seguintes). Além disso, cada
      // despesa só conta a partir da semana em que foi criada (item.desde)
      // e deixa de contar a partir da semana em que foi excluída
      // (item.ate), preservando o histórico de semanas passadas mesmo que
      // o cadastro atual tenha mudado.
      function fixaEstaAtivaNaSemana (item, weekKey) {
        if (item && item.desde && item.desde > weekKey) return false;
        if (item && item.ate && item.ate <= weekKey) return false;
        return true;
      }
      function loadDespesasFixasAtivas (monday) {
        if (isFixasSkippedForWeek(monday)) return [];
        var weekKey = dateKeyFor(monday);
        return loadDespesasFixas().filter(function (item) { return fixaEstaAtivaNaSemana(item, weekKey); });
      }

      function grossOfDay (d) {
        try {
          var raw = cloudGet('homeBadgeValores:' + dateKeyFor(d));
          if (raw) {
            var parsed = JSON.parse(raw);
            return (Number(parsed.uber) || 0) + (Number(parsed.bolt) || 0) + platSum(platExtrasFrom(parsed)) + ganhosExtrasBruto(parsed);
          }
        } catch (e) {  }
        return 0;
      }

      // Soma o bruto (Uber+Bolt) de todos os dias da semana (segunda a
      // domingo) já lançados até agora. A despesa fixa percentual é sempre
      // exibida na segunda-feira e cresce automaticamente conforme os
      // ganhos da semana são lançados em qualquer dia.
      function weekGrossSoFar (monday) {
        var sum = 0;
        for (var i = 0; i < 7; i++) {
          var d = new Date(monday.getTime());
          d.setDate(monday.getDate() + i);
          sum += grossOfDay(d);
        }
        return sum;
      }

      // Despesas fixas são sempre semanais: a despesa inteira (valor cheio
      // em euro, ou percentual sobre o bruto da semana já lançado) é
      // lançada uma única vez, na segunda-feira daquela semana. Nos outros
      // dias da semana não conta nada.
      function totalFixasDia () {
        if (!isMondayOfWeek()) return 0;
        var fixas = loadDespesasFixasAtivas(weekMonday(refDate()));
        if (!fixas.length) return 0;

        var weekGross = weekGrossSoFar(weekMonday(refDate()));
        return fixas.reduce(function (sum, item) {
          if (item.tipo === 'euro') return sum + Number(item.valor || 0);
          return sum + (weekGross * (Number(item.valor || 0) / 100));
        }, 0);
      }

      function totalValor () {
        var totalDiarias = items.reduce(function (sum, item) { return sum + Number(item.valor || 0); }, 0);
        return totalDiarias + totalFixasDia();
      }

      function syncBadge () {
        if (window.HomeBadges && typeof window.HomeBadges.setDespesas === 'function') {
          window.HomeBadges.setDespesas(totalValor());
        }
      }

      function renderLembreteFixa () {
        var el = document.getElementById('despesaFixaLembreteEl');
        if (!el) return;
        var fixas = loadDespesasFixasAtivas(weekMonday(refDate()));
        if (!fixas.length) {
          el.innerHTML = '';
          return;
        }

        var weekGross = weekGrossSoFar(weekMonday(refDate()));
        el.innerHTML = fixas.map(function (item) {
          var isEuro = item.tipo === 'euro';
          var valor = isEuro ? Number(item.valor || 0) : (weekGross * (Number(item.valor || 0) / 100));
          var sub = isEuro
            ? I18N.t('fixas.oncePerWeek', { v: valor.toFixed(2) })
            : I18N.t('fixas.percentOfWeek', { v: valor.toFixed(2), p: Number(item.valor) });
          return (
            '<div class="despesa-card is-fixa despesa-fixa-lembrete">' +
              '<div class="despesa-card-top-row">' +
                '<div class="despesa-card-desc">' + window.SmartSomaSecurity.escapeHtml(item.descricao) + '</div>' +
                '<span class="despesa-card-tag is-fixa">' + I18N.t('fixas.tagFixa') + '</span>' +
              '</div>' +
              '<div class="despesa-card-sub">' + sub + '</div>' +
            '</div>'
          );
        }).join('');
      }

      function renderList () {
        listEl.innerHTML = '';
        renderLembreteFixa();

        var onMonday = isMondayOfWeek();
        // A despesa fixa só existe no dia (segunda-feira) em que ela é
        // lançada; nos outros dias da semana não aparece. O "lembrete"
        // logo acima (renderLembreteFixa) já mostra essas despesas fixas
        // sempre que existirem — por isso aqui elas só contam para saber
        // se a lista está vazia, sem repetir os cartões dentro da lista
        // do dia (evita a duplicação visual na segunda-feira).
        var fixas = onMonday ? loadDespesasFixasAtivas(weekMonday(refDate())) : [];

        if (items.length === 0 && fixas.length === 0) {
          var empty = document.createElement('p');
          empty.className = 'despesa-empty';
          empty.textContent = I18N.t('fixas.empty');
          listEl.appendChild(empty);
          return;
        }

        items.forEach(function (item) {
          var card = document.createElement('div');
          card.className = 'despesa-card';

          var topRow = document.createElement('div');
          topRow.className = 'despesa-card-top-row';

          var desc = document.createElement('div');
          desc.className = 'despesa-card-desc';
          desc.textContent = item.descricao;

          var tag = document.createElement('span');
          tag.className = 'despesa-card-tag';
          tag.textContent = I18N.t('fixas.tagDia');

          topRow.appendChild(desc);
          topRow.appendChild(tag);

          var sub = document.createElement('div');
          sub.className = 'despesa-card-sub';
          sub.textContent = Number(item.valor).toFixed(2) + ' €';

          var delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'despesa-delete-btn';
          delBtn.setAttribute('aria-label', I18N.t('fixas.deleteAria'));
          delBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';
          delBtn.addEventListener('click', function () { openDeleteConfirm(item.id, item.descricao); });

          card.appendChild(topRow);
          card.appendChild(sub);
          card.appendChild(delBtn);
          listEl.appendChild(card);
        });
      }

      salvarBtn.addEventListener('click', function () {
        var descricao = window.SmartSomaSecurity.cleanText(descInput.value);
        var valorNum  = parseFloat(valorInput.value.replace(',', '.'));

        if (!descricao || isNaN(valorNum) || valorNum <= 0) return;
        if (valorNum > 999.99) valorNum = 999.99;

        seq++;
        items.push({ id: seq, descricao: descricao, valor: valorNum });

        saveItems();
        renderList();
        syncBadge();

        descInput.value = '';
        valorInput.value = '';
      });

      function openDeleteConfirm (id, descricao, date) {
        if (window.SmartSomaPro && !window.SmartSomaPro.isPro) {
          if (window.abrirModalSubExpirada) window.abrirModalSubExpirada();
          return;
        }
        pendingDeleteId = id;
        pendingDeleteDate = dateKeyFor(date || refDate());
        if (confirmText) confirmText.textContent = I18N.t('fixas.confirmNamed', { n: descricao });
        if (confirmBackdrop) confirmBackdrop.classList.add('visible');
      }

      function closeDeleteConfirm () {
        pendingDeleteId = null;
        pendingDeleteDate = null;
        if (confirmBackdrop) confirmBackdrop.classList.remove('visible');
      }

      if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', closeDeleteConfirm);
      if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function () {
          if (pendingDeleteId !== null && pendingDeleteDate && (!window.SmartSomaPro || window.SmartSomaPro.isPro)) {
            var key = STORAGE_PREFIX + pendingDeleteDate;
            var saved = cloudGet(key);
            var data = saved ? JSON.parse(saved) : null;
            if (data && Array.isArray(data.items) && data.items.some(function (item) { return item.id === pendingDeleteId; })) {
              data.items = data.items.filter(function (item) { return item.id !== pendingDeleteId; });
              cloudSet(key, JSON.stringify(data));
              if (pendingDeleteDate === dateKey()) {
                loadItems();
                renderList();
                syncBadge();
              } else {
                var parts = pendingDeleteDate.split('-').map(Number);
                var date = new Date(parts[0], parts[1] - 1, parts[2]);
                var badgeKey = 'homeBadgeValores:' + pendingDeleteDate;
                var badge = JSON.parse(cloudGet(badgeKey) || '{}');
                badge.despesas = window.SmartSomaReadModel.day(date).expenses;
                cloudSet(badgeKey, JSON.stringify(badge));
                document.dispatchEvent(new CustomEvent('homeBadgesSaved'));
              }
            }
          }
          closeDeleteConfirm();
        });
      }
      if (confirmBackdrop) {
        confirmBackdrop.addEventListener('click', function (e) {
          if (e.target === confirmBackdrop) closeDeleteConfirm();
        });
      }
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && confirmBackdrop && confirmBackdrop.classList.contains('visible')) {
          closeDeleteConfirm();
        }
      });

      function reload () {
        loadItems();
        renderList();
        syncBadge();
      }

      var isSyncingBadge = false;
      var _syncBadgeOriginal = syncBadge;
      syncBadge = function () {
        isSyncingBadge = true;
        _syncBadgeOriginal();
        isSyncingBadge = false;
      };

      reload();
      document.addEventListener('DOMContentLoaded', function () {
        if (window.GanhosDate && typeof window.GanhosDate.onChange === 'function') {
          window.GanhosDate.onChange(reload);
        }
      });
      // Recalcula sempre que Uber/Bolt/Despesas mudarem (ex: a parcela
      // percentual das despesas fixas depende do bruto da semana), evitando
      // loop infinito quando a própria chamada a syncBadge() disparar este
      // mesmo evento.
      document.addEventListener('homeBadgesSaved', function () {
        if (isSyncingBadge) return;
        renderList();
        syncBadge();
      });
      document.addEventListener('despesasFixasChanged', function () {
        renderList();
        syncBadge();
      });
      document.addEventListener('languageChanged', renderList);
      window.DespesasDiarias = { openDeleteConfirm: openDeleteConfirm };
    })();


    (function () {
      var homeView     = document.getElementById('homeView');
      var headerLogoLink = document.getElementById('headerLogoLink');

      function showHome () {
        closeAllOverlays();
        homeView.classList.add('active');
        window.scrollTo(0, 0);
      }

      // A logo do cabeçalho é totalmente estática: não navega nem abre nada,
      // só realiza um scroll rápido (curto, mas visível) até o topo da página.
      function fastScrollToTop () {
        var duration = 250; // ms — curto e perceptível, sem ser uma animação lenta
        var startY = window.scrollY || window.pageYOffset || 0;
        if (startY <= 0) return;
        var startTime = null;
        function easeOutQuad (t) { return t * (2 - t); }
        function step (timestamp) {
          if (startTime === null) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          window.scrollTo(0, startY * (1 - easeOutQuad(progress)));
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            window.scrollTo(0, 0);
          }
        }
        requestAnimationFrame(step);
      }

      function closeEverythingForLogoNav () {
        closeAllOverlays();
        document.querySelectorAll('.modal-backdrop.visible').forEach(function (el) {
          el.classList.remove('visible');
        });
        var profileSheetEl = document.getElementById('profileSheet');
        var sheetBackdropEl = document.getElementById('sheetBackdrop');
        if (profileSheetEl && profileSheetEl.classList.contains('open')) {
          profileSheetEl.classList.remove('open');
          profileSheetEl.setAttribute('aria-hidden', 'true');
          if (sheetBackdropEl) sheetBackdropEl.classList.remove('visible');
        }
      }

      headerLogoLink.addEventListener('click', function () {
        closeEverythingForLogoNav();
        showHome();
        if (window.HomeNav) window.HomeNav.goToSection('ganhos');
        var homeListViewEl = document.getElementById('homeListView');
        if (homeListViewEl) homeListViewEl.scrollTop = 0;
        fastScrollToTop();
      });

      window.AppNav = {
        showHome: showHome,
        isHomeActive: function () { return homeView.classList.contains('active'); },
        goBack: function () {
          if (!homeView.classList.contains('active')) { showHome(); return true; }
          return false;
        }
      };
    })();

    (function () {
      // Nomes dos meses vindos do dicionário de idiomas.
      function MESES ()       { return I18N.list('months.full'); }
      function MESES_MINUS () { return I18N.list('months.lower'); }

      var subHeaderDateBtn   = document.getElementById('subHeaderDateBtn');
      var subHeaderDateLabel = document.getElementById('subHeaderDateLabel');
      var subHeaderTodayLabel = document.getElementById('subHeaderTodayLabel');
      var calBackdrop  = document.getElementById('calendarModalBackdrop');
      var calDaysGrid  = document.getElementById('mmCalendarDays');
      var calMonthLbl  = document.getElementById('mmCalendarMonthLabel');
      var calPrevBtn   = document.getElementById('mmCalPrevBtn');
      var calNextBtn   = document.getElementById('mmCalNextBtn');
      var calTodayLbl  = document.getElementById('mmCalTodayLabel');

      function todayAtMidnight () {
        var t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
      }

      var selectedDate = todayAtMidnight();
      var viewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      var pickerConfig = null;

      var dateChangeListeners = [];
      function notifyDateChange () {
        dateChangeListeners.forEach(function (fn) {
          try { fn(selectedDate); } catch (e) {  }
        });
      }

      function isSameDay (a, b) {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
      }

      function formatDateLabel (d) {
        return I18N.t('fmt.dayMonth', { d: d.getDate(), m: MESES()[d.getMonth()].toUpperCase() });
      }

      function formatDateLabelLower (d) {
        var today = todayAtMidnight();
        if (isSameDay(d, today)) return I18N.t('app.today');
        return I18N.t('fmt.dayMonth', { d: d.getDate(), m: MESES_MINUS()[d.getMonth()] });
      }

      function updateDateBtnLabel () {
        subHeaderDateLabel.textContent = formatDateLabel(selectedDate);
        var isToday = isSameDay(selectedDate, todayAtMidnight());
        if (subHeaderTodayLabel) subHeaderTodayLabel.hidden = !isToday;
      }

      function renderCalendar () {
        var year  = viewDate.getFullYear();
        var month = viewDate.getMonth();
        var today = todayAtMidnight();
        var isCurrentMonth = (year === today.getFullYear() && month === today.getMonth());

        calMonthLbl.textContent = I18N.t('fmt.monthYear', { m: MESES()[month], y: year });
        calNextBtn.disabled = !pickerConfig && isCurrentMonth;

        // A linha "Hoje: ..." mostra sempre a data real de hoje, mesmo que
        // o calendário esteja navegado para outro mês/dia.
        if (calTodayLbl) {
          calTodayLbl.textContent = I18N.t('fmt.todayIs', { d: today.getDate(), m: MESES_MINUS()[today.getMonth()] });
        }

        calDaysGrid.innerHTML = '';

        var firstWeekdaySunday = new Date(year, month, 1).getDay();
        var firstWeekday = (firstWeekdaySunday + 6) % 7; // grade começa na segunda-feira
        var daysInMonth   = new Date(year, month + 1, 0).getDate();

        for (var p = 0; p < firstWeekday; p++) {
          var pad = document.createElement('div');
          pad.className = 'mm-cal-day other-month';
          calDaysGrid.appendChild(pad);
        }

        for (var day = 1; day <= daysInMonth; day++) {
          var d = new Date(year, month, day);
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'mm-cal-day';
          btn.textContent = day;

          if (!pickerConfig && d.getTime() > today.getTime()) {
            btn.classList.add('is-future');
            btn.disabled = true;
          }
          if (isSameDay(d, today))         btn.classList.add('is-today');
          if (isSameDay(d, pickerConfig ? pickerConfig.date : selectedDate)) btn.classList.add('is-selected');

          (function (dCopy) {
            btn.addEventListener('click', function () {
              if (pickerConfig) {
                var onSelect = pickerConfig.onSelect;
                pickerConfig = null;
                closeCalendarModal();
                onSelect(new Date(dCopy));
                return;
              }
              selectedDate = dCopy;
              updateDateBtnLabel();
              closeCalendarModal();
              notifyDateChange();
              document.dispatchEvent(new CustomEvent('calendarDateSelected', { detail: { date: new Date(selectedDate) } }));
            });
          })(d);

          calDaysGrid.appendChild(btn);
        }
      }

      function openCalendarModal () {
        var initialDate = pickerConfig ? pickerConfig.date : selectedDate;
        viewDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
        renderCalendar();
        calBackdrop.classList.add('visible');
        subHeaderDateBtn.setAttribute('aria-expanded', 'true');
      }

      function closeCalendarModal () {
        calBackdrop.classList.remove('visible');
        subHeaderDateBtn.setAttribute('aria-expanded', 'false');
        pickerConfig = null;
      }

      function resetToToday () {
        var today = todayAtMidnight();
        viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
        if (!isSameDay(today, selectedDate)) {
          selectedDate = today;
          updateDateBtnLabel();
          notifyDateChange();
        } else {
          updateDateBtnLabel();
        }
        closeCalendarModal();
      }

      calPrevBtn.addEventListener('click', function () {
        viewDate.setMonth(viewDate.getMonth() - 1);
        renderCalendar();
      });
      calNextBtn.addEventListener('click', function () {
        if (calNextBtn.disabled) return;
        viewDate.setMonth(viewDate.getMonth() + 1);
        renderCalendar();
      });

      subHeaderDateBtn.addEventListener('click', openCalendarModal);
      calBackdrop.addEventListener('click', function (e) {
        if (e.target === calBackdrop) closeCalendarModal();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && calBackdrop.classList.contains('visible')) closeCalendarModal();
      });

      updateDateBtnLabel();

      // Ao trocar de idioma, o rótulo da data e o calendário (se aberto)
      // voltam a ser desenhados no novo idioma.
      document.addEventListener('languageChanged', function () {
        updateDateBtnLabel();
        if (calBackdrop.classList.contains('visible')) renderCalendar();
      });

      window.GanhosDate = {
        get: function () { return selectedDate; },
        set: function (date) {
          var next = new Date(date);
          next.setHours(0, 0, 0, 0);
          if (isNaN(next.getTime()) || isSameDay(next, selectedDate)) return;
          selectedDate = next;
          updateDateBtnLabel();
          notifyDateChange();
        },
        open: openCalendarModal,
        pick: function (date, onSelect) {
          var initialDate = new Date(date);
          initialDate.setHours(0, 0, 0, 0);
          if (isNaN(initialDate.getTime()) || typeof onSelect !== 'function') return;
          pickerConfig = { date: initialDate, onSelect: onSelect };
          openCalendarModal();
        },
        close: closeCalendarModal,
        resetToToday: resetToToday,
        formatLabel: formatDateLabelLower,
        onChange: function (fn) {
          if (typeof fn === 'function') dateChangeListeners.push(fn);
        }
      };
    })();



    /* ---- Plataformas extra (Multiplataforma): dados partilhados ----
       O cadastro fica em 'multiplataformas': [{ id, nome, img, desde, ate? }].
       desde = segunda-feira da semana em que foi criada; ate = segunda-feira
       da semana em que foi excluída (a partir daí deixa de existir, mas as
       semanas anteriores continuam guardadas e visíveis). Os valores diários
       de cada plataforma ficam dentro do próprio registo do dia
       ('homeBadgeValores:YYYY-MM-DD'), no campo plat: { id: valor }. */
    function platDateKey (d) {
      var m = d.getMonth() + 1, dd = d.getDate();
      return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (dd < 10 ? '0' + dd : dd);
    }
    function platMondayKey (d) {
      var m = new Date(d.getTime());
      var day = m.getDay();
      m.setDate(m.getDate() + (day === 0 ? -6 : 1 - day));
      return platDateKey(m);
    }
    function escHtml (s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function platRegistry () {
      var raw = null;
      try { raw = cloudGet('multiplataformas'); } catch (e) {  }
      if (!raw) return [];
      try {
        var arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.filter(function (p) { return p && p.id && p.nome; }) : [];
      } catch (e) { return []; }
    }
    // Plataformas criadas antes de existir controlo por semana não têm id:
    // dá-lhes um id e a semana atual como início, uma única vez.
    (function platNormalizeRegistry () {
      var raw = null;
      try { raw = cloudGet('multiplataformas'); } catch (e) {  }
      if (!raw) return;
      var arr;
      try { arr = JSON.parse(raw); } catch (e) { return; }
      if (!Array.isArray(arr)) return;
      var mudou = false;
      var semana = platMondayKey(new Date());
      arr.forEach(function (p, i) {
        if (p && !p.id) { p.id = 'p' + Date.now().toString(36) + i; mudou = true; }
        if (p && !p.desde) { p.desde = semana; mudou = true; }
      });
      if (mudou) { try { cloudSet('multiplataformas', JSON.stringify(arr)); } catch (e) {  } }
    })();
    // { id: valor } só com valores positivos, a partir do registo de um dia.
    function platExtrasFrom (parsed) {
      var out = {};
      if (parsed && parsed.plat && typeof parsed.plat === 'object') {
        for (var id in parsed.plat) {
          var n = Number(parsed.plat[id]);
          if (n > 0) out[id] = n;
        }
      }
      return out;
    }
    function platSum (plat) {
      var s = 0;
      for (var id in plat) s += Number(plat[id]) || 0;
      return s;
    }
    // Ganhos que não pertencem a uma plataforma. Mantêm-se separados dos
    // valores por plataforma para que só entrem no bruto quando o utilizador
    // o indicar expressamente.
    function ganhosExtrasFrom (parsed) {
      if (!parsed || !Array.isArray(parsed.ganhosExtras)) return [];
      return parsed.ganhosExtras.filter(function (item) {
        return item && Number(item.valor) > 0;
      }).map(function (item) {
        var extra = {
          id: String(item.id || ''),
          descricao: String(item.descricao || '').trim(),
          valor: Number(item.valor) || 0,
          incluidoBruto: item.incluidoBruto === true
        };
        // Conserva o campo legado apenas nos registos que já o tinham.
        if (item.aindaReceber === true) extra.aindaReceber = true;
        return extra;
      });
    }
    function ganhosExtrasBruto (parsed) {
      return ganhosExtrasFrom(parsed).reduce(function (sum, item) {
        return sum + (item.incluidoBruto ? item.valor : 0);
      }, 0);
    }
    function ganhosExtrasReceber (parsed) {
      // A inclusão no bruto é agora a única forma de um ganho extra entrar
      // no valor a receber. Mantemos a função para compatibilidade com dados
      // antigos, sem voltar a somar registos já recebidos.
      return 0;
    }
    window.GanhosExtras = {
      list: ganhosExtrasFrom,
      bruto: ganhosExtrasBruto,
      aReceber: ganhosExtrasReceber
    };
    // Plataformas que aparecem num intervalo (semana): todas as que estão
    // ativas (como Uber e Bolt, aparecem em todas as semanas), as que só
    // foram excluídas depois do início dessa semana, e qualquer uma com
    // valor lançado nela. dayPlats = lista de { id: valor } de cada dia.
    function platVisibleFor (startKey, endKey, dayPlats) {
      var used = {};
      dayPlats.forEach(function (pl) { for (var id in pl) { if (pl[id] > 0) used[id] = true; } });
      return platRegistry().filter(function (p) {
        if (used[p.id]) return true;
        return !p.ate || p.ate > startKey;
      });
    }

    function setupMasterModal (triggerId, backdropId, prefillKey) {
      var trigger  = document.getElementById(triggerId);
      var backdrop = document.getElementById(backdropId);
      if (!trigger || !backdrop) return null;

      function open () {
        closeAllOverlays();
        backdrop.classList.add('visible');
        trigger.setAttribute('aria-expanded', 'true');
        // Se já existe um valor lançado para o dia selecionado, o campo
        // abre preenchido com ele (em vez de aparecer sempre vazio), para
        // o utilizador ver e corrigir o que já tinha inserido.
        if (prefillKey && window.HomeBadges && typeof window.HomeBadges.get === 'function') {
          var input = backdrop.querySelector('input.mm-value-input');
          if (input) {
            var atual = window.HomeBadges.get()[prefillKey];
            input.value = (typeof atual === 'number' && atual > 0) ? atual.toFixed(2) : '';
          }
        }
      }
      function close () {
        backdrop.classList.remove('visible');
        trigger.setAttribute('aria-expanded', 'false');
        backdrop.querySelectorAll('input.mm-value-input, input.despesa-desc-input, input.despesa-valor-input').forEach(function (inp) {
          if (inp.id === 'distanciaKmInicioInput' || inp.id === 'distanciaKmFimInput') return;
          inp.value = '';
        });
      }

      trigger.addEventListener('click', open);
      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && backdrop.classList.contains('visible')) close();
      });

      return { open: open, close: close };
    }

    window.PlataformaModals = {
      uber:    setupMasterModal('listRowUber', 'uberModalBackdrop', 'uber'),
      bolt:    setupMasterModal('listRowBolt', 'boltModalBackdrop', 'bolt')
    };

    window.DetalhesModals = {
      despesas:  setupMasterModal('listRowDespesas', 'despesasSemanaModalBackdrop'),
      distancia: setupMasterModal('listRowDistancia', 'distanciaModalBackdrop')
    };

    // ---- Faixa deslizante das plataformas de ganhos (Uber, Bolt, ...) ----
    // Linha independente da grade de baixo. Rola/arrasta lateralmente e
    // mostra um degradê nas bordas quando há mais conteúdo por ver.
    (function () {
      var wrap = document.getElementById('ganhosIncomeScrollWrap');
      var scroller = document.getElementById('ganhosIncomeScroll');
      if (!wrap || !scroller) return;

      function updateEdges () {
        var maxScroll = scroller.scrollWidth - scroller.clientWidth;
        wrap.classList.toggle('has-scroll-left', scroller.scrollLeft > 2);
        wrap.classList.toggle('has-scroll-right', scroller.scrollLeft < maxScroll - 2);
      }

      scroller.addEventListener('scroll', updateEdges, { passive: true });
      window.addEventListener('resize', updateEdges);
      // Duplo rAF garante que os tiles já foram pintados antes de medir
      requestAnimationFrame(function () { requestAnimationFrame(updateEdges); });
      if (window.document && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateEdges);
      }
      document.addEventListener('cloudCacheReady', updateEdges);
      document.addEventListener('plataformasChanged', updateEdges);

      // Arraste com o rato (desktop). No toque, o scroll nativo já funciona.
      var isDown = false;
      var moved = false;
      var startX = 0;
      var startScroll = 0;

      function blockNextClick () {
        var onClickCapture = function (e) {
          e.stopPropagation();
          e.preventDefault();
          scroller.removeEventListener('click', onClickCapture, true);
        };
        scroller.addEventListener('click', onClickCapture, true);
      }

      scroller.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'touch') return;
        /* Só activa o arraste se existir conteúdo horizontal a rolar.
           Sem este guarda, um simples clique num tile com o rato
           activava o modo drag e bloqueava o evento click seguinte. */
        if (scroller.scrollWidth <= scroller.clientWidth + 2) return;
        isDown = true;
        moved = false;
        startX = e.clientX;
        startScroll = scroller.scrollLeft;
        scroller.classList.add('is-dragging');
      });

      window.addEventListener('pointermove', function (e) {
        if (!isDown) return;
        var dx = e.clientX - startX;
        /* Threshold aumentado de 4 → 8 px para evitar falsos positivos
           em ratos de alta sensibilidade ou ecrãs de alta densidade. */
        if (Math.abs(dx) > 8) moved = true;
        scroller.scrollLeft = startScroll - dx;
      });

      function endDrag () {
        if (!isDown) return;
        isDown = false;
        scroller.classList.remove('is-dragging');
        if (moved) blockNextClick();
      }

      window.addEventListener('pointerup', endDrag);
      window.addEventListener('pointercancel', endDrag);
    })();

    window.MetaSemanalModal = setupMasterModal('btnMetaSemanal', 'metaSemanalModalBackdrop');



    (function () {
      var dateEls = [
        document.getElementById('uberModalDate'),
        document.getElementById('boltModalDate'),
        document.getElementById('despesasSemanaModalDate'),
        document.getElementById('distanciaModalDate')
      ];

      function renderDates () {
        if (!window.GanhosDate) return;
        var label = window.GanhosDate.formatLabel(window.GanhosDate.get());
        dateEls.forEach(function (el) { if (el) el.textContent = label; });
      }

      renderDates();
      if (window.GanhosDate && typeof window.GanhosDate.onChange === 'function') {
        window.GanhosDate.onChange(renderDates);
      }
      document.addEventListener('languageChanged', renderDates);
    })();



    (function () {
      var LAST_PROMPT_KEY = 'metaSemanalLastPromptWeek';
      function TIPO_LABEL_OF (tipo) { return I18N.t(tipo === 'liquido' ? 'meta.liquidos' : 'meta.brutos'); }

      var valorInput   = document.getElementById('metaSemanalValorInput');
      var btnBruto     = document.getElementById('metaTipoBrutoBtn');
      var btnLiquido   = document.getElementById('metaTipoLiquidoBtn');
      var salvarBtn    = document.getElementById('metaSemanalSalvarBtn');
      var currentText  = document.getElementById('metaSemanalCurrentText');
      var percentLink  = document.getElementById('metaSemanalPercentText');
      var welcomeText  = document.getElementById('metaSemanalWelcomeText');
      var triggerBtn   = document.getElementById('btnMetaSemanal');
      var zerarBtn     = document.getElementById('btnZerarMetaSemanal');
      var periodLabel  = document.getElementById('metaSemanalPeriodLabel');
      if (!valorInput || !btnBruto || !btnLiquido || !salvarBtn || !currentText) return;

      var cardEl            = document.getElementById('metaSemanalCard');
      var weekBoxEl          = document.getElementById('metaSemanalWeekBox');
      var weekBoxBtn          = document.getElementById('btnMetaSemanalSemanaConsultada');
      var weekBoxPeriodEl    = document.getElementById('metaSemanalWeekBoxPeriod');
      var weekBoxPercentEl   = document.getElementById('metaSemanalWeekBoxPercentValue');
      var weekBoxThumbEl     = document.getElementById('metaSemanalWeekBoxThumb');
      var histBackdrop       = document.getElementById('metaSemanalHistModalBackdrop');
      var histPeriodEl       = document.getElementById('metaSemanalHistPeriodText');
      var histBodyEl         = document.getElementById('metaSemanalHistBody');
      var histFecharBtn      = document.getElementById('metaSemanalHistFecharBtn');
      var retroBackdrop      = document.getElementById('metaSemanalRetroModalBackdrop');
      var retroPeriodEl      = document.getElementById('metaSemanalRetroPeriodText');
      var retroValorInput    = document.getElementById('metaSemanalRetroValorInput');
      var retroBrutoBtn      = document.getElementById('metaRetroTipoBrutoBtn');
      var retroLiquidoBtn    = document.getElementById('metaRetroTipoLiquidoBtn');
      var retroSalvarBtn     = document.getElementById('metaSemanalRetroSalvarBtn');

      function MESES_ABBR () { return I18N.list('months.abbr'); }
      function MESES_FULL () { return I18N.list('months.lower'); }
      function TIPO_SING_OF (tipo) { return I18N.t(tipo === 'liquido' ? 'meta.liquido' : 'meta.bruto'); }

      var tipoAtual = 'bruto';
      var config = null;

      function pad2 (n) { return n < 10 ? '0' + n : String(n); }
      function dateKeyFor (d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
      function weekMonday (date) {
        var day = date.getDay();
        var diff = (day === 0) ? -6 : 1 - day;
        var monday = new Date(date.getTime());
        monday.setDate(date.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
      }
      function currentWeekKey () { return dateKeyFor(weekMonday(new Date())); }
      function storageKeyForWeek (weekKey) { return 'metaSemanalConfig:' + weekKey; }
      function zeradaKeyForWeek (weekKey) { return 'metaSemanalZerada:' + weekKey; }
      function isMetaZeradaForWeek (weekKey) {
        try { return cloudGet(zeradaKeyForWeek(weekKey)) === '1'; } catch (e) {  }
        return false;
      }
      function setMetaZeradaForWeek (weekKey, zerada) {
        try {
          if (zerada) cloudSet(zeradaKeyForWeek(weekKey), '1');
          else cloudRemove(zeradaKeyForWeek(weekKey));
        } catch (e) {  }
      }

      // Persistência da meta entre semanas. A meta é guardada por semana
      // (metaSemanalConfig:<segunda>), para que o histórico de cada semana
      // fique intacto. Ao começar uma semana nova sem meta própria, a meta
      // da semana anterior é copiada para ela até o utilizador confirmar a
      // decisão no aviso. Só a semana imediatamente anterior pode ser
      // herdada: metas antigas não devem reaparecer depois de uma semana
      // sem meta.
      var metaMantidaDaSemanaAnterior = null;
      function carryOverMetaFromPreviousWeeks () {
        var monday = weekMonday(new Date());
        var previousMonday = new Date(monday.getTime());
        previousMonday.setDate(monday.getDate() - 7);
        var key = dateKeyFor(previousMonday);
        if (isMetaZeradaForWeek(key)) return null;
        try {
          var raw = cloudGet(storageKeyForWeek(key));
          if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && !parsed.retroativa && typeof parsed.valor === 'number' && parsed.valor > 0) {
              return { valor: parsed.valor, tipo: (parsed.tipo === 'liquido') ? 'liquido' : 'bruto', percent: 0 };
            }
          }
        } catch (e) {  }
        return null;
      }

      function formatWeekPeriodLabel (monday) {
        var sunday = new Date(monday.getTime());
        sunday.setDate(monday.getDate() + 6);
        var startDay = monday.getDate();
        var endDay = sunday.getDate();
        var startMonth = MESES_ABBR()[monday.getMonth()];
        var endMonth = MESES_ABBR()[sunday.getMonth()];
        if (monday.getMonth() === sunday.getMonth()) {
          return I18N.t('fmt.rangeSameMonthDot', { d1: startDay, d2: endDay, m: endMonth });
        }
        return I18N.t('fmt.rangeCrossMonthDot', { d1: startDay, m1: startMonth, d2: endDay, m2: endMonth });
      }

      function renderPeriodLabel () {
        if (periodLabel) periodLabel.textContent = formatWeekPeriodLabel(weekMonday(new Date()));
      }

      // Período bem reduzido, usado dentro do retângulo lateral (ex: "14–20 set").
      function formatWeekPeriodCompact (monday) {
        var sunday = new Date(monday.getTime());
        sunday.setDate(monday.getDate() + 6);
        var startDay = monday.getDate();
        var endDay = sunday.getDate();
        if (monday.getMonth() === sunday.getMonth()) {
          return I18N.t('fmt.compactSameMonth', { d1: startDay, d2: endDay, m: MESES_ABBR()[sunday.getMonth()] });
        }
        return startDay + '/' + (monday.getMonth() + 1) + '–' + endDay + '/' + (sunday.getMonth() + 1);
      }

      // Período por extenso, usado no popup de detalhes da semana consultada.
      function formatWeekPeriodFull (monday) {
        var sunday = new Date(monday.getTime());
        sunday.setDate(monday.getDate() + 6);
        var startDay = monday.getDate();
        var endDay = sunday.getDate();
        var startMonth = MESES_FULL()[monday.getMonth()];
        var endMonth = MESES_FULL()[sunday.getMonth()];
        var year = sunday.getFullYear();
        if (monday.getMonth() === sunday.getMonth()) {
          return I18N.t('fmt.rangeFullSameMonth', { d1: startDay, d2: endDay, m: endMonth, y: year });
        }
        return I18N.t('fmt.rangeFullCrossMonth', { d1: startDay, m1: startMonth, d2: endDay, m2: endMonth, y: year });
      }

      function loadConfig () {
        config = null;
        try {
          var raw = cloudGet(storageKeyForWeek(currentWeekKey()));
          if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && typeof parsed.valor === 'number') {
              config = {
                valor:   parsed.valor,
                tipo:    (parsed.tipo === 'liquido') ? 'liquido' : 'bruto',
                percent: (typeof parsed.percent === 'number') ? parsed.percent : 0
              };
            }
          }
        } catch (e) {  }
      }

      function saveConfig () {
        try {
          cloudSet(storageKeyForWeek(currentWeekKey()), JSON.stringify(config));
        } catch (e) {  }
      }

      // Soma Uber+Bolt-Despesas de cada dia da semana (a partir dos
      // "badges" já salvos por dia) para saber quanto já foi alcançado da
      // meta, em bruto ou líquido conforme o tipo escolhido. Por padrão
      // calcula a semana atual, mas aceita uma segunda-feira específica
      // para consultar semanas passadas navegadas pelo calendário.
      function computeWeekEarnings (tipo, mondayRef) {
        var monday = mondayRef || weekMonday(new Date());
        var sumBruto = 0, sumDespesas = 0;
        for (var i = 0; i < 7; i++) {
          var d = new Date(monday.getTime());
          d.setDate(monday.getDate() + i);
          var b = { uber: 0, bolt: 0, despesas: 0, extras: 0 };
          try {
            var raw = cloudGet('homeBadgeValores:' + dateKeyFor(d));
            if (raw) {
              var parsed = JSON.parse(raw);
              b.uber     = Number(parsed.uber) || 0;
              b.bolt     = Number(parsed.bolt) || 0;
              b.despesas = Number(parsed.despesas) || 0;
              b.extras   = platSum(platExtrasFrom(parsed)) + ganhosExtrasBruto(parsed);
            }
          } catch (e) {  }
          sumBruto     += b.uber + b.bolt + b.extras;
          sumDespesas  += b.despesas;
        }
        return (tipo === 'liquido') ? (sumBruto - sumDespesas) : sumBruto;
      }

      function recomputePercent () {
        if (!config) return;
        var achieved = computeWeekEarnings(config.tipo);
        config.percent = (config.valor > 0) ? Math.round((achieved / config.valor) * 100) : 0;
        if (config.percent < 0) config.percent = 0;
        saveConfig();
      }

      document.addEventListener('homeBadgesSaved', function () {
        var antes = (config && typeof config.percent === 'number') ? config.percent : 0;
        recomputePercent();
        renderCurrent();
        var depois = (config && typeof config.percent === 'number') ? config.percent : 0;
        // Só comemora na transição: estava abaixo de 100% e passou a estar
        // em 100% ou mais. Assim não dispara de novo a cada lançamento
        // feito depois da meta já batida.
        if (antes < 100 && depois >= 100) {
          document.dispatchEvent(new CustomEvent('metaSemanalAtingida'));
        }
      });

      function renderCurrent () {
        var btnInner    = document.getElementById('metaSemanalBtnInner');
        var porDefinir  = document.getElementById('metaSemanalPorDefinir');
        var lapis       = document.getElementById('metaSemanalLapis');
        if (config) {
          currentText.textContent = I18N.t('meta.current', { v: config.valor, t: TIPO_LABEL_OF(config.tipo), p: config.percent });
          currentText.classList.add('is-set');
          if (percentLink) percentLink.textContent = config.percent + '%';
          if (btnInner)   btnInner.style.display   = '';
          if (porDefinir) porDefinir.style.display  = 'none';
          if (lapis)      lapis.style.display        = '';
        } else {
          currentText.textContent = I18N.t('meta.nenhuma');
          currentText.classList.remove('is-set');
          if (percentLink) percentLink.textContent = '0%';
          if (btnInner)   btnInner.style.display   = 'none';
          if (porDefinir) porDefinir.style.display  = '';
          if (lapis)      lapis.style.display        = 'none';
        }
        window.getMetaSemanalConfig = function () { return config; };
        document.dispatchEvent(new CustomEvent('metaSemanalConfigChanged', { detail: config }));
      }

      // ---- Popup exclusivo do aviso automático de início de semana ----
      // A meta anterior é mantida de imediato, para que fechar o popup não
      // a apague. O utilizador pode confirmar essa escolha ou zerar a meta.
      var welcomeModalBackdrop  = document.getElementById('metaSemanalWelcomeModalBackdrop');
      var welcomeModalText      = document.getElementById('metaSemanalWelcomeModalText');
      var welcomeManterBtn      = document.getElementById('metaWelcomeManterBtn');
      var welcomeZerarBtn       = document.getElementById('metaWelcomeZerarBtn');
      var welcomeSalvarBtn      = document.getElementById('metaSemanalWelcomeSalvarBtn');

      function renderWelcomeMeta () {
        var selManter = (welcomeMetaEscolha === 'manter');
        if (welcomeManterBtn) {
          welcomeManterBtn.classList.toggle('active', selManter);
          welcomeManterBtn.setAttribute('aria-pressed', selManter ? 'true' : 'false');
        }
        if (welcomeZerarBtn) {
          welcomeZerarBtn.classList.toggle('active', !selManter);
          welcomeZerarBtn.setAttribute('aria-pressed', (!selManter) ? 'true' : 'false');
        }
      }

      var welcomeMetaEscolha = 'manter';

      if (welcomeManterBtn) {
        welcomeManterBtn.addEventListener('click', function () {
          welcomeMetaEscolha = 'manter';
          renderWelcomeMeta();
        });
      }
      if (welcomeZerarBtn) {
        welcomeZerarBtn.addEventListener('click', function () {
          welcomeMetaEscolha = 'zerar';
          renderWelcomeMeta();
        });
      }

      function openWelcomeModal () {
        if (!welcomeModalBackdrop) return;
        if (welcomeModalText) {
          if (metaMantidaDaSemanaAnterior) {
            var m = metaMantidaDaSemanaAnterior;
            welcomeModalText.textContent = I18N.t('meta.welcomeKept', { v: m.valor, t: TIPO_LABEL_OF(m.tipo) });
          } else {
            welcomeModalText.textContent = I18N.t('meta.welcome');
          }
        }
        welcomeMetaEscolha = 'manter';
        renderWelcomeMeta();
        closeAllOverlays();
        welcomeModalBackdrop.classList.add('visible');
      }
      function closeWelcomeModal (aplicar) {
        // Se fechar sem escolha, a meta já copiada é conservada. Só "Zerar"
        // confirmado remove a meta da semana atual.
        if (aplicar && welcomeMetaEscolha === 'zerar') {
          config = null;
          try { cloudRemove(storageKeyForWeek(currentWeekKey())); } catch (e) {  }
          setMetaZeradaForWeek(currentWeekKey(), true);
          metaMantidaDaSemanaAnterior = null;
          renderCurrent();
        }
        if (welcomeModalBackdrop) welcomeModalBackdrop.classList.remove('visible');
      }

      if (welcomeSalvarBtn) welcomeSalvarBtn.addEventListener('click', function () { closeWelcomeModal(true); });
      if (welcomeModalBackdrop) {
        welcomeModalBackdrop.addEventListener('click', function (e) {
          if (e.target === welcomeModalBackdrop) closeWelcomeModal(false);
        });
      }

      window.MetaSemanalWelcomeModal = { open: openWelcomeModal, close: function () { closeWelcomeModal(false); } };

      function setTipo (tipo) {
        tipoAtual = tipo;
        var isBruto = tipo === 'bruto';
        btnBruto.classList.toggle('active', isBruto);
        btnBruto.setAttribute('aria-pressed', isBruto ? 'true' : 'false');
        btnLiquido.classList.toggle('active', !isBruto);
        btnLiquido.setAttribute('aria-pressed', !isBruto ? 'true' : 'false');
      }

      btnBruto.addEventListener('click', function () { setTipo('bruto'); });
      btnLiquido.addEventListener('click', function () { setTipo('liquido'); });

      function sanitizeGoalInput (input) {
        var value = input.value.replace(/[^0-9.,]/g, '');
        var firstSep = value.search(/[.,]/);
        if (firstSep !== -1) {
          value = value.slice(0, firstSep + 1) + value.slice(firstSep + 1).replace(/[.,]/g, '');
        }
        var numeric = parseFloat(value.replace(',', '.'));
        if (!isNaN(numeric) && numeric > 999.99) {
          value = value.includes(',') ? '999,99' : '999.99';
        }
        input.value = value;
      }

      valorInput.addEventListener('input', function () {
        sanitizeGoalInput(valorInput);
      });

      salvarBtn.addEventListener('click', function () {
        var valorNum = parseFloat(valorInput.value.replace(',', '.'));
        if (isNaN(valorNum) || valorNum <= 0) return;
        if (valorNum > 999.99) valorNum = 999.99;

        config = {
          valor:   valorNum,
          tipo:    tipoAtual,
          percent: config ? config.percent : 0
        };
        setMetaZeradaForWeek(currentWeekKey(), false);
        metaMantidaDaSemanaAnterior = null;
        recomputePercent();
        renderCurrent();
        hideWelcome();

        valorInput.value = '';
        if (window.MetaSemanalModal) window.MetaSemanalModal.close();
      });

      if (zerarBtn) {
        zerarBtn.addEventListener('click', function () {
          config = null;
          try { cloudRemove(storageKeyForWeek(currentWeekKey())); } catch (e) {  }
          setMetaZeradaForWeek(currentWeekKey(), true);
          metaMantidaDaSemanaAnterior = null;
          valorInput.value = '';
          setTipo('bruto');
          renderCurrent();
        });
      }

      loadConfig();
      if (!config && !isMetaZeradaForWeek(currentWeekKey())) {
        var herdada = carryOverMetaFromPreviousWeeks();
        if (herdada) {
          config = herdada;
          metaMantidaDaSemanaAnterior = { valor: herdada.valor, tipo: herdada.tipo };
          saveConfig();
        }
      }
      recomputePercent();
      setTipo(config ? config.tipo : 'bruto');
      renderCurrent();
      renderPeriodLabel();

      function showWelcome () {
        if (welcomeText) {
          if (metaMantidaDaSemanaAnterior) {
            var m = metaMantidaDaSemanaAnterior;
            welcomeText.textContent = I18N.t('meta.welcomeKept', { v: m.valor, t: TIPO_LABEL_OF(m.tipo) });
          } else {
            welcomeText.textContent = I18N.t('meta.welcome');
          }
          welcomeText.classList.add('visible');
        }
      }
      function hideWelcome () {
        if (welcomeText) welcomeText.classList.remove('visible');
      }

      if (triggerBtn) triggerBtn.addEventListener('click', hideWelcome);

      // Semana em que a app foi carregada. Usada para detetar que uma nova
      // semana começou enquanto a app ficou em memória (segundo plano).
      var weekKeyAtLoad = currentWeekKey();

      function maybePromptNewWeek () {
        // Se a app está em segundo plano (ex.: pré-carregada), não gasta o
        // "primeiro acesso da semana" — o aviso fica para quando o
        // utilizador realmente a abrir (ver onAppResumed abaixo).
        if (document.visibilityState === 'hidden') return;

        var weekKey = currentWeekKey();
        if (!metaMantidaDaSemanaAnterior) return;
        var lastPrompted = null;
        try { lastPrompted = cloudGet(LAST_PROMPT_KEY); } catch (e) {  }
        if (lastPrompted === weekKey) return;

        try { cloudSet(LAST_PROMPT_KEY, weekKey); } catch (e) {  }

        openWelcomeModal();
      }

      // Em telemóvel a app quase nunca é "iniciada do zero": ela volta do
      // segundo plano. Sem isto, o aviso de nova semana (meta + Manter/Zerar
      // despesas fixas) só aparecia se o script fosse recarregado.
      function onAppResumed () {
        if (document.visibilityState === 'hidden') return;
        if (currentWeekKey() !== weekKeyAtLoad) {
          // Virou a semana com a app em memória: recarrega para recalcular
          // meta, período e despesas fixas; o aviso aparece no carregamento.
          window.location.reload();
          return;
        }
        maybePromptNewWeek();
      }
      document.addEventListener('visibilitychange', onAppResumed);
      window.addEventListener('pageshow', onAppResumed);
      window.addEventListener('focus', onAppResumed);
      document.addEventListener('resume', onAppResumed, false);

      maybePromptNewWeek();

      // ---- Retângulo lateral: dados da semana sendo consultada no
      // calendário, quando diferente da semana atual. O lado direito do
      // card (btnMetaSemanal) continua sempre se referindo à semana
      // atual de verdade, independente da navegação. ----
      function loadConfigForWeekKey (weekKey) {
        try {
          var raw = cloudGet(storageKeyForWeek(weekKey));
          if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && typeof parsed.valor === 'number') {
              return { valor: parsed.valor, tipo: (parsed.tipo === 'liquido') ? 'liquido' : 'bruto', retroativa: !!parsed.retroativa };
            }
          }
        } catch (e) {  }
        return null;
      }

      function renderWeekBox () {
        if (!weekBoxEl || !cardEl) return;
        var browsedDate   = (window.GanhosDate && typeof window.GanhosDate.get === 'function') ? window.GanhosDate.get() : new Date();
        var browsedMonday = weekMonday(browsedDate);
        var todayMonday    = weekMonday(new Date());
        var isOutraSemana  = dateKeyFor(browsedMonday) !== dateKeyFor(todayMonday);

        cardEl.classList.toggle('has-week-split', isOutraSemana);
        weekBoxEl.hidden = !isOutraSemana;
        if (!isOutraSemana) return;

        var weekKey = dateKeyFor(browsedMonday);
        var cfg = loadConfigForWeekKey(weekKey);

        if (weekBoxPeriodEl) weekBoxPeriodEl.textContent = formatWeekPeriodCompact(browsedMonday);
        if (weekBoxBtn) weekBoxBtn.classList.remove('is-below', 'is-above', 'is-undefined');

        if (!cfg) {
          if (weekBoxPercentEl) weekBoxPercentEl.textContent = I18N.t('metacard.porDefinir');
          if (weekBoxThumbEl) weekBoxThumbEl.textContent = '→';
          if (weekBoxBtn) {
            weekBoxBtn.classList.add('is-undefined');
            weekBoxBtn.setAttribute('aria-label', I18N.t('metacard.porDefinir'));
          }
        } else {
          var achieved = computeWeekEarnings(cfg.tipo, browsedMonday);
          var percent  = (cfg.valor > 0) ? Math.round((achieved / cfg.valor) * 100) : 0;
          if (percent < 0) percent = 0;
          if (weekBoxPercentEl) weekBoxPercentEl.textContent = percent + '%';
          if (weekBoxThumbEl) weekBoxThumbEl.textContent = (percent >= 100) ? '👍' : '👎';
          if (weekBoxBtn) {
            weekBoxBtn.classList.add(percent >= 100 ? 'is-above' : 'is-below');
            weekBoxBtn.removeAttribute('aria-label');
          }
        }

        if (weekBoxBtn) weekBoxBtn.__weekData = { monday: browsedMonday, cfg: cfg };
      }

      function populateHistModal (monday, cfg) {
        if (histPeriodEl) histPeriodEl.textContent = formatWeekPeriodFull(monday);
        if (!histBodyEl) return;

        if (!cfg) {
          histBodyEl.innerHTML = '<p class="meta-semanal-hist-line">' + I18N.t('meta.histNaoDefinida') + '</p>';
          return;
        }

        var achieved = computeWeekEarnings(cfg.tipo, monday);
        var percent  = (cfg.valor > 0) ? Math.round((achieved / cfg.valor) * 100) : 0;
        if (percent < 0) percent = 0;
        var label = TIPO_SING_OF(cfg.tipo);
        var atingiu = percent >= 100;
        var statusTxt = atingiu
          ? I18N.t('meta.histAcima', { p: percent })
          : I18N.t('meta.histAbaixo', { p: percent });

        histBodyEl.innerHTML =
          '<p class="meta-semanal-hist-line"><strong>' + I18N.t('meta.histDefinida') + '</strong> ' + cfg.valor.toFixed(2) + ' € ' + label + '</p>' +
          '<p class="meta-semanal-hist-line"><strong>' + I18N.t('meta.histGanho') + '</strong> ' + achieved.toFixed(2) + ' € ' + label + '</p>' +
          '<p class="meta-semanal-hist-line meta-semanal-hist-status' + (atingiu ? '' : ' is-below') + '">' + statusTxt + '</p>';
      }

      function openHistModal () {
        if (!histBackdrop) return;
        if (window.closeAllOverlays) window.closeAllOverlays();
        histBackdrop.classList.add('visible');
      }
      function closeHistModal () {
        if (histBackdrop) histBackdrop.classList.remove('visible');
      }

      var retroTipoAtual = 'bruto';
      var retroWeekKey = null;
      function setRetroTipo (tipo) {
        retroTipoAtual = tipo;
        var isBruto = tipo === 'bruto';
        if (retroBrutoBtn) {
          retroBrutoBtn.classList.toggle('active', isBruto);
          retroBrutoBtn.setAttribute('aria-pressed', isBruto ? 'true' : 'false');
        }
        if (retroLiquidoBtn) {
          retroLiquidoBtn.classList.toggle('active', !isBruto);
          retroLiquidoBtn.setAttribute('aria-pressed', !isBruto ? 'true' : 'false');
        }
      }
      function openRetroModal (monday) {
        if (!retroBackdrop || !monday) return;
        retroWeekKey = dateKeyFor(monday);
        if (retroPeriodEl) retroPeriodEl.textContent = formatWeekPeriodFull(monday);
        if (retroValorInput) retroValorInput.value = '';
        setRetroTipo('bruto');
        if (window.closeAllOverlays) window.closeAllOverlays();
        retroBackdrop.classList.add('visible');
      }
      function closeRetroModal () {
        if (retroBackdrop) retroBackdrop.classList.remove('visible');
        retroWeekKey = null;
      }

      if (retroBrutoBtn) retroBrutoBtn.addEventListener('click', function () { setRetroTipo('bruto'); });
      if (retroLiquidoBtn) retroLiquidoBtn.addEventListener('click', function () { setRetroTipo('liquido'); });
      if (retroValorInput) retroValorInput.addEventListener('input', function () { sanitizeGoalInput(retroValorInput); });
      if (retroSalvarBtn) retroSalvarBtn.addEventListener('click', function () {
        if (!retroWeekKey || !retroValorInput) return;
        var valorNum = parseFloat(retroValorInput.value.replace(',', '.'));
        if (isNaN(valorNum) || valorNum <= 0) return;
        if (valorNum > 999.99) valorNum = 999.99;
        try {
          cloudSet(storageKeyForWeek(retroWeekKey), JSON.stringify({ valor: valorNum, tipo: retroTipoAtual, percent: 0, retroativa: true }));
          setMetaZeradaForWeek(retroWeekKey, false);
        } catch (e) { return; }
        closeRetroModal();
        renderWeekBox();
      });
      if (retroBackdrop) {
        retroBackdrop.addEventListener('click', function (e) {
          if (e.target === retroBackdrop) closeRetroModal();
        });
      }

      // Presentation-only access to the existing weekly goal and history.
      window.MetaSemanalRead = {
        forDate: function (date) {
          var monday = weekMonday(date);
          var cfg = loadConfigForWeekKey(dateKeyFor(monday));
          var achieved = cfg ? computeWeekEarnings(cfg.tipo, monday) : 0;
          return { monday: monday, config: cfg, achieved: achieved,
            percent: cfg && cfg.valor > 0 ? Math.max(0, Math.round(achieved / cfg.valor * 100)) : 0,
            current: dateKeyFor(monday) === dateKeyFor(weekMonday(new Date())) };
        },
        openHistory: function (date) {
          var monday = weekMonday(date);
          populateHistModal(monday, loadConfigForWeekKey(dateKeyFor(monday)));
          openHistModal();
        }
      };

      if (weekBoxBtn) {
        weekBoxBtn.addEventListener('click', function () {
          var data = weekBoxBtn.__weekData;
          if (!data) return;
          if (!data.cfg) {
            openRetroModal(data.monday);
            return;
          }
          populateHistModal(data.monday, data.cfg);
          openHistModal();
        });
      }
      if (histFecharBtn) histFecharBtn.addEventListener('click', closeHistModal);
      if (histBackdrop) {
        histBackdrop.addEventListener('click', function (e) {
          if (e.target === histBackdrop) closeHistModal();
        });
      }
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && histBackdrop && histBackdrop.classList.contains('visible')) closeHistModal();
        if (e.key === 'Escape' && retroBackdrop && retroBackdrop.classList.contains('visible')) closeRetroModal();
      });
      document.addEventListener('smartSomaTransientStateReset', function () {
        closeHistModal();
        closeRetroModal();
        if (window.MetaSemanalWelcomeModal) window.MetaSemanalWelcomeModal.close();
      });

      renderWeekBox();
      if (window.GanhosDate && typeof window.GanhosDate.onChange === 'function') {
        window.GanhosDate.onChange(renderWeekBox);
      }
      document.addEventListener('homeBadgesSaved', renderWeekBox);

      // Troca de idioma: redesenha tudo o que este módulo escreve no ecrã.
      document.addEventListener('languageChanged', function () {
        renderCurrent();
        renderPeriodLabel();
        renderWeekBox();
      });
    })();



    (function () {
      var allBackdrops = Array.prototype.slice.call(document.querySelectorAll('.mm-backdrop'));

      function isNested (backdrop) {
        return backdrop.getAttribute('data-mm-nested') === 'true';
      }

      function closeOtherBackdrops (current) {
        allBackdrops.forEach(function (other) {
          if (other !== current && other.classList.contains('visible')) {
            other.classList.remove('visible');
          }
        });
      }

      allBackdrops.forEach(function (backdrop) {
        var observer = new MutationObserver(function (mutations) {
          for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].attributeName === 'class') {
              if (backdrop.classList.contains('visible')) {
                if (!isNested(backdrop)) closeOtherBackdrops(backdrop);
              }
              if (typeof syncBodyScroll === 'function') syncBodyScroll();
              break;
            }
          }
        });
        observer.observe(backdrop, { attributes: true, attributeFilter: ['class'] });
      });
    })();



    (function () {
      function MESES_MINUS () { return I18N.list('months.lower'); }

      var periodChips   = document.querySelectorAll('.period-chip');
      var periodLabelEl = document.getElementById('periodLabel');
      var currentWeekPeriodEl = document.getElementById('resumoCurrentWeekPeriod');
      var prevBtn       = document.getElementById('periodNavPrev');
      var nextBtn       = document.getElementById('periodNavNext');

      var refDate = todayAtMidnight();

      function capitalize (s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
      }

      function todayAtMidnight () {
        var t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
      }

      function getWeekRange (date) {
        var day = date.getDay();
        var diffToMonday = (day === 0) ? -6 : 1 - day;
        var monday = new Date(date.getTime());
        monday.setDate(date.getDate() + diffToMonday);
        var sunday = new Date(monday.getTime());
        sunday.setDate(monday.getDate() + 6);
        return { monday: monday, sunday: sunday };
      }

      function formatDiaLabel (d) {
        return d.getDate() + ' ' + capitalize(MESES_MINUS()[d.getMonth()].slice(0, 3));
      }

      function formatSemanaLabel (d) {
        var range = getWeekRange(d);
        var firstMonth = capitalize(MESES_MINUS()[range.monday.getMonth()].slice(0, 3));
        var lastMonth = capitalize(MESES_MINUS()[range.sunday.getMonth()].slice(0, 3));
        if (range.monday.getMonth() === range.sunday.getMonth()) {
          return range.monday.getDate() + ' a ' + range.sunday.getDate() + ' ' + firstMonth;
        }
        return range.monday.getDate() + ' ' + firstMonth + ' a ' + range.sunday.getDate() + ' ' + lastMonth;
      }

      function formatCurrentWeekLabel () {
        var range = getWeekRange(todayAtMidnight());
        var firstMonth = MESES_MINUS()[range.monday.getMonth()];
        var lastMonth = MESES_MINUS()[range.sunday.getMonth()];
        if (range.monday.getMonth() === range.sunday.getMonth()) {
          return range.monday.getDate() + ' a ' + range.sunday.getDate() + ' de ' + firstMonth;
        }
        return range.monday.getDate() + ' de ' + firstMonth + ' a ' + range.sunday.getDate() + ' de ' + lastMonth;
      }

      function formatMesLabel (d) {
        return capitalize(MESES_MINUS()[d.getMonth()].slice(0, 3)) + ' ' + d.getFullYear();
      }

      function currentPeriod () {
        var selected = document.querySelector('.period-chip.selected');
        return selected ? selected.getAttribute('data-period') : 'dia';
      }

      function renderLabel () {
        var period = currentPeriod();
        if (currentWeekPeriodEl) currentWeekPeriodEl.textContent = formatCurrentWeekLabel();
        if (period === 'dia')    periodLabelEl.textContent = formatDiaLabel(refDate);
        if (period === 'semana') periodLabelEl.textContent = formatSemanaLabel(refDate);
        if (period === 'mes')    periodLabelEl.textContent = formatMesLabel(refDate);
      }

      function isAtCurrentPeriod () {
        var today  = todayAtMidnight();
        var period = currentPeriod();
        if (period === 'dia') {
          return refDate.getTime() === today.getTime();
        }
        if (period === 'semana') {
          return getWeekRange(refDate).monday.getTime() === getWeekRange(today).monday.getTime();
        }
        if (period === 'mes') {
          return refDate.getFullYear() === today.getFullYear() && refDate.getMonth() === today.getMonth();
        }
        return true;
      }

      function updateNavButtons () {
        nextBtn.disabled = isAtCurrentPeriod();
      }

      function refresh () {
        renderLabel();
        updateNavButtons();
      }

      function updatePeriodLabel (period) {
        refDate = todayAtMidnight();
        refresh();
      }

      function step (direction) {
        var period  = currentPeriod();
        var newDate = new Date(refDate.getTime());
        if (period === 'dia')    newDate.setDate(newDate.getDate() + direction);
        if (period === 'semana') newDate.setDate(newDate.getDate() + direction * 7);
        if (period === 'mes')    newDate.setMonth(newDate.getMonth() + direction);

        if (direction > 0 && isAtCurrentPeriod()) return;

        refDate = newDate;
        refresh();
      }

      prevBtn.addEventListener('click', function () { step(-1); });
      nextBtn.addEventListener('click', function () { step(1); });
      periodLabelEl.addEventListener('click', function () {
        if (!window.GanhosDate || typeof window.GanhosDate.pick !== 'function') return;
        window.GanhosDate.pick(refDate, function (date) {
          refDate = new Date(date);
          refDate.setHours(0, 0, 0, 0);
          refresh();
          document.dispatchEvent(new CustomEvent('resumoPeriodChanged'));
        });
      });

      periodChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          periodChips.forEach(function (c) {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
          });
          chip.classList.add('selected');
          chip.setAttribute('aria-pressed', 'true');
          refDate = todayAtMidnight();
          refresh();
        });
      });

      refresh();
      document.addEventListener('languageChanged', refresh);

      function resetPeriod () {
        refDate = todayAtMidnight();
        periodChips.forEach(function (chip) {
          var selected = chip.getAttribute('data-period') === 'semana';
          chip.classList.toggle('selected', selected);
          chip.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });
        refresh();
        document.dispatchEvent(new CustomEvent('resumoPeriodChanged'));
      }

      window.ResumoPeriod = { update: updatePeriodLabel, reset: resetPeriod, getWeekRange: getWeekRange, getRefDate: function () { return refDate; } };

      // ---- Preenche os valores reais (Bruto, Despesas, Distância,
      // Líquido) do card de Resumo, de acordo com o período selecionado
      // (Dia / Semana / Mês) e a data de referência navegada acima.
      // Antes estes campos ficavam sempre travados em 0.00 € / 0.0 km.
      (function () {
        var brutoEl     = document.getElementById('summaryBrutoValue');
        var despesasEl  = document.getElementById('summaryDespesasValue');
        var distanciaEl = document.getElementById('summaryDistanciaValue');
        var liquidoEl   = document.getElementById('summaryLiquidoValue');
        if (!brutoEl) return;

        function pad2 (n) { return n < 10 ? '0' + n : String(n); }
        function dateKeyFor (d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
        function formatEuro (v) { return Number(v).toFixed(2) + ' €'; }
        function formatKm (v) {
          var n = Number(v);
          var str = (Math.round(n * 10) / 10).toString();
          return str + ' km';
        }

        function loadDayBadges (d) {
          var badges = { uber: 0, bolt: 0, despesas: 0, distancia: 0 };
          badges.plat = {}; badges.extras = 0;
          try {
            var raw = cloudGet('homeBadgeValores:' + dateKeyFor(d));
            if (raw) {
              var parsed = JSON.parse(raw);
              for (var k in badges) {
                if (parsed && typeof parsed[k] === 'number') badges[k] = parsed[k];
              }
              badges.plat = platExtrasFrom(parsed);
              badges.extras = platSum(badges.plat) + ganhosExtrasBruto(parsed);
            }
          } catch (e) {  }
          return badges;
        }

        function daysForPeriod (period, date) {
          var days = [];
          if (period === 'dia') {
            days.push(date);
          } else if (period === 'semana') {
            var range = getWeekRange(date);
            for (var i = 0; i < 7; i++) {
              var d = new Date(range.monday.getTime());
              d.setDate(range.monday.getDate() + i);
              days.push(d);
            }
          } else if (period === 'mes') {
            var year = date.getFullYear(), month = date.getMonth();
            var lastDay = new Date(year, month + 1, 0).getDate();
            for (var dd = 1; dd <= lastDay; dd++) {
              days.push(new Date(year, month, dd));
            }
          }
          return days;
        }

        function refreshSummary () {
          var period = currentPeriod();
          var days = daysForPeriod(period, refDate);

          var sumBruto = 0, sumDespesas = 0, sumKm = 0;
          days.forEach(function (d) {
            var b = loadDayBadges(d);
            sumBruto    += b.uber + b.bolt + b.extras;
            sumDespesas += b.despesas;
            sumKm       += b.distancia;
          });
          var sumLiquido = sumBruto - sumDespesas;

          if (brutoEl)     brutoEl.textContent = formatEuro(sumBruto);
          if (despesasEl)  despesasEl.textContent = formatEuro(sumDespesas);
          if (distanciaEl) distanciaEl.textContent = formatKm(sumKm);
          if (liquidoEl)   liquidoEl.textContent = formatEuro(sumLiquido);
        }

        periodChips.forEach(function (chip) {
          chip.addEventListener('click', refreshSummary);
        });
        prevBtn.addEventListener('click', refreshSummary);
        nextBtn.addEventListener('click', refreshSummary);
        document.addEventListener('homeBadgesSaved', refreshSummary);

        refreshSummary();
        window.ResumoSummary = { refresh: refreshSummary };
      })();
    })();

    (function () {
      var dashMainRow      = document.getElementById('dashMainRow');
      var dashMetaPanel    = document.getElementById('dashMetaPanel');
      var dashMetaFilled   = document.getElementById('dashMetaFilled');
      var dashMetaValue    = document.getElementById('dashMetaGoalValue');
      var dashMetaPercent  = document.getElementById('dashMetaPercentText');
      var mainInner        = document.querySelector('.dash-main-inner');
      var swapTile         = document.getElementById('dashSwapTile');
      var liquidoIcon      = document.getElementById('dashLiquidoIcon');
      var liquidoLabel     = document.getElementById('dashLiquidoLabel');
      var liquidoValue     = document.getElementById('summaryLiquidoValue');
      var brutoIcon        = document.getElementById('dashBrutoIcon');
      var brutoLabel       = document.getElementById('dashBrutoLabel');
      var brutoValue       = document.getElementById('summaryBrutoValue');
      var swapTicks        = swapTile ? swapTile.querySelector('.dash-tile-ticks') : null;
      if (!dashMainRow || !mainInner || !swapTile) return;

      function TIPO_TITLE_OF (tipo) { return I18N.t(tipo === 'liquido' ? 'meta.liquidos' : 'meta.brutos'); }

      function getConfig () {
        return (typeof window.getMetaSemanalConfig === 'function') ? window.getMetaSemanalConfig() : null;
      }

      function formatValor (n) {
        var rounded = Math.round(n * 100) / 100;
        if (rounded % 1 === 0) return String(rounded);
        return rounded.toFixed(2).replace('.', ',').replace(/0$/, '');
      }

      // Ao mover os elementos entre o "gauge" central (posição principal)
      // e o tile pequeno (posição secundária, ao lado de Despesas), suas
      // classes de tamanho/estilo precisam ser trocadas junto — do
      // contrário o elemento carrega a formatação de onde nasceu no HTML
      // (ex: Líquido sempre com a fonte grande do gauge, mesmo dentro do
      // tile pequeno), causando tamanhos inconsistentes.
      function setMainMetricClasses (icon, label, value) {
        icon.className  = 'dash-main-icon';
        label.className = 'dash-main-label';
        value.className = 'dash-main-value';
      }
      function setTileMetricClasses (icon, label, value) {
        icon.className  = 'dash-tile-icon';
        label.className = 'dash-tile-label';
        value.className = 'dash-tile-value';
      }

      function applyMetricLayout (metric) {
        if (metric === 'bruto') {
          mainInner.appendChild(brutoIcon);
          mainInner.appendChild(brutoLabel);
          mainInner.appendChild(brutoValue);
          setMainMetricClasses(brutoIcon, brutoLabel, brutoValue);

          swapTile.appendChild(liquidoIcon);
          swapTile.appendChild(liquidoLabel);
          swapTile.appendChild(liquidoValue);
          setTileMetricClasses(liquidoIcon, liquidoLabel, liquidoValue);
          if (swapTicks) swapTile.appendChild(swapTicks);
          swapTile.classList.remove('dash-tile-bruto');
          swapTile.classList.add('dash-tile-liquido');
        } else {
          mainInner.appendChild(liquidoIcon);
          mainInner.appendChild(liquidoLabel);
          mainInner.appendChild(liquidoValue);
          setMainMetricClasses(liquidoIcon, liquidoLabel, liquidoValue);

          swapTile.appendChild(brutoIcon);
          swapTile.appendChild(brutoLabel);
          swapTile.appendChild(brutoValue);
          setTileMetricClasses(brutoIcon, brutoLabel, brutoValue);
          if (swapTicks) swapTile.appendChild(swapTicks);
          swapTile.classList.remove('dash-tile-liquido');
          swapTile.classList.add('dash-tile-bruto');
        }
      }

      function applyMetricFromConfig () {
        var config = getConfig();
        applyMetricLayout((config && config.tipo === 'bruto') ? 'bruto' : 'liquido');
      }

      function isSemanaSelected () {
        var selected = document.querySelector('.period-chip.selected');
        return !!selected && selected.getAttribute('data-period') === 'semana';
      }

      var ringProgress = document.getElementById('dashRingProgress');
      var RING_CIRCUMFERENCE = 327;

      function updateRing (percent) {
        if (!ringProgress) return;
        var clamped = Math.max(0, Math.min(100, percent));
        var offset = RING_CIRCUMFERENCE * (1 - clamped / 100);
        ringProgress.style.strokeDashoffset = String(offset);
      }

      function renderMetaPanelContent () {
        var config = getConfig();
        if (dashMetaFilled) dashMetaFilled.hidden = false;
        if (!config) {
          if (dashMetaValue) {
            dashMetaValue.textContent = I18N.t('resumo.definir');
            dashMetaValue.classList.add('is-empty');
          }
          if (dashMetaPercent) {
            dashMetaPercent.textContent = I18N.t('resumo.percentConcluida', { p: 0 });
            dashMetaPercent.classList.remove('is-success');
            dashMetaPercent.classList.add('is-pending');
          }
          updateRing(0);
          return;
        }
        if (dashMetaValue) {
          dashMetaValue.classList.remove('is-empty');
          dashMetaValue.textContent = formatValor(config.valor) + ' € ' + TIPO_TITLE_OF(config.tipo);
        }
        if (dashMetaPercent) {
          var percent = (typeof config.percent === 'number') ? config.percent : 0;
          dashMetaPercent.textContent = I18N.t('resumo.percentConcluida', { p: percent });
          dashMetaPercent.classList.toggle('is-success', percent >= 100);
          dashMetaPercent.classList.toggle('is-pending', percent < 100);
          updateRing(percent);
        }
      }

      if (dashMetaValue) {
        dashMetaValue.addEventListener('click', function () {
          if (!getConfig() && window.MetaSemanalModal) window.MetaSemanalModal.open();
        });
      }

      function refreshPeriodVisibility () {
        var semana = isSemanaSelected();
        dashMainRow.classList.toggle('has-meta', semana);
        if (dashMetaPanel) dashMetaPanel.hidden = !semana;
        if (semana) renderMetaPanelContent();
      }

      document.querySelectorAll('.period-chip').forEach(function (chip) {
        chip.addEventListener('click', refreshPeriodVisibility);
      });

      document.addEventListener('metaSemanalConfigChanged', function () {
        applyMetricFromConfig();
        refreshPeriodVisibility();
      });

      applyMetricFromConfig();
      refreshPeriodVisibility();
      document.addEventListener('languageChanged', refreshPeriodVisibility);
    })();

    (function () {
      var BADGES_STORAGE_PREFIX = 'homeBadgeValores:';

      function pad2 (n) { return n < 10 ? '0' + n : String(n); }

      function dateKey (d) {
        var ref = d || (window.GanhosDate ? window.GanhosDate.get() : new Date());
        return ref.getFullYear() + '-' + pad2(ref.getMonth() + 1) + '-' + pad2(ref.getDate());
      }

      var badges = { uber: 0, bolt: 0, despesas: 0, distancia: 0, plat: {}, ganhosExtras: [] };

      function loadBadges () {
        badges = { uber: 0, bolt: 0, despesas: 0, distancia: 0, plat: {}, ganhosExtras: [] };
        try {
          var raw = cloudGet(BADGES_STORAGE_PREFIX + dateKey());
          if (raw) {
            var parsed = JSON.parse(raw);
            for (var k in badges) {
              if (k !== 'plat' && parsed && typeof parsed[k] === 'number') badges[k] = parsed[k];
            }
            badges.plat = platExtrasFrom(parsed);
            badges.ganhosExtras = ganhosExtrasFrom(parsed);
          }
        } catch (e) {  }
      }

      function saveBadges () {
        try {
          cloudSet(BADGES_STORAGE_PREFIX + dateKey(), JSON.stringify(badges));
        } catch (e) {  }
        try {
          document.dispatchEvent(new CustomEvent('homeBadgesSaved'));
        } catch (e) {  }
      }

      function saveExtrasForDate (date, mutate) {
        var key = BADGES_STORAGE_PREFIX + dateKey(date);
        var data = {};
        try { data = JSON.parse(cloudGet(key) || '{}'); } catch (e) { data = {}; }
        var extras = ganhosExtrasFrom(data);
        if (mutate(extras) === false) return false;
        data.ganhosExtras = extras;
        try { cloudSet(key, JSON.stringify(data)); } catch (e) { return false; }
        if (dateKey(date) === dateKey()) {
          badges.ganhosExtras = extras;
          renderBadges();
        }
        try { document.dispatchEvent(new CustomEvent('homeBadgesSaved')); } catch (e) { }
        return true;
      }

      function formatEuro (v) { return Number(v).toFixed(2) + ' €'; }
      function formatKm (v) {
        var n = Number(v);
        var str = (Math.round(n * 10) / 10).toString();
        return str + ' km';
      }

      function renderBadges () {
        var badgeUber      = document.getElementById('badgeUber');
        var badgeBolt      = document.getElementById('badgeBolt');
        var badgeDespesas  = document.getElementById('badgeDespesas');
        var badgeDistancia = document.getElementById('badgeDistancia');

        if (badgeUber)      badgeUber.textContent = formatEuro(badges.uber);
        if (badgeBolt)      badgeBolt.textContent = formatEuro(badges.bolt);
        if (badgeDespesas)  badgeDespesas.textContent = formatEuro(badges.despesas);
        if (badgeDistancia) badgeDistancia.textContent = formatKm(badges.distancia);
      }

      function parseValorInput (input) {
        if (!input) return NaN;
        return parseFloat(String(input.value).replace(',', '.'));
      }

      function wireSalvar (btnId, inputId, badgeKey, maxValor, closeFn) {
        var btn   = document.getElementById(btnId);
        var input = document.getElementById(inputId);
        if (!btn || !input) return;

        btn.addEventListener('click', function () {
          var valor = parseValorInput(input);
          if (isNaN(valor) || valor < 0) valor = 0;
          if (typeof maxValor === 'number' && valor > maxValor) valor = maxValor;
          badges[badgeKey] = valor;
          saveBadges();
          renderBadges();
          input.value = '';
          if (typeof closeFn === 'function') closeFn();
        });
      }

      loadBadges();
      renderBadges();

      if (window.GanhosDate && typeof window.GanhosDate.onChange === 'function') {
        window.GanhosDate.onChange(function () {
          loadBadges();
          renderBadges();
        });
      }

      wireSalvar('uberSalvarBtn', 'uberValorInput', 'uber', 999.99, function () {
        if (window.PlataformaModals && window.PlataformaModals.uber) window.PlataformaModals.uber.close();
      });
      wireSalvar('boltSalvarBtn', 'boltValorInput', 'bolt', 999.99, function () {
        if (window.PlataformaModals && window.PlataformaModals.bolt) window.PlataformaModals.bolt.close();
      });

      (function () {
        var distanciaSalvarBtn = document.getElementById('distanciaSalvarBtn');
        var distanciaValorInput = document.getElementById('distanciaValorInput');
        if (!distanciaSalvarBtn) return;

        distanciaSalvarBtn.addEventListener('click', function () {
          var valor;
          if (window.DistanciaModo && window.DistanciaModo.getModo() === 'inicio-fim') {
            valor = window.DistanciaModo.getComputedKm();
          } else {
            valor = parseValorInput(distanciaValorInput);
          }
          if (isNaN(valor) || valor < 0) valor = 0;
          if (valor > 9999) valor = 9999;
          badges.distancia = valor;
          saveBadges();
          renderBadges();
          if (window.DistanciaModo) window.DistanciaModo.resetAll();
          if (window.DetalhesModals && window.DetalhesModals.distancia) window.DetalhesModals.distancia.close();
        });
      })();

      window.HomeBadges = {
        get: function () {
          return {
            uber: badges.uber,
            bolt: badges.bolt,
            despesas: badges.despesas,
            distancia: badges.distancia
          };
        },
        // Plataformas extra (Multiplataforma): valor do dia selecionado.
        getPlat: function (id) { return Number(badges.plat[id]) || 0; },
        setPlat: function (id, valor) {
          valor = (typeof valor === 'number' && !isNaN(valor) && valor > 0) ? valor : 0;
          if (valor > 999.99) valor = 999.99;
          if (valor > 0) badges.plat[id] = valor; else delete badges.plat[id];
          saveBadges();
          renderBadges();
        },
        addGanhoExtra: function (item) {
          if (!item || !(Number(item.valor) > 0)) return false;
          badges.ganhosExtras.push({
            id: String(item.id || ('extra-' + Date.now().toString(36))),
            descricao: String(item.descricao || '').trim(),
            valor: Math.min(Number(item.valor), 999.99),
            incluidoBruto: item.incluidoBruto === true
          });
          saveBadges();
          renderBadges();
          return true;
        },
        updateGanhoExtra: function (date, id, item) {
          if (!id || !item || !(Number(item.valor) > 0)) return false;
          return saveExtrasForDate(date, function (extras) {
            var extra = extras.find(function (entry) { return entry.id === id; });
            if (!extra) return false;
            extra.descricao = String(item.descricao || '').trim();
            extra.valor = Math.min(Number(item.valor), 999.99);
            extra.incluidoBruto = item.incluidoBruto === true;
            return true;
          });
        },
        deleteGanhoExtra: function (date, id) {
          if (!id) return false;
          return saveExtrasForDate(date, function (extras) {
            var before = extras.length;
            var kept = extras.filter(function (entry) { return entry.id !== id; });
            if (kept.length === before) return false;
            extras.splice.apply(extras, [0, extras.length].concat(kept));
            return true;
          });
        },
        getGanhosExtras: function () { return ganhosExtrasFrom({ ganhosExtras: badges.ganhosExtras }); },
        reload: function () { loadBadges(); renderBadges(); },
        setDespesas: function (valor) {
          badges.despesas = (typeof valor === 'number' && !isNaN(valor)) ? valor : 0;
          saveBadges();
          renderBadges();
        }
      };
    })();



    (function () {
      // Meses e dias da semana vindos do dicionário de idiomas.
      function MESES_MINUS ()   { return I18N.list('months.lower'); }
      function MESES_ABBR ()    { return I18N.list('months.abbr'); }
      function DIAS_ABBR ()     { return I18N.list('weekday.abbr'); }
      function DIAS_FULL ()     { return I18N.list('weekday.full'); }
      var BADGES_STORAGE_PREFIX = 'homeBadgeValores:';

      var monthLabelEl     = document.getElementById('semanaMonthLabel');
      var prevBtn          = document.getElementById('semanaMonthPrev');
      var nextBtn          = document.getElementById('semanaMonthNext');
      var weeksContainer   = document.getElementById('semanaWeeksContainer');
      var listPlaceholder  = document.getElementById('semanaListPlaceholder');
      var metricSlot       = document.getElementById('semanaMetricSlot');
      var expensesSlot     = document.getElementById('semanaExpensesSlot');
      var earningsTitle    = document.getElementById('semanaEarningsTitle');
      if (!monthLabelEl || !prevBtn || !nextBtn || !weeksContainer) return;

      function pad2 (n) { return n < 10 ? '0' + n : String(n); }
      function capitalize (s) { return s.charAt(0).toUpperCase() + s.slice(1); }

      function todayAtMidnight () {
        var t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
      }

      var today = todayAtMidnight();
      var refYear  = today.getFullYear();
      var refMonth = today.getMonth();

      var weeksTrackEl    = null;
      var currentWeekIndex = 0;
      var activeTableMetric = 'financeiro';
      var currentWeekView = 'list';

      function dateKeyFor (d) {
        return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
      }

      function formatEuro (v) { return Number(v).toFixed(2) + ' €'; }
      function formatKm (v) {
        var n = Number(v);
        var str = (Math.round(n * 10) / 10).toString();
        return str + ' km';
      }
      function formatPlainNumber (v) { return Number(v || 0).toFixed(2).replace('.', ','); }
      function formatWeekPeriodNumeric (monday) {
        var sunday = new Date(monday.getTime());
        sunday.setDate(monday.getDate() + 6);
        return pad2(monday.getDate()) + '/' + pad2(monday.getMonth() + 1) + ' a ' +
          pad2(sunday.getDate()) + '/' + pad2(sunday.getMonth() + 1);
      }

      function loadDayBadges (d) {
        var badges = { uber: 0, bolt: 0, despesas: 0, distancia: 0, ganhosExtras: [] };
        badges.plat = {}; badges.extras = 0;
        try {
          var raw = cloudGet(BADGES_STORAGE_PREFIX + dateKeyFor(d));
          if (raw) {
            var parsed = JSON.parse(raw);
            for (var k in badges) {
              if (parsed && typeof parsed[k] === 'number') badges[k] = parsed[k];
            }
            badges.plat = platExtrasFrom(parsed);
            badges.ganhosExtras = ganhosExtrasFrom(parsed);
            badges.extras = platSum(badges.plat) + ganhosExtrasBruto(parsed);
          }
        } catch (e) {  }
        return badges;
      }

      var DESPESAS_DIARIAS_PREFIX = 'despesasDiarias:';
      var DESPESAS_FIXAS_KEY = 'despesasFixas';
      var DESPESAS_FIXAS_SKIP_PREFIX = 'despesasFixasSkipSemana:';

      function isFixasSkippedForWeek (monday) {
        try {
          return cloudGet(DESPESAS_FIXAS_SKIP_PREFIX + dateKeyFor(monday)) === '1';
        } catch (e) {  }
        return false;
      }
      // Cada despesa fixa só conta a partir da semana em que foi criada
      // (item.desde) e deixa de contar a partir da semana em que foi
      // excluída (item.ate), preservando o histórico de semanas passadas.
      function fixaEstaAtivaNaSemana (item, weekKey) {
        if (item && item.desde && item.desde > weekKey) return false;
        if (item && item.ate && item.ate <= weekKey) return false;
        return true;
      }
      function loadDespesasFixasAtivas (monday) {
        if (isFixasSkippedForWeek(monday)) return [];
        var weekKey = dateKeyFor(monday);
        return loadDespesasFixas().filter(function (item) { return fixaEstaAtivaNaSemana(item, weekKey); });
      }

      function loadDayItems (d) {
        try {
          var raw = cloudGet(DESPESAS_DIARIAS_PREFIX + dateKeyFor(d));
          if (raw) {
            var parsed = JSON.parse(raw);
            return (parsed && parsed.items) || [];
          }
        } catch (e) {  }
        return [];
      }

      function loadDespesasFixas () {
        try {
          var raw = cloudGet(DESPESAS_FIXAS_KEY);
          if (raw) {
            var parsed = JSON.parse(raw);
            return (parsed && parsed.items) || [];
          }
        } catch (e) {  }
        return [];
      }

      // Despesas avulsas usadas exclusivamente na apresentação da
      // faturação semanal. As despesas fixas continuam registadas e são
      // acrescentadas apenas pela leitura completa da tabela de despesas.
      function loadDayVariableExpenseEntries (d) {
        return loadDayItems(d).map(function (item) {
          return { id: item.id, descricao: item.descricao, valor: Number(item.valor) || 0, source: 'daily' };
        });
      }

      function isMonday (d) { return d.getTime() === getMonday(d).getTime(); }

      function weekGrossSoFar (monday) {
        var sum = 0;
        for (var i = 0; i < 7; i++) {
          var dd = new Date(monday.getTime());
          dd.setDate(monday.getDate() + i);
          var b = loadDayBadges(dd);
          sum += b.uber + b.bolt + b.extras;
        }
        return sum;
      }

      // Junta as despesas avulsas do dia com as despesas fixas semanais
      // (lançadas sempre na segunda-feira, e só a partir do dia em que
      // esse lançamento já aconteceu). Esta leitura completa abastece a
      // tabela dedicada de despesas e os cálculos gerais já existentes.
      function loadDayExpenseEntries (d) {
        var entradas = loadDayVariableExpenseEntries(d);

        if (isMonday(d) && d.getTime() <= today.getTime()) {
          var fixas = loadDespesasFixasAtivas(getMonday(d));
          if (fixas.length) {
            var weekGross = weekGrossSoFar(getMonday(d));
            fixas.forEach(function (item) {
              var isEuro = item.tipo === 'euro';
              var valor = isEuro ? Number(item.valor || 0) : (weekGross * (Number(item.valor || 0) / 100));
              var descricao = isEuro
                ? I18N.t('fixas.sufixoFixa', { d: item.descricao })
                : I18N.t('fixas.sufixoFixaPct', { d: item.descricao, p: Number(item.valor) });
              entradas.push({
                id: item.id,
                descricao: descricao,
                rawDescricao: item.descricao,
                valor: valor,
                fixedValor: Number(item.valor) || 0,
                fixedTipo: item.tipo,
                source: 'fixed'
              });
            });
          }
        }

        return entradas;
      }

      // Total de despesas do dia (avulsas + fixas), calculado na hora a
      // partir das mesmas entradas exibidas nos cards e no detalhamento,
      // para que todos os totais da página batam com o que é mostrado.
      function sumExpenseEntries (entradas) {
        return entradas.reduce(function (sum, entry) { return sum + (Number(entry.valor) || 0); }, 0);
      }
      function dayExpenseTotal (d) {
        return sumExpenseEntries(loadDayExpenseEntries(d));
      }

      // Read-only presentation access: the new UI uses the very same day
      // calculation as the existing weekly table (including Monday expenses).
      window.SmartSomaReadModel = {
        day: function (date) {
          var d = new Date(date.getTime()); d.setHours(0, 0, 0, 0);
          var b = loadDayBadges(d);
          var entries = loadDayExpenseEntries(d);
          var expenses = sumExpenseEntries(entries);
          var gross = b.uber + b.bolt + b.extras;
          return { date: d, key: dateKeyFor(d), uber: b.uber, bolt: b.bolt,
            platforms: b.plat, gross: gross, expenses: expenses,
            net: gross - expenses, km: b.distancia, entries: entries };
        },
        platforms: function () { return platRegistry().filter(function (p) { return !p.ate; }); }
      };

      function getMonday (date) {
        var day = date.getDay();
        var diffToMonday = (day === 0) ? -6 : 1 - day;
        var monday = new Date(date.getTime());
        monday.setDate(date.getDate() + diffToMonday);
        monday.setHours(0, 0, 0, 0);
        return monday;
      }

      function weekOwnerDate (monday) {
        var owner = new Date(monday.getTime());
        owner.setDate(monday.getDate() + 3);
        return owner;
      }

      // "Regra do 4 e 3": cada semana (segunda a domingo) pertence ao mês
      // que contém a maioria (4 ou mais) dos seus 7 dias.
      function computeWeeksForMonth (year, month) {
        var firstOfMonth = new Date(year, month, 1);
        var lastOfMonth  = new Date(year, month + 1, 0);
        var monday = getMonday(firstOfMonth);
        var weeks = [];

        while (monday.getTime() <= lastOfMonth.getTime()) {
          var sunday = new Date(monday.getTime());
          sunday.setDate(monday.getDate() + 6);

          var owner = weekOwnerDate(monday);
          if (owner.getFullYear() === year && owner.getMonth() === month) {
            weeks.push({ monday: new Date(monday.getTime()), sunday: sunday });
          }

          monday = new Date(monday.getTime());
          monday.setDate(monday.getDate() + 7);
        }
        return weeks;
      }

      // Período usado no botão/opções de seleção de semana. Só repete o mês
      // quando a semana realmente cruza dois meses diferentes:
      // mesmo mês  -> "14 a 20 de set."
      // meses diferentes -> "31 de ago. à 6 de set."
      function formatWeekPickerPeriod (monday, sunday) {
        function monthShort (date) {
          var value = MESES_ABBR()[date.getMonth()].replace(/\.$/, '');
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
        if (monday.getMonth() === sunday.getMonth()) {
          return monday.getDate() + ' a ' + sunday.getDate() + ' ' + monthShort(sunday);
        }
        return monday.getDate() + ' ' + monthShort(monday) + ' a ' + sunday.getDate() + ' ' + monthShort(sunday);
      }

      window.SmartSomaWeeks = {
        ownerMonth: function (date) {
          var owner = weekOwnerDate(getMonday(date));
          return { year: owner.getFullYear(), month: owner.getMonth() };
        },
        weeksForMonth: computeWeeksForMonth,
        formatPeriod: formatWeekPickerPeriod,
        indexInMonth: function (monday, year, month) {
          return computeWeeksForMonth(year, month).findIndex(function (week) {
            return week.monday.getTime() === monday.getTime();
          });
        }
      };

      // Rótulo (em HTML) usado no botão/opções de seleção de semana, com o
      // período em destaque: <span class="semana-week-picker-num">SEMANA 1</span>
      // <span class="semana-week-picker-period">14 a 20 de set.</span>
      function formatWeekPickerLabelHTML (weekIndex, monday, sunday) {
        var prefix = I18N.getLang() === 'en' ? 'Week' : 'Sem.';
        return '<span class="semana-week-picker-num">' + prefix + ' ' + (weekIndex + 1) + '</span>' +
               '<span class="semana-week-picker-period">(' + formatWeekPickerPeriod(monday, sunday) + ')</span>';
      }

      // Devolve o mês (e ano) ao qual a semana de hoje pertence pela
      // "regra do 4 e 3" — pode ser diferente do mês calendário de hoje
      // quando hoje é segunda-feira e a semana já pertence ao mês seguinte.
      function currentWeekMonth () {
        return window.SmartSomaWeeks.ownerMonth(today);
      }

      function isAtCurrentMonth () {
        var cm = currentWeekMonth();
        return refYear === cm.year && refMonth === cm.month;
      }

      function updateMonthLabel () {
        var monthName = capitalize(MESES_MINUS()[refMonth]);
        monthLabelEl.textContent = window.innerWidth <= 760
          ? monthName.slice(0, 3) + ' ' + refYear
          : I18N.t('fmt.monthYear', { m: monthName, y: refYear });
        nextBtn.disabled = isAtCurrentMonth();
      }

      function updateTableScrollFade (scrollWrap, tableEl) {
        var maxScroll = tableEl.scrollWidth - tableEl.clientWidth;
        if (maxScroll <= 1) {
          scrollWrap.classList.remove('has-scroll-left', 'has-scroll-right');
          return;
        }
        scrollWrap.classList.toggle('has-scroll-left', tableEl.scrollLeft > 2);
        scrollWrap.classList.toggle('has-scroll-right', tableEl.scrollLeft < maxScroll - 2);
      }

      // Plataformas extra que aparecem numa semana (mesmas colunas na
      // tabela e nas linhas dos cartões, para tudo bater certo).
      function weekPlatCols (monday) {
        var lista = [];
        for (var i = 0; i < 7; i++) {
          var dd = new Date(monday.getTime());
          dd.setDate(monday.getDate() + i);
          lista.push(loadDayBadges(dd).plat);
        }
        var sunday = new Date(monday.getTime());
        sunday.setDate(monday.getDate() + 6);
        return platVisibleFor(dateKeyFor(monday), dateKeyFor(sunday), lista);
      }

      var listCardAnimationTimer = 0;

      function setExpandedListCard (card, expand) {
        if (!listPlaceholder) return;
        listPlaceholder.querySelectorAll('.semana-day-card').forEach(function (item) {
          var isSelected = item === card && expand;
          item.classList.toggle('is-expanded', isSelected);
          item.classList.toggle('is-muted', expand && item !== card);
          var itemHeader = item.querySelector('.semana-day-card-header');
          if (itemHeader) itemHeader.setAttribute('aria-expanded', String(isSelected));
        });
        listPlaceholder.classList.toggle('has-expanded-card', expand);
        document.documentElement.classList.add('semana-list-is-animating');
        window.clearTimeout(listCardAnimationTimer);
        listCardAnimationTimer = window.setTimeout(function () {
          document.documentElement.classList.remove('semana-list-is-animating');
        }, 360);
      }

      // ---- Modo lista: um card por dia da semana, abaixo do filtro de
      // semana. Por enquanto mostra só o dia da semana; os detalhes de
      // cada dia serão adicionados depois.
      function buildDayCard (d, weekdayIndex) {
        var badges = loadDayBadges(d);
        var ganhosDia = badges.uber + badges.bolt + badges.extras;
        var extraCols = weekPlatCols(getMonday(d));
        var expenseEntries = loadDayVariableExpenseEntries(d);
        var despesasDia = sumExpenseEntries(expenseEntries);
        var liquidoDia = ganhosDia - despesasDia;
        var platforms = [
          { id: 'uber', nome: 'Uber', img: '01uber.png', valor: badges.uber },
          { id: 'bolt', nome: 'Bolt', img: '02bolt.png', valor: badges.bolt }
        ].concat(extraCols.map(function (p) {
          return { id: p.id, nome: p.nome, img: p.img || '', valor: badges.plat[p.id] || 0 };
        }));
        var platformRows = platforms.filter(function (item) { return item.valor > 0; }).map(function (item) {
          var safeImage = item.img && (item.id === 'uber' || item.id === 'bolt' || window.SmartSomaSecurity.isSafeImageUrl(item.img));
          var avatar = safeImage
            ? '<span class="semana-platform-icon"><img src="' + escHtml(item.img) + '" alt=""></span>'
            : '<span class="semana-platform-icon is-fallback">' + escHtml(String(item.nome).trim().slice(0, 2).toUpperCase()) + '</span>';
          return '<div class="semana-day-card-row is-plus"><span class="row-label">' + avatar + '<span>' + escHtml(item.nome) + '</span></span><span class="row-value">' + formatEuro(item.valor) + '</span></div>';
        }).join('') || '<div class="semana-day-card-row"><span class="row-label">Sem ganhos registados</span><span class="row-value">—</span></div>';
        var expenseRows = expenseEntries.map(function (item) {
          return '<div class="semana-day-card-row is-expense"><span class="row-label">' + escHtml(item.descricao) + '</span><span class="row-value">' + formatEuro(item.valor) + '</span></div>';
        }).join('') || '<div class="semana-day-card-row"><span class="row-label">Sem despesas registadas</span><span class="row-value">—</span></div>';
        var extraEarningsRows = badges.ganhosExtras.map(function (item) {
          return '<div class="semana-day-card-row is-extra-earning"><span class="row-label"><span>' + escHtml(item.descricao) + '</span><small>' + I18N.t('fmt.dayMonth', { d: d.getDate(), m: MESES_MINUS()[d.getMonth()] }) + '</small></span><span class="row-value">' + formatEuro(item.valor) + '</span></div>';
        }).join('');
        var extraEarningsSection = extraEarningsRows
          ? '<div class="semana-day-card-extra-earnings"><span>Ganhos extras</span>' + extraEarningsRows + '</div>'
          : '';
        var weekday = DIAS_FULL()[weekdayIndex] + (weekdayIndex < 5 ? '-feira' : '');
        var longDate = I18N.t('fmt.dayMonth', { d: d.getDate(), m: MESES_MINUS()[d.getMonth()] });

        var card = document.createElement('article');
        card.className = 'semana-day-card';
        card.classList.toggle('is-negative', liquidoDia < 0);
        if (d.getTime() === today.getTime()) card.classList.add('is-today');

        var header = document.createElement('button');
        header.type = 'button';
        header.className = 'semana-day-card-header';
        header.setAttribute('aria-expanded', 'false');
        header.innerHTML =
          '<span class="semana-day-card-date-wrap"><strong class="semana-day-card-weekday">' + weekday + '</strong><small>' + longDate + '</small></span>' +
          '<span class="semana-day-card-net"><small>Lucro líquido</small><strong>' + formatEuro(liquidoDia) + '</strong></span>' +
          '<svg class="semana-day-card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
        card.appendChild(header);

        var details = document.createElement('div');
        details.className = 'semana-day-card-details';
        details.innerHTML =
          '<div class="semana-day-card-details-inner">' +
            '<div class="semana-day-card-platforms"><span>Ganhos por plataforma</span>' + platformRows + '</div>' +
            '<div class="semana-day-card-summary">' +
              '<span>Resumo geral</span>' +
              '<div class="semana-day-card-metrics">' +
                '<div class="is-gross"><small>Bruto</small><strong>' + formatEuro(ganhosDia) + '</strong></div>' +
                '<div class="is-expense-summary"><small>Despesas</small><strong>' + formatEuro(despesasDia) + '</strong></div>' +
                '<div class="is-distance"><small>Distância</small><strong>' + formatKm(badges.distancia) + '</strong></div>' +
              '</div>' +
            '</div>' +
            '<div class="semana-day-card-expenses"><span>Despesas do dia</span>' + expenseRows + '<div class="semana-day-card-expense-total"><span>Total</span><strong>' + formatEuro(despesasDia) + '</strong></div></div>' +
            extraEarningsSection +
          '</div>';
        card.appendChild(details);
        header.addEventListener('click', function (event) {
          event.stopPropagation();
          setExpandedListCard(card, !card.classList.contains('is-expanded'));
        });
        card.addEventListener('click', function (event) {
          if (event.target.closest('button, a, input, select, textarea, label')) return;
          setExpandedListCard(card, !card.classList.contains('is-expanded'));
        });

        return card;
      }

      function renderListCards (week) {
        if (!listPlaceholder) return;
        listPlaceholder.innerHTML = '';
        if (!week) return;
        for (var i = 0; i < 7; i++) {
          var d = new Date(week.monday.getTime());
          d.setDate(week.monday.getDate() + i);
          var card = buildDayCard(d, i);
          listPlaceholder.appendChild(card);
        }
      }

      if (listPlaceholder) {
        listPlaceholder.addEventListener('click', function (event) {
          if (!event.target.closest('.semana-day-card')) setExpandedListCard(null, false);
        });
      }

      // A altura de cada card no modo lista fica travada na altura da
      // visualização de ganhos (mesmo com muitas despesas). Isso só pode
      // ser medido depois que o card está no DOM e visível — por isso
      // reexecuta também quando o modo lista volta a ficar visível.
      function fixarAlturasListCards (cards) {
        return cards;
      }

      function buildWeekBlock (week, weekIndex) {
        var block = document.createElement('div');
        block.className = 'semana-week-block';
        block.id = 'semanaWeekBlock-' + weekIndex;

        var metricTabs = document.createElement('div');
        metricTabs.className = 'semana-metric-tabs';
        metricTabs.setAttribute('role', 'tablist');
        metricTabs._weekBlock = block;
        [
          { key: 'financeiro', label: 'Financeiro' },
          { key: 'operacional', label: 'Operacional' },
          { key: 'apps', label: 'Por App' }
        ].forEach(function (metric) {
          var tab = document.createElement('button');
          tab.type = 'button'; tab.className = 'semana-metric-tab';
          tab.dataset.metric = metric.key; tab.textContent = metric.label;
          tab.setAttribute('role', 'tab');
          tab.setAttribute('aria-selected', String(metric.key === activeTableMetric));
          tab.classList.toggle('is-active', metric.key === activeTableMetric);
          tab.addEventListener('click', function () {
            activeTableMetric = metric.key;
            document.querySelectorAll('.semana-week-block').forEach(function (weekBlock) {
              weekBlock.dataset.metric = activeTableMetric;
            });
            document.querySelectorAll('.semana-metric-tab').forEach(function (button) {
              var selected = button.dataset.metric === activeTableMetric;
              button.classList.toggle('is-active', selected);
              button.setAttribute('aria-selected', String(selected));
            });
          });
          metricTabs.appendChild(tab);
        });
        block.dataset.metric = activeTableMetric;

        var scrollWrap = document.createElement('div');
        scrollWrap.className = 'semana-table-scroll';

        var tableWrap = document.createElement('div');
        tableWrap.className = 'semana-table-wrap';
        var table = document.createElement('table');
        table.className = 'semana-table';

        var thead = document.createElement('thead');
        var extraCols = weekPlatCols(week.monday);
        thead.innerHTML =
          '<tr>' +
            '<th class="semana-metric-all semana-cell-data">' + I18N.t('semana.th.data') + '</th>' +
            '<th class="semana-metric-financeiro">Ganhos</th>' +
            '<th class="semana-metric-financeiro">' + I18N.t('semana.th.despesas') + '</th>' +
            '<th class="semana-metric-financeiro">' + I18N.t('semana.th.liquido') + '</th>' +
            '<th class="semana-metric-operacional">Ganhos</th>' +
            '<th class="semana-metric-operacional">KM</th>' +
            '<th class="semana-metric-operacional">€ / KM</th>' +
            '<th class="semana-metric-apps">' + I18N.t('semana.th.uber') + '</th>' +
            '<th class="semana-metric-apps">' + I18N.t('semana.th.bolt') + '</th>' +
            extraCols.map(function (platform) { return '<th class="semana-metric-apps">' + escHtml(platform.nome) + '</th>'; }).join('') +
          '</tr>';
        table.appendChild(thead);

        var tbody = document.createElement('tbody');

        var sumUber = 0, sumBolt = 0, sumExtras = 0, sumDespesas = 0, sumKm = 0, weekIncludedExtraEarnings = 0, bestRevenueDay = null;
        var meta = window.MetaSemanalRead && window.MetaSemanalRead.forDate(week.monday);
        var activeDays = 0, earningsActiveDays = 0;

        function setTableAmount(cell, value) {
          var text = document.createElement('span');
          text.className = 'semana-cell-value';
          text.textContent = formatEuro(value);
          if (Math.round(value * 100) === 0) text.classList.add('is-zero');
          if (Math.round(value * 100) >= 1) cell.classList.add('has-value');
          cell.appendChild(text);
        }

        for (var i = 0; i < 7; i++) {
          var d = new Date(week.monday.getTime());
          d.setDate(week.monday.getDate() + i);
          var dayBadges = loadDayBadges(d);
          var despesasDia = sumExpenseEntries(loadDayVariableExpenseEntries(d));
          var despesasResumoDia = sumExpenseEntries(loadDayExpenseEntries(d));

          sumUber     += dayBadges.uber;
          sumBolt     += dayBadges.bolt;
          sumExtras   += dayBadges.extras;
          sumDespesas += despesasResumoDia;
          sumKm       += dayBadges.distancia;
          weekIncludedExtraEarnings += dayBadges.ganhosExtras.reduce(function (sum, item) {
            return sum + (item.incluidoBruto ? item.valor : 0);
          }, 0);

          var dayTotal = dayBadges.uber + dayBadges.bolt + dayBadges.extras;
          if (!bestRevenueDay || dayTotal > bestRevenueDay.value) {
            bestRevenueDay = {
              date: new Date(d.getTime()),
              value: dayTotal
            };
          }

          var tr = document.createElement('tr');
          tr.className = 'semana-table-row';
          if (d.getTime() === today.getTime()) tr.classList.add('is-today');
          if (d.getTime() > today.getTime()) tr.classList.add('is-future');

          var tdData = document.createElement('td');
          tdData.className = 'semana-metric-all semana-cell-data';
          tdData.innerHTML = DIAS_ABBR()[i] + '<span class="semana-cell-date">' + pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '</span>';
          tr.appendChild(tdData);

          var dayLiquido = dayTotal - despesasDia;
          var dayGoalValue = meta && meta.config && meta.config.tipo === 'liquido' ? dayLiquido : dayTotal;
          if (dayTotal > 0) earningsActiveDays++;
          if (d.getTime() <= today.getTime()) {
            if (dayGoalValue > 0) activeDays++;
          }
          var otherApps = dayBadges.extras;
          var tdGross = document.createElement('td');
          tdGross.className = 'semana-metric-financeiro semana-cell-total';
          setTableAmount(tdGross, dayTotal);
          tr.appendChild(tdGross);

          var tdDespesas = document.createElement('td');
          tdDespesas.className = 'semana-metric-financeiro semana-cell-total semana-cell-expense';
          setTableAmount(tdDespesas, despesasDia);
          tr.appendChild(tdDespesas);

          var tdLiquido = document.createElement('td');
          tdLiquido.className = 'semana-metric-financeiro semana-cell-liquido';
          tdLiquido.textContent = formatEuro(dayLiquido);
          if (Math.round(dayLiquido * 100) >= 1) tdLiquido.classList.add('is-positive');
          if (dayLiquido < 0) tdLiquido.classList.add('is-negative');
          tr.appendChild(tdLiquido);

          var tdOperationalGross = document.createElement('td');
          tdOperationalGross.className = 'semana-metric-operacional semana-cell-total';
          setTableAmount(tdOperationalGross, dayTotal);
          tr.appendChild(tdOperationalGross);

          var tdKm = document.createElement('td');
          tdKm.className = 'semana-metric-operacional';
          tdKm.textContent = formatKm(dayBadges.distancia);
          tr.appendChild(tdKm);

          var tdRate = document.createElement('td');
          tdRate.className = 'semana-metric-operacional';
          tdRate.textContent = dayBadges.distancia > 0 ? formatEuro(dayTotal / dayBadges.distancia) : '—';
          tr.appendChild(tdRate);

          [dayBadges.uber, dayBadges.bolt].concat(extraCols.map(function (platform) { return dayBadges.plat[platform.id] || 0; })).forEach(function (value) {
            var cell = document.createElement('td');
            cell.className = 'semana-metric-apps semana-cell-total';
            setTableAmount(cell, value);
            tr.appendChild(cell);
          });

          tbody.appendChild(tr);
        }

        var sumBruto = sumUber + sumBolt + sumExtras;
        var sumLiquido = sumBruto - sumDespesas;
        table.appendChild(tbody);
        tableWrap.appendChild(table);
        var quickSummary = document.createElement('section');
        quickSummary.className = 'semana-revenue-quick';
        quickSummary.innerHTML =
          '<span class="semana-revenue-title">Resumo rápido</span>' +
          '<div class="semana-revenue-quick-row"><span><strong>Bruto:</strong> ' + formatEuro(sumBruto) + '</span><span><strong>Despesas:</strong> ' + formatEuro(sumDespesas) + '</span></div>' +
          '<div class="semana-revenue-quick-row"><span><strong>Líquido:</strong> ' + formatEuro(sumLiquido) + '</span><span><strong>Distância:</strong> ' + formatKm(sumKm) + '</span></div>';
        scrollWrap.appendChild(quickSummary);
        scrollWrap.appendChild(metricTabs);
        scrollWrap.appendChild(tableWrap);
        var revenueFooter = document.createElement('footer');
        revenueFooter.className = 'semana-revenue-footer';
        var bestRevenueLabel = 'Sem faturação';
        if (bestRevenueDay && bestRevenueDay.value > 0) {
          var bestDate = bestRevenueDay.date;
          bestRevenueLabel = capitalize(DIAS_FULL()[bestDate.getDay() === 0 ? 6 : bestDate.getDay() - 1]) + ', ' +
            bestDate.getDate() + ' de ' + capitalize(MESES_MINUS()[bestDate.getMonth()]) + ' | ' +
            formatPlainNumber(bestRevenueDay.value) + ' €';
        }
        revenueFooter.innerHTML = '<span class="semana-revenue-title">Melhor da semana</span>' +
          '<span class="semana-revenue-best">' + bestRevenueLabel + '</span>';
        if (weekIncludedExtraEarnings > 0) {
          revenueFooter.insertAdjacentHTML('beforeend',
            '<span class="semana-revenue-title">Ganhos extras</span>' +
            '<span class="semana-revenue-extra">Incluído no valor semanal: ' + formatPlainNumber(weekIncludedExtraEarnings) + ' €</span>');
        }
        scrollWrap.appendChild(revenueFooter);
        var summary = document.createElement('div');
        summary.className = 'semana-week-summary semana-goal-card';
        summary.tabIndex = 0;
        summary.setAttribute('role', 'button');
        summary.setAttribute('aria-label', 'Abrir valor a receber');
        var achieved = meta && meta.config ? meta.achieved : sumBruto;
        var target = meta && meta.config ? meta.config.valor : null;
        var percent = meta && meta.config ? Math.max(0, meta.percent) : 0;
        var progress = Math.min(100, percent);
        var dailyAverage = activeDays ? achieved / activeDays : 0;
        var weekSunday = new Date(week.monday.getTime());
        weekSunday.setDate(week.monday.getDate() + 6);
        var isCurrentWeek = today >= week.monday && today <= weekSunday;
        var summaryTitle = isCurrentWeek
          ? 'Meta da semana Atual'
          : 'Meta da semana <small class="semana-goal-card-period">' + formatWeekPeriodNumeric(week.monday) + '</small>';
        var goalStatus = target
          ? '/ ' + formatEuro(target)
          : (isCurrentWeek ? 'Meta por definir' : 'Meta não definida');
        summary.innerHTML =
          '<div class="semana-goal-card-head">' +
            '<span>' + summaryTitle + '</span>' +
            '<span class="semana-goal-card-action"><strong>' + (target ? percent + '%' : '—') + '</strong>' +
              '<img class="semana-goal-card-click-icon" src="tap-hand-neon.png?v=1" alt="" aria-hidden="true">' +
            '</span>' +
          '</div>' +
          '<div class="semana-goal-card-values">' +
            '<strong>' + formatEuro(achieved) + '</strong>' +
            '<span>' + goalStatus + '</span>' +
          '</div>' +
          '<div class="semana-goal-card-track" role="progressbar" aria-label="Progresso da meta semanal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progress + '"><i style="width:' + progress + '%"></i></div>' +
          '<div class="semana-goal-card-footer">' +
            '<span>Média diária: <strong>' + formatEuro(dailyAverage) + '</strong></span>' +
            '<span>' + earningsActiveDays + ' dias ativos</span>' +
          '</div>';
        summary.classList.toggle('is-negative-achieved', achieved < 0);

        block.appendChild(summary);
        block.appendChild(scrollWrap);

        var detalhesCard = buildWeekExpensesDetailCard(week);
        if (detalhesCard) {
          detalhesCard._weekBlock = block;
          block.appendChild(detalhesCard);
        }

        return block;
      }

      // Card de detalhamento das despesas da semana (modo tabela): só dia,
      // valor e descrição, sem opção de apagar — é apenas visualização.
      function buildWeekExpensesDetailCard (week) {
        var linhas = [];
        for (var i = 0; i < 7; i++) {
          var d = new Date(week.monday.getTime());
          d.setDate(week.monday.getDate() + i);
          var entradas = loadDayExpenseEntries(d);
          entradas.forEach(function (entry) {
            linhas.push({ dia: DIAS_ABBR()[i] + ' ' + pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1), date: new Date(d.getTime()), entry: entry });
          });
        }
        var section = document.createElement('section');
        section.className = 'semana-expenses-section';

        var title = document.createElement('h4');
        title.className = 'semana-despesas-detail-title';
        title.textContent = I18N.t('semana.despesasTitle');
        section.appendChild(title);

        var card = document.createElement('div');
        card.className = 'semana-despesas-detail-card';

        var scrollWrap = document.createElement('div');
        scrollWrap.className = 'semana-table-scroll';

        var tableWrap = document.createElement('div');
        tableWrap.className = 'semana-table-wrap';
        var table = document.createElement('table');
        table.className = 'semana-table semana-despesas-detail-table';
        table.innerHTML = '<thead><tr><th>' + I18N.t('semana.dth.dia') + '</th><th>' + I18N.t('semana.dth.desc') + '</th><th>' + I18N.t('semana.dth.valor') + '</th></tr></thead>';
        var tbody = document.createElement('tbody');
        var total = 0;
        var maior = null;
        linhas.forEach(function (linha) {
          total += Number(linha.entry.valor) || 0;
          if (!maior || Number(linha.entry.valor) > Number(maior.valor)) maior = linha.entry;
          var tr = document.createElement('tr');
          var tdDia = document.createElement('td');
          tdDia.textContent = linha.dia;
          var tdDesc = document.createElement('td');
          tdDesc.className = 'semana-expense-description';
          if ((linha.entry.source === 'daily' || linha.entry.source === 'fixed') && linha.entry.id !== undefined) {
            var descWrap = document.createElement('div');
            descWrap.className = 'semana-expense-editable';
            var descText = document.createElement('span');
            descText.textContent = linha.entry.descricao;
            descText.title = linha.entry.descricao;
            var editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'semana-expense-edit-btn';
            editBtn.setAttribute('aria-label', I18N.t('despesaEdit.title'));
            editBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
            editBtn.addEventListener('click', function () { openWeekExpenseEdit(linha.date, linha.entry.id, linha.entry.source); });
            descWrap.appendChild(descText);
            descWrap.appendChild(editBtn);
            tdDesc.appendChild(descWrap);
          } else {
            tdDesc.textContent = linha.entry.descricao;
          }
          var tdValor = document.createElement('td');
          tdValor.className = 'semana-expense-value';
          tdValor.textContent = formatEuro(linha.entry.valor);
          tr.appendChild(tdDia);
          tr.appendChild(tdDesc);
          tr.appendChild(tdValor);
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        tableWrap.appendChild(table);
        scrollWrap.appendChild(tableWrap);
        card.appendChild(scrollWrap);
        var footer = document.createElement('footer');
        footer.className = 'semana-expenses-footer';
        footer.innerHTML = '<div class="semana-expenses-total"><span>Total da semana</span><strong>' + formatEuro(total) + '</strong></div>' +
          (maior ? '<span class="semana-expenses-largest">Maior gasto: ' + escHtml(maior.descricao) + ' - ' + formatEuro(maior.valor) + '</span>' : '');
        card.appendChild(footer);
        section.appendChild(card);

        return section;
      }

      var expenseEditBackdrop = document.getElementById('semanaDespesaEditBackdrop');
      var expenseEditDesc = document.getElementById('semanaDespesaEditDesc');
      var expenseEditDate = document.getElementById('semanaDespesaEditDate');
      var expenseEditValue = document.getElementById('semanaDespesaEditValorInput');
      var expenseEditFixedTypes = document.getElementById('semanaDespesaEditFixedTypes');
      var expenseEditPercent = document.getElementById('semanaDespesaEditPercentBtn');
      var expenseEditEuro = document.getElementById('semanaDespesaEditEuroBtn');
      var expenseEditSave = document.getElementById('semanaDespesaEditSaveBtn');
      var expenseEditDelete = document.getElementById('semanaDespesaEditDeleteBtn');
      var expenseDeleteBackdrop = document.getElementById('semanaDespesaDeleteBackdrop');
      var expenseDeleteCancel = document.getElementById('semanaDespesaDeleteCancelBtn');
      var expenseDeleteConfirm = document.getElementById('semanaDespesaDeleteConfirmBtn');
      var editingExpense = null;

      function formatExpenseDate (date) {
        return date.getDate() + ' de ' + MESES_MINUS()[date.getMonth()] + ' de ' + date.getFullYear();
      }
      var expenseEditFixedTipo = 'percentual';
      function setExpenseEditFixedTipo (tipo) {
        expenseEditFixedTipo = tipo;
        var isPercent = tipo === 'percentual';
        if (expenseEditPercent) {
          expenseEditPercent.classList.toggle('active', isPercent);
          expenseEditPercent.setAttribute('aria-pressed', isPercent ? 'true' : 'false');
        }
        if (expenseEditEuro) {
          expenseEditEuro.classList.toggle('active', !isPercent);
          expenseEditEuro.setAttribute('aria-pressed', !isPercent ? 'true' : 'false');
        }
        var prefix = expenseEditValue && expenseEditValue.parentElement.querySelector('.mm-value-prefix');
        if (prefix) prefix.textContent = isPercent ? '%' : '€';
      }
      function loadEditableExpense (date, id, source) {
        if (source === 'fixed') {
          var fixed = null;
          try { fixed = JSON.parse(cloudGet(DESPESAS_FIXAS_KEY) || 'null'); } catch (e) { }
          if (!fixed || !Array.isArray(fixed.items)) return null;
          return fixed.items.find(function (item) { return item.id === id; }) || null;
        }
        var data = null;
        try { data = JSON.parse(cloudGet(DESPESAS_DIARIAS_PREFIX + dateKeyFor(date)) || 'null'); } catch (e) { }
        if (!data || !Array.isArray(data.items)) return null;
        return data.items.find(function (item) { return item.id === id; }) || null;
      }
      function openWeekExpenseEdit (date, id, source) {
        var item = loadEditableExpense(date, id, source);
        if (!item || !expenseEditBackdrop) return;
        editingExpense = { date: new Date(date.getTime()), id: id, source: source || 'daily' };
        if (expenseEditDesc) expenseEditDesc.textContent = item.descricao;
        if (expenseEditDate) expenseEditDate.textContent = formatExpenseDate(date);
        if (expenseEditValue) expenseEditValue.value = Number(item.valor).toFixed(2);
        if (expenseEditFixedTypes) expenseEditFixedTypes.hidden = editingExpense.source !== 'fixed';
        if (editingExpense.source === 'fixed') setExpenseEditFixedTipo(item.tipo === 'euro' ? 'euro' : 'percentual');
        else {
          var prefix = expenseEditValue && expenseEditValue.parentElement.querySelector('.mm-value-prefix');
          if (prefix) prefix.textContent = '€';
        }
        expenseEditBackdrop.classList.add('visible');
      }
      function closeWeekExpenseEdit () {
        if (expenseEditBackdrop) expenseEditBackdrop.classList.remove('visible');
        editingExpense = null;
      }
      function refreshAfterWeekExpenseChange (date) {
        var badgeKey = BADGES_STORAGE_PREFIX + dateKeyFor(date);
        var badge = {};
        try { badge = JSON.parse(cloudGet(badgeKey) || '{}'); } catch (e) { }
        badge.despesas = dayExpenseTotal(date);
        cloudSet(badgeKey, JSON.stringify(badge));
        document.dispatchEvent(new CustomEvent('homeBadgesSaved'));
      }
      function updateEditingExpense (remove) {
        if (!editingExpense) return false;
        if (editingExpense.source === 'fixed') {
          var fixedData = null;
          try { fixedData = JSON.parse(cloudGet(DESPESAS_FIXAS_KEY) || 'null'); } catch (e) { }
          if (!fixedData || !Array.isArray(fixedData.items)) return false;
          var fixedItem = fixedData.items.find(function (entry) { return entry.id === editingExpense.id; });
          if (!fixedItem) return false;
          if (remove) {
            fixedItem.ate = dateKeyFor(getMonday(editingExpense.date));
          } else {
            var fixedValue = parseFloat(String(expenseEditValue.value).replace(',', '.'));
            if (isNaN(fixedValue) || fixedValue <= 0 || (expenseEditFixedTipo === 'percentual' && fixedValue > 100)) return false;
            fixedItem.valor = Math.min(fixedValue, expenseEditFixedTipo === 'euro' ? 999.99 : 100);
            fixedItem.tipo = expenseEditFixedTipo;
          }
          cloudSet(DESPESAS_FIXAS_KEY, JSON.stringify(fixedData));
          document.dispatchEvent(new CustomEvent('despesasFixasChanged'));
          document.dispatchEvent(new CustomEvent('homeBadgesSaved'));
          return true;
        }
        var key = DESPESAS_DIARIAS_PREFIX + dateKeyFor(editingExpense.date);
        var data = null;
        try { data = JSON.parse(cloudGet(key) || 'null'); } catch (e) { }
        if (!data || !Array.isArray(data.items)) return false;
        var item = data.items.find(function (entry) { return entry.id === editingExpense.id; });
        if (!item) return false;
        if (remove) {
          data.items = data.items.filter(function (entry) { return entry.id !== editingExpense.id; });
        } else {
          var value = parseFloat(String(expenseEditValue.value).replace(',', '.'));
          if (isNaN(value) || value < 0) return false;
          item.valor = Math.min(value, 999.99);
        }
        cloudSet(key, JSON.stringify(data));
        refreshAfterWeekExpenseChange(editingExpense.date);
        return true;
      }
      if (expenseEditValue) expenseEditValue.addEventListener('input', function () {
        expenseEditValue.value = expenseEditValue.value.replace(/[^0-9.,]/g, '').replace(/([.,].*)[.,]/g, '$1');
      });
      if (expenseEditPercent) expenseEditPercent.addEventListener('click', function () { setExpenseEditFixedTipo('percentual'); });
      if (expenseEditEuro) expenseEditEuro.addEventListener('click', function () { setExpenseEditFixedTipo('euro'); });
      if (expenseEditSave) expenseEditSave.addEventListener('click', function () {
        if (updateEditingExpense(false)) closeWeekExpenseEdit();
      });
      if (expenseEditDelete) expenseEditDelete.addEventListener('click', function () {
        if (editingExpense && expenseDeleteBackdrop) expenseDeleteBackdrop.classList.add('visible');
      });
      if (expenseDeleteCancel) expenseDeleteCancel.addEventListener('click', function () {
        if (expenseDeleteBackdrop) expenseDeleteBackdrop.classList.remove('visible');
      });
      if (expenseDeleteConfirm) expenseDeleteConfirm.addEventListener('click', function () {
        if (updateEditingExpense(true)) closeWeekExpenseEdit();
        if (expenseDeleteBackdrop) expenseDeleteBackdrop.classList.remove('visible');
      });
      if (expenseEditBackdrop) expenseEditBackdrop.addEventListener('click', function (e) {
        if (e.target === expenseEditBackdrop) closeWeekExpenseEdit();
      });
      if (expenseDeleteBackdrop) expenseDeleteBackdrop.addEventListener('click', function (e) {
        if (e.target === expenseDeleteBackdrop) expenseDeleteBackdrop.classList.remove('visible');
      });
      document.addEventListener('smartSomaTransientStateReset', function () {
        closeWeekExpenseEdit();
        if (expenseDeleteBackdrop) expenseDeleteBackdrop.classList.remove('visible');
      });

      var pickerBtn   = document.getElementById('semanaWeekPickerBtn');
      var pickerLabel = document.getElementById('semanaWeekPickerLabel');
      var pickerPanel = document.getElementById('semanaWeekPickerPanel');
      var pickerPrev  = document.getElementById('semanaWeekPrev');
      var pickerNext  = document.getElementById('semanaWeekNext');
      var periodModal = document.getElementById('semanaPeriodModalBackdrop');
      var periodMonthPrev = document.getElementById('semanaPeriodMonthPrev');
      var periodMonthNext = document.getElementById('semanaPeriodMonthNext');
      var periodMonthLabel = document.getElementById('semanaPeriodMonthLabel');
      var periodWeekList = document.getElementById('semanaPeriodWeekList');
      var periodCurrentBtn = document.getElementById('semanaPeriodCurrentBtn');
      var periodFilterBtn = document.getElementById('semanaPeriodFilterBtn');
      var summarySlot = document.getElementById('semanaSummarySlot');
      var currentWeeks = [];
      var modalYear = refYear;
      var modalMonth = refMonth;
      var pendingWeekSelection = null;

      function syncSummarySlot (block) {
        if (!summarySlot) return;
        summarySlot.replaceChildren();
        var summary = block && block.querySelector('.semana-week-summary:not(.semana-despesas-detail-card)');
        if (!summary) return;
        var copy = summary.cloneNode(true);
        copy.classList.add('semana-summary-slot-card');
        summarySlot.appendChild(copy);
      }

      function restoreExternalWeekParts () {
        [expensesSlot].forEach(function (slot) {
          if (!slot || !slot.firstElementChild) return;
          var part = slot.firstElementChild;
          if (part._weekBlock) part._weekBlock.appendChild(part);
        });
      }

      function syncExternalWeekParts (block) {
        restoreExternalWeekParts();
        if (expensesSlot) {
          var expenses = block.querySelector('.semana-expenses-section');
          if (expenses) expensesSlot.appendChild(expenses);
        }
      }

      function syncWeekContentMode () {
        if (earningsTitle) earningsTitle.hidden = false;
        if (metricSlot) metricSlot.hidden = true;
      }

      function syncWeekStepButtons () {
        if (pickerPrev) pickerPrev.disabled = currentWeekIndex <= 0;
        if (pickerNext) pickerNext.disabled = currentWeekIndex >= currentWeeks.length - 1;
      }

      function closeWeekPicker () {
        if (pickerPanel) pickerPanel.hidden = true;
        if (periodModal) periodModal.classList.remove('visible');
        if (pickerBtn) pickerBtn.setAttribute('aria-expanded', 'false');
      }

      function openWeekPicker () {
        modalYear = refYear;
        modalMonth = refMonth;
        pendingWeekSelection = currentWeeks[currentWeekIndex] ? {
          year: refYear,
          month: refMonth,
          index: currentWeekIndex,
          monday: new Date(currentWeeks[currentWeekIndex].monday.getTime())
        } : null;
        renderPeriodModal();
        if (periodModal) periodModal.classList.add('visible');
        if (pickerBtn) pickerBtn.setAttribute('aria-expanded', 'true');
      }

      function sameCalendarDay (a, b) {
        return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
      }

      function modalWeekPeriod (week) {
        return formatWeekPickerPeriod(week.monday, week.sunday);
      }

      function renderPeriodModal () {
        if (!periodWeekList || !periodMonthLabel) return;
        periodMonthLabel.textContent = capitalize(MESES_MINUS()[modalMonth]) + ' de ' + modalYear;
        periodWeekList.innerHTML = '';
        var weeks = computeWeeksForMonth(modalYear, modalMonth);
        var currentMonday = getMonday(todayAtMidnight());
        weeks.forEach(function (week, idx) {
          var option = document.createElement('button');
          var isCurrent = sameCalendarDay(week.monday, currentMonday);
          var isSelected = pendingWeekSelection && sameCalendarDay(week.monday, pendingWeekSelection.monday);
          option.type = 'button';
          option.className = 'semana-period-week-option';
          option.classList.toggle('is-current', isCurrent);
          option.classList.toggle('is-selected', isSelected);
          option.setAttribute('role', 'option');
          option.setAttribute('aria-selected', String(!!isSelected));
          option.innerHTML = '<span>Semana ' + (idx + 1) + ' <small>(' + modalWeekPeriod(week) + ')</small></span>' +
            (isCurrent ? '<strong>Atual</strong>' : '');
          option.addEventListener('click', function () {
            pendingWeekSelection = {
              year: modalYear,
              month: modalMonth,
              index: idx,
              monday: new Date(week.monday.getTime())
            };
            renderPeriodModal();
          });
          periodWeekList.appendChild(option);
        });
        if (periodFilterBtn) periodFilterBtn.disabled = !pendingWeekSelection;
      }

      // Mostra uma semana por vez: a semana ativa desliza para dentro da
      // tela (translateX na trilha) e o card ajusta a altura suavemente
      // para acompanhar o conteúdo da semana que entrou.
      function refreshSemanaLayout () {
        weeksContainer.querySelectorAll('.semana-table-scroll').forEach(function (wrap) {
          var tableEl = wrap.querySelector('.semana-table-wrap');
          if (tableEl) updateTableScrollFade(wrap, tableEl);
        });
        if (weeksTrackEl && weeksTrackEl.children[currentWeekIndex]) {
          weeksContainer.style.height = weeksTrackEl.children[currentWeekIndex].offsetHeight + 'px';
        }
      }

      function setActiveWeek (idx, animate) {
        if (!weeksTrackEl) return;
        var block = weeksTrackEl.children[idx];
        if (!block) return;

        currentWeekIndex = idx;
        syncSummarySlot(block);
        syncExternalWeekParts(block);
        syncWeekContentMode();
        syncWeekStepButtons();

        if (animate === false) {
          weeksTrackEl.style.transition = 'none';
          weeksContainer.style.transition = 'none';
        }

        weeksTrackEl.style.transform = 'translateX(-' + (idx * 100) + '%)';
        weeksContainer.style.height = block.offsetHeight + 'px';

        if (animate === false) {
          // força reflow antes de devolver a transição, evitando animar o
          // posicionamento inicial da semana já selecionada
          void weeksTrackEl.offsetHeight;
          weeksTrackEl.style.transition = '';
          weeksContainer.style.transition = '';
        }

        // A semana que acabou de entrar pode nunca ter tido seu degradê de
        // scroll calculado corretamente (isso só acontecia no build inicial
        // do bloco, ou quando o usuário arrastava a tabela manualmente).
        // Recalcula aqui também, agora que ela está de fato visível — para
        // a tabela principal e para o card de detalhamento de despesas.
        block.querySelectorAll('.semana-table-scroll').forEach(function (wrap) {
          var tableEl = wrap.querySelector('.semana-table-wrap');
          if (tableEl) updateTableScrollFade(wrap, tableEl);
        });

        var week = currentWeeks[idx];
        if (week && window.HomeNav && window.HomeNav.getCurrentState && window.HomeNav.getCurrentState() === 'semana' && window.GanhosDate && typeof window.GanhosDate.set === 'function') {
          window.GanhosDate.set(week.monday);
        }
        if (week && pickerLabel) {
          pickerLabel.innerHTML = formatWeekPickerLabelHTML(idx, week.monday, week.sunday);
        }
        if (week) renderListCards(week);
        if (currentWeekView === 'list') {
          weeksContainer.hidden = true;
          if (listPlaceholder) listPlaceholder.hidden = false;
        }
        if (pickerPanel) {
          pickerPanel.querySelectorAll('.semana-week-picker-option').forEach(function (b, i) {
            b.classList.toggle('is-active', i === idx);
          });
        }
        closeWeekPicker();
      }

      function buildWeekPicker (weeks) {
        if (pickerPanel) {
          pickerPanel.innerHTML = '';
          pickerPanel.hidden = true;
        }
      }

      if (pickerBtn) {
        pickerBtn.addEventListener('click', function () {
          if (!periodModal || !periodModal.classList.contains('visible')) openWeekPicker();
          else closeWeekPicker();
        });
      }
      if (pickerPrev) pickerPrev.addEventListener('click', function () {
        if (currentWeekIndex > 0) setActiveWeek(currentWeekIndex - 1, true);
      });
      if (pickerNext) pickerNext.addEventListener('click', function () {
        if (currentWeekIndex < currentWeeks.length - 1) setActiveWeek(currentWeekIndex + 1, true);
      });
      if (periodMonthPrev) periodMonthPrev.addEventListener('click', function () {
        modalMonth -= 1;
        if (modalMonth < 0) { modalMonth = 11; modalYear -= 1; }
        pendingWeekSelection = null;
        renderPeriodModal();
      });
      if (periodMonthNext) periodMonthNext.addEventListener('click', function () {
        modalMonth += 1;
        if (modalMonth > 11) { modalMonth = 0; modalYear += 1; }
        pendingWeekSelection = null;
        renderPeriodModal();
      });
      if (periodCurrentBtn) periodCurrentBtn.addEventListener('click', function () {
        var current = currentWeekMonth();
        modalYear = current.year;
        modalMonth = current.month;
        var weeks = computeWeeksForMonth(modalYear, modalMonth);
        var currentMonday = getMonday(todayAtMidnight());
        var idx = weeks.findIndex(function (week) { return sameCalendarDay(week.monday, currentMonday); });
        pendingWeekSelection = idx >= 0 ? {
          year: modalYear,
          month: modalMonth,
          index: idx,
          monday: new Date(weeks[idx].monday.getTime())
        } : null;
        renderPeriodModal();
      });
      if (periodFilterBtn) periodFilterBtn.addEventListener('click', function () {
        if (!pendingWeekSelection) return;
        refYear = pendingWeekSelection.year;
        refMonth = pendingWeekSelection.month;
        currentWeekIndex = pendingWeekSelection.index;
        renderMonth();
        closeWeekPicker();
      });
      if (periodModal) periodModal.addEventListener('click', function (e) {
        if (e.target === periodModal) closeWeekPicker();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && periodModal && periodModal.classList.contains('visible')) closeWeekPicker();
      });

      function renderMonth () {
        updateMonthLabel();
        weeksContainer.innerHTML = '';
        closeWeekPicker();
        var weeks = computeWeeksForMonth(refYear, refMonth);
        currentWeeks = weeks;

        weeksTrackEl = document.createElement('div');
        weeksTrackEl.className = 'semana-weeks-track';
        weeks.forEach(function (week, idx) {
          weeksTrackEl.appendChild(buildWeekBlock(week, idx));
        });
        weeksContainer.appendChild(weeksTrackEl);

        buildWeekPicker(weeks);

        var initialIndex = weeks.length ? Math.min(currentWeekIndex, weeks.length - 1) : 0;
        requestAnimationFrame(function () {
          setActiveWeek(initialIndex, false);
        });
      }

      window.addEventListener('resize', refreshSemanaLayout);

      prevBtn.addEventListener('click', function () {
        refMonth -= 1;
        if (refMonth < 0) { refMonth = 11; refYear -= 1; }
        renderMonth();
      });

      nextBtn.addEventListener('click', function () {
        if (nextBtn.disabled) return;
        refMonth += 1;
        if (refMonth > 11) { refMonth = 0; refYear += 1; }
        renderMonth();
      });

      document.addEventListener('homeBadgesSaved', renderMonth);
      document.addEventListener('plataformasChanged', renderMonth);
      document.addEventListener('despesasFixasChanged', renderMonth);
      // Troca de idioma: a tabela, os cards e os rótulos são reconstruídos.
      document.addEventListener('languageChanged', renderMonth);

      // A página "Detalhes da Semana" começa escondida (hidden). Se o
      // cálculo de altura/degradê da tabela rodar enquanto ela ainda está
      // oculta, o resultado vem zerado/errado e só se corrige depois que o
      // usuário troca de semana manualmente. Por isso recalculamos assim
      // que a página realmente aparece na tela — com requestAnimationFrame
      // duplo, pra garantir que já passou por um ciclo de pintura real.
      function resetToCurrentWeek () {
        today = todayAtMidnight();
        // Usa o mês ao qual a semana de hoje pertence (regra do 4 e 3),
        // que pode ser o mês seguinte ao calendário quando hoje é segunda
        // e a semana já pertence ao mês seguinte.
        var selected = (window.GanhosDate && typeof window.GanhosDate.get === 'function') ? window.GanhosDate.get() : today;
        var selectedOwner = window.SmartSomaWeeks.ownerMonth(selected);
        refYear  = selectedOwner.year;
        refMonth = selectedOwner.month;

        var weeksForToday = computeWeeksForMonth(refYear, refMonth);
        var idx = 0;
        for (var i = 0; i < weeksForToday.length; i++) {
          if (selected.getTime() >= weeksForToday[i].monday.getTime() &&
              selected.getTime() <= weeksForToday[i].sunday.getTime()) {
            idx = i;
            break;
          }
        }
        currentWeekIndex = idx;
      }

      function resetWeekFilters () {
        pendingWeekSelection = null;
        closeWeekPicker();
        resetToCurrentWeek();
        renderMonth();
      }

      document.addEventListener('smartSomaTransientStateReset', resetWeekFilters);

      document.addEventListener('semanaPageShown', function () {
        resetToCurrentWeek();
        renderMonth();

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            refreshSemanaLayout();
          });
        });
      });

      // ---- Alternância tabela / lista (o filtro de mês e semana acima
      // permanece igual nos dois modos; só esta área troca). O modo lista
      // ainda está em manutenção.
      window.SemanaView = {
        showList: function () {
          currentWeekView = 'list';
          document.body.classList.remove('semana-table-view');
          syncWeekContentMode();
          weeksContainer.hidden = true;
          if (listPlaceholder) {
            listPlaceholder.hidden = false;
            var cards = [].slice.call(listPlaceholder.querySelectorAll('.semana-day-card'));
            fixarAlturasListCards(cards);
          }
        },
        showTable: function () {
          currentWeekView = 'table';
          document.body.classList.add('semana-table-view');
          syncWeekContentMode();
          if (listPlaceholder) listPlaceholder.hidden = true;
          weeksContainer.hidden = false;
          // A tabela pode ter ficado oculta enquanto o modo lista estava
          // ativo; se a semana foi trocada nesse meio tempo, a altura/
          // degradê calculados com o container ainda escondido saem
          // zerados (offsetHeight = 0), fazendo a tabela "sumir" até o
          // usuário trocar de semana manualmente. Por isso recalculamos o
          // layout assim que o modo tabela volta a ficar visível, com o
          // mesmo duplo requestAnimationFrame usado em semanaPageShown.
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              refreshSemanaLayout();
            });
          });
        }
      };

      resetToCurrentWeek();
      renderMonth();
    })();



    (function () {
      var CURRENCY_MAX = 999.99;

      function sanitizeDecimalInput (e) {
        var input = e.target;
        var value = input.value.replace(/[^0-9.,]/g, '');
        var firstSep = value.search(/[.,]/);
        if (firstSep !== -1) {
          value = value.slice(0, firstSep + 1) + value.slice(firstSep + 1).replace(/[.,]/g, '');
        }

        var numeric = parseFloat(value.replace(',', '.'));
        if (!isNaN(numeric) && numeric > CURRENCY_MAX) {
          value = value.includes(',') ? '999,99' : String(CURRENCY_MAX);
        }

        input.value = value;
      }

      document.querySelectorAll('.mm-value-input').forEach(function (input) {
        if (input.id === 'distanciaValorInput' || input.id === 'distanciaKmInicioInput' || input.id === 'distanciaKmFimInput') return;
        input.addEventListener('input', sanitizeDecimalInput);
      });
    })();

    (function () {
      var DISTANCIA_MAX = 9999;
      var KM_INICIO_FIM_MAX = 999999;
      var distanciaInput = document.getElementById('distanciaValorInput');
      var kmInicioInput = document.getElementById('distanciaKmInicioInput');
      var kmFimInput = document.getElementById('distanciaKmFimInput');

      function sanitizeIntegerInput (input, max) {
        if (!input) return;
        input.addEventListener('input', function () {
          var value = input.value.replace(/[^0-9]/g, '');
          if (value) {
            var numeric = parseInt(value, 10);
            if (numeric > max) value = String(max);
          }
          input.value = value;
        });
      }

      sanitizeIntegerInput(distanciaInput, DISTANCIA_MAX);
      sanitizeIntegerInput(kmInicioInput, KM_INICIO_FIM_MAX);
      sanitizeIntegerInput(kmFimInput, KM_INICIO_FIM_MAX);
    })();

    (function () {
      var btnCadastrarFixas = document.getElementById('btnCadastrarDespesasFixas');
      if (!btnCadastrarFixas) return;

      btnCadastrarFixas.addEventListener('click', function () {
        if (window.DetalhesModals && window.DetalhesModals.despesas) {
          window.DetalhesModals.despesas.close();
        }
        if (window.DespesasModal) {
          window.DespesasModal.open();
        }
      });
    })();

    (function () {
      var relatorioBackBtn = document.getElementById('relatorioBackBtn');
      if (relatorioBackBtn) {
        relatorioBackBtn.addEventListener('click', function () {
          if (window.HomeNav) window.HomeNav.goToSection('ganhos');
        });
      }
    })();



    (function () {
      var listView      = document.getElementById('homeListView');
      var subHeaderLeftDefault = document.getElementById('subHeaderLeftDefault');
      var subHeaderLeftResumo  = document.getElementById('subHeaderLeftResumo');
      var subHeaderLeftSemana  = document.getElementById('subHeaderLeftSemana');
      var subHeaderLeftRelatorio = document.getElementById('subHeaderLeftRelatorio');
      var homeListPageGanhos = document.getElementById('homeListPageGanhos');
      var homeListPageResumo = document.getElementById('homeListPageResumo');
      var homeListPageSemana = document.getElementById('homeListPageSemana');
      var homeListPageRelatorio = document.getElementById('homeListPageRelatorio');
      if (!listView) return;

      var currentHeaderState = 'default'; // 'default' | 'resumo' | 'semana' | 'relatorio'
      var subHeaderViewToggleBtn = document.getElementById('subHeaderViewToggleGroup');
      var metaSlotList = document.getElementById('metaSlotList');

      function setHeaderTitleState (state) {
        if (state === currentHeaderState) return;
        currentHeaderState = state;
        if (subHeaderLeftDefault) subHeaderLeftDefault.classList.toggle('is-visible', state === 'default');
        if (subHeaderLeftResumo) subHeaderLeftResumo.classList.toggle('is-visible', state === 'resumo');
        if (subHeaderLeftSemana) subHeaderLeftSemana.classList.toggle('is-visible', state === 'semana');
        if (subHeaderLeftRelatorio) subHeaderLeftRelatorio.classList.toggle('is-visible', state === 'relatorio');
        if (subHeaderViewToggleBtn) subHeaderViewToggleBtn.hidden = (state !== 'semana');
        if (metaSlotList) metaSlotList.hidden = (state === 'relatorio');
        if (state === 'relatorio' && window.QuickNavMenu) window.QuickNavMenu.close();
      }

      // ---- Botões de alternar modo de visualização (tabela / lista) em
      // Detalhes da Semana. O filtro de mês/semana continua igual nos dois
      // modos; só a área abaixo dele troca entre a tabela e o modo lista
      // (ainda em manutenção).
      (function () {
        var btnList  = document.getElementById('viewToggleBtnList');
        var btnTable = document.getElementById('viewToggleBtnTable');
        var toggle = document.getElementById('subHeaderViewToggleGroup');
        if (!btnList || !btnTable || !toggle) return;
        var viewStorageKey = 'smartsoma:semana-view';
        function setActive (btn, persist) {
          [btnList, btnTable].forEach(function (b) {
            var active = (b === btn);
            b.classList.toggle('is-active', active);
          });
          var isList = btn === btnList;
          var activeLabel = document.getElementById('semanaViewToggleActiveLabel');
          var inactiveLabel = document.getElementById('semanaViewToggleInactiveLabel');
          if (activeLabel) activeLabel.textContent = isList ? 'Lista' : 'Tabela';
          if (inactiveLabel) inactiveLabel.textContent = isList ? 'Tabela' : 'Lista';
          toggle.setAttribute('aria-pressed', isList ? 'true' : 'false');
          toggle.setAttribute('aria-label', isList ? 'Alternar para tabela' : 'Alternar para lista');
          if (persist) {
            try { localStorage.setItem(viewStorageKey, isList ? 'list' : 'table'); } catch (e) {}
          }
        }
        function applyView (btn, persist) {
          setActive(btn, persist);
          if (window.SemanaView) {
            if (btn === btnList) window.SemanaView.showList();
            else window.SemanaView.showTable();
          }
        }
        function toggleView () {
          var next = btnList.classList.contains('is-active') ? btnTable : btnList;
          applyView(next, true);
        }
        toggle.addEventListener('click', toggleView);
        var storedView = null;
        try { storedView = localStorage.getItem(viewStorageKey); } catch (e) {}
        applyView(storedView === 'table' ? btnTable : btnList, false);
      })();

      // ---- Navegação entre seções (Ganhos / Resumo Financeiro / Detalhes
      // da Semana), chamada a partir do menu principal. Cada seção é uma
      // "página" própria dentro de #homeListView.
      function resetNavigationScroll () {
        if (listView) listView.scrollTop = 0;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      function showHomeListPage (section) {
        resetNavigationScroll();
        var normalized = (section === 'default') ? 'ganhos' : section;
        var pages = PAGES_LIST;
        var nextEl = null;
        pages.forEach(function (p) { if (p.key === normalized) nextEl = p.el; });
        setHeaderTitleState(normalized === 'ganhos' ? 'default' : normalized);

        if (!nextEl) return;
        pages.forEach(function (p) { if (p.el) p.el.hidden = p.el !== nextEl; });
        if (listView) listView.scrollTop = 0;
        if (normalized === 'semana') {
          document.dispatchEvent(new CustomEvent('semanaPageShown'));
        }
      }

      var PAGES_LIST = [
        { key: 'ganhos', el: homeListPageGanhos },
        { key: 'resumo', el: homeListPageResumo },
        { key: 'semana', el: homeListPageSemana },
        { key: 'relatorio', el: homeListPageRelatorio }
      ];
      function hideAllInstant () {
        PAGES_LIST.forEach(function (p) {
          if (!p.el) return;
          p.el.hidden = true;
        });
      }

      window.HomeNav = {
        goToSection: function (section) {
          showHomeListPage(section);
        },
        slideToSection: showHomeListPage,
        hideAllInstant: hideAllInstant,
        fadeInSection: showHomeListPage,
        getCurrentState: function () { return currentHeaderState; }
      };

      var btnVerMeuResumo = document.getElementById('btnVerMeuResumo');
      if (btnVerMeuResumo) {
        btnVerMeuResumo.addEventListener('click', function () {
          showHomeListPage('resumo');
        });
      }

      var btnRegistrarGanhos = document.getElementById('btnRegistrarGanhos');
      if (btnRegistrarGanhos) {
        btnRegistrarGanhos.addEventListener('click', function () {
          showHomeListPage('ganhos');
        });
      }

      showHomeListPage('ganhos');
    })();

    (function () {
      var btnTheme = document.getElementById('btnToggleTheme');
      if (!btnTheme) return;

      var THEME_STORAGE_KEY = 'appTheme';
      function loadSavedTheme () {
        try {
          return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
        } catch (e) {
          return 'light';
        }
      }
      function saveTheme (value) {
        try { localStorage.setItem(THEME_STORAGE_KEY, value); } catch (e) {}
      }

      var theme = loadSavedTheme();

      function applyTheme () {
        var isDark = theme === 'dark';
        document.documentElement.classList.toggle('theme-dark', isDark);
        document.body.classList.toggle('theme-dark', isDark);
        btnTheme.classList.toggle('is-alt', isDark);
        btnTheme.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      }

      btnTheme.addEventListener('click', function () {
        theme = (theme === 'dark') ? 'light' : 'dark';
        saveTheme(theme);
        applyTheme();
      });

      applyTheme();
    })();

    (function () {
      var vv = window.visualViewport;
      if (!vv) return;

      function fitOpenPopupsToVisibleArea () {
        var offsetTop = vv.offsetTop || 0;
        document.querySelectorAll('.modal-backdrop.visible').forEach(function (el) {
          if (document.body.classList.contains('ui-v2')) {
            el.style.top = 'calc(var(--ui-header) + ' + offsetTop + 'px)';
            el.style.height = 'calc(' + vv.height + 'px - var(--ui-header))';
          } else {
            el.style.top = offsetTop + 'px';
            el.style.height = vv.height + 'px';
          }
        });
      }

      function resetPopupPositions () {
        document.querySelectorAll('.modal-backdrop').forEach(function (el) {
          el.style.top    = '';
          el.style.height = '';
        });
      }

      vv.addEventListener('resize', fitOpenPopupsToVisibleArea);
      vv.addEventListener('scroll', fitOpenPopupsToVisibleArea);

      document.addEventListener('focusin', function (e) {
        var tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
          fitOpenPopupsToVisibleArea();
          setTimeout(fitOpenPopupsToVisibleArea, 60);
          setTimeout(fitOpenPopupsToVisibleArea, 300);
        }
      });
      document.addEventListener('focusout', function (e) {
        var tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
          setTimeout(resetPopupPositions, 60);
        }
      });
    })();

    // Como a conta entrou. 'google' esconde a troca de email e de password
    // (essas contas geram-se e mudam-se pela própria conta Google).
    var IS_GOOGLE = window.currentUserProvider === 'google';

    var state = {
      name: '',
      email: window.currentUserEmail || '',
      photo: null,
      vehicle: '',
      vehicleYear: '',
      driverSince: null
    };

    var PROFILE_STORAGE_KEY = 'mydocs.profile';
    // A coluna user_data aceita no máximo 400 KB. Reservamos uma margem para
    // os restantes campos do perfil e para caracteres UTF-8 no JSON.
    var PROFILE_STORAGE_SAFE_LIMIT = 390000;

    function serialiseProfile (photo) {
      return JSON.stringify({
        name: state.name,
        photo: photo,
        vehicle: state.vehicle,
        vehicleYear: state.vehicleYear,
        driverSince: state.driverSince
      });
    }

    function loadProfileFromStorage () {
      var hasSavedName = false;
      var hasSavedPhoto = false;
      try {
        var raw = cloudGet(PROFILE_STORAGE_KEY);
        if (raw) {
          var saved = JSON.parse(raw);
          if (saved && typeof saved === 'object') {
            if (typeof saved.name === 'string' && saved.name.trim()) { state.name = window.SmartSomaSecurity.cleanText(saved.name); hasSavedName = true; }
            if (window.SmartSomaSecurity.isSafeImageUrl(saved.photo)) { state.photo = saved.photo; hasSavedPhoto = true; }
            if (typeof saved.vehicle === 'string') state.vehicle = saved.vehicle;
            if (typeof saved.vehicleYear === 'string') state.vehicleYear = saved.vehicleYear;
            if (typeof saved.driverSince === 'string') state.driverSince = saved.driverSince;
          }
        }
      } catch (e) {
      }
      // Primeiro login com Google: usa o nome/foto já recolhidos pela conta
      // como ponto de partida. A pessoa pode trocar os dois à vontade em
      // Dados Pessoais — a partir daí o valor guardado é que manda.
      if (IS_GOOGLE) {
        if (!hasSavedName && window.currentUserGoogleName) state.name = window.currentUserGoogleName;
        if (!hasSavedPhoto && window.currentUserGoogleAvatar) state.photo = window.currentUserGoogleAvatar;
      }
    }

    function saveProfileToStorage () {
      try {
        var profileValue = serialiseProfile(state.photo);
        if (profileValue.length > PROFILE_STORAGE_SAFE_LIMIT) {
          return Promise.reject(new Error('Dados de perfil demasiado grandes para sincronizar.'));
        }
        return cloudSet(PROFILE_STORAGE_KEY, profileValue);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    loadProfileFromStorage();

    var AVATAR_PLACEHOLDER =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="8" r="3.4"/><path d="M4.5 20c1.2-3.6 4.2-5.6 7.5-5.6s6.3 2 7.5 5.6"/></svg>';

    var headerAvatarBtn = document.getElementById('headerAvatarBtn');
    var sheetAvatar      = document.getElementById('sheetAvatar');
    var sheetUsername    = document.getElementById('sheetUsername');
    var sheetVehicleInfo  = document.getElementById('sheetVehicleInfo');
    var sheetDriverSince  = document.getElementById('sheetDriverSince');
    var sheetBackdrop   = document.getElementById('sheetBackdrop');
    var profileSheet    = document.getElementById('profileSheet');
    var sheetHandleArea = document.getElementById('sheetHandleArea');
    var sheetHandleTitle = document.getElementById('sheetHandleTitle');
    var sheetCloseBtn   = document.getElementById('sheetCloseBtn');
    var sheetScreens         = document.querySelectorAll('.sheet-screen');
    var sheetScreenDefault   = document.getElementById('sheetScreenDefault');
    var sheetScreenDadosPessoais = document.getElementById('sheetScreenDadosPessoais');
    var sheetScreenAjuda         = document.getElementById('sheetScreenAjuda');
    var sheetScreenIdioma        = document.getElementById('sheetScreenIdioma');
    var sheetScreenDespesasFixas = document.getElementById('sheetScreenDespesasFixas');
    var sheetScreenMultiplataforma = document.getElementById('sheetScreenMultiplataforma');
    var sheetScreenTamanho       = document.getElementById('sheetScreenTamanho');
    var sheetScreenApagarDados   = document.getElementById('sheetScreenApagarDados');
    var openDadosPessoaisBtn = document.getElementById('openDadosPessoaisBtn');
    var openDespesasFixasBtn = document.getElementById('openDespesasFixasBtn');
    var openMultiplataformaBtn = document.getElementById('openMultiplataformaBtn');
    var openApagarDadosBtn   = document.getElementById('openApagarDadosBtn');
    var openAjudaBtn          = document.getElementById('openAjudaBtn');
    var openIdiomaBtn         = document.getElementById('openIdiomaBtn');
    var openTamanhoBtn        = document.getElementById('openTamanhoBtn');
    var dpNomeInput      = document.getElementById('dpNomeInput');
    var dpDriverSinceBtn   = document.getElementById('dpDriverSinceBtn');
    var dpDriverSinceLabel = document.getElementById('dpDriverSinceLabel');
    var dpPhotoThumb     = document.getElementById('dpPhotoThumb');
    var dpUploadPhotoBtn = document.getElementById('dpUploadPhotoBtn');
    var dpSaveBtn        = document.getElementById('dpSaveBtn');
    var dpChangePasswordBtn = document.getElementById('dpChangePasswordBtn');
    var driverSinceModalBackdrop = document.getElementById('driverSinceModalBackdrop');
    var driverSinceModalCard     = document.getElementById('driverSinceModalCard');
    var wheelDayCol   = document.getElementById('wheelDayCol');
    var wheelMonthCol = document.getElementById('wheelMonthCol');
    var wheelYearCol  = document.getElementById('wheelYearCol');
    var wheelSaveBtn  = document.getElementById('wheelSaveBtn');
    var photoModalBackdrop = document.getElementById('photoModalBackdrop');
    var photoModalCard     = document.getElementById('photoModalCard');
    var fileInput          = document.getElementById('fileInput');
    var photoStepCrop      = document.getElementById('photoStepCrop');
    var cropStage          = document.getElementById('cropStage');
    var cropImage          = document.getElementById('cropImage');
    var zoomRange           = document.getElementById('zoomRange');
    var cropCancelBtn      = document.getElementById('cropCancelBtn');
    var cropApplyBtn       = document.getElementById('cropApplyBtn');
    var photoViewBackdrop    = document.getElementById('photoViewBackdrop');
    var photoViewCloseBtn    = document.getElementById('photoViewCloseBtn');
    var photoViewStage       = document.getElementById('photoViewStage');
    var photoViewImage       = document.getElementById('photoViewImage');
    var photoViewPlaceholder = document.getElementById('photoViewPlaceholder');
    var photoViewChangeBtn   = document.getElementById('photoViewChangeBtn');

    var PROFILE_UI_READY = !!(headerAvatarBtn && sheetAvatar && sheetUsername &&
      sheetBackdrop && profileSheet && sheetHandleArea && sheetCloseBtn &&
      photoModalBackdrop && photoModalCard && fileInput &&
      photoStepCrop && cropStage && cropImage && zoomRange &&
      cropCancelBtn && cropApplyBtn);

    var PHOTO_VIEW_UI_READY = !!(photoViewBackdrop && photoViewCloseBtn &&
      photoViewStage && photoViewImage && photoViewPlaceholder && photoViewChangeBtn);

    var DP_UI_READY = !!(sheetScreenDadosPessoais && dpNomeInput && dpPhotoThumb &&
      dpUploadPhotoBtn && dpSaveBtn);

    function updateSheetScreenScrollFade (el) {
      if (!el) return;
      var maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 1) {
        el.classList.remove('has-scroll-top', 'has-scroll-bottom');
        return;
      }
      el.classList.toggle('has-scroll-top', el.scrollTop > 2);
      el.classList.toggle('has-scroll-bottom', el.scrollTop < maxScroll - 2);
    }

    function renderAvatar () {
      if (!PROFILE_UI_READY) return;
      var safePhoto = window.SmartSomaSecurity.isSafeImageUrl(state.photo) ? state.photo : null;
      state.photo = safePhoto;
      sheetAvatar.innerHTML = safePhoto ? '' : AVATAR_PLACEHOLDER;
      if (safePhoto) {
        var avatar = document.createElement('img');
        avatar.src = safePhoto;
        avatar.alt = I18N.t('photo.avatarAlt');
        sheetAvatar.appendChild(avatar);
      }
      sheetAvatar.classList.toggle('has-photo', !!state.photo);
      var profileHero = document.querySelector('#uiSettingsPage .sheet-profile-row');
      if (profileHero) {
        profileHero.style.setProperty('--profile-photo', safePhoto ? 'url("' + safePhoto.replace(/"/g, '\\"') + '")' : 'none');
        profileHero.classList.toggle('has-profile-photo', !!safePhoto);
      }
      if (dpPhotoThumb) {
        dpPhotoThumb.innerHTML = safePhoto ? '' : AVATAR_PLACEHOLDER;
        if (safePhoto) {
          var thumb = document.createElement('img');
          thumb.src = safePhoto;
          thumb.alt = I18N.t('photo.avatarAlt');
          dpPhotoThumb.appendChild(thumb);
        }
      }
      renderPhotoView();
    }

    // Nome mostrado no painel: o nome guardado ou, se não houver nenhum,
    // o texto genérico traduzido ("Utilizador" / "User" / "Usuario").
    function displayName () {
      return (state.name && state.name.trim()) ? state.name : I18N.t('sheet.defaultUser');
    }

    function renderName () {
      if (!PROFILE_UI_READY) return;
      sheetUsername.textContent = displayName();
    }

    function daysSince (isoDate) {
      var d = new Date(isoDate);
      d.setHours(0, 0, 0, 0);
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var diff = Math.round((today.getTime() - d.getTime()) / 86400000);
      return diff < 0 ? 0 : diff;
    }

    function yearsMonthsSince (isoDate) {
      var d = new Date(isoDate);
      d.setHours(0, 0, 0, 0);
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d > today) return { years: 0, months: 0 };
      var years = today.getFullYear() - d.getFullYear();
      var months = today.getMonth() - d.getMonth();
      if (today.getDate() < d.getDate()) months--;
      if (months < 0) { years--; months += 12; }
      if (years < 0) years = 0;
      return { years: years, months: months };
    }

    function driverSinceText (isoDate) {
      var diff = yearsMonthsSince(isoDate);
      if (diff.years === 0 && diff.months === 0) {
        return I18N.t('dp.daysOnApps', { n: daysSince(isoDate) });
      }
      var parts = [];
      if (diff.years > 0) parts.push(I18N.t(diff.years === 1 ? 'dp.yearOne' : 'dp.yearMany', { n: diff.years }));
      if (diff.months > 0) parts.push(I18N.t(diff.months === 1 ? 'dp.monthOne' : 'dp.monthMany', { n: diff.months }));
      return parts.join(I18N.t('dp.join')) + I18N.t('dp.onApps');
    }

    function renderProfileSummary () {
      if (!PROFILE_UI_READY) return;
      if (sheetVehicleInfo) {
        sheetVehicleInfo.textContent = state.email;
      }
      if (sheetDriverSince) {
        // Sem data preenchida ainda: esconde a linha em vez de mostrar
        // "0 dias nos Apps.".
        if (state.driverSince) {
          sheetDriverSince.hidden = false;
          sheetDriverSince.textContent = driverSinceText(state.driverSince);
        } else {
          sheetDriverSince.hidden = true;
          sheetDriverSince.textContent = '';
        }
      }
    }

    renderName();
    renderProfileSummary();

    // Troca de idioma: nome genérico, tempo "nos Apps" e formulário de dados.
    document.addEventListener('languageChanged', function () {
      renderName();
      renderProfileSummary();
      if (DP_UI_READY) fillDadosPessoaisForm();
    });

    function anyOverlayOpen () {
      if (document.querySelector('.mm-backdrop.visible, .modal-backdrop.visible, .ui-entry-backdrop.visible')) return true;
      if (!PROFILE_UI_READY) return false;
      return profileSheet.classList.contains('open') ||
             photoModalBackdrop.classList.contains('visible') ||
             (photoViewBackdrop && photoViewBackdrop.classList.contains('visible')) ||
             (driverSinceModalBackdrop && driverSinceModalBackdrop.classList.contains('visible'));
    }
    // Trava o scroll do fundo fixando o body no lugar (em vez de usar
    // overflow:hidden). O overflow:hidden funciona bem no preview desktop,
    // mas em WebViews Android costuma disparar um recálculo/"flash" dos
    // elementos fixos (o cabeçalho preto) ao ligar/desligar. Fixar a
    // posição evita esse recálculo em qualquer plataforma.
    var bodyScrollLockY = 0;
    function syncBodyScroll () {
      var shouldLock = anyOverlayOpen();
      var isLocked = document.body.style.position === 'fixed';
      if (shouldLock && !isLocked) {
        bodyScrollLockY = window.scrollY || window.pageYOffset || 0;
        document.body.style.position = 'fixed';
        document.body.style.top = (-bodyScrollLockY) + 'px';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
      } else if (!shouldLock && isLocked) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, bodyScrollLockY);
      }
    }
    new MutationObserver(function () { syncBodyScroll(); }).observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'open']
    });

    var closeResetTimer = null;

    function openProfileSheet () {
      if (!PROFILE_UI_READY) return;
      if (closeResetTimer) { clearTimeout(closeResetTimer); closeResetTimer = null; }
      sheetBackdrop.classList.add('visible');
      profileSheet.classList.add('open');
      profileSheet.setAttribute('aria-hidden', 'false');
      headerAvatarBtn.setAttribute('aria-expanded', 'true');
      syncBodyScroll();
      var activeSheetScreenEl = document.querySelector('.sheet-screen.is-active');
      if (activeSheetScreenEl) {
        requestAnimationFrame(function () { updateSheetScreenScrollFade(activeSheetScreenEl); });
      }
    }

    function closeProfileSheet () {
      if (!PROFILE_UI_READY) return;
      sheetBackdrop.classList.remove('visible');
      profileSheet.classList.remove('open');
      profileSheet.setAttribute('aria-hidden', 'true');
      headerAvatarBtn.setAttribute('aria-expanded', 'false');
      syncBodyScroll();
      sheetScreens.forEach(function (s) { s.scrollTop = 0; });
      sheetNavStack = [];
      if (closeResetTimer) clearTimeout(closeResetTimer);
      closeResetTimer = setTimeout(function () {
        closeResetTimer = null;
        openSheetScreen(sheetScreenDefault, I18N.t('sheet.title'), { push: false });
      }, 220);
    }

    function goToSheetScreen (targetEl) {
      if (!targetEl) return;
      sheetScreens.forEach(function (s) {
        if (s === targetEl) {
          s.hidden = false;
          requestAnimationFrame(function () {
            s.classList.add('is-active');
            updateSheetScreenScrollFade(s);
          });
        } else if (s.classList.contains('is-active')) {
          s.classList.remove('is-active');
          setTimeout(function () { if (!s.classList.contains('is-active')) s.hidden = true; }, 280);
        }
      });
    }

    var sheetNavStack = [];

    function openSheetScreen (targetEl, title, opts) {
      if (!targetEl) return;
      var push = !opts || opts.push !== false;
      if (push) {
        var current = document.querySelector('.sheet-screen.is-active');
        if (current && current !== targetEl) {
          sheetNavStack.push({ el: current, title: sheetHandleTitle ? sheetHandleTitle.textContent : '' });
        }
      }
      goToSheetScreen(targetEl);
      var isDefault = targetEl === sheetScreenDefault;
      if (sheetHandleTitle) sheetHandleTitle.textContent = title;
      if (sheetCloseBtn) {
        sheetCloseBtn.classList.toggle('is-alt', !isDefault);
        sheetCloseBtn.setAttribute('aria-label', I18N.t(isDefault ? 'app.close' : 'app.back'));
      }
    }

    function goBackSheetScreen () {
      if (sheetNavStack.length) {
        var prev = sheetNavStack.pop();
        openSheetScreen(prev.el, prev.title, { push: false });
      } else {
        openSheetScreen(sheetScreenDefault, I18N.t('sheet.title'), { push: false });
      }
    }

    var cropState = null;

    function openPhotoModal () {
      if (!PROFILE_UI_READY) return;
      photoModalBackdrop.classList.add('visible');
      syncBodyScroll();
    }
    function closePhotoModal () {
      if (!PROFILE_UI_READY) return;
      photoModalBackdrop.classList.remove('visible');
      fileInput.value = '';
      syncBodyScroll();
    }

    // ---- Visualização ampliada da foto de perfil (tela cheia) ----
    function renderPhotoView () {
      if (!PHOTO_VIEW_UI_READY) return;
      if (state.photo) {
        photoViewImage.src = state.photo;
        photoViewImage.hidden = false;
        photoViewPlaceholder.hidden = true;
      } else {
        photoViewImage.hidden = true;
        photoViewImage.removeAttribute('src');
        photoViewPlaceholder.hidden = false;
      }
    }
    function openPhotoView () {
      if (!PHOTO_VIEW_UI_READY || !state.photo) return;
      renderPhotoView();
      photoViewBackdrop.classList.add('visible');
      syncBodyScroll();
    }
    function closePhotoView () {
      if (!PHOTO_VIEW_UI_READY) return;
      photoViewBackdrop.classList.remove('visible');
      syncBodyScroll();
    }

    // ---- Dados Pessoais: formulário ----
    var dpEmailOriginal = '';

    function fillDadosPessoaisForm () {
      if (!DP_UI_READY) return;
      dpNomeInput.value = state.name || '';
      var dpEmailInputEl = document.getElementById('dpEmailInput');
      if (dpEmailInputEl) {
        dpEmailInputEl.value = state.email;
        dpEmailOriginal = state.email;
        // Quem entrou com Google só troca o email pela própria conta
        // Google; quem entrou com email/senha pode editá-lo aqui.
        dpEmailInputEl.readOnly = IS_GOOGLE;
        dpEmailInputEl.classList.toggle('dp-input-readonly', IS_GOOGLE);
        if (IS_GOOGLE) {
          dpEmailInputEl.setAttribute('aria-readonly', 'true');
          dpEmailInputEl.setAttribute('tabindex', '-1');
        } else {
          dpEmailInputEl.removeAttribute('aria-readonly');
          dpEmailInputEl.removeAttribute('tabindex');
        }
      }
      if (dpChangePasswordBtn) dpChangePasswordBtn.hidden = IS_GOOGLE;
    }

    function formatDpDate (d) {
      var dd = String(d.getDate()).padStart(2, '0');
      var mm = DP_MONTH_ABBR()[d.getMonth()];
      return I18N.t('fmt.dpDate', { d: dd, m: mm, y: d.getFullYear() });
    }

    // ---- Dados Pessoais: seletor de data rotativo (dia / mês / ano) ----
    function DP_MONTH_ABBR () { return I18N.list('months.abbrCap'); }
    // A altura do item é lida do CSS (1.875rem) em vez de fixa, porque o
    // tamanho de letra Pequeno/Médio muda o valor real em pixels.
    function wheelItemHeightPx () {
      var remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return 1.875 * remPx;
    }
    var WHEEL_ITEM_H = wheelItemHeightPx();
    var wheelYearsList = [];

    function buildWheelColumn (el, labels, initialIndex) {
      if (!el) return;
      el.innerHTML = '';
      labels.forEach(function (label) {
        var item = document.createElement('div');
        item.className = 'mm-wheel-item';
        item.textContent = label;
        el.appendChild(item);
      });
      requestAnimationFrame(function () {
        el.scrollTop = Math.max(0, initialIndex) * WHEEL_ITEM_H;
        updateWheelSelection(el);
      });
    }

    function updateWheelSelection (el) {
      if (!el) return 0;
      var idx = Math.round(el.scrollTop / WHEEL_ITEM_H);
      var items = el.querySelectorAll('.mm-wheel-item');
      idx = Math.max(0, Math.min(items.length - 1, idx));
      items.forEach(function (it, i) { it.classList.toggle('is-selected', i === idx); });
      return idx;
    }

    function openDriverSinceModal () {
      WHEEL_ITEM_H = wheelItemHeightPx();
      if (!DP_UI_READY) return;
      var base = state.driverSince ? new Date(state.driverSince) : new Date();
      base.setHours(0, 0, 0, 0);

      var currentYear = new Date().getFullYear();
      wheelYearsList = [];
      for (var y = currentYear - 60; y <= currentYear; y++) wheelYearsList.push(y);

      var dayLabels = [];
      for (var d = 1; d <= 31; d++) dayLabels.push(String(d));

      buildWheelColumn(wheelDayCol, dayLabels, base.getDate() - 1);
      buildWheelColumn(wheelMonthCol, DP_MONTH_ABBR(), base.getMonth());
      var yearIdx = wheelYearsList.indexOf(base.getFullYear());
      buildWheelColumn(wheelYearCol, wheelYearsList.map(String), yearIdx < 0 ? wheelYearsList.length - 1 : yearIdx);

      driverSinceModalBackdrop.classList.add('visible');
      syncBodyScroll();
    }

    function closeDriverSinceModal () {
      if (!DP_UI_READY) return;
      driverSinceModalBackdrop.classList.remove('visible');
      syncBodyScroll();
    }

    function initCrop () {
      var stageSize = cropStage.getBoundingClientRect().width;
      var circleSize = stageSize * 0.84;
      var naturalW = cropImage.naturalWidth;
      var naturalH = cropImage.naturalHeight;
      var minScale = circleSize / Math.min(naturalW, naturalH);

      cropState = {
        naturalW: naturalW,
        naturalH: naturalH,
        circleSize: circleSize,
        minScale: minScale,
        scale: minScale,
        offsetX: 0,
        offsetY: 0
      };

      zoomRange.value = 1;
      applyCropTransform();
    }

    function clampCropOffsets () {
      var w = cropState.naturalW * cropState.scale;
      var h = cropState.naturalH * cropState.scale;
      var maxOffsetX = Math.max(0, (w - cropState.circleSize) / 2);
      var maxOffsetY = Math.max(0, (h - cropState.circleSize) / 2);
      cropState.offsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, cropState.offsetX));
      cropState.offsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, cropState.offsetY));
    }

    function applyCropTransform () {
      var w = cropState.naturalW * cropState.scale;
      var h = cropState.naturalH * cropState.scale;
      cropImage.style.width = w + 'px';
      cropImage.style.height = h + 'px';
      cropImage.style.transform =
        'translate(calc(-50% + ' + cropState.offsetX + 'px), calc(-50% + ' + cropState.offsetY + 'px))';
    }

    function closeBlockingPopupsForMenu () {
      if (document.querySelector('.mm-backdrop.visible')) closeAllOverlays();
      if (photoModalBackdrop.classList.contains('visible')) closePhotoModal();
      if (PHOTO_VIEW_UI_READY && photoViewBackdrop.classList.contains('visible')) closePhotoView();
      if (driverSinceModalBackdrop && driverSinceModalBackdrop.classList.contains('visible')) closeDriverSinceModal();
    }

    if (PROFILE_UI_READY) {
      sheetScreens.forEach(function (s) {
        updateSheetScreenScrollFade(s);
        s.addEventListener('scroll', function () { updateSheetScreenScrollFade(s); }, { passive:true });
      });
      window.addEventListener('resize', function () {
        sheetScreens.forEach(function (s) { updateSheetScreenScrollFade(s); });
      });
      headerAvatarBtn.addEventListener('click', function () {
        closeBlockingPopupsForMenu();
        if (profileSheet.classList.contains('open')) { closeProfileSheet(); } else { openProfileSheet(); }
      });
      sheetBackdrop.addEventListener('click', closeProfileSheet);
      if (PHOTO_VIEW_UI_READY) {
        sheetAvatar.addEventListener('click', openPhotoView);
        sheetAvatar.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            openPhotoView();
          }
        });
        photoViewBackdrop.addEventListener('click', function (e) {
          if (e.target === photoViewBackdrop) closePhotoView();
        });
        photoViewStage.addEventListener('click', function (e) { e.stopPropagation(); });
        photoViewCloseBtn.addEventListener('click', closePhotoView);
        photoViewChangeBtn.addEventListener('click', function () {
          closePhotoView();
          if (fileInput) fileInput.click();
        });
      }
      sheetCloseBtn.addEventListener('click', function () {
        if (sheetCloseBtn.classList.contains('is-alt')) {
          goBackSheetScreen();
        } else {
          closeProfileSheet();
        }
      });

      if (openDadosPessoaisBtn) {
        openDadosPessoaisBtn.addEventListener('click', function () {
          if (DP_UI_READY) fillDadosPessoaisForm();
          openSheetScreen(sheetScreenDadosPessoais, I18N.t('sheet.perfil'));
        });
      }
      if (openDespesasFixasBtn) {
        openDespesasFixasBtn.addEventListener('click', function () {
          openSheetScreen(sheetScreenDespesasFixas, I18N.t('sheet.despesasFixas'));
        });
      }
      if (openApagarDadosBtn) {
        openApagarDadosBtn.addEventListener('click', function () {
          openSheetScreen(sheetScreenApagarDados, I18N.t('sheet.apagarDados'));
        });
      }
      if (openTamanhoBtn) {
        openTamanhoBtn.addEventListener('click', function () {
          if (window.TamanhoScreen) window.TamanhoScreen.prepare();
          openSheetScreen(sheetScreenTamanho, I18N.t('sheet.tamanho'));
        });
      }
      if (openAjudaBtn) {
        openAjudaBtn.addEventListener('click', function () {
          openSheetScreen(sheetScreenAjuda, I18N.t('sheet.ajuda'));
        });
      }
      if (openIdiomaBtn) {
        openIdiomaBtn.addEventListener('click', function () {
          if (window.IdiomaScreen) window.IdiomaScreen.prepare();
          openSheetScreen(sheetScreenIdioma, I18N.t('sheet.idioma'));
        });
      }

      photoModalBackdrop.addEventListener('click', function (e) {
        if (e.target === photoModalBackdrop) closePhotoModal();
      });
      photoModalCard.addEventListener('click', function (e) { e.stopPropagation(); });

      var cropSourceUrl = '';

      function releaseCropSource () {
        if (cropSourceUrl) URL.revokeObjectURL(cropSourceUrl);
        cropSourceUrl = '';
      }

      async function imageBlobForCrop (file) {
        var extension = String(file.name || '').split('.').pop().toLowerCase();
        var isHeic = file.type === 'image/heic' || file.type === 'image/heif' || extension === 'heic' || extension === 'heif';
        if (!isHeic) return file;
        if (typeof window.heic2any !== 'function') throw new Error('Conversor HEIC indisponível.');
        var converted = await window.heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
        return Array.isArray(converted) ? converted[0] : converted;
      }

      fileInput.addEventListener('change', async function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!(await window.SmartSomaSecurity.validateImageFile(file))) {
          fileInput.value = '';
          alert('Selecione uma imagem JPEG, PNG, WebP ou HEIC válida.');
          return;
        }
        try {
          var sourceBlob = await imageBlobForCrop(file);
          releaseCropSource();
          cropSourceUrl = URL.createObjectURL(sourceBlob);
          cropImage.onload = function () {
            initCrop();
            openPhotoModal();
          };
          cropImage.onerror = function () {
            releaseCropSource();
            alert('Não foi possível abrir esta imagem.');
          };
          cropImage.src = cropSourceUrl;
        } catch (error) {
          console.error('Falha ao preparar a imagem de perfil:', error);
          alert('Não foi possível preparar esta imagem.');
        } finally {
          fileInput.value = '';
        }
      });

      zoomRange.addEventListener('input', function () {
        if (!cropState) return;
        var zoomFactor = parseFloat(zoomRange.value);
        cropState.scale = cropState.minScale * zoomFactor;
        clampCropOffsets();
        applyCropTransform();
      });

      (function enableCropDrag () {
        var dragging = false, startX = 0, startY = 0, originX = 0, originY = 0;

        cropStage.addEventListener('pointerdown', function (e) {
          if (!cropState) return;
          dragging = true;
          startX = e.clientX; startY = e.clientY;
          originX = cropState.offsetX; originY = cropState.offsetY;
          cropStage.classList.add('grabbing');
          cropStage.setPointerCapture(e.pointerId);
        });

        cropStage.addEventListener('pointermove', function (e) {
          if (!dragging || !cropState) return;
          cropState.offsetX = originX + (e.clientX - startX);
          cropState.offsetY = originY + (e.clientY - startY);
          clampCropOffsets();
          applyCropTransform();
        });

        function endDrag () {
          dragging = false;
          cropStage.classList.remove('grabbing');
        }
        cropStage.addEventListener('pointerup', endDrag);
        cropStage.addEventListener('pointercancel', endDrag);
      })();

      cropCancelBtn.addEventListener('click', function () {
        closePhotoModal();
      });

      cropApplyBtn.addEventListener('click', async function () {
        if (!cropState) return;
        var outputSize = 512;
        var canvas = document.createElement('canvas');
        canvas.width = outputSize;
        canvas.height = outputSize;
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, outputSize, outputSize);

        ctx.beginPath();
        ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        var ratio = outputSize / cropState.circleSize;
        var drawW = cropState.naturalW * cropState.scale * ratio;
        var drawH = cropState.naturalH * cropState.scale * ratio;
        var drawX = outputSize / 2 - drawW / 2 + cropState.offsetX * ratio;
        var drawY = outputSize / 2 - drawH / 2 + cropState.offsetY * ratio;

        ctx.drawImage(cropImage, drawX, drawY, drawW, drawH);

        var previousPhoto = state.photo;
        cropApplyBtn.disabled = true;
        cropApplyBtn.setAttribute('aria-busy', 'true');
        try {
          var avatarBlob = await new Promise(function (resolve, reject) {
            canvas.toBlob(function (blob) {
              if (blob) resolve(blob);
              else reject(new Error('Falha ao gerar o avatar.'));
            }, 'image/jpeg', 0.9);
          });
          if (!window.SmartSomaAvatarStorage || typeof window.SmartSomaAvatarStorage.upload !== 'function') {
            throw new Error('Armazenamento de avatar indisponível.');
          }
          state.photo = await window.SmartSomaAvatarStorage.upload(avatarBlob);
          renderAvatar();
          await saveProfileToStorage();
          closePhotoModal();
        } catch (error) {
          console.error('Falha ao guardar a foto de perfil:', error);
          state.photo = previousPhoto;
          renderAvatar();
          alert('Não foi possível guardar a foto. Tente novamente.');
        } finally {
          cropApplyBtn.disabled = false;
          cropApplyBtn.removeAttribute('aria-busy');
          releaseCropSource();
        }
      });
    }

    if (DP_UI_READY) {
      dpUploadPhotoBtn.addEventListener('click', function () {
        if (PROFILE_UI_READY && fileInput) fileInput.click();
      });

      if (dpDriverSinceBtn) dpDriverSinceBtn.addEventListener('click', openDriverSinceModal);

      if (driverSinceModalBackdrop) driverSinceModalBackdrop.addEventListener('click', function (e) {
        if (e.target === driverSinceModalBackdrop) closeDriverSinceModal();
      });
      if (driverSinceModalCard) driverSinceModalCard.addEventListener('click', function (e) { e.stopPropagation(); });

      [wheelDayCol, wheelMonthCol, wheelYearCol].filter(Boolean).forEach(function (col) {
        var scrollTimer = null;
        col.addEventListener('scroll', function () {
          clearTimeout(scrollTimer);
          scrollTimer = setTimeout(function () { updateWheelSelection(col); }, 90);
        });
      });

      if (wheelSaveBtn) wheelSaveBtn.addEventListener('click', function () {
        var dayIdx = updateWheelSelection(wheelDayCol);
        var monthIdx = updateWheelSelection(wheelMonthCol);
        var yearIdx = updateWheelSelection(wheelYearCol);
        var day = dayIdx + 1;
        var month = monthIdx;
        var year = wheelYearsList[yearIdx] || new Date().getFullYear();
        var picked = new Date(year, month, Math.min(day, new Date(year, month + 1, 0).getDate()));
        picked.setHours(0, 0, 0, 0);
        state.driverSince = picked.toISOString();
        if (dpDriverSinceLabel) dpDriverSinceLabel.textContent = formatDpDate(picked);
        closeDriverSinceModal();
      });

      var dpEmailInputEl = document.getElementById('dpEmailInput');

      function isValidEmail (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      }

      dpSaveBtn.addEventListener('click', function () {
        var nome = window.SmartSomaSecurity.cleanText(dpNomeInput.value);
        if (nome) state.name = nome;

        // Só quem entrou com email/senha pode trocar o email, e só entra
        // no fluxo de confirmação se o valor realmente mudou.
        var novoEmail = (!IS_GOOGLE && dpEmailInputEl) ? dpEmailInputEl.value.trim() : '';
        var emailMudou = novoEmail && novoEmail !== dpEmailOriginal && isValidEmail(novoEmail);

        renderName();
        saveProfileToStorage();

        if (emailMudou) {
          if (window.EmailChangeModal) window.EmailChangeModal.open(novoEmail);
          return;
        }

        renderProfileSummary();
        openSheetScreen(sheetScreenDefault, I18N.t('sheet.title'));
      });

      if (dpChangePasswordBtn) {
        dpChangePasswordBtn.addEventListener('click', function () {
          if (window.PasswordChangeModal) window.PasswordChangeModal.open();
        });
      }
    }

    renderAvatar();

    /* ---- Ecrã "Confirmar novo email" (dentro de Ajustes) ----
       Só existe para quem entrou com email/senha (ver IS_GOOGLE). Pede a
       password atual, reautentica com ela e só então chama updateUser —
       a troca real só se completa quando a pessoa confirmar o link
       enviado para o novo endereço. */
    (function () {
      var screenEl    = document.getElementById('sheetScreenEmailChange');
      var formView    = document.getElementById('emailChangeFormView');
      var successView = document.getElementById('emailChangeSuccessView');
      var passInput   = document.getElementById('emailChangePasswordInput');
      var errorEl     = document.getElementById('emailChangeError');
      var continueBtn = document.getElementById('emailChangeContinueBtn');
      var okBtn       = document.getElementById('emailChangeOkBtn');
      if (!screenEl || !continueBtn) return;

      var pendingEmail = '';

      function reset () {
        passInput.value = '';
        errorEl.textContent = '';
        formView.hidden = false;
        successView.hidden = true;
        continueBtn.disabled = false;
        continueBtn.textContent = I18N.t('emailChange.continuar');
      }

      function open (novoEmail) {
        pendingEmail = novoEmail;
        reset();
        openSheetScreen(screenEl, I18N.t('emailChange.title'));
      }

      function close () {
        goBackSheetScreen();
      }

      continueBtn.addEventListener('click', function () {
        var pass = passInput.value;
        if (!pass) {
          errorEl.textContent = I18N.t('emailChange.erroSenha');
          return;
        }
        if (!window.AuthAPI) { errorEl.textContent = I18N.t('emailChange.erroGenerico'); return; }

        continueBtn.disabled = true;
        continueBtn.textContent = I18N.t('emailChange.aguarde');
        errorEl.textContent = '';

        window.AuthAPI.verifyPassword(pass).then(function (res) {
          if (res && res.error) {
            errorEl.textContent = I18N.t('emailChange.erroSenha');
            continueBtn.disabled = false;
            continueBtn.textContent = I18N.t('emailChange.continuar');
            return;
          }
          window.AuthAPI.updateEmail(pendingEmail).then(function (res2) {
            continueBtn.disabled = false;
            continueBtn.textContent = I18N.t('emailChange.continuar');
            if (res2 && res2.error) {
              errorEl.textContent = I18N.t('emailChange.erroGenerico');
              return;
            }
            formView.hidden = true;
            successView.hidden = false;
          }).catch(function () {
            continueBtn.disabled = false;
            continueBtn.textContent = I18N.t('emailChange.continuar');
            errorEl.textContent = I18N.t('emailChange.erroGenerico');
          });
        }).catch(function () {
          continueBtn.disabled = false;
          continueBtn.textContent = I18N.t('emailChange.continuar');
          errorEl.textContent = I18N.t('emailChange.erroGenerico');
        });
      });

      if (okBtn) okBtn.addEventListener('click', close);

      window.EmailChangeModal = { open: open, close: close };
    })();

    /* ---- Ecrã "Alterar password" (dentro de Ajustes) ----
       Também só para quem entrou com email/senha. Confirma a password
       atual antes de aceitar a nova, para evitar que alguém troque a
       password de uma sessão aberta sem confirmar quem é. */
    (function () {
      var screenEl  = document.getElementById('sheetScreenPasswordChange');
      var oldInput  = document.getElementById('pwdChangeOldInput');
      var newInput  = document.getElementById('pwdChangeNewInput');
      var confirmInput = document.getElementById('pwdChangeConfirmInput');
      var errorEl   = document.getElementById('pwdChangeError');
      var concluirBtn = document.getElementById('pwdChangeConcluirBtn');
      if (!screenEl || !concluirBtn) return;

      function reset () {
        oldInput.value = '';
        newInput.value = '';
        confirmInput.value = '';
        errorEl.textContent = '';
        concluirBtn.disabled = false;
        concluirBtn.textContent = I18N.t('pwdChange.concluir');
      }

      function open () {
        reset();
        openSheetScreen(screenEl, I18N.t('pwdChange.title'));
      }

      function close () {
        goBackSheetScreen();
      }

      concluirBtn.addEventListener('click', function () {
        var oldPass = oldInput.value;
        var newPass = newInput.value;
        var confirmPass = confirmInput.value;

        if (!oldPass) { errorEl.textContent = I18N.t('pwdChange.erroSenha'); return; }
        if (newPass.length < 10 || !/[a-z]/.test(newPass) || !/[A-Z]/.test(newPass) || !/[0-9]/.test(newPass)) { errorEl.textContent = I18N.t('pwdChange.erroCurta'); return; }
        if (newPass !== confirmPass) { errorEl.textContent = I18N.t('pwdChange.erroDiferente'); return; }
        if (!window.AuthAPI) { errorEl.textContent = I18N.t('pwdChange.erroGenerico'); return; }

        concluirBtn.disabled = true;
        concluirBtn.textContent = I18N.t('pwdChange.aguarde');
        errorEl.textContent = '';

        window.AuthAPI.verifyPassword(oldPass).then(function (res) {
          if (res && res.error) {
            errorEl.textContent = I18N.t('pwdChange.erroSenha');
            concluirBtn.disabled = false;
            concluirBtn.textContent = I18N.t('pwdChange.concluir');
            return;
          }
          window.AuthAPI.updatePassword(newPass).then(function (res2) {
            if (res2 && res2.error) {
              concluirBtn.disabled = false;
              concluirBtn.textContent = I18N.t('pwdChange.concluir');
              errorEl.textContent = I18N.t('pwdChange.erroGenerico');
              return;
            }
            errorEl.style.color = 'var(--brand-green)';
            errorEl.textContent = I18N.t('pwdChange.sucesso');
            concluirBtn.textContent = I18N.t('pwdChange.concluir');
            setTimeout(function () { errorEl.style.color = ''; close(); }, 1200);
          }).catch(function () {
            concluirBtn.disabled = false;
            concluirBtn.textContent = I18N.t('pwdChange.concluir');
            errorEl.textContent = I18N.t('pwdChange.erroGenerico');
          });
        }).catch(function () {
          concluirBtn.disabled = false;
          concluirBtn.textContent = I18N.t('pwdChange.concluir');
          errorEl.textContent = I18N.t('pwdChange.erroGenerico');
        });
      });

      window.PasswordChangeModal = { open: open, close: close };
    })();

    // Usado pelo ecrã "Idioma" para abrir/fechar o painel de Ajustes.
    window.closeProfileSheetPublic = closeProfileSheet;
    window.openProfileSheetPublic = openProfileSheet;
    window.openSheetScreenPublic = openSheetScreen;
    window.goBackSheetScreenPublic = goBackSheetScreen;
    window.openProfileSheetPublic = openProfileSheet;



    (function () {

      function isVisible (el, cls) {
        return !!(el && el.classList.contains(cls));
      }

      var exitArmed = false;
      var exitTimer = null;

      function handleBackAtHome () {
        if (exitArmed) {
          if (window.AndroidExit && typeof AndroidExit.exitApp === 'function') {
            AndroidExit.exitApp();
          }
          return;
        }
        exitArmed = true;
        if (window.AndroidExit && typeof AndroidExit.showExitToast === 'function') {
          AndroidExit.showExitToast();
        }
        if (exitTimer) clearTimeout(exitTimer);
        exitTimer = setTimeout(function () { exitArmed = false; }, 2000);
      }

      function cancelExitArm () {
        exitArmed = false;
        if (exitTimer) { clearTimeout(exitTimer); exitTimer = null; }
      }

      window.addEventListener('popstate', function () {

        var quickNavOverlay = document.getElementById('screenOverlay');
        if (quickNavOverlay && quickNavOverlay.classList.contains('is-active')) {
          if (window.QuickNavMenu) window.QuickNavMenu.close();
          cancelExitArm();
          return;
        }

        var nestedConfirm = document.querySelector('.mm-backdrop[data-mm-nested="true"].visible');
        if (nestedConfirm) {
          nestedConfirm.classList.remove('visible');
          cancelExitArm();
          return;
        }

        var openBackdrop = document.querySelector('.mm-backdrop.visible:not([data-mm-nested="true"])');
        if (openBackdrop) {
          openBackdrop.classList.remove('visible');
          cancelExitArm();
          return;
        }

        if (isVisible(photoModalBackdrop, 'visible')) {
          closePhotoModal();
          cancelExitArm();
          return;
        }

        if (PHOTO_VIEW_UI_READY && isVisible(photoViewBackdrop, 'visible')) {
          closePhotoView();
          cancelExitArm();
          return;
        }

        if (isVisible(profileSheet, 'open')) {
          var activeSheetScreen = document.querySelector('.sheet-screen.is-active');
          if (typeof sheetScreenDefault !== 'undefined' && sheetScreenDefault &&
              activeSheetScreen && activeSheetScreen !== sheetScreenDefault) {
            goBackSheetScreen();
          } else {
            closeProfileSheet();
          }
          cancelExitArm();
          return;
        }

        if (window.AppNav && !window.AppNav.isHomeActive()) {
          window.AppNav.goBack();
          cancelExitArm();
          return;
        }

        if (window.HomeNav && window.HomeNav.getCurrentState && window.HomeNav.getCurrentState() !== 'default') {
          window.HomeNav.goToSection('ganhos');
          cancelExitArm();
          return;
        }

        handleBackAtHome();
      });

    })();



    (function () {
      var ANIMATION_DURATION = 1400;
      var startTime = Date.now();

      function reveal () {
        var splash  = document.getElementById('splash');
        var appRoot = document.getElementById('appRoot');
        if (appRoot) appRoot.classList.add('visible');
        if (splash) {
          splash.addEventListener('transitionend', function (event) {
            if (event.target === splash && event.propertyName === 'opacity') splash.remove();
          });
          splash.classList.add('fade-out');
          // A classe pode ser adiada pelo tempo mínimo do splash em app.html.
          setTimeout(function () { splash.remove(); }, 3500);
        }
      }

      function revealWhenReady () {
        var elapsed   = Date.now() - startTime;
        var remaining = ANIMATION_DURATION - elapsed;
        if (remaining > 0) {
          setTimeout(reveal, remaining);
        } else {
          reveal();
        }
      }

      // O evento load pode ficar à espera de imagens externas sem ligação.
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', revealWhenReady, { once: true });
      } else {
        revealWhenReady();
      }
    })();



    (function () {
      var svgMenuBtn    = document.getElementById('svgMenuBtn');
      var navContainer  = document.getElementById('navContainer');
      var screenOverlay = document.getElementById('screenOverlay');
      if (!svgMenuBtn || !navContainer || !screenOverlay) return;

      var isOpen = false;

      function toggleMenu () {
        isOpen = !isOpen;
        navContainer.classList.toggle('menu-active', isOpen);
        screenOverlay.classList.toggle('is-active', isOpen);
      }

      function closeMenu () {
        if (!isOpen) return;
        toggleMenu();
      }

      svgMenuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
      });

      screenOverlay.addEventListener('click', function () {
        closeMenu();
      });

      navContainer.querySelectorAll('.menu-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var section = btn.getAttribute('data-nav');
          if (window.HomeNav && section) window.HomeNav.goToSection(section);
          closeMenu();
        });
      });

      window.QuickNavMenu = { close: closeMenu };
    })();



    /* Comemoração ao bater a meta semanal: o card da meta pisca em verde
       (fade in/out lento) e, ao mesmo tempo, confetes jorram de trás do
       card para cima e caem lentamente. Dura poucos segundos e some. */
    (function () {
      var canvas = document.getElementById('metaConfettiCanvas');
      var card   = document.getElementById('metaSemanalCard');
      if (!canvas || !card) return;

      var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      var CORES = ['#1e9e5a', '#21d0b2', '#f5b73d', '#e8604c', '#5b8def', '#ffffff'];
      var BURST_H = 420;          // altura da área de animação acima do card
      var DURACAO = 3900;         // ms
      var particulas = [];
      var rafId = null;
      var inicio = 0;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);

      function ajustarCanvas () {
        var largura = card.offsetWidth || canvas.parentNode.offsetWidth || 320;
        canvas.style.height = BURST_H + 'px';
        canvas.width  = Math.round(largura * dpr);
        canvas.height = Math.round(BURST_H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return largura;
      }

      function criarParticulas (largura) {
        particulas = [];
        var total = 90;
        for (var i = 0; i < total; i++) {
          // Saem de trás do card (base da área) espalhadas na largura,
          // com impulso para cima e leve abertura lateral. Cada uma some
          // em um ponto diferente da descida — algumas somem chegando
          // perto do card, outras somem no meio do caminho.
          var fadeInicioFrac = 0.38 + Math.random() * 0.37;   // 38%–75% da animação
          particulas.push({
            x: largura * (0.5 + (Math.random() - 0.5) * 0.7),
            y: BURST_H + 10,
            vx: (Math.random() - 0.5) * 3.2,
            vy: -(6.5 + Math.random() * 4.5),
            g: 0.075 + Math.random() * 0.035,
            drag: 0.988 + Math.random() * 0.008,
            w: 5 + Math.random() * 5,
            h: 8 + Math.random() * 6,
            cor: CORES[(Math.random() * CORES.length) | 0],
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.18,
            balanco: Math.random() * Math.PI * 2,
            fadeInicioFrac: fadeInicioFrac,
            fadeDurFrac: 0.2 + Math.random() * 0.25
          });
        }
      }

      function desenhar (agora) {
        var decorrido = agora - inicio;
        var progresso = decorrido / DURACAO;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (progresso >= 1) {
          parar();
          return;
        }

        for (var i = 0; i < particulas.length; i++) {
          var p = particulas[i];
          p.vy += p.g;
          p.vy *= p.drag;   // ar "segura" a queda, confete é leve
          p.vx *= p.drag;
          p.balanco += 0.05;
          p.x += p.vx + Math.sin(p.balanco) * 0.8;
          p.y += p.vy;
          p.rot += p.vr;

          // Cada partícula desaparece de forma independente durante a
          // descida, em vez de todas sumirem juntas no fim.
          var alpha = 1;
          if (progresso > p.fadeInicioFrac) {
            alpha = 1 - (progresso - p.fadeInicioFrac) / p.fadeDurFrac;
            if (alpha <= 0) continue;
          }

          if (p.y > BURST_H + 40) continue;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.cor;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }

        rafId = window.requestAnimationFrame(desenhar);
      }

      function parar () {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = null;
        particulas = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.remove('is-active');
        canvas.style.height = '0px';
      }

      function comemorar () {
        // A piscada do card acontece sempre; os confetes respeitam a
        // preferência de movimento reduzido do sistema.
        card.classList.remove('is-goal-hit');
        void card.offsetWidth; // reinicia a animação se disparar de novo
        card.classList.add('is-goal-hit');
        window.setTimeout(function () { card.classList.remove('is-goal-hit'); }, 3600);

        if (prefersReduced) return;

        var largura = ajustarCanvas();
        criarParticulas(largura);
        canvas.classList.add('is-active');
        inicio = window.performance ? window.performance.now() : Date.now();
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(desenhar);
      }

      document.addEventListener('metaSemanalAtingida', function () {
        // Pequeno atraso para o popup terminar de fechar antes da festa.
        window.setTimeout(comemorar, 260);
      });

      window.MetaCelebracao = { comemorar: comemorar };
    })();



    /* ---- Ecrã "Idioma" dentro do menu Ajustes ----
       Abre como uma página lateral do painel de Ajustes (igual a "Perfil e
       Dados da Conta" e "Ajuda"), lista as três opções escritas cada uma no
       seu próprio idioma e, ao Salvar, aplica o idioma, fecha tudo e volta
       à página inicial já traduzida. */
    (function () {
      var listEl     = document.getElementById('langOptionsList');
      var saveBtn    = document.getElementById('langSaveBtn');
      var openBtn    = document.getElementById('openIdiomaBtn');
      var flagEl     = document.getElementById('idiomaCurrentFlag');
      var nameEl     = document.getElementById('idiomaCurrentName');
      if (!listEl || !saveBtn || !openBtn || !window.I18N) return;

      var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

      // Idioma marcado no ecrã (ainda não guardado): só passa a valer
      // quando o utilizador carrega em Salvar.
      var pendingLang = I18N.getLang();

      function renderCurrent () {
        var code = I18N.getLang();
        if (flagEl) flagEl.innerHTML = I18N.getFlag(code);
        if (nameEl) nameEl.textContent = I18N.getName(code);
      }

      function renderOptions () {
        listEl.innerHTML = '';
        I18N.getOrder().forEach(function (code) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'lang-option' + (code === pendingLang ? ' is-selected' : '');
          btn.setAttribute('role', 'radio');
          btn.setAttribute('aria-checked', code === pendingLang ? 'true' : 'false');
          btn.innerHTML =
            '<span class="lang-flag" aria-hidden="true">' + I18N.getFlag(code) + '</span>' +
            '<span class="lang-option-name">' + I18N.getName(code) + '</span>' +
            '<span class="lang-option-check" aria-hidden="true">' + CHECK_SVG + '</span>';
          btn.addEventListener('click', function () {
            pendingLang = code;
            renderOptions();
          });
          listEl.appendChild(btn);
        });
      }

      window.IdiomaScreen = {
        prepare: function () {
          pendingLang = I18N.getLang();
          renderOptions();
        }
      };

      saveBtn.addEventListener('click', function () {
        var mudou = I18N.setLang(pendingLang);
        renderCurrent();
        renderOptions();
        // Fecha o painel de Ajustes e volta à página inicial (Ganhos).
        if (typeof window.closeProfileSheetPublic === 'function') {
          window.closeProfileSheetPublic();
        }
        if (window.QuickNavMenu) window.QuickNavMenu.close();
        if (window.closeAllOverlays) window.closeAllOverlays();
        if (window.HomeNav) window.HomeNav.goToSection('ganhos');
        var listViewEl = document.getElementById('homeListView');
        if (listViewEl) listViewEl.scrollTop = 0;
        window.scrollTo(0, 0);
        return mudou;
      });

      document.addEventListener('languageChanged', renderCurrent);
      renderCurrent();
      renderOptions();
    })();

    /* ---- Popup modal de idioma (versão gratuita) ----
       Replica o mesmo conteúdo do ecrã de idioma dos Ajustes mas
       abre como modal standalone ao clicar no botão PT do cabeçalho. */
    (function () {
      var modal   = document.getElementById('langPopupModal');
      var listEl  = document.getElementById('langPopupOptionsList');
      var saveBtn = document.getElementById('langPopupSaveBtn');
      if (!modal || !listEl || !saveBtn || !window.I18N) return;

      var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      var pendingLang = I18N.getLang();

      function renderOptions () {
        listEl.innerHTML = '';
        I18N.getOrder().forEach(function (code) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'lang-option' + (code === pendingLang ? ' is-selected' : '');
          btn.setAttribute('role', 'radio');
          btn.setAttribute('aria-checked', code === pendingLang ? 'true' : 'false');
          btn.innerHTML =
            '<span class="lang-flag" aria-hidden="true">' + I18N.getFlag(code) + '</span>' +
            '<span class="lang-option-name">' + I18N.getName(code) + '</span>' +
            '<span class="lang-option-check" aria-hidden="true">' + CHECK_SVG + '</span>';
          btn.addEventListener('click', function () {
            pendingLang = code;
            renderOptions();
          });
          listEl.appendChild(btn);
        });
      }

      function openModal () {
        pendingLang = I18N.getLang();
        renderOptions();
        modal.classList.add('is-open');
      }

      function closeModal () {
        modal.classList.remove('is-open');
      }

      saveBtn.addEventListener('click', function () {
        I18N.setLang(pendingLang);
        closeModal();
        if (window.HomeNav) window.HomeNav.goToSection('ganhos');
        var listViewEl = document.getElementById('homeListView');
        if (listViewEl) listViewEl.scrollTop = 0;
        window.scrollTo(0, 0);
      });

      /* Fechar ao clicar no backdrop */
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });

      window.LangPopupModal = { open: openModal, close: closeModal };
    })();



    /* ---- Ecrã "Multiplataforma" dentro do menu Ajustes ----
       Lista as plataformas já presentes ("Atuais") cada uma com um "x"
       vermelho para excluir e um formulário simples para adicionar uma
       nova plataforma ao final da lista. Cada plataforma nova funciona
       como uma entrada de ganhos extra (tile em Ganhos, colunas nas
       tabelas, soma no bruto). Uber e Bolt são fixas do sistema. */
    (function () {
      var MP_KEY = 'multiplataformas';

      var openBtn      = document.getElementById('openMultiplataformaBtn');
      var screenEl     = document.getElementById('sheetScreenMultiplataforma');
      var listaEl      = document.getElementById('mpListaAtuais');
      var novaInput    = document.getElementById('mpNovaInput');
      var salvarBtn    = document.getElementById('mpSalvarBtn');
      var novaThumb    = document.getElementById('mpNovaThumb');
      var uploadBtn    = document.getElementById('mpUploadLogoBtn');
      var fileInput    = document.getElementById('mpLogoFileInput');
      var confirmBackdrop  = document.getElementById('mpConfirmBackdrop');
      var confirmText      = document.getElementById('mpConfirmText');
      var confirmCancelBtn = document.getElementById('mpConfirmCancelBtn');
      var confirmDeleteBtn = document.getElementById('mpConfirmDeleteBtn');
      var scroller         = document.getElementById('ganhosIncomeScroll');
      var addBtn           = document.getElementById('btnAddPlatform');

      if (!openBtn || !screenEl || !listaEl || !novaInput || !salvarBtn || !window.I18N) return;

      var ARROW_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>';
      var DEL_SVG   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';
      var IMG_SVG   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

      var BASE = [
        { nome: 'Uber', img: '01uber.png' },
        { nome: 'Bolt', img: '02bolt.png' }
      ];

      var all = [];          // todas as extras: ativas e já excluídas (histórico)
      var novaImgData = null;
      var pendingDelId = null;

      function ativas () { return all.filter(function (p) { return !p.ate; }); }
      function achar (id) {
        for (var i = 0; i < all.length; i++) { if (all[i].id === id) return all[i]; }
        return null;
      }

      /* --- Persistência --- */
      function carregar () {
        var raw = window.cloudGet ? window.cloudGet(MP_KEY) : null;
        all = [];
        if (!raw) return;
        try { all = JSON.parse(raw) || []; } catch (e) { all = []; }
        if (!Array.isArray(all)) all = [];
        all = all.filter(function (p) { return p && p.id && p.nome; });
      }

      function guardar () {
        if (window.cloudSet) window.cloudSet(MP_KEY, JSON.stringify(all));
      }

      /* --- Valor do dia de cada plataforma extra (no tile) --- */
      function refreshTileValues () {
        if (!scroller) return;
        scroller.querySelectorAll('.ganhos-tile-extra').forEach(function (btn) {
          var v = btn.querySelector('.list-row-value');
          var n = (window.HomeBadges && window.HomeBadges.getPlat) ? window.HomeBadges.getPlat(btn.getAttribute('data-pid')) : 0;
          if (v) v.textContent = Number(n).toFixed(2) + ' €';
        });
      }

      /* --- Tiles na página inicial ---
         Ordem: [+] → Uber → Bolt → extras → (restantes já no DOM)
         Os tiles extra são sempre inseridos a seguir ao Bolt. */
      function renderTiles () {
        if (!scroller) return;
        scroller.querySelectorAll('.ganhos-tile-extra').forEach(function (el) { el.remove(); });

        var boltTile = document.getElementById('listRowBolt');
        var insertAfter = boltTile || addBtn;

        ativas().forEach(function (p) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'list-row ganhos-tile ganhos-tile-income ganhos-tile-scroll-item ganhos-tile-extra';
          btn.setAttribute('data-pid', p.id);
          btn.addEventListener('click', function () { openExtraModal(p.id); });
          btn.setAttribute('aria-haspopup', 'true');
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Ganhos ' + p.nome);

          // Linha do ícone + seta (idêntico a Uber/Bolt)
          var iconRow = document.createElement('span');
          iconRow.className = 'ganhos-tile-icon-row';

          var iconWrap = document.createElement('span');
          iconWrap.className = 'list-row-icon';
          if (p.img) {
            var img = document.createElement('img');
            img.src = p.img;
            img.alt = '';
            img.draggable = false;
            iconWrap.appendChild(img);
          } else {
            iconWrap.style.cssText = 'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.625rem;letter-spacing:-.02em;';
            iconWrap.textContent = p.nome.slice(0, 2).toUpperCase();
          }

          var arrowWrap = document.createElement('span');
          arrowWrap.className = 'ganhos-tile-arrow';
          arrowWrap.setAttribute('aria-hidden', 'true');
          arrowWrap.innerHTML = ARROW_SVG;

          iconRow.appendChild(iconWrap);
          iconRow.appendChild(arrowWrap);

          var title = document.createElement('span');
          title.className = 'list-row-title';
          title.textContent = 'Ganhos ' + p.nome;

          var value = document.createElement('span');
          value.className = 'list-row-value';
          value.textContent = '0.00 €';

          var ticks = document.createElement('span');
          ticks.className = 'ganhos-tile-ticks';
          ticks.setAttribute('aria-hidden', 'true');

          btn.appendChild(iconRow);
          btn.appendChild(title);
          btn.appendChild(value);
          btn.appendChild(ticks);

          // Inserir a seguir ao Bolt (ou ao addBtn se Bolt não existir)
          if (insertAfter && insertAfter.nextSibling) {
            scroller.insertBefore(btn, insertAfter.nextSibling);
          } else {
            scroller.appendChild(btn);
          }
          insertAfter = btn;
        });

        refreshTileValues();
        document.dispatchEvent(new CustomEvent('plataformasChanged'));
      }

      /* --- Lista na subtela (Uber/Bolt com imagens reais, extras com x) --- */
      function renderLista () {
        listaEl.innerHTML = '';

        BASE.forEach(function (p) {
          var card = document.createElement('div');
          card.className = 'mp-card';

          var thumb = document.createElement('div');
          thumb.className = 'mp-card-thumb';
          var img = document.createElement('img');
          img.src = p.img;
          img.alt = p.nome;
          thumb.appendChild(img);

          var nomeEl = document.createElement('span');
          nomeEl.className = 'mp-card-nome';
          nomeEl.textContent = p.nome;

          card.appendChild(thumb);
          card.appendChild(nomeEl);
          listaEl.appendChild(card);
        });

        ativas().forEach(function (p) {
          var card = document.createElement('div');
          card.className = 'mp-card';

          var thumb = document.createElement('div');
          thumb.className = 'mp-card-thumb';
          if (p.img) {
            var img = document.createElement('img');
            img.src = p.img;
            img.alt = p.nome;
            thumb.appendChild(img);
          } else {
            thumb.innerHTML = IMG_SVG;
          }

          var nomeEl = document.createElement('span');
          nomeEl.className = 'mp-card-nome';
          nomeEl.textContent = p.nome;

          var delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'mp-card-del';
          delBtn.setAttribute('aria-label', I18N.t('mp.deleteAria'));
          delBtn.innerHTML = DEL_SVG;
          delBtn.addEventListener('click', function () { openDeleteConfirm(p.id); });

          card.appendChild(thumb);
          card.appendChild(nomeEl);
          card.appendChild(delBtn);
          listaEl.appendChild(card);
        });
      }

      /* --- Upload de imagem --- */
      if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function () { fileInput.click(); });
        fileInput.addEventListener('change', async function () {
          var file = fileInput.files && fileInput.files[0];
          if (!file) return;
          if (!(await window.SmartSomaSecurity.validateImageFile(file))) {
            fileInput.value = '';
            alert('Selecione uma imagem JPEG, PNG ou WebP válida, com até 5 MB.');
            return;
          }
          var reader = new FileReader();
          reader.onload = function (e) {
            var imgEl = new Image();
            imgEl.onload = function () {
              var size = 128;
              var canvas = document.createElement('canvas');
              canvas.width = size; canvas.height = size;
              var ctx = canvas.getContext('2d');
              var s = Math.min(imgEl.width, imgEl.height);
              var ox = (imgEl.width - s) / 2;
              var oy = (imgEl.height - s) / 2;
              ctx.drawImage(imgEl, ox, oy, s, s, 0, 0, size, size);
              novaImgData = canvas.toDataURL('image/jpeg', 0.82);
              if (novaThumb) {
                novaThumb.innerHTML = '';
                var prev = document.createElement('img');
                prev.src = novaImgData;
                novaThumb.appendChild(prev);
              }
            };
            imgEl.src = e.target.result;
          };
          reader.readAsDataURL(file);
          fileInput.value = '';
        });
      }

      /* --- Confirmação de exclusão --- */
      function openDeleteConfirm (id) {
        var p = achar(id);
        if (!p) return;
        pendingDelId = id;
        if (confirmText) confirmText.textContent = I18N.t('mp.confirmNamed', { n: p.nome });
        if (confirmBackdrop) confirmBackdrop.classList.add('visible');
      }

      function closeDeleteConfirm () {
        if (confirmBackdrop) confirmBackdrop.classList.remove('visible');
        pendingDelId = null;
      }

      // Exclui a plataforma: encerra o cadastro na semana atual e apaga os
      // valores lançados nela desta semana em diante. As semanas
      // anteriores ficam intactas (controle/conferência), e a plataforma
      // continua a aparecer nas tabelas dessas semanas.
      function apagarPlataforma (id) {
        var p = achar(id);
        if (!p || p.ate) return;
        var semana = platMondayKey(new Date());
        p.ate = semana;
        guardar();

        var cache = window._cloudCache || {};
        Object.keys(cache).forEach(function (k) {
          if (k.indexOf('homeBadgeValores:') !== 0) return;
          if (k.slice(17) < semana) return;
          var raw = window.cloudGet(k);
          if (!raw) return;
          var obj;
          try { obj = JSON.parse(raw); } catch (e) { return; }
          if (obj && obj.plat && obj.plat[id] !== undefined) {
            delete obj.plat[id];
            window.cloudSet(k, JSON.stringify(obj));
          }
        });

        if (window.HomeBadges && window.HomeBadges.reload) window.HomeBadges.reload();
        renderLista();
        renderTiles();
        document.dispatchEvent(new CustomEvent('homeBadgesSaved'));
      }

      if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', closeDeleteConfirm);
      if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function () {
          if (pendingDelId !== null) apagarPlataforma(pendingDelId);
          closeDeleteConfirm();
        });
      }
      if (confirmBackdrop) {
        confirmBackdrop.addEventListener('click', function (e) {
          if (e.target === confirmBackdrop) closeDeleteConfirm();
        });
      }

      /* --- Popup para lançar o valor do dia numa plataforma extra --- */
      var xBackdrop = document.getElementById('platExtraModalBackdrop');
      var xTitle    = document.getElementById('platExtraModalTitle');
      var xDate     = document.getElementById('platExtraModalDate');
      var xInput    = document.getElementById('platExtraValorInput');
      var xSave     = document.getElementById('platExtraSalvarBtn');
      var xCurrent  = null;

      function openExtraModal (id) {
        var p = achar(id);
        if (!p || p.ate || !xBackdrop) return;
        if (typeof closeAllOverlays === 'function') closeAllOverlays();
        xCurrent = id;
        if (xTitle) xTitle.textContent = I18N.t('plat.title', { n: p.nome });
        if (xDate && window.GanhosDate) xDate.textContent = window.GanhosDate.formatLabel(window.GanhosDate.get());
        var atual = (window.HomeBadges && window.HomeBadges.getPlat) ? window.HomeBadges.getPlat(id) : 0;
        if (xInput) xInput.value = atual > 0 ? atual.toFixed(2) : '';
        xBackdrop.classList.add('visible');
      }
      function closeExtraModal () {
        if (xBackdrop) xBackdrop.classList.remove('visible');
        if (xInput) xInput.value = '';
        xCurrent = null;
      }
      if (xBackdrop) {
        xBackdrop.addEventListener('click', function (e) { if (e.target === xBackdrop) closeExtraModal(); });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && xBackdrop.classList.contains('visible')) closeExtraModal();
        });
      }
      if (xSave) {
        xSave.addEventListener('click', function () {
          if (!xCurrent || !window.HomeBadges || !window.HomeBadges.setPlat) return;
          var valor = parseFloat(String(xInput.value).replace(',', '.'));
          if (isNaN(valor) || valor < 0) valor = 0;
          window.HomeBadges.setPlat(xCurrent, valor);
          closeExtraModal();
        });
      }

      // O valor mostrado em cada tile acompanha o dia escolhido e os lançamentos.
      document.addEventListener('homeBadgesSaved', refreshTileValues);
      if (window.GanhosDate && typeof window.GanhosDate.onChange === 'function') {
        window.GanhosDate.onChange(refreshTileValues);
      }

      /* --- Botão "+" abre o menu Ajustes na subtela Multiplataforma --- */
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          if (typeof window.openProfileSheetPublic === 'function') {
            window.openProfileSheetPublic();
          }
          setTimeout(function () {
            carregar();
            renderLista();
            novaInput.value = '';
            novaImgData = null;
            if (novaThumb) novaThumb.innerHTML = IMG_SVG;
            if (typeof window.openSheetScreenPublic === 'function') {
              window.openSheetScreenPublic(screenEl, I18N.t('sheet.multiplataforma'));
            }
          }, 60);
        });
      }

      /* --- Abrir subtela via botão no menu Ajustes --- */
      openBtn.addEventListener('click', function () {
        carregar();
        renderLista();
        novaInput.value = '';
        novaImgData = null;
        if (novaThumb) novaThumb.innerHTML = IMG_SVG;
        if (fileInput) fileInput.value = '';
        if (typeof window.openSheetScreenPublic === 'function') {
          window.openSheetScreenPublic(screenEl, I18N.t('sheet.multiplataforma'));
        }
      });

      /* --- Salvar nova plataforma --- */
      salvarBtn.addEventListener('click', function () {
        var nome = window.SmartSomaSecurity.cleanText(novaInput.value, 9);
        if (!nome) return;
        all.push({
          id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36),
          nome: nome,
          img: novaImgData || null,
          desde: platMondayKey(new Date())
        });
        guardar();
        renderLista();
        renderTiles();
        novaInput.value = '';
        novaImgData = null;
        if (novaThumb) novaThumb.innerHTML = IMG_SVG;
        if (fileInput) fileInput.value = '';
      });

      /* --- Init --- */
      carregar();
      renderTiles();
      window.Multiplataformas = {
        prepare: function () {
          carregar();
          renderLista();
          novaInput.value = '';
          novaImgData = null;
          if (novaThumb) novaThumb.innerHTML = IMG_SVG;
          if (fileInput) fileInput.value = '';
        }
      };
    })();



    /* ---- Ajustes › Apagar dados ----
       Apaga só o que a pessoa inseriu (valores por dia, despesas, metas),
       conforme o período escolhido. Foto, nome, email, senha e conta não
       são tocados, nem a lista de plataformas nem o tamanho da fonte.
       Chaves por dia (YYYY-MM-DD): homeBadgeValores, despesasDiarias,
       distanciaInicioFim. Chaves por semana (segunda-feira YYYY-MM-DD):
       metaSemanalConfig, metaSemanalZerada, despesasFixasSkipSemana. */
    (function () {
      var screenEl   = document.getElementById('sheetScreenApagarDados');
      var optBtns    = [
        { el: document.getElementById('apagarSemanaBtn'), periodo: 'semana' },
        { el: document.getElementById('apagarMesBtn'),    periodo: 'mes' },
        { el: document.getElementById('apagarTodosBtn'),  periodo: 'todos' }
      ];
      var apagarBtn  = document.getElementById('apagarConfirmarBtn');
      var backdrop   = document.getElementById('apagarConfirmBackdrop');
      var textEl     = document.getElementById('apagarConfirmText');
      var cancelBtn  = document.getElementById('apagarConfirmCancelBtn');
      var okBtn      = document.getElementById('apagarConfirmOkBtn');
      if (!screenEl || !apagarBtn || !backdrop || !okBtn) return;

      var DAY_PREFIXES  = ['homeBadgeValores:', 'despesasDiarias:', 'distanciaInicioFim:'];
      var WEEK_PREFIXES = ['metaSemanalConfig:', 'metaSemanalZerada:', 'despesasFixasSkipSemana:'];
      var selecionado = null;
      var apagando = false;

      function pad2 (n) { return n < 10 ? '0' + n : String(n); }
      function keyOf (d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
      function mondayOf (d) {
        var m = new Date(d.getTime());
        m.setHours(0, 0, 0, 0);
        var day = m.getDay();
        m.setDate(m.getDate() + (day === 0 ? -6 : 1 - day));
        return m;
      }

      // Semanas do mês pela regra "4 ou mais dias dentro do mês" (a mesma
      // das tabelas). Devolve as segundas-feiras dessas semanas.
      function mondaysOfMonth (year, month) {
        var last = new Date(year, month + 1, 0);
        var m = mondayOf(new Date(year, month, 1));
        var out = [];
        while (m.getTime() <= last.getTime()) {
          var count = 0;
          for (var i = 0; i < 7; i++) {
            var d = new Date(m.getTime());
            d.setDate(m.getDate() + i);
            if (d.getFullYear() === year && d.getMonth() === month) count++;
          }
          if (count >= 4) out.push(new Date(m.getTime()));
          m = new Date(m.getTime());
          m.setDate(m.getDate() + 7);
        }
        return out;
      }

      // Lista de chaves existentes a apagar para o período.
      function keysFor (periodo) {
        var keys = [];
        function add (k) { if (window.cloudGet(k) !== null && keys.indexOf(k) === -1) keys.push(k); }

        if (periodo === 'todos') {
          Object.keys(window._cloudCache || {}).forEach(function (k) {
            var pref = DAY_PREFIXES.concat(WEEK_PREFIXES);
            for (var i = 0; i < pref.length; i++) { if (k.indexOf(pref[i]) === 0) { add(k); return; } }
          });
          add('despesasFixas');
          add('metaSemanalLastPromptWeek');
          return keys;
        }

        var mondays;
        if (periodo === 'semana') {
          mondays = [mondayOf(new Date())];
        } else {
          var hoje = new Date();
          mondays = mondaysOfMonth(hoje.getFullYear(), hoje.getMonth());
        }
        mondays.forEach(function (m) {
          for (var i = 0; i < 7; i++) {
            var d = new Date(m.getTime());
            d.setDate(m.getDate() + i);
            DAY_PREFIXES.forEach(function (p) { add(p + keyOf(d)); });
          }
          WEEK_PREFIXES.forEach(function (p) { add(p + keyOf(m)); });
        });
        return keys;
      }

      function select (periodo) {
        selecionado = periodo;
        optBtns.forEach(function (o) { if (o.el) o.el.classList.toggle('is-selected', o.periodo === periodo); });
        apagarBtn.disabled = !periodo;
      }
      optBtns.forEach(function (o) {
        if (o.el) o.el.addEventListener('click', function () { select(o.periodo); });
      });

      function closeConfirm () { backdrop.classList.remove('visible'); }

      apagarBtn.addEventListener('click', function () {
        if (!selecionado || apagando) return;
        textEl.textContent = I18N.t('apagar.confirm.' + selecionado);
        backdrop.classList.add('visible');
      });
      if (cancelBtn) cancelBtn.addEventListener('click', closeConfirm);
      backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeConfirm(); });

      okBtn.addEventListener('click', function () {
        if (!selecionado || apagando) return;
        apagando = true;
        okBtn.disabled = true;
        okBtn.classList.add('is-loading');
        if (cancelBtn) cancelBtn.disabled = true;
        okBtn.textContent = I18N.t('apagar.aguarde');
        var promessas = keysFor(selecionado).map(function (k) { return window.cloudRemove(k); });
        Promise.all(promessas).then(function () {
          // Recarrega para todos os módulos (ganhos, tabelas, meta,
          // despesas, distância) voltarem a ler os dados já limpos.
          window.location.reload();
        }).catch(function () {
          apagando = false;
          okBtn.disabled = false;
          okBtn.classList.remove('is-loading');
          if (cancelBtn) cancelBtn.disabled = false;
          okBtn.textContent = I18N.t('apagar.btn');
          closeConfirm();
        });
      });

      // Sempre que o ecrã abre, volta ao estado inicial.
      if (openApagarDadosBtn) {
        openApagarDadosBtn.addEventListener('click', function () { select(null); });
      }

      window.ApagarDados = { keysFor: keysFor };
    })();



    /* =========================================================================
       Download Relatório — escolha de mês + geração do PDF.

       As bibliotecas de PDF (jsPDF + AutoTable) só são carregadas quando a
       pessoa carrega em "Baixar PDF" pela primeira vez — ficheiros locais
       (funcionam offline depois do primeiro carregamento), não pesam nada
       no resto da app. ========================================================== */
    (function () {
      var monthLabelEl = document.getElementById('relatorioPageMonthLabel');
      var prevBtn       = document.getElementById('relatorioPageMonthPrev');
      var nextBtn       = document.getElementById('relatorioPageMonthNext');
      var downloadBtn   = document.getElementById('relatorioPageDownloadBtn');
      var downloadLabel = downloadBtn ? downloadBtn.querySelector('[data-i18n="relatorio.download"]') : null;
      var archiveList   = document.getElementById('relatorioArchiveList');
      var archiveEmpty  = document.getElementById('relatorioArchiveEmpty');
      if (!monthLabelEl || !window.I18N) return;

      var hoje = new Date();
      var relYear  = hoje.getFullYear();
      var relMonth = hoje.getMonth(); // 0-based

      function isMesAtual () {
        var n = new Date();
        return relYear === n.getFullYear() && relMonth === n.getMonth();
      }

      function renderLabel () {
        monthLabelEl.textContent = I18N.t('fmt.monthYear', {
          m: I18N.capitalize(I18N.list('months.lower')[relMonth]),
          y: relYear
        });
        if (nextBtn) nextBtn.disabled = isMesAtual();
      }
      function resetReportMonth () {
        var now = new Date();
        relYear = now.getFullYear();
        relMonth = now.getMonth();
        renderLabel();
      }
      renderLabel();
      document.addEventListener('languageChanged', renderLabel);
      document.addEventListener('smartSomaTransientStateReset', resetReportMonth);

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          relMonth--;
          if (relMonth < 0) { relMonth = 11; relYear--; }
          renderLabel();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          if (isMesAtual()) return;
          relMonth++;
          if (relMonth > 11) { relMonth = 0; relYear++; }
          renderLabel();
        });
      }

      /* ---- Carregamento das bibliotecas do PDF, só quando precisa ---- */
      var pdfLibsPromise = null;
      function carregarScript (src) {
        return new Promise(function (resolve, reject) {
          var s = document.createElement('script');
          s.src = src;
          s.async = true;
          s.onload = function () { resolve(); };
          s.onerror = function () { reject(new Error('Falha ao carregar ' + src)); };
          document.head.appendChild(s);
        });
      }
      function carregarLibsPdf () {
        if (window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API && window.jspdf.jsPDF.API.autoTable) {
          return Promise.resolve();
        }
        if (pdfLibsPromise) return pdfLibsPromise;
        pdfLibsPromise = carregarScript('jspdf.umd.min.js')
          .then(function () { return carregarScript('jspdf.plugin.autotable.min.js'); })
          .catch(function (err) { pdfLibsPromise = null; throw err; });
        return pdfLibsPromise;
      }

      /* ---- Leitura dos dados do mês (mesmas chaves usadas no resto da app) ---- */
      var BADGES_PREFIX = 'homeBadgeValores:';
      var DESPESAS_DIARIAS_PREFIX = 'despesasDiarias:';

      function pad2 (n) { return n < 10 ? '0' + n : String(n); }
      function dateKeyFor (d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
      function mondayOfDate (d) {
        var m = new Date(d.getTime());
        m.setHours(0, 0, 0, 0);
        var day = m.getDay();
        m.setDate(m.getDate() + (day === 0 ? -6 : 1 - day));
        return m;
      }
      function loadDayBadgesPdf (d) {
        var b = { uber: 0, bolt: 0, despesas: 0, distancia: 0, plat: {}, raw: {} };
        try {
          var raw = cloudGet(BADGES_PREFIX + dateKeyFor(d));
          if (raw) {
            var parsed = JSON.parse(raw);
            b.uber      = Number(parsed.uber) || 0;
            b.bolt      = Number(parsed.bolt) || 0;
            b.despesas  = Number(parsed.despesas) || 0;
            b.distancia = Number(parsed.distancia) || 0;
            b.plat      = platExtrasFrom(parsed);
            b.raw       = parsed;
          }
        } catch (e) {  }
        return b;
      }
      function loadDayItemsPdf (d) {
        try {
          var raw = cloudGet(DESPESAS_DIARIAS_PREFIX + dateKeyFor(d));
          if (raw) {
            var parsed = JSON.parse(raw);
            return (parsed && parsed.items) || [];
          }
        } catch (e) {  }
        return [];
      }
      function loadDespesasFixasCadastro () {
        try {
          var raw = cloudGet('despesasFixas');
          if (raw) { var parsed = JSON.parse(raw); return (parsed && parsed.items) || []; }
        } catch (e) {  }
        return [];
      }
      function fixaAtivaNaSemana (item, weekKey) {
        if (item && item.desde && item.desde > weekKey) return false;
        if (item && item.ate && item.ate <= weekKey) return false;
        return true;
      }
      function isFixasSkippedForWeekPdf (weekKey) {
        try { return cloudGet('despesasFixasSkipSemana:' + weekKey) === '1'; } catch (e) {  }
        return false;
      }
      function fixasAtivasDaSemana (monday) {
        var weekKey = dateKeyFor(monday);
        if (isFixasSkippedForWeekPdf(weekKey)) return [];
        return loadDespesasFixasCadastro().filter(function (item) { return fixaAtivaNaSemana(item, weekKey); });
      }

      /* Junta tudo o que o relatório do mês precisa, dia a dia. */
      function coletarDadosDoMes (year, month) {
        var lastDay = new Date(year, month + 1, 0).getDate();
        var dias = [];
        var platIds = {}; // plataformas que aparecem em pelo meno um dia do mês

        for (var dNum = 1; dNum <= lastDay; dNum++) {
          var d = new Date(year, month, dNum);
          var badges = loadDayBadgesPdf(d);
          var itens = loadDayItemsPdf(d);
          var fixasDoDia = [];

          var hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          if (d.getDay() === 1 && d <= hoje) { // segunda-feira: onde as despesas fixas são lançadas
            var weekGross = 0;
            for (var i = 0; i < 7; i++) {
              var wd = new Date(d.getTime());
              wd.setDate(d.getDate() + i);
              var wb = loadDayBadgesPdf(wd);
              weekGross += wb.uber + wb.bolt + platSum(wb.plat) + ganhosExtrasBruto(wb.raw);
            }
            fixasDoDia = fixasAtivasDaSemana(d).map(function (item) {
              var valor = (item.tipo === 'euro') ? Number(item.valor || 0) : (weekGross * (Number(item.valor || 0) / 100));
              return { descricao: item.descricao, valor: valor, tipo: item.tipo };
            });
          }

          for (var pid in badges.plat) platIds[pid] = true;

          var bruto = badges.uber + badges.bolt + platSum(badges.plat) + ganhosExtrasBruto(badges.raw);
          var despesas = window.SmartSomaReadModel.day(d).expenses;
          dias.push({
            data: d,
            uber: badges.uber,
            bolt: badges.bolt,
            plat: badges.plat,
            distancia: badges.distancia,
            despesas: despesas,
            itens: itens,
            fixasDoDia: fixasDoDia,
            ganhosExtras: ganhosExtrasFrom(badges.raw),
            bruto: bruto,
            liquido: bruto - despesas
          });
        }

        var registry = platRegistry();
        var plataformasExtras = registry.filter(function (p) { return platIds[p.id]; });

        return { dias: dias, plataformasExtras: plataformasExtras };
      }

      /* ---- Construção do PDF ---- */
      var COR_INK    = [28, 43, 58];
      var COR_GREEN  = [30, 158, 90];
      var COR_RED    = [228, 87, 76];
      var COR_PAPER  = [243, 248, 250];
      var COR_LINE   = [225, 232, 236];

      function euro (v) { return Number(v || 0).toFixed(2).replace('.', ',') + ' €'; }

      function gerarRelatorioPdf (year, month) {
        var jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF({ unit: 'pt', format: 'a4' });
        var pageW = doc.internal.pageSize.getWidth();
        var pageH = doc.internal.pageSize.getHeight();
        var margin = 42;
        var contentW = pageW - margin * 2;
        var CORES = {
          ink: [21, 36, 27], green: [25, 120, 70], lime: [212, 245, 60],
          red: [180, 68, 53], blue: [46, 117, 184], paper: [246, 243, 234],
          card: [255, 254, 249], line: [221, 220, 210], muted: [104, 114, 104],
          softGreen: [230, 244, 234], softRed: [253, 243, 241], softBlue: [238, 246, 253]
        };
        var isEnglish = I18N.getLang && I18N.getLang() === 'en';
        var texto = isEnglish ? {
          report: 'FINANCIAL REPORT', overview: 'Financial overview', summary: 'Key indicators',
          gross: 'Gross earnings', expenses: 'Expenses', net: 'Net result', margin: 'Net margin',
          days: 'Days with earnings', average: 'Average per working day', expenseRate: 'Expenses of earnings',
          goals: 'Goal completion', dailyEvolution: 'Daily earnings and net result',
          grossLegend: 'Gross earnings', netLegend: 'Net result', platformAnalysis: 'Platform analysis',
          platformShare: 'Earnings distribution by platform', platformComparison: 'Platform comparison by week',
          platform: 'Platform', share: 'Share', total: 'Total', otherEarnings: 'Included extra earnings',
          expenseAnalysis: 'Expense analysis', expenseEvolution: 'Daily expenses', expenseImpact: 'Highest-impact expense descriptions',
          description: 'Description', type: 'Type', amount: 'Amount', date: 'Date', oneOff: 'One-off', fixed: 'Fixed',
          weeklyComparison: 'Weekly comparison', weeklyTrend: 'Weekly gross and net evolution', averageTrend: 'Average earnings per working day',
          indicator: 'Indicator', variation: 'Variation', grossShort: 'Gross earnings', expensesShort: 'Expenses',
          netShort: 'Net result', averageShort: 'Daily average', goalShort: 'Goal completion',
          goalsTitle: 'Financial goals', goal: 'Goal', achieved: 'Achieved', completion: 'Completion', status: 'Status',
          reached: 'Reached', remaining: 'Remaining', exceeded: 'Exceeded', notSet: 'Not set',
          insights: 'Automatic insights', bestWeek: 'Best week', lowestWeek: 'Lowest week', bestDay: 'Best earning day',
          bestPlatform: 'Top platform', largestExpense: 'Largest expense', noData: 'No records available for this insight.',
          dailyDetail: 'Daily financial detail', platforms: 'Platforms', distance: 'Distance', mileage: 'Mileage',
          expenseDetail: 'Expense records', fixedExpenses: 'Fixed expenses active in the period',
          generated: 'Generated on', profile: 'Account', reportPeriod: 'Report period', noExpenses: 'No expense records in this period.',
          noPlatforms: 'No platform earnings in this period.', noGoals: 'No financial goals were defined for the included weeks.',
          weeklyPerformance: 'Weekly performance', period: 'Period', workingDay: 'working day', goalProgress: 'Goal progress'
        } : {
          report: 'RELATÓRIO FINANCEIRO', overview: 'Visão financeira', summary: 'Indicadores principais',
          gross: 'Ganhos brutos', expenses: 'Despesas', net: 'Resultado líquido', margin: 'Margem líquida',
          days: 'Dias com ganhos', average: 'Média por dia trabalhado', expenseRate: 'Despesas sobre ganhos',
          goals: 'Cumprimento de metas', dailyEvolution: 'Ganhos e resultado líquido por dia',
          grossLegend: 'Ganhos brutos', netLegend: 'Resultado líquido', platformAnalysis: 'Análise por plataforma',
          platformShare: 'Distribuição dos ganhos por plataforma', platformComparison: 'Comparação por plataforma e semana',
          platform: 'Plataforma', share: 'Participação', total: 'Total', otherEarnings: 'Ganhos extras incluídos',
          expenseAnalysis: 'Análise de despesas', expenseEvolution: 'Despesas diárias', expenseImpact: 'Descrições com maior impacto',
          description: 'Descrição', type: 'Tipo', amount: 'Valor', date: 'Data', oneOff: 'Avulsa', fixed: 'Fixa',
          weeklyComparison: 'Comparação entre semanas', weeklyTrend: 'Evolução semanal de bruto e líquido', averageTrend: 'Média de ganhos por dia trabalhado',
          indicator: 'Indicador', variation: 'Variação', grossShort: 'Ganhos brutos', expensesShort: 'Despesas',
          netShort: 'Resultado líquido', averageShort: 'Média diária', goalShort: 'Meta alcançada',
          goalsTitle: 'Metas financeiras', goal: 'Meta', achieved: 'Alcançado', completion: 'Cumprimento', status: 'Estado',
          reached: 'Atingida', remaining: 'Em falta', exceeded: 'Excedida', notSet: 'Não definida',
          insights: 'Indicadores automáticos', bestWeek: 'Melhor semana', lowestWeek: 'Semana com menor resultado', bestDay: 'Dia com maior faturação',
          bestPlatform: 'Plataforma com maior rendimento', largestExpense: 'Maior despesa registada', noData: 'Não existem dados suficientes.',
          dailyDetail: 'Detalhe financeiro diário', platforms: 'Plataformas', distance: 'Distância', mileage: 'Quilometragem',
          expenseDetail: 'Registos de despesas', fixedExpenses: 'Despesas fixas ativas no período',
          generated: 'Gerado em', profile: 'Conta', reportPeriod: 'Período do relatório', noExpenses: 'Não existem despesas registadas neste período.',
          noPlatforms: 'Não existem ganhos por plataforma neste período.', noGoals: 'Não foram definidas metas nas semanas incluídas.',
          weeklyPerformance: 'Desempenho semanal', period: 'Período', workingDay: 'dia trabalhado', goalProgress: 'Progresso das metas'
        };

        var dados = coletarDadosDoMes(year, month);
        var dias = dados.dias;
        var extras = dados.plataformasExtras;
        var mesNome = I18N.capitalize(I18N.list('months.full')[month]);
        var diasAbbr = I18N.list('weekday.abbr');
        var geradoEm = new Date();
        var geradoStr = pad2(geradoEm.getDate()) + '/' + pad2(geradoEm.getMonth() + 1) + '/' + geradoEm.getFullYear() + ' ' + pad2(geradoEm.getHours()) + ':' + pad2(geradoEm.getMinutes());
        var perfilNome = '';
        try {
          var perfilRaw = cloudGet('mydocs.profile');
          if (perfilRaw) {
            var perfilObj = JSON.parse(perfilRaw);
            if (perfilObj && perfilObj.name) perfilNome = perfilObj.name;
          }
        } catch (e) { }
        if (!perfilNome) perfilNome = I18N.t('sheet.defaultUser');
        var perfilEmail = window.currentUserEmail || '—';

        var totBruto = 0, totDespesas = 0, totKm = 0, totUber = 0, totBolt = 0, totGanhosExtras = 0;
        var totExtras = {};
        extras.forEach(function (p) { totExtras[p.id] = 0; });
        dias.forEach(function (dia) {
          totBruto += dia.bruto;
          totDespesas += dia.despesas;
          totKm += dia.distancia;
          totUber += dia.uber;
          totBolt += dia.bolt;
          totGanhosExtras += dia.ganhosExtras.reduce(function (sum, item) { return sum + (item.incluidoBruto ? item.valor : 0); }, 0);
          extras.forEach(function (p) { totExtras[p.id] += dia.plat[p.id] || 0; });
        });
        var totLiquido = totBruto - totDespesas;
        var diasComGanhos = dias.filter(function (dia) { return dia.bruto > 0; }).length;
        var margemLiquida = totBruto ? (totLiquido / totBruto) * 100 : 0;
        var percentDespesas = totBruto ? (totDespesas / totBruto) * 100 : 0;
        var mediaDiaria = diasComGanhos ? totBruto / diasComGanhos : 0;

        var plataformas = [
          { id: 'uber', nome: 'Uber', valor: totUber, cor: [25, 120, 70] },
          { id: 'bolt', nome: 'Bolt', valor: totBolt, cor: [46, 117, 184] }
        ].concat(extras.map(function (p, i) {
          var paleta = [[130, 90, 190], [201, 126, 42], [30, 143, 145], [184, 72, 122]];
          return { id: p.id, nome: p.nome, valor: totExtras[p.id] || 0, cor: paleta[i % paleta.length] };
        })).filter(function (plataforma) { return plataforma.valor > 0; });
        var totalPlataformas = plataformas.reduce(function (sum, plataforma) { return sum + plataforma.valor; }, 0);

        var semanasPorChave = {};
        dias.forEach(function (dia) {
          var monday = mondayOfDate(dia.data);
          var key = dateKeyFor(monday);
          if (!semanasPorChave[key]) {
            var sunday = new Date(monday.getTime()); sunday.setDate(monday.getDate() + 6);
            semanasPorChave[key] = { key: key, monday: monday, sunday: sunday, bruto: 0, despesas: 0, liquido: 0, km: 0, diasComGanhos: 0, plataformas: {} };
          }
          var semana = semanasPorChave[key];
          semana.bruto += dia.bruto;
          semana.despesas += dia.despesas;
          semana.liquido += dia.liquido;
          semana.km += dia.distancia;
          if (dia.bruto > 0) semana.diasComGanhos++;
          semana.plataformas.uber = (semana.plataformas.uber || 0) + dia.uber;
          semana.plataformas.bolt = (semana.plataformas.bolt || 0) + dia.bolt;
          extras.forEach(function (p) { semana.plataformas[p.id] = (semana.plataformas[p.id] || 0) + (dia.plat[p.id] || 0); });
        });
        var semanas = Object.keys(semanasPorChave).map(function (key) { return semanasPorChave[key]; }).sort(function (a, b) { return a.monday - b.monday; });
        semanas.forEach(function (semana, i) {
          semana.numero = i + 1;
          semana.rotulo = (isEnglish ? 'Week ' : 'Sem. ') + semana.numero;
          semana.periodo = pad2(semana.monday.getDate()) + '/' + pad2(semana.monday.getMonth() + 1) + ' - ' + pad2(semana.sunday.getDate()) + '/' + pad2(semana.sunday.getMonth() + 1);
          semana.mediaDiaria = semana.diasComGanhos ? semana.bruto / semana.diasComGanhos : 0;
          semana.meta = null;
          try {
            var rawMeta = cloudGet('metaSemanalConfig:' + semana.key);
            var parsedMeta = rawMeta ? JSON.parse(rawMeta) : null;
            if (parsedMeta && Number(parsedMeta.valor) > 0) {
              semana.meta = { valor: Number(parsedMeta.valor), tipo: parsedMeta.tipo === 'liquido' ? 'liquido' : 'bruto' };
            }
          } catch (e) { }
          if (semana.meta) {
            semana.metaRealizada = semana.meta.tipo === 'liquido' ? semana.liquido : semana.bruto;
            semana.metaPercentual = Math.max(0, (semana.metaRealizada / semana.meta.valor) * 100);
          }
        });
        var semanasComMeta = semanas.filter(function (semana) { return !!semana.meta; });
        var cumprimentoMedioMetas = semanasComMeta.length ? semanasComMeta.reduce(function (sum, semana) { return sum + semana.metaPercentual; }, 0) / semanasComMeta.length : 0;

        var despesasDetalhadas = [];
        var despesasPorDescricao = {};
        function adicionarDespesa(dia, item, tipo) {
          var valor = Number(item.valor) || 0;
          if (valor <= 0) return;
          var descricao = String(item.descricao || '—');
          despesasDetalhadas.push({ data: dia.data, descricao: descricao, tipo: tipo, valor: valor });
          despesasPorDescricao[descricao] = (despesasPorDescricao[descricao] || 0) + valor;
        }
        dias.forEach(function (dia) {
          dia.itens.forEach(function (item) { adicionarDespesa(dia, item, texto.oneOff); });
          dia.fixasDoDia.forEach(function (item) { adicionarDespesa(dia, item, texto.fixed); });
        });
        var maioresDespesas = Object.keys(despesasPorDescricao).map(function (descricao) {
          return { descricao: descricao, valor: despesasPorDescricao[descricao] };
        }).sort(function (a, b) { return b.valor - a.valor; });

        function setFill(cor) { doc.setFillColor(cor[0], cor[1], cor[2]); }
        function setDraw(cor) { doc.setDrawColor(cor[0], cor[1], cor[2]); }
        function setText(cor) { doc.setTextColor(cor[0], cor[1], cor[2]); }
        function header() {
          setFill(CORES.ink); doc.rect(0, 0, pageW, 66, 'F');
          setFill(CORES.lime); doc.rect(0, 64, pageW, 3, 'F');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(255, 255, 255);
          doc.text('smart', margin, 31);
          doc.setTextColor(CORES.lime[0], CORES.lime[1], CORES.lime[2]); doc.text('soma', margin + 47, 31);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(204, 219, 208);
          doc.text(texto.report, margin, 47);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(255, 255, 255);
          doc.text(mesNome + ' ' + year, pageW - margin, 34, { align: 'right' });
          doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(204, 219, 208);
          doc.text(texto.reportPeriod, pageW - margin, 48, { align: 'right' });
        }
        function footer(pageNum, pageCount) {
          setDraw(CORES.line); doc.setLineWidth(0.5); doc.line(margin, pageH - 34, pageW - margin, pageH - 34);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); setText(CORES.muted);
          doc.text(texto.generated + ' ' + geradoStr, margin, pageH - 20);
          doc.text(String(pageNum) + ' / ' + String(pageCount), pageW - margin, pageH - 20, { align: 'right' });
        }
        function newPage() { doc.addPage(); y = 94; }
        function ensure(space) { if (y + space > pageH - 50) newPage(); }
        function section(kicker, title, detail) {
          ensure(detail ? 48 : 34);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); setText(CORES.green);
          doc.text(kicker.toUpperCase(), margin, y);
          doc.setFontSize(14); setText(CORES.ink); doc.text(title, margin, y + 17);
          if (detail) {
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8); setText(CORES.muted);
            var lines = doc.splitTextToSize(detail, contentW);
            doc.text(lines, margin, y + 30);
            y += 30 + lines.length * 9;
          } else y += 26;
        }
        function drawLegend(items, x, cy) {
          var cursor = x;
          items.forEach(function (item) {
            setFill(item.cor); doc.roundedRect(cursor, cy - 5, 8, 8, 2, 2, 'F');
            doc.setFont('helvetica', 'normal'); doc.setFontSize(7); setText(CORES.muted);
            doc.text(item.label, cursor + 12, cy + 1);
            cursor += 16 + doc.getTextWidth(item.label);
          });
        }
        function drawMetricGrid(cards) {
          var columns = 4, gap = 7, cardH = 47;
          var cardW = (contentW - gap * (columns - 1)) / columns;
          cards.forEach(function (card, i) {
            var row = Math.floor(i / columns), col = i % columns;
            var x = margin + col * (cardW + gap), cy = y + row * (cardH + gap);
            setFill(CORES.card); doc.roundedRect(x, cy, cardW, cardH, 6, 6, 'F');
            setDraw(CORES.line); doc.setLineWidth(.6); doc.roundedRect(x, cy, cardW, cardH, 6, 6, 'S');
            setFill(card.cor); doc.roundedRect(x, cy, 3, cardH, 2, 2, 'F');
            doc.setFont('helvetica', 'normal'); doc.setFontSize(7); setText(CORES.muted);
            var labelLines = doc.splitTextToSize(card.label, cardW - 18);
            doc.text(labelLines, x + 10, cy + 14);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(card.size || 10.5); setText(card.cor);
            doc.text(card.value, x + 10, cy + 36, { maxWidth: cardW - 16 });
          });
          y += Math.ceil(cards.length / columns) * (cardH + gap) + 8;
        }
        function drawEmptyChart(x, cy, w, h, message) {
          setFill(CORES.paper); doc.roundedRect(x, cy, w, h, 7, 7, 'F');
          doc.setFont('helvetica', 'normal'); doc.setFontSize(8); setText(CORES.muted);
          doc.text(message, x + w / 2, cy + h / 2, { align: 'center' });
        }
        function drawDailyBars(cy, title, valueFn, cor, limit) {
          ensure(164);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setText(CORES.ink); doc.text(title, margin, cy);
          var chartY = cy + 14, chartH = 106, chartW = contentW;
          var values = dias.map(valueFn), max = Math.max.apply(null, values.concat([0]));
          if (max <= 0) { drawEmptyChart(margin, chartY, chartW, chartH, texto.noData); y = chartY + chartH + 14; return; }
          setFill(CORES.card); doc.roundedRect(margin, chartY, chartW, chartH, 7, 7, 'F');
          setDraw(CORES.line); doc.setLineWidth(.5); doc.roundedRect(margin, chartY, chartW, chartH, 7, 7, 'S');
          var baseline = chartY + chartH - 20, plotH = chartH - 36, slot = (chartW - 22) / dias.length;
          setDraw(CORES.line); doc.line(margin + 11, baseline, margin + chartW - 11, baseline);
          dias.forEach(function (dia, i) {
            var value = values[i], barH = Math.max(value > 0 ? 2 : 0, Math.abs(value) / max * plotH);
            var x = margin + 11 + i * slot + Math.max(.4, (slot - Math.min(9, slot * .62)) / 2);
            var width = Math.max(.8, Math.min(9, slot * .62));
            setFill(value < 0 ? CORES.red : cor);
            doc.roundedRect(x, value < 0 ? baseline : baseline - barH, width, barH, Math.min(2, width / 2), Math.min(2, width / 2), 'F');
            if (i === 0 || i === dias.length - 1 || (dias.length > 10 && i % 5 === 0)) {
              doc.setFont('helvetica', 'normal'); doc.setFontSize(5.8); setText(CORES.muted);
              doc.text(String(dia.data.getDate()), x + width / 2, chartY + chartH - 7, { align: 'center' });
            }
          });
          doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); setText(CORES.muted);
          doc.text(euro(max), margin + chartW - 10, chartY + 12, { align: 'right' });
          y = chartY + chartH + 14;
        }
        function drawDonut(cy) {
          ensure(170);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setText(CORES.ink); doc.text(texto.platformShare, margin, cy);
          var chartY = cy + 14, chartH = 126;
          setFill(CORES.card); doc.roundedRect(margin, chartY, contentW, chartH, 7, 7, 'F');
          setDraw(CORES.line); doc.setLineWidth(.5); doc.roundedRect(margin, chartY, contentW, chartH, 7, 7, 'S');
          if (!totalPlataformas) { drawEmptyChart(margin, chartY, contentW, chartH, texto.noPlatforms); y = chartY + chartH + 14; return; }
          var cx = margin + 76, centerY = chartY + chartH / 2, radius = 39, angle = -Math.PI / 2;
          plataformas.forEach(function (platform) {
            var end = angle + (platform.valor / totalPlataformas) * Math.PI * 2;
            var steps = Math.max(3, Math.ceil((end - angle) / .11));
            setFill(platform.cor);
            for (var step = 0; step < steps; step++) {
              var startA = angle + (end - angle) * step / steps;
              var endA = angle + (end - angle) * (step + 1) / steps;
              doc.triangle(cx, centerY, cx + radius * Math.cos(startA), centerY + radius * Math.sin(startA), cx + radius * Math.cos(endA), centerY + radius * Math.sin(endA), 'F');
            }
            angle = end;
          });
          setFill(CORES.card); doc.circle(cx, centerY, 22, 'F');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(8); setText(CORES.ink);
          doc.text(euro(totalPlataformas), cx, centerY - 1, { align: 'center' });
          doc.setFont('helvetica', 'normal'); doc.setFontSize(6); setText(CORES.muted);
          doc.text(texto.total, cx, centerY + 9, { align: 'center' });
          var legendX = margin + 146, legendY = chartY + 22;
          plataformas.slice(0, 6).forEach(function (platform, i) {
            var lineY = legendY + i * 16;
            setFill(platform.cor); doc.roundedRect(legendX, lineY - 6, 8, 8, 2, 2, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); setText(CORES.ink);
            doc.text(platform.nome, legendX + 13, lineY, { maxWidth: 155 });
            doc.setFont('helvetica', 'normal'); doc.setFontSize(7); setText(CORES.muted);
            doc.text(euro(platform.valor) + '  ' + ((platform.valor / totalPlataformas) * 100).toFixed(1).replace('.', ',') + '%', margin + contentW - 12, lineY, { align: 'right' });
          });
          if (totGanhosExtras > 0) {
            doc.setFont('helvetica', 'normal'); doc.setFontSize(7); setText(CORES.muted);
            doc.text(texto.otherEarnings + ': ' + euro(totGanhosExtras), legendX, chartY + chartH - 14);
          }
          y = chartY + chartH + 14;
        }
        function drawPlatformBars(cy) {
          ensure(148);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setText(CORES.ink); doc.text(texto.platformComparison, margin, cy);
          var chartY = cy + 14, chartH = Math.max(78, plataformas.length * 22 + 24);
          if (!plataformas.length) { drawEmptyChart(margin, chartY, contentW, chartH, texto.noPlatforms); y = chartY + chartH + 14; return; }
          setFill(CORES.card); doc.roundedRect(margin, chartY, contentW, chartH, 7, 7, 'F'); setDraw(CORES.line); doc.setLineWidth(.5); doc.roundedRect(margin, chartY, contentW, chartH, 7, 7, 'S');
          var top = plataformas[0].valor;
          plataformas.forEach(function (platform, i) {
            var lineY = chartY + 19 + i * 22, x = margin + 106, barW = contentW - 186;
            doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); setText(CORES.ink); doc.text(platform.nome, margin + 12, lineY + 4, { maxWidth: 86 });
            setFill(CORES.paper); doc.roundedRect(x, lineY - 5, barW, 10, 4, 4, 'F');
            setFill(platform.cor); doc.roundedRect(x, lineY - 5, Math.max(3, barW * platform.valor / top), 10, 4, 4, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); setText(platform.cor); doc.text(euro(platform.valor), margin + contentW - 12, lineY + 4, { align: 'right' });
          });
          y = chartY + chartH + 14;
        }
        function drawWeeklyBars(cy) {
          ensure(162);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setText(CORES.ink); doc.text(texto.weeklyTrend, margin, cy);
          var chartY = cy + 14, chartH = 104, max = Math.max.apply(null, semanas.map(function (semana) { return Math.max(semana.bruto, Math.abs(semana.liquido)); }).concat([0]));
          if (!max) { drawEmptyChart(margin, chartY, contentW, chartH, texto.noData); y = chartY + chartH + 14; return; }
          setFill(CORES.card); doc.roundedRect(margin, chartY, contentW, chartH, 7, 7, 'F'); setDraw(CORES.line); doc.roundedRect(margin, chartY, contentW, chartH, 7, 7, 'S');
          var baseline = chartY + chartH - 20, plotH = chartH - 36, group = (contentW - 24) / semanas.length;
          semanas.forEach(function (semana, i) {
            var x = margin + 12 + i * group, grossH = semana.bruto / max * plotH, netH = Math.abs(semana.liquido) / max * plotH;
            setFill(CORES.green); doc.roundedRect(x + group * .2, baseline - grossH, Math.max(3, group * .23), grossH, 2, 2, 'F');
            setFill(semana.liquido < 0 ? CORES.red : CORES.ink); doc.roundedRect(x + group * .52, semana.liquido < 0 ? baseline : baseline - netH, Math.max(3, group * .23), netH, 2, 2, 'F');
            doc.setFont('helvetica', 'normal'); doc.setFontSize(6); setText(CORES.muted); doc.text(semana.rotulo, x + group / 2, chartY + chartH - 7, { align: 'center' });
          });
          drawLegend([{ label: texto.grossLegend, cor: CORES.green }, { label: texto.netLegend, cor: CORES.ink }], margin + 12, chartY + 14);
          y = chartY + chartH + 14;
        }
        function drawAverageTrend(cy) {
          ensure(118);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setText(CORES.ink); doc.text(texto.averageTrend, margin, cy);
          var chartY = cy + 14, chartH = 72, values = semanas.map(function (semana) { return semana.mediaDiaria; });
          var max = Math.max.apply(null, values.concat([0]));
          if (!max) { drawEmptyChart(margin, chartY, contentW, chartH, texto.noData); y = chartY + chartH + 14; return; }
          setFill(CORES.card); doc.roundedRect(margin, chartY, contentW, chartH, 7, 7, 'F'); setDraw(CORES.line); doc.roundedRect(margin, chartY, contentW, chartH, 7, 7, 'S');
          var points = [];
          semanas.forEach(function (semana, i) {
            var x = margin + 22 + (semanas.length === 1 ? 0 : i * (contentW - 44) / (semanas.length - 1));
            var py = chartY + 16 + (1 - semana.mediaDiaria / max) * (chartH - 34);
            points.push({ x: x, y: py, label: semana.rotulo });
          });
          setDraw(CORES.blue); doc.setLineWidth(1.5);
          for (var i = 1; i < points.length; i++) doc.line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
          points.forEach(function (point) {
            setFill(CORES.blue); doc.circle(point.x, point.y, 2.8, 'F');
            doc.setFont('helvetica', 'normal'); doc.setFontSize(6); setText(CORES.muted); doc.text(point.label, point.x, chartY + chartH - 7, { align: 'center' });
          });
          y = chartY + chartH + 14;
        }
        function drawGoalProgress(cy) {
          ensure(132);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setText(CORES.ink); doc.text(texto.goalProgress, margin, cy);
          var chartY = cy + 14, chartH = Math.max(62, semanasComMeta.length * 20 + 22);
          if (!semanasComMeta.length) { drawEmptyChart(margin, chartY, contentW, chartH, texto.noGoals); y = chartY + chartH + 14; return; }
          setFill(CORES.card); doc.roundedRect(margin, chartY, contentW, chartH, 7, 7, 'F'); setDraw(CORES.line); doc.roundedRect(margin, chartY, contentW, chartH, 7, 7, 'S');
          semanasComMeta.forEach(function (semana, i) {
            var lineY = chartY + 18 + i * 20, x = margin + 62, barW = contentW - 132;
            doc.setFont('helvetica', 'bold'); doc.setFontSize(7); setText(CORES.ink); doc.text(semana.rotulo, margin + 12, lineY + 4);
            setFill(CORES.paper); doc.roundedRect(x, lineY - 5, barW, 9, 4, 4, 'F');
            setFill(semana.metaPercentual >= 100 ? CORES.green : CORES.lime); doc.roundedRect(x, lineY - 5, Math.min(barW, barW * semana.metaPercentual / 100), 9, 4, 4, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(7); setText(semana.metaPercentual >= 100 ? CORES.green : CORES.ink);
            doc.text(semana.metaPercentual.toFixed(0) + '%', margin + contentW - 12, lineY + 4, { align: 'right' });
          });
          y = chartY + chartH + 14;
        }
        function variation(current, previous) {
          if (!previous) return '—';
          var percent = ((current - previous) / Math.abs(previous)) * 100;
          return (percent > 0 ? '+' : '') + percent.toFixed(1).replace('.', ',') + '%';
        }
        function renderTable(head, body, options) {
          options = options || {};
          doc.autoTable({
            head: [head], body: body, startY: y,
            margin: { left: margin, right: margin, top: 76, bottom: 44 },
            styles: { font: 'helvetica', fontSize: options.fontSize || 7.5, cellPadding: options.cellPadding || 4.5, textColor: CORES.ink, lineColor: CORES.line, lineWidth: .45, overflow: 'linebreak' },
            headStyles: { fillColor: options.headColor || CORES.ink, textColor: 255, fontStyle: 'bold', fontSize: options.headFontSize || 7.4 },
            alternateRowStyles: { fillColor: options.altColor || [250, 250, 247] },
            columnStyles: options.columnStyles || {},
            didParseCell: options.didParseCell
          });
          y = doc.lastAutoTable.finalY + 20;
        }
        function showInsight(x, cy, width, label, value, cor) {
          setFill(CORES.card); doc.roundedRect(x, cy, width, 47, 6, 6, 'F'); setDraw(CORES.line); doc.setLineWidth(.55); doc.roundedRect(x, cy, width, 47, 6, 6, 'S');
          setFill(cor); doc.roundedRect(x, cy, 3, 47, 2, 2, 'F');
          doc.setFont('helvetica', 'normal'); doc.setFontSize(7); setText(CORES.muted); doc.text(label, x + 10, cy + 14, { maxWidth: width - 18 });
          doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); setText(CORES.ink);
          var lines = doc.splitTextToSize(value, width - 18); doc.text(lines.slice(0, 2), x + 10, cy + 28);
        }

        var y = 92;
        setFill(CORES.ink); doc.roundedRect(margin, y, contentW, 54, 8, 8, 'F');
        setFill(CORES.lime); doc.roundedRect(margin, y, 5, 54, 3, 3, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(255, 255, 255);
        doc.text(texto.overview, margin + 18, y + 22);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(204, 219, 208);
        doc.text(perfilNome + ' · ' + perfilEmail, margin + 18, y + 39, { maxWidth: contentW - 180 });
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(CORES.lime[0], CORES.lime[1], CORES.lime[2]);
        doc.text(mesNome + ' ' + year, pageW - margin - 16, y + 30, { align: 'right' });
        y += 76;

        section(texto.report, texto.summary);
        drawMetricGrid([
          { label: texto.gross, value: euro(totBruto), cor: CORES.green },
          { label: texto.expenses, value: euro(totDespesas), cor: CORES.red },
          { label: texto.net, value: euro(totLiquido), cor: totLiquido >= 0 ? CORES.green : CORES.red },
          { label: texto.margin, value: margemLiquida.toFixed(1).replace('.', ',') + '%', cor: margemLiquida >= 0 ? CORES.green : CORES.red },
          { label: texto.days, value: String(diasComGanhos), cor: CORES.blue },
          { label: texto.average, value: euro(mediaDiaria), cor: CORES.blue },
          { label: texto.expenseRate, value: percentDespesas.toFixed(1).replace('.', ',') + '%', cor: CORES.red },
          { label: texto.goals, value: semanasComMeta.length ? cumprimentoMedioMetas.toFixed(0) + '%' : '—', cor: CORES.green }
        ]);
        drawDailyBars(y, texto.dailyEvolution, function (dia) { return dia.bruto; }, CORES.green);
        drawDonut(y);

        newPage();
        section('01', texto.platformAnalysis, texto.platformComparison);
        drawPlatformBars(y);
        if (plataformas.length) {
          var platformHead = [texto.platform].concat(semanas.map(function (semana) { return semana.rotulo; })).concat([texto.total, texto.share]);
          var platformBody = plataformas.map(function (platform) {
            return [platform.nome].concat(semanas.map(function (semana) { return euro(semana.plataformas[platform.id] || 0); })).concat([
              euro(platform.valor), ((platform.valor / totalPlataformas) * 100).toFixed(1).replace('.', ',') + '%'
            ]);
          });
          renderTable(platformHead, platformBody, {
            fontSize: 7, cellPadding: 4,
            columnStyles: (function () { var styles = { 0: { fontStyle: 'bold' } }; styles[platformHead.length - 2] = { fontStyle: 'bold', halign: 'right' }; styles[platformHead.length - 1] = { halign: 'right' }; return styles; })()
          });
        } else {
          drawEmptyChart(margin, y, contentW, 54, texto.noPlatforms); y += 68;
        }

        newPage();
        section('02', texto.expenseAnalysis, texto.expenseEvolution);
        drawDailyBars(y, texto.expenseEvolution, function (dia) { return dia.despesas; }, CORES.red);
        section('02', texto.expenseImpact);
        if (maioresDespesas.length) {
          renderTable([texto.description, texto.amount, texto.share], maioresDespesas.slice(0, 8).map(function (item) {
            return [item.descricao, euro(item.valor), (totDespesas ? item.valor / totDespesas * 100 : 0).toFixed(1).replace('.', ',') + '%'];
          }), {
            headColor: CORES.red, altColor: CORES.softRed,
            columnStyles: { 1: { fontStyle: 'bold', textColor: CORES.red, halign: 'right' }, 2: { halign: 'right' } }
          });
        } else {
          drawEmptyChart(margin, y, contentW, 54, texto.noExpenses); y += 68;
        }

        newPage();
        section('03', texto.weeklyComparison, texto.weeklyPerformance);
        drawWeeklyBars(y);
        drawAverageTrend(y);
        var firstWeek = semanas[0], lastWeek = semanas[semanas.length - 1];
        if (semanas.length) {
          var comparisonHead = [texto.indicator].concat(semanas.map(function (semana) { return semana.rotulo; })).concat([texto.variation]);
          var comparisonBody = [
            [texto.grossShort].concat(semanas.map(function (semana) { return euro(semana.bruto); })).concat([variation(lastWeek.bruto, firstWeek.bruto)]),
            [texto.expensesShort].concat(semanas.map(function (semana) { return euro(semana.despesas); })).concat([variation(lastWeek.despesas, firstWeek.despesas)]),
            [texto.netShort].concat(semanas.map(function (semana) { return euro(semana.liquido); })).concat([variation(lastWeek.liquido, firstWeek.liquido)]),
            [texto.averageShort].concat(semanas.map(function (semana) { return euro(semana.mediaDiaria); })).concat([variation(lastWeek.mediaDiaria, firstWeek.mediaDiaria)]),
            [texto.goalShort].concat(semanas.map(function (semana) { return semana.meta ? semana.metaPercentual.toFixed(0) + '%' : '—'; })).concat(['—'])
          ];
          renderTable(comparisonHead, comparisonBody, {
            fontSize: 6.9, cellPadding: 4,
            didParseCell: function (cell) {
              if (cell.section === 'body' && cell.column.index === comparisonHead.length - 1) {
                var value = String(cell.cell.raw);
                if (value.indexOf('+') === 0) cell.cell.styles.textColor = CORES.green;
                if (value.indexOf('-') === 0) cell.cell.styles.textColor = CORES.red;
                cell.cell.styles.fontStyle = 'bold';
              }
            }
          });
        }
        section('04', texto.goalsTitle);
        drawGoalProgress(y);
        if (semanasComMeta.length) {
          renderTable([texto.period, texto.goal, texto.achieved, texto.completion, texto.status], semanasComMeta.map(function (semana) {
            var remaining = semana.meta.valor - semana.metaRealizada;
            return [
              semana.rotulo + ' (' + semana.periodo + ')',
              euro(semana.meta.valor) + ' · ' + (semana.meta.tipo === 'liquido' ? texto.netShort : texto.grossShort),
              euro(semana.metaRealizada), semana.metaPercentual.toFixed(1).replace('.', ',') + '%',
              remaining <= 0 ? texto.reached : texto.remaining + ' ' + euro(remaining)
            ];
          }), {
            columnStyles: { 2: { fontStyle: 'bold', halign: 'right' }, 3: { fontStyle: 'bold', halign: 'right' }, 4: { halign: 'right' } }
          });
        }

        newPage();
        section('05', texto.insights);
        var bestWeek = semanas.length ? semanas.reduce(function (best, semana) { return semana.bruto > best.bruto ? semana : best; }, semanas[0]) : null;
        var lowestWeek = semanas.length ? semanas.reduce(function (lowest, semana) { return semana.liquido < lowest.liquido ? semana : lowest; }, semanas[0]) : null;
        var bestDay = dias.reduce(function (best, dia) { return dia.bruto > (best ? best.bruto : -1) ? dia : best; }, null);
        var bestPlatform = plataformas.length ? plataformas.reduce(function (best, plataforma) { return plataforma.valor > best.valor ? plataforma : best; }, plataformas[0]) : null;
        var insightItems = [
          { label: texto.bestWeek, value: bestWeek && bestWeek.bruto > 0 ? bestWeek.rotulo + ' · ' + euro(bestWeek.bruto) : texto.noData, cor: CORES.green },
          { label: texto.lowestWeek, value: lowestWeek ? lowestWeek.rotulo + ' · ' + euro(lowestWeek.liquido) : texto.noData, cor: lowestWeek && lowestWeek.liquido < 0 ? CORES.red : CORES.blue },
          { label: texto.bestDay, value: bestDay && bestDay.bruto > 0 ? pad2(bestDay.data.getDate()) + '/' + pad2(bestDay.data.getMonth() + 1) + ' · ' + euro(bestDay.bruto) : texto.noData, cor: CORES.blue },
          { label: texto.bestPlatform, value: bestPlatform ? bestPlatform.nome + ' · ' + euro(bestPlatform.valor) : texto.noData, cor: CORES.green },
          { label: texto.largestExpense, value: maioresDespesas[0] ? maioresDespesas[0].descricao + ' · ' + euro(maioresDespesas[0].valor) : texto.noData, cor: CORES.red },
          { label: texto.expenseRate, value: percentDespesas.toFixed(1).replace('.', ',') + '%', cor: CORES.red }
        ];
        insightItems.forEach(function (item, i) {
          var columns = 2, gap = 10, width = (contentW - gap) / columns;
          var x = margin + (i % columns) * (width + gap), cy = y + Math.floor(i / columns) * 55;
          showInsight(x, cy, width, item.label, item.value, item.cor);
        });
        y += Math.ceil(insightItems.length / 2) * 55 + 12;

        section('06', texto.dailyDetail, texto.platforms);
        var dailyRows = dias.map(function (dia) {
          var platformLines = [];
          if (dia.uber) platformLines.push('Uber ' + euro(dia.uber));
          if (dia.bolt) platformLines.push('Bolt ' + euro(dia.bolt));
          extras.forEach(function (platform) { if (dia.plat[platform.id]) platformLines.push(platform.nome + ' ' + euro(dia.plat[platform.id])); });
          if (dia.ganhosExtras.some(function (item) { return item.incluidoBruto; })) platformLines.push(texto.otherEarnings + ' ' + euro(ganhosExtrasBruto({ ganhosExtras: dia.ganhosExtras })));
          return [
            diasAbbr[(dia.data.getDay() + 6) % 7] + ' ' + pad2(dia.data.getDate()) + '/' + pad2(month + 1),
            platformLines.length ? platformLines.join('\n') : '—', euro(dia.bruto), euro(dia.despesas), euro(dia.liquido), dia.distancia.toFixed(0) + ' km'
          ];
        });
        renderTable([texto.date, texto.platforms, texto.grossShort, texto.expensesShort, texto.netShort, texto.mileage], dailyRows, {
          fontSize: 7, cellPadding: 4,
          columnStyles: { 0: { fontStyle: 'bold', cellWidth: 52 }, 1: { cellWidth: 200 }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { fontStyle: 'bold', halign: 'right' }, 5: { halign: 'right' } },
          didParseCell: function (cell) {
            if (cell.section === 'body' && cell.column.index === 4 && String(cell.cell.raw).indexOf('-') === 0) cell.cell.styles.textColor = CORES.red;
          }
        });

        section('07', texto.expenseDetail);
        if (despesasDetalhadas.length) {
          renderTable([texto.date, texto.description, texto.type, texto.amount], despesasDetalhadas.map(function (item) {
            return [pad2(item.data.getDate()) + '/' + pad2(item.data.getMonth() + 1), item.descricao, item.tipo, euro(item.valor)];
          }), {
            headColor: CORES.red, altColor: CORES.softRed,
            columnStyles: { 0: { cellWidth: 55 }, 3: { fontStyle: 'bold', textColor: CORES.red, halign: 'right' } }
          });
        } else {
          drawEmptyChart(margin, y, contentW, 54, texto.noExpenses); y += 68;
        }

        var fixasRegistradas = loadDespesasFixasCadastro().filter(function (item) {
          var fimMes = dateKeyFor(new Date(year, month + 1, 0));
          var inicioMes = dateKeyFor(new Date(year, month, 1));
          return (!item.ate || item.ate > inicioMes) && (!item.desde || item.desde <= fimMes);
        });
        if (fixasRegistradas.length) {
          section('07', texto.fixedExpenses);
          renderTable([texto.description, texto.type, texto.amount], fixasRegistradas.map(function (item) {
            return [item.descricao, item.tipo === 'euro' ? I18N.t('relatorio.pdf.valorFixo') : I18N.t('relatorio.pdf.percentBruto'), item.tipo === 'euro' ? euro(item.valor) : Number(item.valor) + ' %'];
          }), { columnStyles: { 2: { fontStyle: 'bold', halign: 'right' } } });
        }

        var pageCount = doc.internal.getNumberOfPages();
        for (var page = 1; page <= pageCount; page++) { doc.setPage(page); header(); footer(page, pageCount); }

        var nomeFicheiro = 'smartsoma-relatorio-' + pad2(month + 1) + '-' + year + '.pdf';
        if (window.Capacitor && window.Capacitor.isNativePlatform() && window.Capacitor.getPlatform() === 'android') {
          var nativeDownloads = window.Capacitor.Plugins.NativeDownloads;
          if (!nativeDownloads) throw new Error('Transferência de PDF indisponível no Android.');
          return nativeDownloads.savePdf({ filename: nomeFicheiro, base64: doc.output('datauristring').split(',')[1] });
        }
        return doc.save(nomeFicheiro);
      }

      function mesTemDados (year, month) {
        var lastDay = new Date(year, month + 1, 0).getDate();
        for (var day = 1; day <= lastDay; day++) {
          var date = new Date(year, month, day);
          var badges = loadDayBadgesPdf(date);
          var hasBadge = badges.uber || badges.bolt || badges.despesas || badges.distancia || platSum(badges.plat) || ganhosExtrasFrom(badges.raw).length;
          if (hasBadge || loadDayItemsPdf(date).length) return true;
        }
        return false;
      }

      function mesesArquivaveis () {
        var months = {};
        var cache = window._cloudCache || {};
        Object.keys(cache).forEach(function (key) {
          var match = /^(?:homeBadgeValores|despesasDiarias):(\d{4})-(\d{2})-\d{2}$/.exec(key);
          if (match) months[match[1] + '-' + match[2]] = true;
        });
        return Object.keys(months).map(function (key) {
          var bits = key.split('-');
          return { year:Number(bits[0]), month:Number(bits[1]) - 1 };
        }).filter(function (item) { return mesTemDados(item.year, item.month); }).sort(function (a, b) {
          return (b.year * 12 + b.month) - (a.year * 12 + a.month);
        });
      }

      function gerarPdf (year, month, button, label, restoreKey) {
        if (button.disabled) return;
        button.disabled = true;
        label.textContent = I18N.t('relatorio.pdf.aGerar');
        carregarLibsPdf()
          .then(function () { return new Promise(function (resolve) { setTimeout(resolve, 30); }); })
          .then(function () {
            return Promise.resolve(gerarRelatorioPdf(year, month)).then(renderArchive);
          })
          .catch(function (err) {
            console.error('Erro ao gerar PDF:', err);
            alert(I18N.t('relatorio.pdf.erro'));
          })
          .then(function () {
            button.disabled = false;
            label.textContent = I18N.t(restoreKey);
          });
      }

      function renderArchive () {
        if (!archiveList || !archiveEmpty) return;
        archiveList.replaceChildren();
        var months = mesesArquivaveis();
        archiveEmpty.hidden = months.length > 0;
        months.forEach(function (item) {
          var button = document.createElement('button');
          var monthName = I18N.capitalize(I18N.list('months.full')[item.month]);
          button.type = 'button';
          button.className = 'report-archive-item';
          button.innerHTML = '<span class="report-archive-file" aria-hidden="true">PDF</span><span class="report-archive-name"><strong>' + monthName + ' ' + item.year + '</strong><small>PDF</small></span><span class="report-archive-action">' + I18N.t('relatorio.archive.generate') + '</span>';
          button.addEventListener('click', function () {
            var label = button.querySelector('.report-archive-action');
            gerarPdf(item.year, item.month, button, label, 'relatorio.archive.generate');
          });
          archiveList.appendChild(button);
        });
      }

      renderArchive();
      document.addEventListener('cloudCacheReady', renderArchive);
      document.addEventListener('languageChanged', renderArchive);

      if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
          gerarPdf(relYear, relMonth, downloadBtn, downloadLabel, 'relatorio.download');
        });
      }
    })();



/* ===================================================================
       Tutorial guiado.

       Abre a partir de Ajustes › Tutorial: primeiro um popup de
       confirmação e, ao carregar em "Iniciar", uma sequência de balões
       que destacam, um a um, os botões e zonas que valem a pena
       explicar. Cada passo diz em que página tem de estar (Ganhos /
       Resumo / Semana) e se o painel de Ajustes deve estar aberto — o
       tutorial navega sozinho até lá antes de desenhar o balão.

       O destaque é feito com um retângulo transparente sobre o alvo e
       uma sombra gigante à volta, que escurece o resto do ecrã. O
       overlay cobre tudo, por isso o utilizador não consegue tocar na
       app por engano enquanto o tutorial corre.
       =================================================================== */
    (function () {
      var overlay   = document.getElementById('tutorialOverlay');
      var spot      = document.getElementById('tutorialSpot');
      var balloon   = document.getElementById('tutorialBalloon');
      var arrow     = document.getElementById('tutorialArrow');
      var titleEl   = document.getElementById('tutorialTitle');
      var textEl    = document.getElementById('tutorialText');
      var counterEl = document.getElementById('tutorialCounter');
      var backBtn   = document.getElementById('tutorialBackBtn');
      var nextBtn   = document.getElementById('tutorialNextBtn');
      var closeBtn  = document.getElementById('tutorialCloseBtn');
      var startBackdrop = document.getElementById('tutorialStartBackdrop');
      var startBtn  = document.getElementById('tutorialStartBtn');
      var laterBtn  = document.getElementById('tutorialLaterBtn');
      var openBtn   = document.getElementById('openTutorialBtn');
      if (!overlay || !spot || !balloon || !openBtn) return;

      var SEEN_KEY = 'tutorialVisto';

      // sel    : elemento (ou lista de elementos) a destacar. Com vários
      //          selectores, o recorte abrange todos eles de uma só vez.
      // k      : prefixo das chaves de tradução (k + '.title' / '.text')
      // page   : página do corpo da app onde o passo acontece
      // sheet  : true = painel de Ajustes aberto; false = fechado
      var ALL_STEPS = [
        { sel: '#uiCalendar',             k: 'tut.s1',  page: 'ganhos', sheet: false },
        { sel: '#listRowUber',             k: 'tut.s2',  page: 'ganhos', sheet: false },
        { sel: '#uiManagePlatforms',       k: 'tut.s2b', page: 'ganhos', sheet: false },
        { sel: '#listRowDespesas',         k: 'tut.s3',  page: 'ganhos', sheet: false },
        { sel: '#listRowDistancia',        k: 'tut.s4',  page: 'ganhos', sheet: false },
        { sel: '#metaSemanalCard',         k: 'tut.s5',  page: 'resumo', sheet: false },
        { sel: '.ui-navigation',           k: 'tut.s6',  page: 'ganhos', sheet: false },
        { sel: '#btnVerMeuResumo',         k: 'tut.s7',  page: 'ganhos', sheet: false },
        { sel: '.period-filter-row',       k: 'tut.s8',  page: 'resumo', sheet: false },
        { sel: '.dash-cluster',            k: 'tut.s9',  page: 'resumo', sheet: false },
        { sel: '#semanaWeekPicker',        k: 'tut.s10', page: 'semana', sheet: false },
        { sel: '#subHeaderViewToggleGroup',k: 'tut.s11', page: 'semana', sheet: false },
        { sel: '#openDespesasFixasBtn',    k: 'tut.s12', page: 'ganhos', sheet: true,  pro: false }
      ];

      var STEPS = ALL_STEPS.slice();

      // Devolve os elementos de um passo (aceita um selector ou vários).
      function alvosDe (step) {
        var sels = (typeof step.sel === 'string') ? [step.sel] : step.sel;
        var els = [];
        sels.forEach(function (sel) {
          var el = document.querySelector(sel);
          if (el) els.push(el);
        });
        return els;
      }

      // Retângulo que envolve todos os elementos do passo.
      function rectDe (els) {
        var top = Infinity, left = Infinity, bottom = -Infinity, right = -Infinity;
        els.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < top) top = r.top;
          if (r.left < left) left = r.left;
          if (r.bottom > bottom) bottom = r.bottom;
          if (r.right > right) right = r.right;
        });
        return { top: top, left: left, bottom: bottom, right: right, width: right - left, height: bottom - top };
      }

      var index = -1;
      var running = false;
      var rafId = null;

      function sheetIsOpen () {
        var el = document.getElementById('profileSheet');
        return !!(el && el.classList.contains('open'));
      }

      function currentPage () {
        var state = (window.HomeNav && window.HomeNav.getCurrentState) ? window.HomeNav.getCurrentState() : 'default';
        return (state === 'default') ? 'ganhos' : state;
      }

      // Leva a app ao estado que o passo precisa (página certa, painel de
      // Ajustes aberto ou fechado) e só depois desenha o balão, dando
      // tempo às animações de transição já existentes.
      function prepare (step, done) {
        var espera = 0;

        if (step.page && currentPage() !== step.page) {
          if (window.HomeNav) window.HomeNav.goToSection(step.page);
          espera = 320;
        }

        if (step.sheet && !sheetIsOpen()) {
          if (typeof window.openProfileSheetPublic === 'function') window.openProfileSheetPublic();
          espera = Math.max(espera, 360);
        } else if (!step.sheet && sheetIsOpen()) {
          if (typeof window.closeProfileSheetPublic === 'function') window.closeProfileSheetPublic();
          espera = Math.max(espera, 360);
        }

        window.setTimeout(done, espera);
      }

      function render () {
        var step = STEPS[index];
        if (!step) return;
        titleEl.textContent = I18N.t(step.k + '.title');
        textEl.textContent  = I18N.t(step.k + '.text');
        counterEl.textContent = I18N.t('tut.counter', { a: index + 1, b: STEPS.length });
        backBtn.textContent = I18N.t('tut.back');
        backBtn.disabled = (index === 0);
        nextBtn.textContent = I18N.t(index === STEPS.length - 1 ? 'tut.finish' : 'tut.next');
      }

      // Coloca o recorte sobre o alvo e escolhe se o balão fica por baixo
      // ou por cima, consoante o espaço livre no ecrã.
      function place () {
        var step = STEPS[index];
        if (!step) return;
        var els = alvosDe(step);
        if (!els.length) { avancar(); return; }

        var PAD = 6;
        var r = rectDe(els);
        var vw = window.innerWidth;
        var vh = window.innerHeight;

        spot.style.top    = Math.max(0, r.top - PAD) + 'px';
        spot.style.left   = Math.max(0, r.left - PAD) + 'px';
        spot.style.width  = Math.min(vw, r.width + PAD * 2) + 'px';
        spot.style.height = Math.min(vh, r.height + PAD * 2) + 'px';

        var bw = balloon.offsetWidth;
        var bh = balloon.offsetHeight;
        var GAP = 12;

        var abaixo = (r.bottom + GAP + bh + 12 <= vh);
        if (!abaixo && (r.top - GAP - bh < 12)) {
          // Não cabe em cima nem em baixo: centra no espaço maior.
          abaixo = (vh - r.bottom) >= r.top;
        }
        var top = abaixo ? (r.bottom + GAP) : (r.top - GAP - bh);
        top = Math.max(12, Math.min(top, vh - bh - 12));

        var left = r.left + r.width / 2 - bw / 2;
        left = Math.max(12, Math.min(left, vw - bw - 12));

        balloon.style.top  = top + 'px';
        balloon.style.left = left + 'px';

        var ax = r.left + r.width / 2 - left - 6;
        ax = Math.max(16, Math.min(ax, bw - 30));
        arrow.style.left = ax + 'px';
        arrow.style.top    = abaixo ? '-5px' : '';
        arrow.style.bottom = abaixo ? '' : '-5px';

        overlay.classList.add('is-ready');
      }

      function mostrarPasso () {
        var step = STEPS[index];
        if (!step) { terminar(); return; }
        overlay.classList.remove('is-ready');
        prepare(step, function () {
          if (!running) return;
          var alvo = alvosDe(step)[0];
          if (alvo && alvo.scrollIntoView) {
            try { alvo.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch (e) { alvo.scrollIntoView(); }
          }
          render();
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(place);
          });
        });
      }

      function avancar () {
        if (index >= STEPS.length - 1) { concluirTutorial(); return; }
        index++;
        mostrarPasso();
      }

      function recuar () {
        if (index <= 0) return;
        index--;
        mostrarPasso();
      }

      function iniciar () {
        if (startBackdrop) startBackdrop.classList.remove('visible');
        if (window.closeAllOverlays) window.closeAllOverlays();
        if (window.QuickNavMenu) window.QuickNavMenu.close();
        STEPS = ALL_STEPS.slice();
        running = true;
        index = 0;
        overlay.hidden = false;
        mostrarPasso();
      }

      function terminar () {
        running = false;
        overlay.classList.remove('is-ready');
        overlay.hidden = true;
        try { cloudSet(SEEN_KEY, '1'); } catch (e) {  }
        if (sheetIsOpen() && typeof window.closeProfileSheetPublic === 'function') {
          window.closeProfileSheetPublic();
        }
        if (window.HomeNav) window.HomeNav.goToSection('ganhos');
      }

      // Concluir o último passo (clicar em "Concluir", não fechar a meio):
      // fecha o tutorial e mostra o popup de fim, a avisar que dá para
      // rever tudo outra vez a partir de Ajustes.
      function concluirTutorial () {
        terminar();
        var endBackdrop = document.getElementById('tutorialEndBackdrop');
        if (endBackdrop) {
          window.setTimeout(function () { endBackdrop.classList.add('visible'); }, 200);
        }
      }

      // ---- ligações ----
      openBtn.addEventListener('click', function () {
        if (typeof window.closeProfileSheetPublic === 'function') window.closeProfileSheetPublic();
        window.setTimeout(function () {
          if (startBackdrop) startBackdrop.classList.add('visible');
        }, 240);
      });

      if (startBtn) startBtn.addEventListener('click', iniciar);
      if (laterBtn) laterBtn.addEventListener('click', function () {
        if (startBackdrop) startBackdrop.classList.remove('visible');
      });
      if (startBackdrop) {
        startBackdrop.addEventListener('click', function (e) {
          if (e.target === startBackdrop) startBackdrop.classList.remove('visible');
        });
      }

      nextBtn.addEventListener('click', avancar);
      backBtn.addEventListener('click', recuar);
      closeBtn.addEventListener('click', terminar);

      var tutorialEndBackdrop = document.getElementById('tutorialEndBackdrop');
      var tutorialEndCloseBtn = document.getElementById('tutorialEndCloseBtn');
      var tutorialEndCard     = document.getElementById('tutorialEndCard');
      if (tutorialEndCloseBtn) {
        tutorialEndCloseBtn.addEventListener('click', function () {
          tutorialEndBackdrop.classList.remove('visible');
        });
      }
      if (tutorialEndBackdrop) {
        tutorialEndBackdrop.addEventListener('click', function (e) {
          if (e.target === tutorialEndBackdrop) tutorialEndBackdrop.classList.remove('visible');
        });
      }
      if (tutorialEndCard) {
        tutorialEndCard.addEventListener('click', function (e) { e.stopPropagation(); });
      }

      document.addEventListener('keydown', function (e) {
        if (!running) return;
        if (e.key === 'Escape') terminar();
        if (e.key === 'ArrowRight') avancar();
        if (e.key === 'ArrowLeft') recuar();
      });

      // O ecrã pode mexer-se (scroll, rotação, teclado): o balão e o
      // recorte acompanham sempre o elemento destacado.
      function reposicionar () {
        if (!running) return;
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(place);
      }
      window.addEventListener('resize', reposicionar);
      window.addEventListener('scroll', reposicionar, { passive: true });
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', reposicionar);
        window.visualViewport.addEventListener('scroll', reposicionar);
      }
      var listViewEl = document.getElementById('homeListView');
      if (listViewEl) listViewEl.addEventListener('scroll', reposicionar, { passive: true });

      // Troca de idioma a meio do tutorial: reescreve o balão atual.
      document.addEventListener('languageChanged', function () {
        if (!running) return;
        render();
        reposicionar();
      });

      window.TutorialGuiado = {
        isRunning: function () { return running; },
        close: terminar,
        start: iniciar
      };
    })();

    // A apresentação só inicia depois dos controlos reais e do cache estarem prontos.
    // Last DOM-ready listener: cloud-init replays these after hydration when
    // app.js loads dynamically. Announce readiness only after legacy setup.
    document.addEventListener('DOMContentLoaded', function () {
      window.SmartSomaAppReady = true;
      document.dispatchEvent(new CustomEvent('smartSomaAppReady'));
    }, { once: true });
