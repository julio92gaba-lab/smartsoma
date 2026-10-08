/* Presentation adapter. Persistence, validation and business rules live in app.js.
   Never use mockup data or bypass cloud-init / subscription checks here. */
(function () {
  'use strict';
  var started = false;
  var route = 'resumo';
  var pageTransitioning = false;
  var $ = function (id) { return document.getElementById(id); };
  var icons = {
    resumo: '<path d="M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    ganhos: '<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 10h18M7 6V3h10v3M16 15h2"/>',
    despesas: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z M9 8h6M9 12h6"/>',
    semana: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2"/>',
    relatorio: '<path d="M5 3h10l4 4v14H5ZM14 3v5h5M8 12h8M8 16h8"/>',
    ajustes: '<path d="m12 3 2 3 4-.2.2 4 3 2-3 2 .2 4-4 .2-2 3-2-3-4 .2-.2-4-3-2 3-2-.2-4 4-.2Z"/><circle cx="12" cy="12" r="3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    profit: '<path d="M5 18 19 4M5 4h14v14"/>',
    distance: '<path d="M7 3 3 21M17 3l4 18M12 3v3M12 10v4M12 18v3"/>'
  };
  var text = {
    pt: { resumo:'Visão geral', ganhos:'Ganhos diários', despesas:'Despesas', semana:'Detalhes da semana', relatorio:'Relatórios', ajustes:'Ajustes', hello:'Bom dia', afternoon:'Boa tarde', evening:'Boa noite', record:'Adicionar registo', calendar:'Escolher data', tag:'Para Estafetas e Motoristas de App.', ganhosNote:'Cada percurso conta. Regista os teus rendimentos e acompanha o dia.', despesasNote:'As tuas despesas, sem perder nenhum detalhe.', semanaNote:'Sete dias. Uma visão clara dos teus resultados.', relatorioNote:'Os teus resultados, organizados e prontos a guardar.', ajustesNote:'O SmartSoma, à tua medida.', theme:'Modo escuro', profile:'Editar perfil', help:'Ajuda e tutorial', normal:'Normal', newPlatform:'Nova plataforma', manage:'Gerir plataformas', addIncome:'Adicionar rendimento' },
    en: { resumo:'Overview', ganhos:'Daily earnings', despesas:'Expenses', semana:'Weekly details', relatorio:'Reports', ajustes:'Settings', hello:'Good morning', afternoon:'Good afternoon', evening:'Good evening', record:'Add entry', calendar:'Choose date', tag:'For couriers and app drivers.', ganhosNote:'Every journey counts. Record your earnings and track your day.', despesasNote:'Your expenses, without missing a detail.', semanaNote:'Seven days. A clear view of your results.', relatorioNote:'Your results, organised and ready to save.', ajustesNote:'SmartSoma, your way.', theme:'Dark mode', profile:'Edit profile', help:'Help and tutorial', normal:'Normal', newPlatform:'New platform', manage:'Manage platforms', addIncome:'Add earnings' }
  };
  function t(key) { return (text[window.I18N && I18N.getLang()] || text.pt)[key] || key; }
  function svg(key) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[key] || icons.arrow) + '</svg>'; }
  function create(tag, className, html) { var n = document.createElement(tag); n.className = className || ''; if (html) n.innerHTML = html; return n; }
  function translate(root) { (root || document).querySelectorAll('[data-ui-text]').forEach(function(n) { n.textContent = t(n.dataset.uiText); }); }
  function button(label, handler, className) { var n = create('button', className || 'ui-button'); n.type = 'button'; n.textContent = label; n.addEventListener('click', handler); return n; }
  function heading(key) {
    return create('div', 'ui-page-intro', '<p class="ui-eyebrow ui-selected-date"></p><h1 data-ui-text="'+key+'"></h1><p data-ui-text="'+key+'Note"></p>');
  }
  function currentSheet() { return document.querySelector('#profileSheet .sheet-screen.is-active'); }
  function syncHeader() {
    if (!started) return;
    var sheet = currentSheet();
    var inSettings = $('profileSheet').classList.contains('open');
    document.body.classList.toggle('ui-settings-open', inSettings);
    var pageSheet = false;
    document.body.classList.toggle('ui-sheet-page', !!pageSheet);
    $('profileSheet').setAttribute('role',pageSheet?'region':'dialog');
    $('profileSheet').setAttribute('aria-modal',String(inSettings&&!pageSheet));
    document.querySelector('.page').inert=!!pageSheet;
    var selected = inSettings ? 'ajustes' : route;
    document.querySelectorAll('[data-ui-route]').forEach(function(n) {
      n.setAttribute('aria-label',t(n.dataset.uiRoute));
      n.classList.toggle('is-active', n.dataset.uiRoute === selected);
      if (n.dataset.uiRoute === selected) n.setAttribute('aria-current','page'); else n.removeAttribute('aria-current');
    });
    var now = new Date(), date = window.GanhosDate ? GanhosDate.get() : now;
    var locale = I18N.t('lang.code');
    var today=new Date();today.setHours(0,0,0,0);
    var selectedDay=new Date(date);selectedDay.setHours(0,0,0,0);
    var showingOtherDate=selectedDay.getTime()!==today.getTime();
    document.body.classList.toggle('ui-showing-other-date',showingOtherDate);
    var headerDate = date.toLocaleDateString(locale,{weekday:'long',day:'numeric',month:'long'}).replace(/-feira\b/i,'');
    $('uiHeaderDate').textContent = showingOtherDate && window.matchMedia('(max-width:760px)').matches ? say('A mostrar dados de…','Showing data from…') : headerDate;
    var name = $('sheetUsername').textContent.trim().split(' ')[0];
    var greeting = t(now.getHours()<12?'hello':now.getHours()<19?'afternoon':'evening');
    $('uiHeaderTitle').textContent = showingOtherDate && window.matchMedia('(max-width:760px)').matches ? shortHeaderDate(date) : inSettings ? (sheet && sheet.id !== 'sheetScreenDefault' ? $('sheetHandleTitle').textContent : t('ajustes')) : route === 'resumo' ? greeting + ', ' + name + '.' : t(route);
    document.body.dataset.uiRoute = route;
    document.body.classList.toggle('ui-home', route === 'resumo' && !inSettings);
    document.querySelectorAll('.ui-selected-date').forEach(function(n){ n.textContent = date.toLocaleDateString(locale,{day:'numeric',month:'long',year:'numeric'}); });
    $('uiCalendar').setAttribute('aria-label',t('calendar'));
    $('uiAdd').setAttribute('aria-label',t('record'));
    $('uiThemeRow').setAttribute('aria-pressed',String(document.body.classList.contains('theme-dark')));
  }
  function shortHeaderDate(date){
    if(I18N.getLang()==='en')return date.toLocaleDateString(I18N.t('lang.code'),{weekday:'short',day:'numeric',month:'short'});
    var days=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    var months=['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'];
    return days[date.getDay()]+', '+date.getDate()+' de '+months[date.getMonth()];
  }
  function go(key) {
    window.closeAllOverlays();
    var settingsPage=$('uiSettingsPage');
    if (key === 'ajustes') {
      window.closeProfileSheetPublic();
      HomeNav.hideAllInstant();
      if($('uiExpensesPage'))$('uiExpensesPage').hidden=true;
      if($('metaSlotList'))$('metaSlotList').hidden=true;
      if(settingsPage)settingsPage.hidden=false;
      route=key;
      syncHeader();
      window.scrollTo({top:0,behavior:'instant'});
      return;
    }
    window.closeProfileSheetPublic();
    if(settingsPage)settingsPage.hidden=true;
    var expenses = $('uiExpensesPage');
    if (key !== 'despesas' && expenses && !expenses.hidden && !pageTransitioning) {
      pageTransitioning=true;
      expenses.classList.add('is-fading');
      setTimeout(function(){ expenses.hidden=true; expenses.classList.remove('is-fading'); pageTransitioning=false; go(key); },140);
      return;
    }
    route = key;
    if (key === 'despesas') {
      HomeNav.hideAllInstant(); $('metaSlotList').hidden = true;
      if(expenses){expenses.hidden=false;expenses.classList.add('is-fading');void expenses.offsetWidth;expenses.classList.remove('is-fading');}
    } else {
      if($('metaSlotList'))$('metaSlotList').hidden = key !== 'resumo';
      HomeNav.goToSection(key);
    }
    syncHeader();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function start() {
    if (started || !window.SmartSomaAppReady) return;
    started = true;
    document.body.classList.add('ui-v2');
    document.documentElement.classList.add('ui-v2');
    var nav = create('aside', 'ui-sidebar', '<button type="button" class="ui-brand" aria-label="SmartSoma"><img src="logo.png" alt="SmartSoma"></button><p class="ui-brand-caption" data-ui-text="tag"></p><nav class="ui-navigation" aria-label="Menu principal"></nav><div class="ui-sidebar-footer"><button type="button" class="ui-subscription-card" id="uiSidebarSubscription"><span class="ui-subscription-dot"></span><span><strong id="uiSidebarSubscriptionTitle"></strong><small id="uiSidebarSubscriptionNote"></small></span><b id="uiSidebarSubscriptionAction"></b></button><button type="button" class="ui-sidebar-profile" id="uiSidebarProfile"><span class="ui-sidebar-avatar" id="uiSidebarAvatar"></span><span><strong id="uiSidebarName"></strong><small>Conta pessoal</small></span><b>›</b></button></div>');
    $('appRoot').prepend(nav);
    nav.querySelector('.ui-brand').addEventListener('click',function(){go('resumo');});
    $('uiSidebarProfile').addEventListener('click',function(){go('ajustes');});
    $('uiSidebarSubscription').addEventListener('click',function(){
      var manage=$('gerirSubscricaoBtn');
      if(manage&&getComputedStyle(manage).display!=='none'){manage.click();return;}
      go('ajustes');
    });
    ['resumo','ganhos','despesas','semana','relatorio','ajustes'].forEach(function(key){
      var n=button('',function(){go(key);},'ui-nav-item');
      n.dataset.uiRoute=key; n.innerHTML=svg(key)+'<span class="ui-nav-full" data-ui-text="'+key+'"></span><span class="ui-nav-short" aria-hidden="true"></span>'; nav.querySelector('nav').append(n);
    });
    var header=create('header','ui-header','<div class="ui-header-copy"><p id="uiHeaderDate" class="ui-eyebrow"></p><h1 id="uiHeaderTitle"></h1></div><div class="ui-mobile-logo"><img src="logo-home.png" alt="SmartSoma"><span data-ui-text="tag"></span></div><div class="ui-header-actions"><button type="button" id="uiCalendar" class="ui-icon-button">'+svg('semana')+'</button><button type="button" id="uiAdd" class="ui-add">'+svg('plus')+'</button></div>');
    $('appRoot').prepend(header);
    var headerAvatar=$('headerAvatarBtn');
    if(headerAvatar)headerAvatar.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();go('ajustes');},true);
    ['openDadosPessoaisBtn','openDespesasFixasBtn','openMultiplataformaBtn','openIdiomaBtn','openTamanhoBtn','openAjudaBtn'].forEach(function(id){
      $(id).addEventListener('click',function(){window.openProfileSheetPublic();},true);
    });
    $('uiCalendar').addEventListener('click',function(){window.closeProfileSheetPublic(); window.closeAllOverlays(); GanhosDate.open();});
    $('uiAdd').addEventListener('click',function(){window.closeProfileSheetPublic(); if(window.SmartSomaUI.openEntry) SmartSomaUI.openEntry(); else PlataformaModals.uber.open();});
    ['Ganhos','Semana','Relatorio'].forEach(function(name){$('homeListPage'+name).prepend(heading(name.toLowerCase()));});
    $('tamanhoOptionP').querySelector('.tamanho-option-letter').textContent='A';
    $('tamanhoOptionG').querySelector('.tamanho-option-letter').textContent='A';
    var theme=button('',function(){$('btnToggleTheme').click();syncHeader();},'sheet-action-btn');
    theme.id='uiThemeRow'; theme.innerHTML=svg('ajustes')+'<span data-ui-text="theme"></span>'; $('openTermosMenuBtn').before(theme);
    var manage=button('',function(){window.openProfileSheetPublic();$('openMultiplataformaBtn').click();},'ui-button ui-secondary');
    manage.innerHTML='<span data-ui-text="manage"></span>'; manage.id='uiManagePlatforms';
    $('homeListPageGanhos').querySelector('.tech-card-header').append(manage);
    var viewControls=$('subHeaderViewToggleGroup'); $('semanaWeekPicker').after(viewControls); viewControls.hidden=false;
    var originalGo=HomeNav.goToSection;
    HomeNav.goToSection=function(key){ route=key==='default'?'ganhos':key; if($('uiSettingsPage'))$('uiSettingsPage').hidden=true; if($('uiExpensesPage')) $('uiExpensesPage').hidden=true; originalGo(key); syncHeader(); };
    // These original buttons call the private navigation function, so keep the shell in sync too.
    $('btnVerMeuResumo').addEventListener('click',function(){route='resumo';syncHeader();});
    var observer=new MutationObserver(function(){syncHeader();syncSidebarAccount();});
    observer.observe($('profileSheet'),{attributes:true,subtree:true,attributeFilter:['class']});
    observer.observe($('sheetHandleTitle'),{childList:true,subtree:true,characterData:true});
    observer.observe($('sheetUsername'),{childList:true,subtree:true,characterData:true});
    observer.observe($('sheetAvatar'),{childList:true,subtree:true,attributes:true,attributeFilter:['class','src']});
    observer.observe($('subStatusText'),{childList:true,subtree:true,characterData:true});
    observer.observe($('sheetProActiveBadge'),{attributes:true,attributeFilter:['style']});
    GanhosDate.onChange(syncHeader);
    document.addEventListener('languageChanged',function(){translate();syncHeader();});
    setupPages();
    syncSidebarAccount();
    translate(); go('resumo');
    document.dispatchEvent(new CustomEvent('smartSomaUIReady'));
  }
  function money(value) { return Number(value).toLocaleString(I18N.t('lang.code'),{style:'currency',currency:'EUR'}); }
  function syncSidebarAccount(){
    var name=$('sheetUsername').textContent.trim()||say('Utilizador','User');
    $('uiSidebarName').textContent=name;
    var avatar=$('uiSidebarAvatar');avatar.replaceChildren();
    var source=$('sheetAvatar img');
    if(source){var image=create('img');image.src=source.src;image.alt='';avatar.append(image);}
    else avatar.textContent=name.split(/\s+/).slice(0,2).map(function(part){return part[0]||'';}).join('').toUpperCase();
    var status=$('subStatusText').textContent.trim();
    var isTrial=/trial/i.test(status), isCancelled=/cancel/i.test(status), active=!isTrial&&!isCancelled;
    var card=$('uiSidebarSubscription');card.classList.toggle('is-trial',isTrial);card.classList.toggle('is-cancelled',isCancelled);
    $('uiSidebarSubscriptionTitle').textContent=isTrial?say('Período de trial','Trial period'):isCancelled?say('Subscrição cancelada','Subscription cancelled'):say('Subscrição ativa','Active subscription');
    $('uiSidebarSubscriptionNote').textContent=isTrial?status:isCancelled?status:say('Gerir subscrição','Manage subscription');
    $('uiSidebarSubscriptionAction').textContent=isTrial?'':active?say('Gerir','Manage'):'›';
  }
  function say(pt,en) { return I18N.getLang()==='en'?en:pt; }
  function platforms() { return [{id:'uber',nome:'Uber',img:'01uber.png'},{id:'bolt',nome:'Bolt',img:'02bolt.png'}].concat(SmartSomaReadModel.platforms()); }
  function shortDate(d) { return d.toLocaleDateString(I18N.t('lang.code'),{day:'2-digit',month:'2-digit'}); }
  function daysInPeriod() {
    var ref=ResumoPeriod.getRefDate(), period=document.querySelector('.period-chip.selected').dataset.period;
    var first=new Date(ref), count=1;
    if(period==='semana'){first=ResumoPeriod.getWeekRange(ref).monday;count=7;}
    if(period==='mes'){first=new Date(ref.getFullYear(),ref.getMonth(),1);count=new Date(ref.getFullYear(),ref.getMonth()+1,0).getDate();}
    return Array.from({length:count},function(_,i){var d=new Date(first);d.setDate(first.getDate()+i);return SmartSomaReadModel.day(d);});
  }
  function setupPages() {
    // Reposition existing elements, retaining their IDs, listeners and references.
    var summary=$('resumoLiveContent');
    var settingsPage=create('section','home-list-page');
    settingsPage.id='uiSettingsPage';settingsPage.hidden=true;settingsPage.append(heading('ajustes'));
    var settingsContent=$('sheetScreenDefault').querySelector('.sheet-content');
    settingsPage.append(settingsContent);
    $('sheetScreenDefault').append(create('div','sheet-content ui-settings-placeholder'));
    document.querySelector('.home-list-inner').append(settingsPage);
    summary.prepend($('metaSlotList'));
    var expenses=create('section','home-list-page'); expenses.id='uiExpensesPage'; expenses.hidden=true; expenses.append(heading('despesas'));
    var expenseCard=create('div','home-card','<div class="ui-panel-head"><h2 id="uiExpenseTitle"></h2><button class="ui-button" id="uiExpenseAdd" type="button"></button></div><div class="ui-expense-total" id="uiExpenseTotal"></div><div id="uiExpenseRows"></div>');
    expenses.append(expenseCard); document.querySelector('.home-list-inner').append(expenses);
    $('uiExpenseAdd').addEventListener('click',function(){openEntry('expense');});
    var fix=button('',openFixedExpensesModal,'ui-button ui-secondary');
    fix.id='uiExpenseFixed';expenseCard.append(fix);
    var daily=button('',function(){PlataformaModals.despesas.open();},'ui-button ui-secondary');
    daily.id='uiExpenseManage';expenseCard.append(daily);
    var dashboard=create('div','ui-dashboard-bottom','<section class="home-card ui-chart-panel"><div class="ui-panel-head"><div><p class="ui-eyebrow" id="uiChartEyebrow"></p><h2 id="uiChartTitle"></h2></div><button type="button" id="uiChartDetails" class="ui-text-button"></button></div><div id="uiChart"></div></section><section class="home-card ui-overview-expenses"><div class="ui-panel-head"><h2 id="uiOverviewExpensesTitle"></h2><button type="button" id="uiOverviewFixed" class="ui-text-button"></button></div><div id="uiOverviewFixedGroup" hidden><p class="ui-expense-section-label" id="uiOverviewFixedLabel"></p><div id="uiOverviewFixedRows"></div></div><p class="ui-expense-section-label" id="uiOverviewDailyLabel"></p><div id="uiOverviewExpenseRows"></div></section>');
    $('resumoTechCard').after(dashboard);
    $('uiChartDetails').addEventListener('click',function(){go('semana');});
    $('uiOverviewFixed').addEventListener('click',openFixedExpensesModal);
    var goal=create('div','ui-goal-progress','<div class="ui-goal-topline"><span class="ui-goal-tag" id="uiGoalTag"></span><span id="uiGoalPeriod"></span></div><div class="ui-goal-grid"><div class="ui-goal-copy"><h2 id="uiGoalTitle"></h2><p id="uiGoalCopy"></p><div class="ui-goal-actions"><button type="button" id="uiGoalGross"></button><button type="button" id="uiGoalNet"></button><button type="button" id="uiGoalEdit"></button></div></div><div class="ui-goal-number"><span id="uiGoalProgressLabel"></span><strong id="uiGoalPercent"></strong><small id="uiGoalAmounts"></small></div></div><div class="ui-progress-wrap"><div class="ui-progress-track" id="uiGoalTrack" role="progressbar" aria-valuemin="0" aria-valuemax="100"><div id="uiGoalFill"></div></div><div id="uiGoalDays" class="ui-goal-days"></div></div>');
    $('metaSemanalCard').append(goal);
    $('uiGoalEdit').addEventListener('click',function(){
      var week=MetaSemanalRead.forDate(ResumoPeriod.getRefDate());
      if(!week.current){MetaSemanalRead.openHistory(ResumoPeriod.getRefDate());return;}
      $('btnMetaSemanal').click();
      if(week.config){$('metaSemanalValorInput').value=week.config.valor;$(week.config.tipo==='liquido'?'metaTipoLiquidoBtn':'metaTipoBrutoBtn').click();}
    });
    function changeGoalType(type){
      var week=MetaSemanalRead.forDate(ResumoPeriod.getRefDate());
      if(!week.current)return;
      if(window.SmartSomaPro&&!SmartSomaPro.isPro){if(window.abrirModalSubExpirada)abrirModalSubExpirada();return;}
      $(type==='liquido'?'metaTipoLiquidoBtn':'metaTipoBrutoBtn').click();
      if(!week.config){$('btnMetaSemanal').click();return;}
      // Delegate to the original save path: same weekly key, validation and cloud persistence.
      $('metaSemanalValorInput').value=week.config.valor;$('metaSemanalSalvarBtn').click();
    }
    $('uiGoalGross').addEventListener('click',function(){changeGoalType('bruto');});
    $('uiGoalNet').addEventListener('click',function(){changeGoalType('liquido');});
    var metrics=create('section','ui-metrics');metrics.setAttribute('aria-label',say('Resumo financeiro','Financial summary'));
    [['Net','profit','profit'],['Gross','purple','ganhos'],['Expenses','coral','despesas'],['Distance','amber','distance']].forEach(function(item){
      var card=create('article','ui-metric '+item[1],'<div class="ui-metric-icon">'+svg(item[2])+'</div><p id="uiMetric'+item[0]+'Label"></p><h3 id="uiMetric'+item[0]+'Value"></h3><small id="uiMetric'+item[0]+'Note"></small>');metrics.append(card);
    });
    summary.append(metrics);
    var dayTotal=create('div','ui-daily-total','<span id="uiDailyTitle"></span><strong id="uiDailyTotal"></strong>');
    $('ganhosIncomeScrollWrap').after(dayTotal);
    var add=button('',function(){openEntry();}); add.id='uiIncomeAdd'; dayTotal.append(add);
    var dayHistory=create('section','home-card','<h2 id="uiDayHistoryTitle"></h2><div id="uiDayHistoryRows"></div>');
    $('homeListPageGanhos').append(dayHistory);
    setupEntry(); setupSettings();
    var refreshQueued=false;
    function schedule(){if(refreshQueued)return;refreshQueued=true;queueMicrotask(function(){refreshQueued=false;refreshData();});}
    ['homeBadgesSaved','plataformasChanged','despesasFixasChanged','metaSemanalConfigChanged','languageChanged','cloudCacheReady'].forEach(function(name){document.addEventListener(name,schedule);});
    GanhosDate.onChange(schedule);
    document.querySelectorAll('.period-chip,#periodNavPrev,#periodNavNext').forEach(function(n){n.addEventListener('click',schedule);});
    refreshData();
    SmartSomaUI.refresh=refreshData;
  }
  function tableRows(target,rows) {
    target.replaceChildren();
    if(!rows.length){target.append(create('p','ui-empty',say('Ainda não há registos neste período.','No entries in this period yet.')));return;}
    rows.forEach(function(row){
      var n=create('div','ui-record-row');
      var label=create('span');label.textContent=row.label;
      var date=create('small');date.textContent=shortDate(row.date);
      var value=create('strong',row.expense?'ui-negative':'ui-positive');value.textContent=(row.expense?'−':'')+money(row.value);
      n.append(date,label,value);target.append(n);
    });
  }
  function records(days){
    var names=platforms();var result=[];
    days.slice().reverse().forEach(function(d){
      names.forEach(function(p){var value=p.id==='uber'?d.uber:p.id==='bolt'?d.bolt:d.platforms[p.id]||0;if(value)result.push({date:d.date,label:p.nome,value:value});});
      d.entries.forEach(function(e){result.push({date:d.date,label:e.descricao,value:e.valor,expense:true});});
    });return result;
  }
  function refreshData(){
    var day=SmartSomaReadModel.day(GanhosDate.get());
    $('uiExpenseTitle').textContent=say('Despesas do dia','Daily expenses')+' · '+shortDate(day.date);
    $('uiExpenseTotal').textContent=money(day.expenses);
    $('uiExpenseAdd').textContent=say('Adicionar despesa','Add expense');
    $('uiExpenseFixed').textContent=say('Gerir despesas fixas','Manage fixed expenses');
    $('uiExpenseManage').textContent=say('Gerir despesas do dia','Manage daily expenses');
    tableRows($('uiExpenseRows'),day.entries.map(function(e){return{date:day.date,label:e.descricao,value:e.valor,expense:true};}));
    $('uiDailyTitle').textContent=say('Rendimentos','Earnings')+' · '+GanhosDate.formatLabel(day.date);
    $('uiDailyTotal').textContent=money(day.gross);$('uiIncomeAdd').textContent=t('addIncome');
    $('uiDayHistoryTitle').textContent=say('Histórico do dia','Daily history');tableRows($('uiDayHistoryRows'),records([day]));
    $('uiChartTitle').textContent=say('O teu ritmo','Your rhythm');
    $('uiChartEyebrow').textContent=say('SEMANA EM MOVIMENTO','WEEK IN MOTION');
    $('uiChartDetails').textContent=say('Ver semana completa →','View full week →');
    $('uiOverviewExpensesTitle').textContent=say('Despesas','Expenses');$('uiOverviewFixed').textContent=say('Configurar','Configure');$('uiOverviewFixedLabel').textContent=say('DESPESAS FIXAS','FIXED EXPENSES');$('uiOverviewDailyLabel').textContent=say('DESPESAS DO DIA','DAILY EXPENSES');
    renderOverviewExpenses(day);
    var days=daysInPeriod();renderChart(days);
    // Same calculations as the weekly table, including current fixed expenses.
    // Only presentation changes; no cached amounts or persisted data are rewritten.
    var totals=days.reduce(function(s,d){s.gross+=d.gross;s.net+=d.net;s.expenses+=d.expenses;s.km+=d.km;return s;},{gross:0,net:0,expenses:0,km:0});
    [['summaryBrutoValue','gross'],['summaryLiquidoValue','net'],['summaryDespesasValue','expenses']].forEach(function(pair){$(pair[0]).textContent='€'+totals[pair[1]].toFixed(2);});
    $('summaryDistanciaValue').textContent=(Math.round(totals.km*10)/10)+' km';
    renderMetrics(days,totals);
    var goalWeek=MetaSemanalRead.forDate(ResumoPeriod.getRefDate());
    var cfg=goalWeek.config, pct=goalWeek.percent;
    $('metaSemanalCard').classList.toggle('ui-historical-goal',!goalWeek.current);
    $('uiGoalTag').textContent=say('◎ FOCO DA SEMANA','◎ WEEKLY FOCUS');
    var sunday=new Date(goalWeek.monday);sunday.setDate(sunday.getDate()+6);
    $('uiGoalPeriod').textContent=shortDate(goalWeek.monday)+' — '+shortDate(sunday);
    $('uiGoalTitle').textContent=!cfg?say('Dá uma direção à tua semana.','Give your week direction.'):pct>=100?say('A tua meta foi atingida!','You reached your goal!'):say('A tua meta está mesmo ao alcance.','Your goal is within reach.');
    $('uiGoalCopy').replaceChildren();
    if(cfg&&pct<100){var remaining=create('strong');remaining.textContent=money(Math.max(0,cfg.valor-goalWeek.achieved));$('uiGoalCopy').append(say('Mais ','Another '),remaining,goalWeek.current?say(' e fechas a semana em grande.',' to finish the week strong.'):say(' para atingir a meta desta semana.',' to reach this week’s goal.'));}
    else $('uiGoalCopy').textContent=cfg?say('Objetivo cumprido. Cada percurso contou.','Goal achieved. Every journey counted.'):say('Define uma meta em bruto ou líquido e acompanha o teu progresso.','Set a gross or net goal and follow your progress.');
    $('uiGoalGross').textContent=say('Bruto','Gross');$('uiGoalNet').textContent=say('Líquido','Net');
    $('uiGoalGross').setAttribute('aria-pressed',String(!cfg||cfg.tipo==='bruto'));
    $('uiGoalNet').setAttribute('aria-pressed',String(!!cfg&&cfg.tipo==='liquido'));
    $('uiGoalGross').disabled=$('uiGoalNet').disabled=!goalWeek.current;
    $('uiGoalEdit').textContent=goalWeek.current?(cfg?say('Editar meta ↗','Edit goal ↗'):say('Definir meta ↗','Set goal ↗')):say('Consultar meta ↗','View goal ↗');
    $('uiGoalProgressLabel').textContent=say('Progresso','Progress');
    $('uiGoalPercent').textContent=cfg?pct+'%':'—';
    $('uiGoalAmounts').textContent=cfg?money(goalWeek.achieved)+say(' de ',' of ')+money(cfg.valor):say('Meta por definir','No goal set');
    $('uiGoalTrack').setAttribute('aria-label',say('Progresso da meta semanal','Weekly goal progress'));
    $('uiGoalTrack').setAttribute('aria-valuenow',String(Math.min(100,Math.max(0,pct))));
    $('uiGoalTrack').setAttribute('aria-valuetext',cfg?pct+'%':say('Meta por definir','No goal set'));
    $('uiGoalFill').style.width=Math.min(100,Math.max(0,pct))+'%';
    var monday=goalWeek.monday;
    $('uiGoalDays').replaceChildren();
    var today=new Date();today.setHours(0,0,0,0);
    for(var i=0;i<7;i++){
      var d=new Date(monday);d.setDate(d.getDate()+i);var info=SmartSomaReadModel.day(d);
      var amount=cfg&&cfg.tipo==='liquido'?info.net:info.gross;
      var dot=create('span',d>today?'is-future':info.gross>0?'has-entry':'');
      dot.classList.toggle('is-today',d.getTime()===today.getTime());
      var label=create('b');label.textContent=I18N.list('weekday.abbr')[i];var value=create('span');value.textContent=d>today?'—':money(amount);
      dot.title=shortDate(d)+' · '+(cfg&&cfg.tipo==='liquido'?say('Líquido','Net'):say('Bruto','Gross'))+' · '+money(amount);dot.append(label,value);$('uiGoalDays').append(dot);
    }
    syncHeader();
  }
  function renderMetrics(days,totals){
    var period=document.querySelector('.period-chip.selected').dataset.period;
    var today=new Date();today.setHours(0,0,0,0);
    // Compare only elapsed days. Calendar arithmetic also works across DST/month boundaries.
    var elapsed=days.filter(function(d){return d.date<=today;}),prior=0,current=0;
    elapsed.forEach(function(d){
      var prev=new Date(d.date);
      if(period==='mes'){
        prev=new Date(d.date.getFullYear(),d.date.getMonth()-1,d.date.getDate());
        if(prev.getDate()!==d.date.getDate())return;
      }else prev.setDate(prev.getDate()-(period==='semana'?7:1));
      current+=d.net;prior+=SmartSomaReadModel.day(prev).net;
    });
    var comparison=period==='semana'?say('vs. mesmos dias da semana anterior','vs. same days last week'):period==='mes'?say('vs. mesmos dias do mês anterior','vs. same days last month'):say('vs. dia anterior','vs. previous day');
    var netNote=$('uiMetricNetNote');netNote.replaceChildren();
    if(prior!==0){var delta=(current-prior)/Math.abs(prior)*100;var change=create('b',delta<0?'ui-negative':'ui-positive');change.textContent=(delta>0?'+':'')+delta.toLocaleString(I18N.t('lang.code'),{maximumFractionDigits:1})+'%';netNote.append(change,' '+comparison);}
    else netNote.textContent=say('Sem base de comparação anterior','No previous comparison available');
    [['Net',say('Lucro líquido','Net profit'),money(totals.net)],['Gross',say('Ganhos brutos','Gross earnings'),money(totals.gross)],['Expenses',say('Despesas','Expenses'),money(totals.expenses)],['Distance',say('Distância','Distance'),totals.km.toLocaleString(I18N.t('lang.code'),{maximumFractionDigits:1})+' km']].forEach(function(item){$('uiMetric'+item[0]+'Label').textContent=item[1];$('uiMetric'+item[0]+'Value').textContent=item[2];});
    $('uiMetricGrossNote').textContent=platforms().length+say(' plataformas registadas',' registered platforms');
    $('uiMetricExpensesNote').textContent=totals.gross>0?(totals.expenses/totals.gross*100).toLocaleString(I18N.t('lang.code'),{maximumFractionDigits:1})+say('% dos ganhos','% of earnings'):say('Sem ganhos neste período','No earnings in this period');
    $('uiMetricDistanceNote').textContent=totals.km>0?money(totals.net/totals.km)+say(' líquidos / km em média',' net / km on average'):say('Sem quilometragem registada','No mileage recorded');
  }
  function renderChart(days){
    var target=$('uiChart'),recorded=days.filter(function(d){return d.gross>0||d.expenses>0;}).length;
    var summary=create('p','ui-rhythm-summary');summary.textContent=recorded+say(' de ',' of ')+days.length+say(' dias registados',' days recorded');
    var rhythm=create('div','ui-rhythm-days');rhythm.setAttribute('role','list');rhythm.setAttribute('aria-label',say('Ritmo semanal','Weekly rhythm'));
    var today=new Date();today.setHours(0,0,0,0),labels=I18N.list('weekday.abbr');
    days.forEach(function(d){
      var hasIncome=d.gross>0,hasExpense=d.expenses>0,isToday=d.date.getTime()===today.getTime();
      var day=create('div','ui-rhythm-day'+(hasIncome?' has-income':'')+(hasExpense?' has-expense':'')+(isToday?' is-today':''));day.setAttribute('role','listitem');
      day.setAttribute('aria-label',labels[(d.date.getDay()+6)%7]+': '+(hasIncome&&hasExpense?say('ganhos e despesas registados','earnings and expenses recorded'):hasIncome?say('ganhos registados','earnings recorded'):hasExpense?say('despesas registadas','expenses recorded'):say('sem registos','no entries')));
      var track=create('span','ui-rhythm-track'),label=create('span','ui-rhythm-label');label.textContent=labels[(d.date.getDay()+6)%7];day.append(track,label);rhythm.append(day);
    });
    target.replaceChildren(summary,rhythm);
  }
  function openFixedExpensesModal(){
    var screen=$('sheetScreenDespesasFixas'),content=screen&&screen.querySelector('.sheet-content');
    if(!content)return;
    var backdrop=$('uiFixedExpensesModalBackdrop');
    if(!backdrop){
      backdrop=create('div','mm-backdrop ui-fixed-expenses-modal-backdrop');backdrop.id='uiFixedExpensesModalBackdrop';
      var card=create('div','mm-card ui-fixed-expenses-modal-card');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','uiFixedExpensesModalTitle');
      var head=create('div','ui-fixed-expenses-modal-head','<h3 class="mm-title" id="uiFixedExpensesModalTitle"></h3><button type="button" class="ui-icon-button" aria-label="Fechar">×</button>');
      head.querySelector('button').addEventListener('click',closeFixedExpensesModal);card.append(head);backdrop.append(card);document.body.append(backdrop);
      backdrop.addEventListener('click',function(e){if(e.target===backdrop)closeFixedExpensesModal();});
      document.addEventListener('keydown',function(e){if(e.key==='Escape'&&backdrop.classList.contains('visible'))closeFixedExpensesModal();});
    }
    window.closeAllOverlays();document.dispatchEvent(new CustomEvent('fixedExpensesFormReset'));
    var card=backdrop.querySelector('.ui-fixed-expenses-modal-card');card.append(content);screen.hidden=true;
    backdrop.querySelector('h3').textContent=say('Despesas fixas','Fixed expenses');
    backdrop._returnFocus=document.activeElement;backdrop.classList.add('visible');
    requestAnimationFrame(function(){var input=content.querySelector('input');if(input)input.focus();});
  }
  function closeFixedExpensesModal(){
    var backdrop=$('uiFixedExpensesModalBackdrop'),screen=$('sheetScreenDespesasFixas');
    if(!backdrop||!backdrop.classList.contains('visible')||!screen)return;
    document.dispatchEvent(new CustomEvent('fixedExpensesFormReset'));
    var content=backdrop.querySelector('.sheet-content');if(content)screen.append(content);
    backdrop.classList.remove('visible');
    if(backdrop._returnFocus&&typeof backdrop._returnFocus.focus==='function')backdrop._returnFocus.focus();
  }
  function renderOverviewExpenses(day){
    var fixedSource=$('despesaFixaLembreteEl');
    var fixedRows=fixedSource?Array.from(fixedSource.querySelectorAll('.despesa-card')).map(function(card){return{label:(card.querySelector('.despesa-card-desc')||{}).textContent||'',detail:(card.querySelector('.despesa-card-sub')||{}).textContent||''};}):[];
    $('uiOverviewFixedGroup').hidden=!fixedRows.length;$('uiOverviewFixedRows').replaceChildren();
    fixedRows.forEach(function(row){var item=create('div','ui-overview-expense-row ui-fixed-expense-row'),label=create('span'),detail=create('small');label.textContent=row.label;detail.textContent=row.detail;item.append(label,detail);$('uiOverviewFixedRows').append(item);});
    var dailyEntries=day.date.getDay()===1?day.entries.slice(0,Math.max(0,day.entries.length-fixedRows.length)):day.entries;
    tableRows($('uiOverviewExpenseRows'),dailyEntries.map(function(entry){return{date:day.date,label:entry.descricao,value:entry.valor,expense:true};}));
  }
  var entryMode='income',chosen=null,entryReturnFocus=null;
  function setupEntry(){
    var dialog=create('dialog','ui-entry-dialog','<form id="uiEntryForm"><div class="ui-panel-head"><h2 id="uiEntryTitle"></h2><button type="button" id="uiEntryClose" class="ui-icon-button" aria-label="Fechar">×</button></div><p id="uiEntryDate" class="ui-eyebrow"></p><div class="ui-entry-tabs"><button type="button" id="uiEntryIncome"></button><button type="button" id="uiEntryExpense"></button></div><div class="ui-platform-selector" id="uiPlatformSelector"><div id="uiPlatformChoices" class="ui-platform-choices"></div><p id="uiPlatformName" class="ui-platform-name"></p></div><label id="uiEntryDescriptionLabel"><span id="uiDescriptionLabel"></span><input id="uiEntryDescription" maxlength="60"></label><label><span id="uiValueLabel"></span><div class="ui-entry-amount"><span>€</span><input id="uiEntryValue" inputmode="decimal" autocomplete="off" required aria-label="Valor" placeholder="0,00"></div></label><p id="uiEntryHint" class="ui-muted" aria-live="polite"></p><p id="uiEntryError" class="ui-error" role="alert"></p><button type="submit" id="uiEntrySave" class="ui-button"></button></form>');
    var backdrop=create('div','ui-entry-backdrop');dialog.id='uiEntryDialog';dialog.setAttribute('aria-labelledby','uiEntryTitle');document.body.append(backdrop,dialog);
    $('uiEntryClose').addEventListener('click',function(){dialog.close();});
    backdrop.addEventListener('click',function(){dialog.close();});
    dialog.addEventListener('close',function(){backdrop.classList.remove('visible');if(entryReturnFocus)entryReturnFocus.focus();});
    $('uiEntryIncome').addEventListener('click',function(){entryMode='income';chosen=null;renderEntry();});
    $('uiEntryExpense').addEventListener('click',function(){entryMode='expense';chosen=null;renderEntry();});
    $('uiEntryForm').addEventListener('submit',function(e){
      e.preventDefault();
      var value=Number($('uiEntryValue').value.trim().replace(',','.'));
      if(!Number.isFinite(value)||value<0||value>999.99||!$('uiEntryValue').value.trim()||(entryMode==='expense'&&value===0)){$('uiEntryError').textContent=say('Insere um valor válido até 999,99 €.','Enter a valid amount up to €999.99.');return;}
      if(window.SmartSomaPro && !SmartSomaPro.isPro){dialog.close();if(window.abrirModalSubExpirada)abrirModalSubExpirada();return;}
      if(entryMode==='income'){
        if(!chosen){$('uiEntryError').textContent=say('Seleciona uma plataforma.','Select a platform.');return;}
        if(chosen.id==='uber'||chosen.id==='bolt'){
          $(chosen.id+'ValorInput').value=String(value);$(chosen.id+'SalvarBtn').click();
        }else{HomeBadges.setPlat(chosen.id,value);}
      }else{
        var desc=$('uiEntryDescription').value.trim();
        if(!desc){$('uiEntryError').textContent=say('Adiciona uma descrição.','Add a description.');return;}
        $('despesasSemanaDescInput').value=desc;$('despesasSemanaValorInput').value=String(value);$('despesasSemanaSalvarBtn').click();
      }
      dialog.close();refreshData();
    });
    SmartSomaUI.openEntry=openEntry;
  }
  function openEntry(mode){
    window.closeAllOverlays();window.closeProfileSheetPublic();entryReturnFocus=document.activeElement;
    entryMode=mode||'income';chosen=null;$('uiEntryValue').value='';$('uiEntryDescription').value='';renderEntry();
    var entryDialog=$('uiEntryDialog');entryDialog.previousElementSibling.classList.add('visible');
    if(typeof entryDialog.show==='function')entryDialog.show();else entryDialog.showModal();
  }
  function renderEntry(){
    var income=entryMode==='income';$('uiEntryTitle').textContent=t('record');$('uiEntryDate').textContent=GanhosDate.formatLabel(GanhosDate.get());
    $('uiEntryIncome').textContent=say('Ganhos','Earnings');$('uiEntryExpense').textContent=t('despesas');
    $('uiEntryIncome').setAttribute('aria-pressed',String(income));$('uiEntryExpense').setAttribute('aria-pressed',String(!income));
    $('uiEntryDescriptionLabel').hidden=income;$('uiEntryDescription').required=!income;
    $('uiDescriptionLabel').textContent=say('Descrição','Description');$('uiValueLabel').textContent=say('Valor','Amount');
    $('uiEntrySave').textContent=say('Guardar','Save');$('uiEntryError').textContent='';
    $('uiPlatformSelector').hidden=!income;$('uiPlatformChoices').hidden=!income;$('uiPlatformChoices').replaceChildren();
    $('uiPlatformName').textContent=chosen?chosen.nome:say('Selecione','Select');
    $('uiEntryHint').textContent=income?(chosen?say('Total do dia na '+chosen.nome,'Daily total on '+chosen.nome):say('Total do dia','Daily total')):say('A despesa será guardada na data selecionada.','The expense will be saved for the selected date.');
    if(income)platforms().forEach(function(p){var n=button('',function(){chosen=chosen&&chosen.id===p.id?null:p;$('uiEntryValue').value=chosen?String(p.id==='uber'||p.id==='bolt'?HomeBadges.get()[p.id]||'':HomeBadges.getPlat(p.id)||''):'';renderEntry();},'ui-platform-choice');n.setAttribute('aria-label',p.nome);n.setAttribute('aria-pressed',String(!!chosen&&chosen.id===p.id));n.dataset.platform=p.id;
      if(p.img && (p.id==='uber'||p.id==='bolt'||SmartSomaSecurity.isSafeImageUrl(p.img))){var image=create('img');image.src=p.img;image.alt=p.nome;n.append(image);}else n.textContent=p.nome.slice(0,2).toUpperCase();$('uiPlatformChoices').append(n);});
    if(income&&chosen&&Number($('uiEntryValue').value)>0)$('uiEntryHint').textContent=say('Já existe um registo. Guardar substitui o total deste dia.','An entry exists. Saving replaces this day’s total.');
  }
  function setupSettings(){
    var profileLabel=$('openDadosPessoaisBtn').querySelector('span');profileLabel.removeAttribute('data-i18n');profileLabel.dataset.uiText='profile';
    var helpLabel=$('openAjudaBtn').querySelector('span');helpLabel.removeAttribute('data-i18n');helpLabel.dataset.uiText='help';
    var settings=$('uiSettingsPage').querySelector('.sheet-content');
    var columns=create('div','ui-settings-columns');
    var management=create('div','sheet-actions ui-settings-group');
    var preferences=create('div','sheet-actions ui-settings-group');
    ['openDespesasFixasBtn','openMultiplataformaBtn'].forEach(function(id){management.append($(id));});
    ['openIdiomaBtn','openTamanhoBtn','openAjudaBtn'].forEach(function(id){preferences.append($(id));});
    columns.append(management,preferences);
    settings.querySelector('.sheet-profile-row').append($('openDadosPessoaisBtn'));
    $('sheetProActiveBadge').after(columns);
    // The tutorial remains the original guided flow; its launcher is now on Help.
    $('openTutorialBtn').hidden=true;
    settings.querySelectorAll('.sheet-actions').forEach(function(n){if(!n.children.length)n.remove();else if(Array.from(n.children).every(function(c){return c.hidden;}))n.hidden=true;});
    var newPlatform=$('sheetScreenMultiplataforma').querySelector('[data-i18n="mp.adicionar"]');newPlatform.removeAttribute('data-i18n');newPlatform.dataset.uiText='newPlatform';
    var fixedForm=$('sheetScreenDespesasFixas').querySelector('.despesa-form');
    function resetFixedForm(){fixedForm.hidden=true;fixedAdd.setAttribute('aria-expanded','false');$('despesaDescInput').value='';$('despesaValorInput').value='';$('despesaTipoPercentBtn').click();}
    var fixedAdd=button('',function(){fixedForm.hidden=!fixedForm.hidden;fixedAdd.setAttribute('aria-expanded',String(!fixedForm.hidden));if(!fixedForm.hidden)$('despesaDescInput').focus();});
    fixedAdd.id='uiFixedAdd';fixedAdd.setAttribute('aria-expanded','false');fixedForm.before(fixedAdd);fixedForm.hidden=true;
    document.addEventListener('fixedExpensesFormReset',resetFixedForm);
    document.addEventListener('fixedExpenseSaved',resetFixedForm);
    var helper=$('sheetScreenDespesasFixas').querySelector('.mm-helper-text');helper.removeAttribute('data-i18n');
    var help=$('sheetScreenAjuda').querySelector('.sheet-content');
    help.innerHTML='<section class="ui-help-hero"><p class="ui-eyebrow">SMARTSOMA</p><h2 id="uiHelpTitle"></h2><a href="mailto:contacto@smartsoma.pt">contacto@smartsoma.pt</a><p>Lisboa, Portugal</p><button id="uiTutorialStart" type="button" class="ui-button">Tutorial →</button></section><section class="home-card ui-faq"><h2 id="uiFaqTitle"></h2><div id="uiFaqItems"></div></section>';
    $('uiTutorialStart').addEventListener('click',function(){$('openTutorialBtn').click();});
    var faqs=[
      ['Como registar os meus ganhos?','Escolhe a data no calendário e toca em +. Em Ganhos, seleciona o ícone da plataforma, insere o total do dia e guarda. Uber, Bolt e as tuas plataformas ficam separadas.','How do I record earnings?','Choose a date in the calendar and tap +. Under Earnings, select a platform, enter its daily total and save. Each platform is recorded separately.'],
      ['Posso corrigir um valor já guardado?','Sim. Abre a plataforma na página Ganhos diários ou seleciona-a no registo rápido. O valor guardado aparece no campo. Guardar substitui esse total; não soma uma segunda entrada.','Can I correct an amount?','Yes. Open the platform in Daily earnings or select it in the quick entry. Saving replaces that day’s total rather than adding a second entry.'],
      ['Como adicionar despesas?','No botão +, escolhe Despesas e preenche a descrição e o valor. Podes lançar várias despesas no mesmo dia. Para eliminar uma, abre as despesas do dia e confirma a exclusão.','How do I add expenses?','Tap +, choose Expenses and enter a description and amount. You can add multiple expenses per day. Open daily expenses to delete an entry with confirmation.'],
      ['Como configurar despesas fixas?','Em Ajustes → Despesas fixas, toca em Adicionar despesa fixa. Define a descrição e um valor em euros ou uma percentagem dos ganhos brutos semanais. São contabilizadas na segunda-feira. A percentagem acompanha os ganhos da semana.','How do fixed expenses work?','In Settings → Fixed expenses, add a description and a euro amount or percentage of weekly gross earnings. These are included on Monday; percentages follow the weekly earnings.'],
      ['Como registar a quilometragem?','Em Ganhos diários, abre Distância. Usa Km Total para o percurso completo, ou Início e Fim para o odómetro. Confirma o início com ✓; ao terminar o dia, confirma o fim e guarda a distância calculada.','How do I record mileage?','In Daily earnings, open Distance. Use Total km or Start and End for the odometer. Confirm the start with ✓, then confirm the end and save the calculated distance.'],
      ['Qual é a diferença entre bruto e líquido?','O bruto soma os rendimentos das plataformas. O líquido desconta as despesas registadas e as despesas fixas aplicáveis. Podes definir a meta semanal em qualquer um destes valores.','What is gross versus net?','Gross is the sum of platform earnings. Net deducts recorded expenses and applicable fixed expenses. Your weekly goal can use either value.'],
      ['Posso consultar ou editar dias anteriores?','Sim. Usa o calendário junto ao botão + e seleciona um dia anterior. Os registos e a quilometragem correspondem à data escolhida. Dias futuros não permitem lançamentos.','Can I edit earlier days?','Yes. Use the calendar beside + and select an earlier date. Entries and mileage apply to that date. Future dates cannot receive entries.'],
      ['Como adicionar outra plataforma?','Em Ganhos diários → Gerir plataformas, dá um nome à nova plataforma e escolhe uma imagem. Uber e Bolt são fixas. A eliminação de uma plataforma personalizada pede confirmação e explica o impacto nos dados.','How do I add a platform?','In Daily earnings → Manage platforms, enter a name and choose an image. Uber and Bolt are permanent. Deleting a custom platform requires confirmation and explains the impact on data.'],
      ['Como descarregar os relatórios?','Abre Relatórios, escolhe o mês e descarrega o PDF. O relatório mantém os detalhes e os totais calculados pela aplicação.','How do I download reports?','Open Reports, choose a month and download the PDF containing your daily details and calculated totals.'],
      ['Onde posso gerir a minha subscrição?','Abre Ajustes → Editar perfil. Consulta o estado da subscrição e usa Gerir subscrição para abrir o portal seguro do Creem, onde podes alterar o plano, o cartão ou cancelar.','Where do I manage my subscription?','Open Settings → Edit profile. View the subscription status and use Manage subscription to access the secure Creem portal for plan, card or cancellation changes.'],
      ['Os registos funcionam sem internet?','Com uma sessão já iniciada e os dados disponíveis no dispositivo, podes continuar offline. As alterações ficam na fila local e sincronizam quando a ligação regressa. Confirma o estado da sincronização antes de sair da conta ou limpar os dados do navegador.','Can I work offline?','With an existing session and data available on your device, entries queue locally and sync when connectivity returns. Check the sync status before signing out or clearing browser data.']
    ];
    function labels(){fixedAdd.textContent=say('Adicionar despesa fixa','Add fixed expense');helper.textContent=say('Despesas semanais, em € ou % do bruto. Entram na segunda-feira; a percentagem acompanha os ganhos. Ao excluir, as semanas anteriores ficam preservadas.','Weekly expenses, in € or % of gross. Added on Monday; percentages follow earnings. Deleting preserves previous weeks.');$('uiHelpTitle').textContent=say('Estamos por perto.','We are here to help.');$('uiFaqTitle').textContent=say('Perguntas frequentes','Frequently asked questions');$('uiFaqItems').replaceChildren();faqs.forEach(function(f){var n=create('details');var q=create('summary');q.textContent=say(f[0],f[2]);var p=create('p');p.textContent=say(f[1],f[3]);n.append(q,p);$('uiFaqItems').append(n);});}
    function navLabels(){var labels=say(['Início','Ganhos','Despesas','Semana','Relatórios','Ajustes'],['Home','Earnings','Expenses','Week','Reports','Settings']);document.querySelectorAll('.ui-nav-short').forEach(function(n,i){n.textContent=labels[i];});}
    labels();navLabels();document.addEventListener('languageChanged',function(){labels();navLabels();});
  }
  window.SmartSomaUI={start:start,go:go,t:t,svg:svg,create:create,button:button,translate:translate,syncHeader:syncHeader,refreshSidebar:syncSidebarAccount};
  document.addEventListener('smartSomaAppReady',function(){setTimeout(start,0);});
  if (window.SmartSomaAppReady) start();
})();
