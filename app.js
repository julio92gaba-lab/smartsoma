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
"app.save": "Salvar",
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
"semana.weekNum": "SEMANA {n}",
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
"semana.despesasTitle": "Despesas da semana",
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
"relatorio.intro": "O relatório reúne os detalhes diários do mês escolhido, todos juntos em um único PDF. Selecione o mês desejado no filtro abaixo.",
"relatorio.download": "Baixar PDF",
"relatorio.preview": "IMG EXEMPLO DE PDF",
"sheet.title": "Ajustes",
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
"sheet.idioma": "Idioma",
"sheet.tamanho": "Tamanho da fonte",
"sheet.tamanhoPequeno": "Pequeno",
"sheet.tamanhoGrande": "Grande",
"tamanho.popupTitle": "Tamanho da fonte",
"tamanho.popupTexto": "Escolha para aumentar ou diminuir a fonte e os elementos em todo o app.",
"tamanho.concluir": "Concluído",
"sheet.tutorial": "Tutorial",
"sheet.ajuda": "Falar connosco",
"sheet.termosPrivacidade": "Termos e Privacidade",
"sheet.sair": "Sair",
"idioma.title": "Idioma",
"idioma.intro": "Escolha o idioma da aplicação. Todos os textos serão apresentados no idioma selecionado.",
"idioma.save": "Salvar",
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
"pwdChange.novaPh": "Mínimo 6 caracteres",
"pwdChange.confirmar": "Confirmar nova password",
"pwdChange.confirmarPh": "Repita a nova password",
"pwdChange.concluir": "Concluir",
"pwdChange.aguarde": "A concluir...",
"pwdChange.erroSenha": "Password atual incorreta.",
"pwdChange.erroCurta": "A nova password precisa de pelo menos 6 caracteres.",
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
"fixas.oncePerWeek": "€{v} (1x por semana)",
"fixas.percentOfWeek": "€{v} ({p}% do bruto da semana)",
"fixas.weeklyShort": "€{v} (semanal)",
"fixas.sufixoFixa": "{d} (FIXA)",
"fixas.sufixoFixaPct": "{d} {p}% do Bruto (FIXA)",
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
"meta.welcomeKept": "Mantivemos sua meta em €{v} {t}. Pode alterar sempre que quiser na página inicial.",
"meta.valorAria": "Valor da meta semanal",
"meta.bruto": "Bruto",
"meta.liquido": "Líquido",
"meta.brutos": "Brutos",
"meta.liquidos": "Líquidos",
"meta.atual": "Meta atual",
"meta.nenhuma": "Nenhuma",
"meta.current": "{v}€ {t} / {p}%",
"meta.fixasQuestion": "Manter as mesmas despesas fixas da semana passada?",
"meta.fixasEmpty": "Nenhuma despesa fixa cadastrada. Para usar esta opção, cadastre em Ajustes › Despesas Fixas.",
"meta.fixasManter": "Manter",
"meta.fixasZerar": "Zerar Despesas",
"meta.podeAlterar": "Pode alterar quando quiser.",
"meta.zerar": "Zerar",
"meta.fixasLinhaEuro": "{v} Eur",
"meta.fixasLinhaPct": "{v}% do valor bruto",
"meta.histNaoDefinida": "Meta não foi definida para esta semana.",
"meta.histDefinida": "Meta definida:",
"meta.histGanho": "Ganho no período:",
"meta.histAcima": "Você ultrapassou a meta, atingindo {p}% dela.",
"meta.histAbaixo": "Você atingiu {p}% da meta até então.",
"tut.popup.title": "Tutorial",
"tut.popup.text": "Quer ver uma visita guiada pela aplicação? Leva menos de um minuto e pode sair quando quiser.",
"tut.popup.start": "Iniciar",
"tut.popup.later": "Agora não",
"tut.next": "Seguinte",
"tut.back": "Voltar",
"tut.finish": "Concluir",
"tut.closeAria": "Fechar tutorial",
"tut.counter": "{a} de {b}",
"tut.s1.title": "Data do registo",
"tut.s1.text": "Tudo o que inserir fica guardado no dia escolhido aqui. Toque para registar num dia anterior.",
"tut.s2.title": "Os seus rendimentos",
"tut.s2.text": "Registe quanto recebeu nas plataformas. Se já tiver lançado um valor nesse dia, carregue novamente para poder corrigir.",
"tut.s3.title": "Despesas do dia",
"tut.s3.text": "Gastos avulsos: combustível, refeições, portagens. Pode inserir quantos quiser e apagar depois.",
"tut.s4.title": "Distância percorrida",
"tut.s4.text": "Dois modos: «Km Total» para inserir só o total do dia, ou «Início e Fim» para inserir o km do painel de manhã e o final à noite — nós fazemos a conta.",
"tut.s5.title": "Meta semanal",
"tut.s5.text": "Defina quanto quer ganhar na semana, em bruto ou em líquido, e acompanhe aqui a percentagem já concluída.",
"tut.s6.title": "Menu de páginas",
"tut.s6.text": "Este botão abre o menu de páginas: daqui vai e volta entre as diferentes visualizações e detalhes dos seus ganhos.",
"tut.s7.title": "Navegar entre páginas",
"tut.s7.text": "Este botão leva-o ao Resumo Financeiro. Vamos espreitar.",
"tut.s8.title": "Escolher o período",
"tut.s8.text": "Veja os totais por Dia, Semana ou Mês e use as setas para consultar períodos anteriores.",
"tut.s9.title": "Os seus números",
"tut.s9.text": "O anel mostra o progresso da meta da semana. Bruto e Líquido trocam de lugar conforme o tipo de meta que definiu.",
"tut.s10.title": "Semana a semana",
"tut.s10.text": "Escolha o mês e a semana que quer consultar. Uma semana pertence ao mês onde tem mais dias.",
"tut.s11.title": "Tabela ou lista",
"tut.s11.text": "Alterne entre a tabela da semana e um card por dia, onde consegue ver as despesas de cada dia em detalhe.",
"tut.s12.title": "Despesas fixas",
"tut.s12.text": "Gastos que se repetem todas as semanas (aluguer do carro, comissão da plataforma). Em euros ou em % do bruto — neste caso o valor cresce sozinho conforme lança ganhos. É lançado sempre à segunda-feira.",
"tut.end.title": "Fim do tutorial",
"tut.end.text": "Pode voltar a vê-lo sempre que quiser, através do menu Ajustes.",
"tut.end.highlight": "Bons ganhos!",
"tut.end.fechar": "Fechar"
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
"semana.despesasTitle": "Expenses of the week",
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
"relatorio.intro": "The report gathers the daily details of the chosen month, all together in a single PDF. Select the month you want in the filter below.",
"relatorio.download": "Download PDF",
"relatorio.preview": "SAMPLE PDF IMAGE",
"sheet.title": "Settings",
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
"sheet.idioma": "Language",
"sheet.tamanho": "Font size",
"sheet.tamanhoPequeno": "Small",
"sheet.tamanhoGrande": "Large",
"tamanho.popupTitle": "Font size",
"tamanho.popupTexto": "Choose to make the font and elements bigger or smaller across the whole app.",
"tamanho.concluir": "Done",
"sheet.tutorial": "Tutorial",
"sheet.ajuda": "Contact us",
"sheet.termosPrivacidade": "Terms and Privacy",
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
"pwdChange.novaPh": "At least 6 characters",
"pwdChange.confirmar": "Confirm new password",
"pwdChange.confirmarPh": "Repeat the new password",
"pwdChange.concluir": "Done",
"pwdChange.aguarde": "Finishing...",
"pwdChange.erroSenha": "Current password is incorrect.",
"pwdChange.erroCurta": "The new password needs at least 6 characters.",
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
"fixas.oncePerWeek": "€{v} (1x per week)",
"fixas.percentOfWeek": "€{v} ({p}% of the week's gross)",
"fixas.weeklyShort": "€{v} (weekly)",
"fixas.sufixoFixa": "{d} (FIXED)",
"fixas.sufixoFixaPct": "{d} {p}% of Gross (FIXED)",
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
"meta.welcomeKept": "We kept your goal at €{v} {t}. You can change it whenever you like on the home screen.",
"meta.valorAria": "Weekly goal amount",
"meta.bruto": "Gross",
"meta.liquido": "Net",
"meta.brutos": "Gross",
"meta.liquidos": "Net",
"meta.atual": "Current goal",
"meta.nenhuma": "None",
"meta.current": "€{v} {t} / {p}%",
"meta.fixasQuestion": "Keep the same fixed expenses as last week?",
"meta.fixasEmpty": "No fixed expenses registered. To use this option, register them in Settings › Fixed Expenses.",
"meta.fixasManter": "Keep",
"meta.fixasZerar": "Clear Expenses",
"meta.podeAlterar": "You can change it whenever you like.",
"meta.zerar": "Clear",
"meta.fixasLinhaEuro": "{v} Eur",
"meta.fixasLinhaPct": "{v}% of the gross amount",
"meta.histNaoDefinida": "No goal was set for this week.",
"meta.histDefinida": "Goal set:",
"meta.histGanho": "Earned in the period:",
"meta.histAcima": "You went past the goal, reaching {p}% of it.",
"meta.histAbaixo": "You reached {p}% of the goal so far.",
"tut.popup.title": "Tutorial",
"tut.popup.text": "Would you like a guided tour of the app? It takes less than a minute and you can leave whenever you want.",
"tut.popup.start": "Start",
"tut.popup.later": "Not now",
"tut.next": "Next",
"tut.back": "Back",
"tut.finish": "Finish",
"tut.closeAria": "Close tutorial",
"tut.counter": "{a} of {b}",
"tut.s1.title": "Entry date",
"tut.s1.text": "Everything you enter is saved under the day chosen here. Tap to log an entry on a previous day.",
"tut.s2.title": "Your earnings",
"tut.s2.text": "Log how much you made on the platforms. If you've already entered an amount for that day, tap again to make a correction.",
"tut.s3.title": "Expenses of the day",
"tut.s3.text": "One-off costs: fuel, meals, tolls. Enter as many as you like and delete them later.",
"tut.s4.title": "Distance travelled",
"tut.s4.text": "Two modes: \"Total Km\" to enter just the day's total, or \"Start and End\" to enter the odometer in the morning and again at night — we do the maths.",
"tut.s5.title": "Weekly goal",
"tut.s5.text": "Set how much you want to earn this week, gross or net, and follow the percentage completed right here.",
"tut.s6.title": "Page menu",
"tut.s6.text": "This button opens the page menu: from here you move back and forth between the different views and details of your earnings.",
"tut.s7.title": "Moving between pages",
"tut.s7.text": "This button takes you to the Financial Summary. Let's have a look.",
"tut.s8.title": "Choosing the period",
"tut.s8.text": "See totals by Day, Week or Month and use the arrows to look at earlier periods.",
"tut.s9.title": "Your numbers",
"tut.s9.text": "The ring shows how far along the week's goal is. Gross and Net swap places depending on the type of goal you set.",
"tut.s10.title": "Week by week",
"tut.s10.text": "Pick the month and the week you want to review. A week belongs to the month holding most of its days.",
"tut.s11.title": "Table or list",
"tut.s11.text": "Switch between the week's table and one card per day, where you can see each day's expenses in detail.",
"tut.s12.title": "Fixed expenses",
"tut.s12.text": "Costs that repeat every week (car rental, platform fee). In euros or as a % of the gross — in that case the amount grows on its own as you log earnings. It is always posted on Monday.",
"tut.end.title": "Tutorial complete",
"tut.end.text": "You can watch it again anytime from the Settings menu.",
"tut.end.highlight": "Happy earning!",
"tut.end.fechar": "Close"
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
        if (labelEl) labelEl.textContent = isGrande() ? 'G' : 'P';
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
      document.querySelectorAll('.mm-backdrop.visible').forEach(function (b) {
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

      var confirmBackdrop  = document.getElementById('despesaConfirmBackdrop');
      var confirmCancelBtn = document.getElementById('despesaConfirmCancelBtn');
      var confirmDeleteBtn = document.getElementById('despesaConfirmDeleteBtn');

      if (!descInput || !valorInput || !salvarBtn || !listEl) return;

      var tipoAtual = 'percentual';
      var despesas  = [];
      var despesaSeq = 0;
      var pendingDeleteId = null;

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
          return '€' + Number(item.valor).toFixed(2);
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
        valorInput.placeholder = isPercent ? '%' : '€';
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

        var ativas = despesas.filter(function (item) { return !item.ate; });

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
        var descricao = descInput.value.trim();
        var valorNum  = parseFloat(valorInput.value.replace(',', '.'));

        if (!descricao || isNaN(valorNum) || valorNum <= 0) return;

        if (tipoAtual === 'euro' && valorNum > 999.99) valorNum = 999.99;

        despesaSeq++;
        despesas.push({
          id: despesaSeq,
          descricao: descricao,
          valor: valorNum,
          tipo: tipoAtual,
          desde: semanaAtualKey()
        });

        saveDespesas();
        renderDespesas();
        document.dispatchEvent(new CustomEvent('despesasFixasChanged'));

        descInput.value = '';
        valorInput.value = '';
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
      document.addEventListener('languageChanged', renderDespesas);

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
            return (Number(parsed.uber) || 0) + (Number(parsed.bolt) || 0);
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
                '<div class="despesa-card-desc">' + item.descricao + '</div>' +
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
          sub.textContent = '€' + Number(item.valor).toFixed(2);

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
        var descricao = descInput.value.trim();
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
        descInput.focus();
      });

      function openDeleteConfirm (id, descricao) {
        pendingDeleteId = id;
        if (confirmText) confirmText.textContent = I18N.t('fixas.confirmNamed', { n: descricao });
        if (confirmBackdrop) confirmBackdrop.classList.add('visible');
      }

      function closeDeleteConfirm () {
        pendingDeleteId = null;
        if (confirmBackdrop) confirmBackdrop.classList.remove('visible');
      }

      if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', closeDeleteConfirm);
      if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function () {
          if (pendingDeleteId !== null) {
            items = items.filter(function (item) { return item.id !== pendingDeleteId; });
            saveItems();
            renderList();
            syncBadge();
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
        calNextBtn.disabled = isCurrentMonth;

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

          if (d.getTime() > today.getTime()) {
            btn.classList.add('is-future');
            btn.disabled = true;
          }
          if (isSameDay(d, today))         btn.classList.add('is-today');
          if (isSameDay(d, selectedDate))  btn.classList.add('is-selected');

          (function (dCopy) {
            btn.addEventListener('click', function () {
              selectedDate = dCopy;
              updateDateBtnLabel();
              closeCalendarModal();
              notifyDateChange();
            });
          })(d);

          calDaysGrid.appendChild(btn);
        }
      }

      function openCalendarModal () {
        viewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        renderCalendar();
        calBackdrop.classList.add('visible');
        subHeaderDateBtn.setAttribute('aria-expanded', 'true');
      }

      function closeCalendarModal () {
        calBackdrop.classList.remove('visible');
        subHeaderDateBtn.setAttribute('aria-expanded', 'false');
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
        open: openCalendarModal,
        close: closeCalendarModal,
        formatLabel: formatDateLabelLower,
        onChange: function (fn) {
          if (typeof fn === 'function') dateChangeListeners.push(fn);
        }
      };
    })();



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
      requestAnimationFrame(updateEdges);
      // A fonte Inter troca a fonte de sistema depois do primeiro cálculo
      // (font-display:swap), o que muda a largura dos blocos e deixava o
      // degradê "errado" até o próximo scroll. Recalcula assim que a
      // fonte termina de carregar.
      if (window.document && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateEdges);
      }

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
        isDown = true;
        moved = false;
        startX = e.clientX;
        startScroll = scroller.scrollLeft;
        scroller.classList.add('is-dragging');
      });

      window.addEventListener('pointermove', function (e) {
        if (!isDown) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
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
      // da semana anterior é copiada para ela (o utilizador pode alterar ou
      // "Zerar"). Procura para trás a semana mais recente que tenha meta;
      // se essa semana foi "zerada" de propósito, não herda nada — senão
      // uma meta antiga "ressuscitaria" depois de zerada.
      var metaMantidaDaSemanaAnterior = null;
      function carryOverMetaFromPreviousWeeks () {
        var monday = weekMonday(new Date());
        for (var i = 1; i <= 104; i++) {
          var d = new Date(monday.getTime());
          d.setDate(monday.getDate() - 7 * i);
          var key = dateKeyFor(d);
          try {
            var raw = cloudGet(storageKeyForWeek(key));
            if (raw) {
              var parsed = JSON.parse(raw);
              if (parsed && typeof parsed.valor === 'number' && parsed.valor > 0) {
                return { valor: parsed.valor, tipo: (parsed.tipo === 'liquido') ? 'liquido' : 'bruto', percent: 0 };
              }
            }
          } catch (e) {  }
          if (isMetaZeradaForWeek(key)) return null;
        }
        return null;
      }

      var DESPESAS_FIXAS_KEY = 'despesasFixas';
      var DESPESAS_FIXAS_SKIP_PREFIX = 'despesasFixasSkipSemana:';

      function loadDespesasFixasCadastradas () {
        try {
          var raw = cloudGet(DESPESAS_FIXAS_KEY);
          if (raw) {
            var parsed = JSON.parse(raw);
            var items = (parsed && parsed.items) || [];
            var weekKey = currentWeekKey();
            return items.filter(function (item) {
              if (item && item.desde && item.desde > weekKey) return false;
              if (item && item.ate && item.ate <= weekKey) return false;
              return true;
            });
          }
        } catch (e) {  }
        return [];
      }
      function isFixasSkippedForWeek (weekKey) {
        try {
          return cloudGet(DESPESAS_FIXAS_SKIP_PREFIX + weekKey) === '1';
        } catch (e) {  }
        return false;
      }
      function setFixasSkippedForWeek (weekKey, skip) {
        try {
          if (skip) cloudSet(DESPESAS_FIXAS_SKIP_PREFIX + weekKey, '1');
          else cloudRemove(DESPESAS_FIXAS_SKIP_PREFIX + weekKey);
        } catch (e) {  }
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
          var b = { uber: 0, bolt: 0, despesas: 0 };
          try {
            var raw = cloudGet('homeBadgeValores:' + dateKeyFor(d));
            if (raw) {
              var parsed = JSON.parse(raw);
              b.uber     = Number(parsed.uber) || 0;
              b.bolt     = Number(parsed.bolt) || 0;
              b.despesas = Number(parsed.despesas) || 0;
            }
          } catch (e) {  }
          sumBruto     += b.uber + b.bolt;
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

      // O bloco "Manter/Zerar despesas fixas" só faz sentido uma vez por
      // semana e mora no popup automático de boas-vindas (ver
      // metaFixasWelcomeSection mais abaixo). O popup manual da meta não
      // tem mais essa pergunta — só a meta semanal em si.

      // Despesas fixas ainda não excluídas, sem olhar para a semana em que
      // foram criadas. Serve de plano B para a pergunta lá em baixo (no
      // popup de boas-vindas): se a janela desde/ate da semana (ex.: data
      // do aparelho alterada para testar) deixasse a lista vazia, a
      // pergunta sumia sem explicação.
      function loadDespesasFixasNaoExcluidas () {
        try {
          var raw = cloudGet(DESPESAS_FIXAS_KEY);
          if (raw) {
            var parsed = JSON.parse(raw);
            return ((parsed && parsed.items) || []).filter(function (item) { return item && !item.ate; });
          }
        } catch (e) {  }
        return [];
      }

      // ---- Popup exclusivo do aviso automático de início de semana ----
      // Duplicado do popup principal, mas sem os campos de editar a meta
      // (valor, Bruto/Líquido, meta atual, link Zerar): a meta já foi
      // mantida automaticamente da semana anterior (ver
      // carryOverMetaFromPreviousWeeks). Mostra só o texto de boas-vindas
      // e a seção de despesas fixas (Manter/Zerar).
      var welcomeModalBackdrop  = document.getElementById('metaSemanalWelcomeModalBackdrop');
      var welcomeModalText      = document.getElementById('metaSemanalWelcomeModalText');
      var welcomeFixasListEl    = document.getElementById('metaFixasWelcomeListEl');
      var welcomeFixasEmptyEl   = document.getElementById('metaFixasWelcomeEmptyEl');
      var welcomeFixasManterBtn = document.getElementById('metaFixasWelcomeManterBtn');
      var welcomeFixasPularBtn  = document.getElementById('metaFixasWelcomePularBtn');
      var welcomeSalvarBtn      = document.getElementById('metaSemanalWelcomeSalvarBtn');

      function renderWelcomeFixas () {
        if (!welcomeFixasListEl) return;

        var lista = loadDespesasFixasCadastradas();
        if (!lista.length) lista = loadDespesasFixasNaoExcluidas();
        var temFixas = lista.length > 0;

        welcomeFixasListEl.innerHTML = lista.map(function (item) {
          var linha = (item.tipo === 'euro')
            ? ('<span class="valor">' + I18N.t('meta.fixasLinhaEuro', { v: Number(item.valor).toFixed(2) }) + '</span> - ' + item.descricao)
            : ('<span class="valor">' + I18N.t('meta.fixasLinhaPct', { v: Number(item.valor) }) + '</span> - ' + item.descricao);
          return '<div class="meta-fixas-list-item">' + linha + '</div>';
        }).join('');

        if (welcomeFixasEmptyEl) welcomeFixasEmptyEl.hidden = temFixas;

        // Popup abre sempre com "Manter" pré-selecionado; o estado visual
        // dos botões é gerido pela variável welcomeFixasEscolha (não pelo
        // cloudGet), porque a escolha só é aplicada ao clicar em Salvar.
        var selManter = (welcomeFixasEscolha === 'manter');
        if (welcomeFixasManterBtn) {
          welcomeFixasManterBtn.disabled = !temFixas;
          welcomeFixasManterBtn.classList.toggle('active', selManter);
          welcomeFixasManterBtn.setAttribute('aria-pressed', selManter ? 'true' : 'false');
        }
        if (welcomeFixasPularBtn) {
          welcomeFixasPularBtn.disabled = !temFixas;
          welcomeFixasPularBtn.classList.toggle('active', !selManter);
          welcomeFixasPularBtn.setAttribute('aria-pressed', (!selManter) ? 'true' : 'false');
        }
      }

      // Variável local que guarda a escolha do utilizador dentro do popup.
      // Começa sempre em 'manter' quando o popup abre.
      var welcomeFixasEscolha = 'manter';

      if (welcomeFixasManterBtn) {
        welcomeFixasManterBtn.addEventListener('click', function () {
          welcomeFixasEscolha = 'manter';
          renderWelcomeFixas();
        });
      }
      if (welcomeFixasPularBtn) {
        welcomeFixasPularBtn.addEventListener('click', function () {
          welcomeFixasEscolha = 'zerar';
          renderWelcomeFixas();
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
        // Sempre abre com "Manter" pré-selecionado.
        welcomeFixasEscolha = 'manter';
        renderWelcomeFixas();
        closeAllOverlays();
        welcomeModalBackdrop.classList.add('visible');
      }
      function closeWelcomeModal (aplicar) {
        // Se aplicar=true (clique em Salvar), aplica a escolha actual.
        // Se aplicar=false (fechar pelo backdrop ou outro meio), não altera nada.
        if (aplicar) {
          setFixasSkippedForWeek(currentWeekKey(), welcomeFixasEscolha === 'zerar');
          document.dispatchEvent(new CustomEvent('despesasFixasChanged'));
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

      valorInput.addEventListener('input', function () {
        var value = valorInput.value.replace(/[^0-9.,]/g, '');
        var firstSep = value.search(/[.,]/);
        if (firstSep !== -1) {
          value = value.slice(0, firstSep + 1) + value.slice(firstSep + 1).replace(/[.,]/g, '');
        }
        var numeric = parseFloat(value.replace(',', '.'));
        if (!isNaN(numeric) && numeric > 999.99) {
          value = value.includes(',') ? '999,99' : '999.99';
        }
        valorInput.value = value;
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
              return { valor: parsed.valor, tipo: (parsed.tipo === 'liquido') ? 'liquido' : 'bruto' };
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
          if (weekBoxPercentEl) weekBoxPercentEl.textContent = '0% (ND)';
          if (weekBoxThumbEl) weekBoxThumbEl.textContent = '';
          if (weekBoxBtn) weekBoxBtn.classList.add('is-undefined');
        } else {
          var achieved = computeWeekEarnings(cfg.tipo, browsedMonday);
          var percent  = (cfg.valor > 0) ? Math.round((achieved / cfg.valor) * 100) : 0;
          if (percent < 0) percent = 0;
          if (weekBoxPercentEl) weekBoxPercentEl.textContent = percent + '%';
          if (weekBoxThumbEl) weekBoxThumbEl.textContent = (percent >= 100) ? '👍' : '👎';
          if (weekBoxBtn) weekBoxBtn.classList.add(percent >= 100 ? 'is-above' : 'is-below');
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
          '<p class="meta-semanal-hist-line"><strong>' + I18N.t('meta.histDefinida') + '</strong> €' + cfg.valor.toFixed(2) + ' ' + label + '</p>' +
          '<p class="meta-semanal-hist-line"><strong>' + I18N.t('meta.histGanho') + '</strong> €' + achieved.toFixed(2) + ' ' + label + '</p>' +
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

      if (weekBoxBtn) {
        weekBoxBtn.addEventListener('click', function () {
          var data = weekBoxBtn.__weekData;
          if (!data) return;
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

      var NO_AUTOFOCUS_IDS = ['despesasSemanaModalBackdrop', 'despesasModalBackdrop'];

      function focusFirstField (backdrop) {
        if (NO_AUTOFOCUS_IDS.indexOf(backdrop.id) !== -1) return;
        var field = backdrop.querySelector('input, textarea, select');
        if (!field) return;
        setTimeout(function () { field.focus(); }, 80);
      }

      allBackdrops.forEach(function (backdrop) {
        var observer = new MutationObserver(function (mutations) {
          for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].attributeName === 'class') {
              if (backdrop.classList.contains('visible')) {
                if (!isNested(backdrop)) closeOtherBackdrops(backdrop);
                focusFirstField(backdrop);
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
        return I18N.t('fmt.dayMonth', { d: d.getDate(), m: capitalize(MESES_MINUS()[d.getMonth()]) });
      }

      function formatSemanaLabel (d) {
        var range = getWeekRange(d);
        if (range.monday.getMonth() === range.sunday.getMonth()) {
          return I18N.t('fmt.rangeSameMonth', {
            d1: range.monday.getDate(), d2: range.sunday.getDate(), m: MESES_MINUS()[range.monday.getMonth()]
          });
        }
        return I18N.t('fmt.rangeCrossMonth', {
          d1: range.monday.getDate(), m1: MESES_MINUS()[range.monday.getMonth()],
          d2: range.sunday.getDate(),  m2: MESES_MINUS()[range.sunday.getMonth()]
        });
      }

      function formatMesLabel (d) {
        return I18N.t('fmt.monthYear', { m: capitalize(MESES_MINUS()[d.getMonth()]), y: d.getFullYear() });
      }

      function currentPeriod () {
        var selected = document.querySelector('.period-chip.selected');
        return selected ? selected.getAttribute('data-period') : 'dia';
      }

      function renderLabel () {
        var period = currentPeriod();
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

      window.ResumoPeriod = { update: updatePeriodLabel, getWeekRange: getWeekRange, getRefDate: function () { return refDate; } };

      // ---- Preenche os valores reais (Bruto, Despesas, Distância,
      // Líquido) do card de Resumo, de acordo com o período selecionado
      // (Dia / Semana / Mês) e a data de referência navegada acima.
      // Antes esses campos ficavam sempre travados em €0.00 / 0.0 km.
      (function () {
        var brutoEl     = document.getElementById('summaryBrutoValue');
        var despesasEl  = document.getElementById('summaryDespesasValue');
        var distanciaEl = document.getElementById('summaryDistanciaValue');
        var liquidoEl   = document.getElementById('summaryLiquidoValue');
        if (!brutoEl) return;

        function pad2 (n) { return n < 10 ? '0' + n : String(n); }
        function dateKeyFor (d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
        function formatEuro (v) { return '€' + Number(v).toFixed(2); }
        function formatKm (v) {
          var n = Number(v);
          var str = (Math.round(n * 10) / 10).toString();
          return str + ' km';
        }

        function loadDayBadges (d) {
          var badges = { uber: 0, bolt: 0, despesas: 0, distancia: 0 };
          try {
            var raw = cloudGet('homeBadgeValores:' + dateKeyFor(d));
            if (raw) {
              var parsed = JSON.parse(raw);
              for (var k in badges) {
                if (parsed && typeof parsed[k] === 'number') badges[k] = parsed[k];
              }
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
            sumBruto    += b.uber + b.bolt;
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
          dashMetaValue.textContent = '€' + formatValor(config.valor) + ' ' + TIPO_TITLE_OF(config.tipo);
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

      var badges = { uber: 0, bolt: 0, despesas: 0, distancia: 0 };

      function loadBadges () {
        badges = { uber: 0, bolt: 0, despesas: 0, distancia: 0 };
        try {
          var raw = cloudGet(BADGES_STORAGE_PREFIX + dateKey());
          if (raw) {
            var parsed = JSON.parse(raw);
            for (var k in badges) {
              if (parsed && typeof parsed[k] === 'number') badges[k] = parsed[k];
            }
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

      function formatEuro (v) { return '€ ' + Number(v).toFixed(2); }
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

      function dateKeyFor (d) {
        return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
      }

      function formatEuro (v) { return '€ ' + Number(v).toFixed(2); }
      function formatKm (v) {
        var n = Number(v);
        var str = (Math.round(n * 10) / 10).toString();
        return str + ' km';
      }

      function loadDayBadges (d) {
        var badges = { uber: 0, bolt: 0, despesas: 0, distancia: 0 };
        try {
          var raw = cloudGet(BADGES_STORAGE_PREFIX + dateKeyFor(d));
          if (raw) {
            var parsed = JSON.parse(raw);
            for (var k in badges) {
              if (parsed && typeof parsed[k] === 'number') badges[k] = parsed[k];
            }
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

      function isMonday (d) { return d.getTime() === getMonday(d).getTime(); }

      function weekGrossSoFar (monday) {
        var sum = 0;
        for (var i = 0; i < 7; i++) {
          var dd = new Date(monday.getTime());
          dd.setDate(monday.getDate() + i);
          var b = loadDayBadges(dd);
          sum += b.uber + b.bolt;
        }
        return sum;
      }

      // Junta as despesas avulsas do dia com as despesas fixas semanais
      // (lançadas sempre na segunda-feira, e só a partir do dia em que
      // esse lançamento já aconteceu), no formato "descrição + valor"
      // usado no card do modo lista, na tabela e no detalhamento.
      function loadDayExpenseEntries (d) {
        var entradas = loadDayItems(d).map(function (item) {
          return { descricao: item.descricao, valor: Number(item.valor) || 0 };
        });

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
              entradas.push({ descricao: descricao, valor: valor });
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

      function getMonday (date) {
        var day = date.getDay();
        var diffToMonday = (day === 0) ? -6 : 1 - day;
        var monday = new Date(date.getTime());
        monday.setDate(date.getDate() + diffToMonday);
        monday.setHours(0, 0, 0, 0);
        return monday;
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

          var count = 0;
          for (var i = 0; i < 7; i++) {
            var d = new Date(monday.getTime());
            d.setDate(monday.getDate() + i);
            if (d.getFullYear() === year && d.getMonth() === month) count++;
          }

          if (count >= 4) weeks.push({ monday: new Date(monday.getTime()), sunday: sunday });

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
        if (monday.getMonth() === sunday.getMonth()) {
          return I18N.t('fmt.rangeSameMonthDot', { d1: monday.getDate(), d2: sunday.getDate(), m: MESES_ABBR()[monday.getMonth()] });
        }
        return I18N.t('fmt.rangeCrossMonthDot2', {
          d1: monday.getDate(), m1: MESES_ABBR()[monday.getMonth()],
          d2: sunday.getDate(), m2: MESES_ABBR()[sunday.getMonth()]
        });
      }

      // Rótulo (em HTML) usado no botão/opções de seleção de semana, com o
      // período em destaque: <span class="semana-week-picker-num">SEMANA 1</span>
      // <span class="semana-week-picker-period">14 a 20 de set.</span>
      function formatWeekPickerLabelHTML (weekIndex, monday, sunday) {
        return '<span class="semana-week-picker-num">' + I18N.t('semana.weekNum', { n: weekIndex + 1 }) + '</span>' +
               '<span class="semana-week-picker-sep">&middot;</span>' +
               '<span class="semana-week-picker-period">' + formatWeekPickerPeriod(monday, sunday) + '</span>';
      }

      function isAtCurrentMonth () {
        return refYear === today.getFullYear() && refMonth === today.getMonth();
      }

      function updateMonthLabel () {
        monthLabelEl.textContent = I18N.t('fmt.monthYear', { m: capitalize(MESES_MINUS()[refMonth]), y: refYear });
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

      // ---- Modo lista: um card por dia da semana, abaixo do filtro de
      // semana. Por enquanto mostra só o dia da semana; os detalhes de
      // cada dia serão adicionados depois.
      function buildDayCard (d, weekdayIndex) {
        var badges = loadDayBadges(d);
        var ganhosDia = badges.uber + badges.bolt;
        var expenseEntries = loadDayExpenseEntries(d);
        var despesasDia = sumExpenseEntries(expenseEntries);
        var liquidoDia = ganhosDia - despesasDia;

        var card = document.createElement('div');
        card.className = 'semana-day-card';
        if (d.getTime() === today.getTime()) card.classList.add('is-today');

        var header = document.createElement('div');
        header.className = 'semana-day-card-header';
        header.innerHTML =
          '<span class="semana-day-card-weekday">' + DIAS_FULL()[weekdayIndex] + '</span>' +
          '<span class="semana-day-card-sep">&middot;</span>' +
          '<span class="semana-day-card-date">' + I18N.t('fmt.dayMonth', { d: d.getDate(), m: MESES_MINUS()[d.getMonth()] }) + '</span>';
        card.appendChild(header);

        var flipWrap = document.createElement('div');
        flipWrap.className = 'semana-day-flip-wrap';

        var ganhosView = document.createElement('div');
        ganhosView.className = 'semana-day-flip-view semana-day-card-body';
        ganhosView.innerHTML =
          '<div class="semana-day-card-row is-plus">' +
            '<span class="row-label"><span class="row-sign">+</span>' + I18N.t('semana.rowUber') + '</span>' +
            '<span class="row-value">' + formatEuro(badges.uber) + '</span>' +
          '</div>' +
          '<div class="semana-day-card-row is-plus">' +
            '<span class="row-label"><span class="row-sign">+</span>' + I18N.t('semana.rowBolt') + '</span>' +
            '<span class="row-value">' + formatEuro(badges.bolt) + '</span>' +
          '</div>' +
          '<div class="semana-day-card-row is-minus">' +
            '<span class="row-label"><span class="row-sign">-</span>' + I18N.t('semana.rowDespesas') + '</span>' +
            '<span class="row-value">' + formatEuro(despesasDia) + '</span>' +
          '</div>' +
          '<div class="semana-day-card-row">' +
            '<span class="row-label"><span class="row-sign">&middot;</span>' + I18N.t('semana.rowDistancia') + '</span>' +
            '<span class="row-value">' + formatKm(badges.distancia) + '</span>' +
          '</div>';

        var badgesWrap = document.createElement('div');
        badgesWrap.className = 'semana-day-card-badges';
        badgesWrap.innerHTML =
          '<div class="semana-day-card-badge semana-day-card-badge-ganhos">' +
            '<span class="semana-day-card-badge-label">' + I18N.t('semana.ganhosDoDia') + '</span>' +
            '<span class="semana-day-card-badge-value">' + formatEuro(ganhosDia) + '</span>' +
          '</div>' +
          '<div class="semana-day-card-badge semana-day-card-badge-liquido">' +
            '<span class="semana-day-card-badge-label">' + I18N.t('semana.liquido') + '</span>' +
            '<span class="semana-day-card-badge-value">' + formatEuro(liquidoDia) + '</span>' +
          '</div>';
        ganhosView.appendChild(badgesWrap);

        var despesasView = document.createElement('div');
        despesasView.className = 'semana-day-flip-view semana-day-despesas-view is-hidden';

        var despesasScroll = document.createElement('div');
        despesasScroll.className = 'semana-day-despesas-scroll';
        expenseEntries.forEach(function (entry) {
          var line = document.createElement('div');
          line.className = 'semana-day-despesa-line';
          line.innerHTML = '<span class="valor">' + formatEuro(entry.valor) + '</span> - ' + entry.descricao;
          despesasScroll.appendChild(line);
        });
        despesasView.appendChild(despesasScroll);

        function updateDespesaScrollState () {
          var maxScroll = despesasScroll.scrollHeight - despesasScroll.clientHeight;
          if (maxScroll <= 1) {
            despesasView.classList.remove('has-scroll-up', 'has-scroll-down');
            return;
          }
          despesasView.classList.toggle('has-scroll-up', despesasScroll.scrollTop > 2);
          despesasView.classList.toggle('has-scroll-down', despesasScroll.scrollTop < maxScroll - 2);
        }
        despesasScroll.addEventListener('scroll', updateDespesaScrollState, { passive: true });

        if (expenseEntries.length > 1) {
          var setaUp = document.createElement('button');
          setaUp.type = 'button';
          setaUp.className = 'semana-day-despesas-arrow is-up';
          setaUp.setAttribute('aria-label', I18N.t('semana.scrollUpAria'));
          setaUp.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
          setaUp.addEventListener('click', function () { despesasScroll.scrollBy({ top: -48, behavior: 'smooth' }); });

          var setaDown = document.createElement('button');
          setaDown.type = 'button';
          setaDown.className = 'semana-day-despesas-arrow is-down';
          setaDown.setAttribute('aria-label', I18N.t('semana.scrollDownAria'));
          setaDown.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
          setaDown.addEventListener('click', function () { despesasScroll.scrollBy({ top: 48, behavior: 'smooth' }); });

          despesasView.appendChild(setaUp);
          despesasView.appendChild(setaDown);
        }

        flipWrap.appendChild(ganhosView);
        flipWrap.appendChild(despesasView);
        card.appendChild(flipWrap);

        // O link "Despesas" (vermelho) só aparece quando o dia tem
        // alguma despesa. Ao clicar, o conteúdo do card (Uber…Distância +
        // os dois balões) faz fade out e as despesas do dia fazem fade in
        // no mesmo lugar, sem o card mudar de tamanho ou posição — a
        // altura do card fica travada na altura da visualização de
        // ganhos; se houver mais despesas do que cabe nesse espaço, a
        // lista de despesas rola internamente (com degradê e setas).
        if (expenseEntries.length > 0) {
          var toggleBtn = document.createElement('button');
          toggleBtn.type = 'button';
          toggleBtn.className = 'semana-day-toggle-btn';
          toggleBtn.textContent = I18N.t('semana.verDespesas');
          toggleBtn.addEventListener('click', function () {
            var mostrandoDespesas = !despesasView.classList.contains('is-hidden');
            despesasView.classList.toggle('is-hidden');
            ganhosView.classList.toggle('is-hidden');
            toggleBtn.textContent = mostrandoDespesas ? I18N.t('semana.verDespesas') : I18N.t('semana.verGanhos');
            toggleBtn.classList.toggle('is-ganhos', !mostrandoDespesas);
            if (!mostrandoDespesas) {
              despesasScroll.scrollTop = 0;
              updateDespesaScrollState();
            }
          });
          header.appendChild(toggleBtn);
        }

        // Guarda uma referência para o ajuste de altura feito depois que o
        // card já está inserido no DOM (offsetHeight só é confiável então).
        card._fixarAlturaFlip = function () {
          flipWrap.style.height = ganhosView.scrollHeight + 'px';
          updateDespesaScrollState();
        };

        return card;
      }

      function renderListCards (week) {
        if (!listPlaceholder) return;
        listPlaceholder.innerHTML = '';
        if (!week) return;
        var cards = [];
        for (var i = 0; i < 7; i++) {
          var d = new Date(week.monday.getTime());
          d.setDate(week.monday.getDate() + i);
          var card = buildDayCard(d, i);
          cards.push(card);
          listPlaceholder.appendChild(card);
        }
        fixarAlturasListCards(cards);
      }

      // A altura de cada card no modo lista fica travada na altura da
      // visualização de ganhos (mesmo com muitas despesas). Isso só pode
      // ser medido depois que o card está no DOM e visível — por isso
      // reexecuta também quando o modo lista volta a ficar visível.
      function fixarAlturasListCards (cards) {
        requestAnimationFrame(function () {
          cards.forEach(function (card) {
            if (typeof card._fixarAlturaFlip === 'function') card._fixarAlturaFlip();
          });
        });
      }

      function buildWeekBlock (week, weekIndex) {
        var block = document.createElement('div');
        block.className = 'semana-week-block';
        block.id = 'semanaWeekBlock-' + weekIndex;

        var scrollWrap = document.createElement('div');
        scrollWrap.className = 'semana-table-scroll';

        var tableWrap = document.createElement('div');
        tableWrap.className = 'semana-table-wrap';
        var table = document.createElement('table');
        table.className = 'semana-table';

        var thead = document.createElement('thead');
        thead.innerHTML =
          '<tr>' +
            '<th>' + I18N.t('semana.th.data') + '</th>' +
            '<th>' + I18N.t('semana.th.uber') + '</th>' +
            '<th>' + I18N.t('semana.th.bolt') + '</th>' +
            '<th>' + I18N.t('semana.th.despesas') + '</th>' +
            '<th>' + I18N.t('semana.th.km') + '</th>' +
            '<th>' + I18N.t('semana.th.total') + '</th>' +
            '<th>' + I18N.t('semana.th.liquido') + '</th>' +
          '</tr>';
        table.appendChild(thead);

        var tbody = document.createElement('tbody');

        var sumUber = 0, sumBolt = 0, sumDespesas = 0, sumKm = 0;

        for (var i = 0; i < 7; i++) {
          var d = new Date(week.monday.getTime());
          d.setDate(week.monday.getDate() + i);
          var dayBadges = loadDayBadges(d);
          var despesasDia = dayExpenseTotal(d);

          sumUber     += dayBadges.uber;
          sumBolt     += dayBadges.bolt;
          sumDespesas += despesasDia;
          sumKm       += dayBadges.distancia;

          var dayTotal = dayBadges.uber + dayBadges.bolt;

          var tr = document.createElement('tr');
          tr.className = 'semana-table-row';
          if (d.getTime() === today.getTime()) tr.classList.add('is-today');
          if (d.getMonth() !== refMonth || d.getFullYear() !== refYear) tr.classList.add('is-outside-month');
          if (d.getTime() > today.getTime()) tr.classList.add('is-future');

          var tdData = document.createElement('td');
          tdData.className = 'semana-cell-data';
          tdData.innerHTML = DIAS_ABBR()[i] + '<span class="semana-cell-date">' + pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '</span>';
          tr.appendChild(tdData);

          var tdUber = document.createElement('td');
          tdUber.textContent = formatEuro(dayBadges.uber);
          tr.appendChild(tdUber);

          var tdBolt = document.createElement('td');
          tdBolt.textContent = formatEuro(dayBadges.bolt);
          tr.appendChild(tdBolt);

          var tdDespesas = document.createElement('td');
          tdDespesas.textContent = formatEuro(despesasDia);
          tr.appendChild(tdDespesas);

          var tdKm = document.createElement('td');
          tdKm.textContent = formatKm(dayBadges.distancia);
          tr.appendChild(tdKm);

          var tdTotal = document.createElement('td');
          tdTotal.className = 'semana-cell-total';
          tdTotal.textContent = formatEuro(dayTotal);
          tr.appendChild(tdTotal);

          var tdLiquido = document.createElement('td');
          tdLiquido.className = 'semana-cell-liquido';
          var dayLiquido = dayTotal - despesasDia;
          tdLiquido.textContent = formatEuro(dayLiquido);
          if (Math.round(dayLiquido * 100) >= 1) tdLiquido.classList.add('is-positive');
          tr.appendChild(tdLiquido);

          tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        tableWrap.appendChild(table);
        scrollWrap.appendChild(tableWrap);
        block.appendChild(scrollWrap);

        tableWrap.addEventListener('scroll', function () {
          updateTableScrollFade(scrollWrap, tableWrap);
        }, { passive: true });
        requestAnimationFrame(function () {
          updateTableScrollFade(scrollWrap, tableWrap);
        });

        var sumBruto   = sumUber + sumBolt;
        var sumLiquido = sumBruto - sumDespesas;

        var summary = document.createElement('div');
        summary.className = 'semana-week-summary';

        var tiles = document.createElement('div');
        tiles.className = 'dash-sub-row semana-summary-tiles';
        tiles.innerHTML =
          '<div class="dash-sub-tile dash-tile-bruto">' +
            '<span class="dash-tile-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15l3.5-3.5"/><path d="M20.3 18a9 9 0 1 0-16.6 0"/></svg></span>' +
            '<span class="dash-tile-label">' + I18N.t('semana.tileGanhos') + '</span>' +
            '<span class="dash-tile-value" data-field="bruto"></span>' +
          '</div>' +
          '<div class="dash-sub-tile dash-tile-despesas">' +
            '<span class="dash-tile-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h1.5a2 2 0 0 1 2 2v2a1.5 1.5 0 0 0 3 0V9.5L17 6"/></svg></span>' +
            '<span class="dash-tile-label">' + I18N.t('semana.tileDespesas') + '</span>' +
            '<span class="dash-tile-value" data-field="despesas"></span>' +
          '</div>' +
          '<div class="dash-sub-tile dash-tile-distancia">' +
            '<span class="dash-tile-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.2"/></svg></span>' +
            '<span class="dash-tile-label">' + I18N.t('semana.tileDistancia') + '</span>' +
            '<span class="dash-tile-value" data-field="km"></span>' +
          '</div>';
        summary.appendChild(tiles);

        tiles.querySelector('[data-field="bruto"]').textContent = formatEuro(sumBruto);
        tiles.querySelector('[data-field="despesas"]').textContent = formatEuro(sumDespesas);
        tiles.querySelector('[data-field="km"]').textContent = formatKm(sumKm);

        var divider = document.createElement('div');
        divider.className = 'semana-summary-divider';
        summary.appendChild(divider);

        var liquidoRow = document.createElement('div');
        liquidoRow.className = 'semana-summary-liquido';
        liquidoRow.innerHTML =
          '<span class="semana-summary-liquido-label">' + I18N.t('semana.totalLiquido') + '</span>' +
          '<span class="semana-summary-liquido-value"></span>';
        summary.appendChild(liquidoRow);

        var liquidoValueEl = liquidoRow.querySelector('.semana-summary-liquido-value');
        liquidoValueEl.classList.toggle('is-negative', sumLiquido < 0);
        liquidoValueEl.textContent = formatEuro(sumLiquido);

        block.appendChild(summary);

        var detalhesCard = buildWeekExpensesDetailCard(week);
        if (detalhesCard) block.appendChild(detalhesCard);

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
            linhas.push({ dia: DIAS_ABBR()[i] + ' ' + pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1), entry: entry });
          });
        }
        if (!linhas.length) return null;

        var card = document.createElement('div');
        card.className = 'semana-week-summary semana-despesas-detail-card';

        var title = document.createElement('h4');
        title.className = 'semana-despesas-detail-title';
        title.textContent = I18N.t('semana.despesasTitle');
        card.appendChild(title);

        var scrollWrap = document.createElement('div');
        scrollWrap.className = 'semana-table-scroll';

        var tableWrap = document.createElement('div');
        tableWrap.className = 'semana-table-wrap';
        var table = document.createElement('table');
        table.className = 'semana-table semana-despesas-detail-table';
        table.innerHTML = '<thead><tr><th>' + I18N.t('semana.dth.dia') + '</th><th>' + I18N.t('semana.dth.valor') + '</th><th>' + I18N.t('semana.dth.desc') + '</th></tr></thead>';
        var tbody = document.createElement('tbody');
        linhas.forEach(function (linha) {
          var tr = document.createElement('tr');
          var tdDia = document.createElement('td');
          tdDia.textContent = linha.dia;
          var tdValor = document.createElement('td');
          tdValor.textContent = formatEuro(linha.entry.valor);
          var tdDesc = document.createElement('td');
          tdDesc.textContent = linha.entry.descricao;
          tr.appendChild(tdDia);
          tr.appendChild(tdValor);
          tr.appendChild(tdDesc);
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        tableWrap.appendChild(table);
        scrollWrap.appendChild(tableWrap);
        card.appendChild(scrollWrap);

        tableWrap.addEventListener('scroll', function () {
          updateTableScrollFade(scrollWrap, tableWrap);
        }, { passive: true });
        requestAnimationFrame(function () {
          updateTableScrollFade(scrollWrap, tableWrap);
        });

        return card;
      }

      var pickerBtn   = document.getElementById('semanaWeekPickerBtn');
      var pickerLabel = document.getElementById('semanaWeekPickerLabel');
      var pickerPanel = document.getElementById('semanaWeekPickerPanel');
      var currentWeeks = [];

      function closeWeekPicker () {
        if (!pickerPanel || pickerPanel.hidden) return;
        pickerPanel.hidden = true;
        if (pickerBtn) pickerBtn.setAttribute('aria-expanded', 'false');
      }

      function openWeekPicker () {
        if (!pickerPanel) return;
        pickerPanel.hidden = false;
        if (pickerBtn) pickerBtn.setAttribute('aria-expanded', 'true');
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
        if (week && pickerLabel) {
          pickerLabel.innerHTML = formatWeekPickerLabelHTML(idx, week.monday, week.sunday);
        }
        if (week) renderListCards(week);
        if (pickerPanel) {
          pickerPanel.querySelectorAll('.semana-week-picker-option').forEach(function (b, i) {
            b.classList.toggle('is-active', i === idx);
          });
        }
        closeWeekPicker();
      }

      function buildWeekPicker (weeks) {
        if (!pickerPanel) return;
        pickerPanel.innerHTML = '';
        weeks.forEach(function (week, idx) {
          var opt = document.createElement('button');
          opt.type = 'button';
          opt.className = 'semana-week-picker-option';
          opt.innerHTML = formatWeekPickerLabelHTML(idx, week.monday, week.sunday);
          opt.addEventListener('click', function () {
            setActiveWeek(idx, true);
          });
          pickerPanel.appendChild(opt);
        });
      }

      if (pickerBtn) {
        pickerBtn.addEventListener('click', function () {
          if (pickerPanel && pickerPanel.hidden) openWeekPicker();
          else closeWeekPicker();
        });
      }
      document.addEventListener('click', function (e) {
        if (!pickerPanel || pickerPanel.hidden) return;
        if (pickerBtn && (pickerBtn.contains(e.target) || pickerPanel.contains(e.target))) return;
        closeWeekPicker();
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
        refYear  = today.getFullYear();
        refMonth = today.getMonth();

        var weeksForToday = computeWeeksForMonth(refYear, refMonth);
        var idx = 0;
        for (var i = 0; i < weeksForToday.length; i++) {
          if (today.getTime() >= weeksForToday[i].monday.getTime() &&
              today.getTime() <= weeksForToday[i].sunday.getTime()) {
            idx = i;
            break;
          }
        }
        currentWeekIndex = idx;
      }

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
          weeksContainer.hidden = true;
          if (listPlaceholder) {
            listPlaceholder.hidden = false;
            var cards = [].slice.call(listPlaceholder.querySelectorAll('.semana-day-card'));
            fixarAlturasListCards(cards);
          }
        },
        showTable: function () {
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
        if (!btnList || !btnTable) return;
        function setActive (btn) {
          [btnList, btnTable].forEach(function (b) {
            var active = (b === btn);
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-pressed', active ? 'true' : 'false');
          });
        }
        btnList.addEventListener('click', function () {
          setActive(btnList);
          if (window.SemanaView) window.SemanaView.showList();
        });
        btnTable.addEventListener('click', function () {
          setActive(btnTable);
          if (window.SemanaView) window.SemanaView.showTable();
        });
      })();

      // ---- Navegação entre seções (Ganhos / Resumo Financeiro / Detalhes
      // da Semana), chamada a partir do menu principal. Cada seção é uma
      // "página" própria dentro de #homeListView.
      //
      // A troca entre páginas usa um crossfade curto (fade-out da página
      // atual, depois fade-in da nova) em vez de simplesmente alternar o
      // atributo "hidden" — a troca instantânea deixava a tela "piscar"
      // ao navegar pelo menu.
      var HOME_PAGE_FADE_MS = 140;
      function showHomeListPage (section) {
        var normalized = (section === 'default') ? 'ganhos' : section;
        var pages = PAGES_LIST;
        var nextEl = null;
        pages.forEach(function (p) { if (p.key === normalized) nextEl = p.el; });
        var currentEl = null;
        pages.forEach(function (p) { if (p.el && !p.el.hidden) currentEl = p.el; });

        setHeaderTitleState(normalized === 'ganhos' ? 'default' : normalized);

        if (!nextEl) return;

        function reveal () {
          pages.forEach(function (p) {
            if (!p.el) return;
            if (p.el === nextEl) {
              p.el.hidden = false;
              p.el.classList.add('is-fading');
              void p.el.offsetWidth; // força reflow para garantir a transição no fade-in
              p.el.classList.remove('is-fading');
            } else {
              p.el.hidden = true;
              p.el.classList.remove('is-fading');
            }
          });
          if (listView) listView.scrollTop = 0;
          if (normalized === 'semana') {
            document.dispatchEvent(new CustomEvent('semanaPageShown'));
          }
        }

        if (currentEl && currentEl !== nextEl) {
          currentEl.classList.add('is-fading');
          setTimeout(reveal, HOME_PAGE_FADE_MS);
        } else {
          reveal();
        }
      }

      var PAGES_LIST = [
        { key: 'ganhos', el: homeListPageGanhos },
        { key: 'resumo', el: homeListPageResumo },
        { key: 'semana', el: homeListPageSemana },
        { key: 'relatorio', el: homeListPageRelatorio }
      ];
      var homeListInner = listView ? listView.querySelector('.home-list-inner') : null;

      // ---- Deslize entre Ganhos <-> Resumo Financeiro, acionado pelas
      // setas "Ver meu resumo" / "Registrar ganhos". A direção do deslize
      // segue a seta do botão clicado: seta para a direita desliza para a
      // direita (página nova entra pela esquerda, atual sai pela direita);
      // seta para a esquerda faz o inverso.
      var SLIDE_MS = 300;
      var slideBusy = false;
      function slideToSection (section, direction) {
        if (slideBusy) return;
        var normalized = (section === 'default') ? 'ganhos' : section;
        var nextEl = null;
        PAGES_LIST.forEach(function (p) { if (p.key === normalized) nextEl = p.el; });
        var currentEl = null;
        PAGES_LIST.forEach(function (p) { if (p.el && !p.el.hidden) currentEl = p.el; });

        setHeaderTitleState(normalized === 'ganhos' ? 'default' : normalized);

        if (!nextEl || nextEl === currentEl || !currentEl || !homeListInner) {
          showHomeListPage(section);
          return;
        }

        slideBusy = true;
        var goingRight = direction === 'right';
        homeListInner.classList.add('is-sliding');

        nextEl.hidden = false;
        nextEl.classList.remove('slide-current', 'slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
        currentEl.classList.remove('slide-current', 'slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
        nextEl.classList.add(goingRight ? 'slide-in-left' : 'slide-in-right');
        currentEl.classList.add('slide-current');
        void nextEl.offsetWidth; // força reflow antes de animar

        requestAnimationFrame(function () {
          currentEl.classList.remove('slide-current');
          currentEl.classList.add(goingRight ? 'slide-out-right' : 'slide-out-left');
          nextEl.classList.remove(goingRight ? 'slide-in-left' : 'slide-in-right');
          nextEl.classList.add('slide-current');
        });

        setTimeout(function () {
          PAGES_LIST.forEach(function (p) {
            if (!p.el) return;
            p.el.hidden = (p.el !== nextEl);
            p.el.classList.remove('slide-current', 'slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
          });
          homeListInner.classList.remove('is-sliding');
          if (listView) listView.scrollTop = 0;
          slideBusy = false;
        }, SLIDE_MS);
      }

      // ---- Navegação a partir do menu Ajustes: a página que estiver
      // atrás deve fechar/sumir instantaneamente assim que a opção é
      // clicada (antes mesmo do menu terminar de fechar), e a nova página
      // só aparece com um fade-in suave depois que o menu termina de
      // fechar.
      function hideAllInstant () {
        PAGES_LIST.forEach(function (p) {
          if (!p.el) return;
          p.el.classList.remove('is-fading', 'slide-current', 'slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
          p.el.hidden = true;
        });
        if (homeListInner) homeListInner.classList.remove('is-sliding');
      }

      function fadeInSection (section) {
        var normalized = (section === 'default') ? 'ganhos' : section;
        var nextEl = null;
        PAGES_LIST.forEach(function (p) { if (p.key === normalized) nextEl = p.el; });
        setHeaderTitleState(normalized === 'ganhos' ? 'default' : normalized);
        if (!nextEl) return;
        nextEl.hidden = false;
        nextEl.classList.add('is-fading');
        void nextEl.offsetWidth; // força reflow para garantir a transição no fade-in
        nextEl.classList.remove('is-fading');
        if (listView) listView.scrollTop = 0;
        if (normalized === 'semana') {
          document.dispatchEvent(new CustomEvent('semanaPageShown'));
        }
      }

      window.HomeNav = {
        goToSection: function (section) {
          showHomeListPage(section);
        },
        slideToSection: slideToSection,
        hideAllInstant: hideAllInstant,
        fadeInSection: fadeInSection,
        getCurrentState: function () { return currentHeaderState; }
      };

      var btnVerMeuResumo = document.getElementById('btnVerMeuResumo');
      if (btnVerMeuResumo) {
        btnVerMeuResumo.addEventListener('click', function () {
          slideToSection('resumo', 'right');
        });
      }

      var btnRegistrarGanhos = document.getElementById('btnRegistrarGanhos');
      if (btnRegistrarGanhos) {
        btnRegistrarGanhos.addEventListener('click', function () {
          slideToSection('ganhos', 'left');
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
          el.style.top    = offsetTop + 'px';
          el.style.height = vv.height + 'px';
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

    function loadProfileFromStorage () {
      var hasSavedName = false;
      var hasSavedPhoto = false;
      try {
        var raw = cloudGet(PROFILE_STORAGE_KEY);
        if (raw) {
          var saved = JSON.parse(raw);
          if (saved && typeof saved === 'object') {
            if (typeof saved.name === 'string' && saved.name.trim()) { state.name = saved.name; hasSavedName = true; }
            if (typeof saved.photo === 'string') { state.photo = saved.photo; hasSavedPhoto = true; }
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
        cloudSet(PROFILE_STORAGE_KEY, JSON.stringify({
          name: state.name,
          photo: state.photo,
          vehicle: state.vehicle,
          vehicleYear: state.vehicleYear,
          driverSince: state.driverSince
        }));
      } catch (e) {
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
    var openDadosPessoaisBtn = document.getElementById('openDadosPessoaisBtn');
    var openDespesasFixasBtn = document.getElementById('openDespesasFixasBtn');
    var openMultiplataformaBtn = document.getElementById('openMultiplataformaBtn');
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

    var DP_UI_READY = !!(sheetScreenDadosPessoais && dpNomeInput &&
      dpDriverSinceBtn && dpDriverSinceLabel && dpPhotoThumb &&
      dpUploadPhotoBtn && dpSaveBtn && driverSinceModalBackdrop && driverSinceModalCard &&
      wheelDayCol && wheelMonthCol && wheelYearCol && wheelSaveBtn);

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
      var html = state.photo ? '<img src="' + state.photo + '" alt="' + I18N.t('photo.avatarAlt') + '">' : AVATAR_PLACEHOLDER;
      sheetAvatar.innerHTML = html;
      sheetAvatar.classList.toggle('has-photo', !!state.photo);
      if (dpPhotoThumb) dpPhotoThumb.innerHTML = html;
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
      if (document.querySelector('.mm-backdrop.visible')) return true;
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
      dpDriverSinceLabel.textContent = state.driverSince
        ? formatDpDate(new Date(state.driverSince))
        : I18N.t('dp.selecionarData');
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

      fileInput.addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          cropImage.onload = initCrop;
          cropImage.src = ev.target.result;
          openPhotoModal();
        };
        reader.readAsDataURL(file);
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

      cropApplyBtn.addEventListener('click', function () {
        if (!cropState) return;
        var outputSize = 400;
        var canvas = document.createElement('canvas');
        canvas.width = outputSize;
        canvas.height = outputSize;
        var ctx = canvas.getContext('2d');

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

        state.photo = canvas.toDataURL('image/png');
        renderAvatar();
        saveProfileToStorage();
        closePhotoModal();
      });
    }

    if (DP_UI_READY) {
      dpUploadPhotoBtn.addEventListener('click', function () {
        if (PROFILE_UI_READY && fileInput) fileInput.click();
      });

      dpDriverSinceBtn.addEventListener('click', openDriverSinceModal);

      driverSinceModalBackdrop.addEventListener('click', function (e) {
        if (e.target === driverSinceModalBackdrop) closeDriverSinceModal();
      });
      driverSinceModalCard.addEventListener('click', function (e) { e.stopPropagation(); });

      [wheelDayCol, wheelMonthCol, wheelYearCol].forEach(function (col) {
        var scrollTimer = null;
        col.addEventListener('scroll', function () {
          clearTimeout(scrollTimer);
          scrollTimer = setTimeout(function () { updateWheelSelection(col); }, 90);
        });
      });

      wheelSaveBtn.addEventListener('click', function () {
        var dayIdx = updateWheelSelection(wheelDayCol);
        var monthIdx = updateWheelSelection(wheelMonthCol);
        var yearIdx = updateWheelSelection(wheelYearCol);
        var day = dayIdx + 1;
        var month = monthIdx;
        var year = wheelYearsList[yearIdx] || new Date().getFullYear();
        var picked = new Date(year, month, Math.min(day, new Date(year, month + 1, 0).getDate()));
        picked.setHours(0, 0, 0, 0);
        state.driverSince = picked.toISOString();
        dpDriverSinceLabel.textContent = formatDpDate(picked);
        closeDriverSinceModal();
      });

      var dpEmailInputEl = document.getElementById('dpEmailInput');

      function isValidEmail (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      }

      dpSaveBtn.addEventListener('click', function () {
        var nome = dpNomeInput.value.trim();
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
        if (newPass.length < 6) { errorEl.textContent = I18N.t('pwdChange.erroCurta'); return; }
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

    // Usados pelo ecrã "Idioma" e pelo tutorial guiado para abrir/fechar
    // o painel de Ajustes a partir de fora deste bloco.
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

        if (window.TutorialGuiado && window.TutorialGuiado.isRunning()) {
          window.TutorialGuiado.close();
          cancelExitArm();
          return;
        }

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

        var tutorialEndBackdropEl = document.getElementById('tutorialEndBackdrop');
        if (isVisible(tutorialEndBackdropEl, 'visible')) {
          tutorialEndBackdropEl.classList.remove('visible');
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
          splash.classList.add('fade-out');
          setTimeout(function () { splash.remove(); }, 400);
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

      if (document.readyState === 'complete') {
        revealWhenReady();
      } else {
        window.addEventListener('load', revealWhenReady);
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



    /* ---- Ecrã "Multiplataforma" dentro do menu Ajustes ----
       Lista as plataformas já presentes ("Atuais") cada uma com um "x"
       vermelho para excluir (por enquanto sem efeito real, apenas mostra
       a confirmação) e um formulário simples para adicionar uma nova
       plataforma ao final da lista. */
    (function () {
      var openBtn      = document.getElementById('openMultiplataformaBtn');
      var screenEl     = document.getElementById('sheetScreenMultiplataforma');
      var listaEl      = document.getElementById('mpListaAtuais');
      var novaInput    = document.getElementById('mpNovaInput');
      var salvarBtn    = document.getElementById('mpSalvarBtn');
      var confirmBackdrop  = document.getElementById('mpConfirmBackdrop');
      var confirmText      = document.getElementById('mpConfirmText');
      var confirmCancelBtn = document.getElementById('mpConfirmCancelBtn');
      var confirmDeleteBtn = document.getElementById('mpConfirmDeleteBtn');
      if (!openBtn || !screenEl || !listaEl || !novaInput || !salvarBtn || !window.I18N) return;

      var DEL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';

      var plataformas = ['Uber', 'Bolt'];

      function renderLista () {
        listaEl.innerHTML = '';
        plataformas.forEach(function (nome) {
          var card = document.createElement('div');
          card.className = 'despesa-card';

          var desc = document.createElement('p');
          desc.className = 'despesa-card-desc';
          desc.textContent = nome;
          card.appendChild(desc);

          var delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'despesa-delete-btn';
          delBtn.setAttribute('aria-label', I18N.t('mp.deleteAria'));
          delBtn.innerHTML = DEL_SVG;
          delBtn.addEventListener('click', function () { openDeleteConfirm(nome); });
          card.appendChild(delBtn);

          listaEl.appendChild(card);
        });
      }

      function openDeleteConfirm (nome) {
        if (!confirmBackdrop) return;
        if (confirmText) confirmText.textContent = I18N.t('mp.confirmNamed', { n: nome });
        confirmBackdrop.classList.add('visible');
      }

      function closeDeleteConfirm () {
        if (confirmBackdrop) confirmBackdrop.classList.remove('visible');
      }

      if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', closeDeleteConfirm);
      if (confirmDeleteBtn) {
        // Ainda sem efeito real: apenas fecha a confirmação.
        confirmDeleteBtn.addEventListener('click', closeDeleteConfirm);
      }
      if (confirmBackdrop) {
        confirmBackdrop.addEventListener('click', function (e) {
          if (e.target === confirmBackdrop) closeDeleteConfirm();
        });
      }

      openBtn.addEventListener('click', function () {
        renderLista();
        if (typeof window.openSheetScreenPublic === 'function') {
          window.openSheetScreenPublic(screenEl, I18N.t('sheet.multiplataforma'));
        }
      });

      salvarBtn.addEventListener('click', function () {
        var nome = novaInput.value.trim();
        if (!nome) return;

        plataformas.push(nome);
        renderLista();
        novaInput.value = '';
      });

      renderLista();
    })();



    /* Rótulo do mês na página "Download Relatório": escrito por JavaScript
       para acompanhar o idioma escolhido (antes era texto fixo no HTML). */
    (function () {
      var el = document.getElementById('relatorioPageMonthLabel');
      if (!el || !window.I18N) return;
      function render () {
        var d = new Date();
        el.textContent = I18N.t('fmt.monthYear', {
          m: I18N.capitalize(I18N.list('months.lower')[d.getMonth()]),
          y: d.getFullYear()
        });
      }
      render();
      document.addEventListener('languageChanged', render);
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
      var STEPS = [
        { sel: '#subHeaderDateBtn',        k: 'tut.s1',  page: 'ganhos', sheet: false },
        { sel: '#listRowUber',             k: 'tut.s2',  page: 'ganhos', sheet: false },
        { sel: '#listRowDespesas',         k: 'tut.s3',  page: 'ganhos', sheet: false },
        { sel: '#listRowDistancia',        k: 'tut.s4',  page: 'ganhos', sheet: false },
        { sel: '#metaSemanalCard',         k: 'tut.s5',  page: 'ganhos', sheet: false },
        { sel: '#svgMenuBtn',              k: 'tut.s6',  page: 'ganhos', sheet: false },
        { sel: '#btnVerMeuResumo',         k: 'tut.s7',  page: 'ganhos', sheet: false },
        { sel: '.period-filter-row',       k: 'tut.s8',  page: 'resumo', sheet: false },
        { sel: '.dash-cluster',            k: 'tut.s9',  page: 'resumo', sheet: false },
        { sel: '#semanaWeekPicker',        k: 'tut.s10', page: 'semana', sheet: false },
        { sel: '#subHeaderViewToggleGroup',k: 'tut.s11', page: 'semana', sheet: false },
        { sel: '#openDespesasFixasBtn',    k: 'tut.s12', page: 'ganhos', sheet: true  }
      ];

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