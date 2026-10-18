/* Presentation adapter. Persistence, validation and business rules live in app.js.
   Never use mockup data or bypass cloud-init / subscription checks here. */
(function () {
  'use strict';
  var started = false;
  var route = 'resumo';
  var routeHistory = ['resumo'];
  var returning = false;
  var calendarWeekSelection = false;
  var $ = function (id) { return document.getElementById(id); };
  var icons = {
    resumo: '<path d="M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    ganhos: '<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 10h18M7 6V3h10v3M16 15h2"/>',
    despesas: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z M9 8h6M9 12h6"/>',
    semana: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2"/>',
    relatorio: '<path d="M5 3h10l4 4v14H5ZM14 3v5h5M8 12h8M8 16h8"/>',
    downloads: '<path d="M5 3h10l4 4v14H5Z M15 3v5h5M12 10v7m-3-3 3 3 3-3"/>',
    ajustes: '<path d="m12 3 2 3 4-.2.2 4 3 2-3 2 .2 4-4 .2-2 3-2-3-4 .2-.2-4-3-2 3-2-.2-4 4-.2Z"/><circle cx="12" cy="12" r="3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    profit: '<path d="M5 18 19 4M5 4h14v14"/>',
    distance: '<path d="M7 3 3 21M17 3l4 18M12 3v3M12 10v4M12 18v3"/>',
    news: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'
  };
  var text = {
    pt: { resumo:'Início', ganhos:'Ganhos diários', despesas:'Despesas', semana:'Semana', relatorio:'Relatórios', downloads:'Downloads', ajustes:'Ajustes', hello:'Bom dia', afternoon:'Boa tarde', evening:'Boa noite', record:'Adicionar registo', calendar:'Escolher data', tag:'Para Estafetas e Motoristas de App.', ganhosNote:'Cada percurso conta. Regista os teus rendimentos e acompanha o dia.', despesasNote:'As tuas despesas, sem perder nenhum detalhe.', semanaNote:'Sete dias. Uma visão clara dos teus resultados.', relatorioNote:'Os teus resultados, organizados e prontos a guardar.', downloadsNote:'Os teus resultados, organizados e prontos a descarregar.', ajustesNote:'O SmartSoma, à tua medida.', theme:'Modo escuro', profile:'Editar perfil', contact:'Contacto', help:'Perguntas frequentes', normal:'Normal', newPlatform:'Nova plataforma', manage:'Gerir plataformas', addIncome:'Adicionar rendimento' },
    en: { resumo:'Home', ganhos:'Daily earnings', despesas:'Expenses', semana:'Week', relatorio:'Reports', downloads:'Downloads', ajustes:'Settings', hello:'Good morning', afternoon:'Good afternoon', evening:'Good evening', record:'Add entry', calendar:'Choose date', tag:'For couriers and app drivers.', ganhosNote:'Every journey counts. Record your earnings and track your day.', despesasNote:'Your expenses, without missing a detail.', semanaNote:'Sete days. A clear view of your results.', relatorioNote:'Your results, organised and ready to save.', downloadsNote:'Your results, organised and ready to download.', ajustesNote:'SmartSoma, your way.', theme:'Dark mode', profile:'Edit profile', contact:'Contact', help:'Frequently asked questions', normal:'Normal', newPlatform:'New platform', manage:'Manage platforms', addIncome:'Add earnings' }
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
    var now = new Date(), selectedDate = window.GanhosDate ? GanhosDate.get() : now;
    var date = now;
    var locale = I18N.t('lang.code');
    var today=new Date();today.setHours(0,0,0,0);
    document.body.classList.remove('ui-showing-other-date');
    $('uiHeaderDate').textContent = date.toLocaleDateString(locale,{weekday:'long',day:'numeric',month:'long'}).replace(/-feira\b/i,'');
    var pageTitles = { semana:say('Minha Semana','My Week'), downloads:'Downloads', ajustes:say('Ajustes','Settings') };
    var name = $('sheetUsername').textContent.trim().split(' ')[0];
    var greeting = say('Olá','Hello');
    $('uiHeaderTitle').textContent = pageTitles[selected] || (greeting + ', ' + name + '.');
    document.body.dataset.uiRoute = route;
    document.body.classList.toggle('ui-home', route === 'resumo' && !inSettings);
    document.querySelectorAll('.ui-selected-date').forEach(function(n){ n.textContent = selectedDate.toLocaleDateString(locale,{day:'numeric',month:'long',year:'numeric'}); });
    $('uiAdd').setAttribute('aria-label',t('record'));
    $('uiThemeRow').setAttribute('aria-pressed',String(document.body.classList.contains('theme-dark')));
  }
  function shortHeaderDate(date){
    if(I18N.getLang()==='en')return date.toLocaleDateString(I18N.t('lang.code'),{weekday:'short',day:'numeric',month:'short'});
    var days=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    var months=['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'];
    return days[date.getDay()]+', '+date.getDate()+' de '+months[date.getMonth()];
  }
  function calendarHeaderTitle(date){
    if(I18N.getLang()==='en')return date.toLocaleDateString(I18N.t('lang.code'),{weekday:'short',day:'numeric',month:'short'}).replace(',', ' |');
    var days=['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.'];
    var months=['jan.','fev.','mar.','abr.','mai.','jun.','jul.','ago.','set.','out.','nov.','dez.'];
    return days[date.getDay()]+' | '+date.getDate()+' de '+months[date.getMonth()];
  }
  function resetRouteScroll(){
    var list=$('homeListView');
    if(list)list.scrollTop=0;
    window.scrollTo({top:0,left:0,behavior:'instant'});
  }
  function go(key) {
    if (key === 'default' || key === 'ganhos' || key === 'despesas') key = 'resumo';
    if (!returning && routeHistory[routeHistory.length - 1] !== key) routeHistory.push(key);
    document.body.classList.remove('ui-mobile-nav-hidden');
    if (window.SmartSomaSettings) window.SmartSomaSettings.close();
    if (key !== 'semana') calendarWeekSelection = false;
    resetRouteScroll();
    window.closeAllOverlays();
    var settingsPage=$('uiSettingsPage');
    if (key === 'ajustes') {
      if(settingsPage&&!settingsPage.hidden){route=key;syncHeader();return;}
      window.closeProfileSheetPublic();
      HomeNav.hideAllInstant();
      if($('metaSlotList'))$('metaSlotList').hidden=true;
      if(settingsPage)settingsPage.hidden=false;
      route=key;
      syncHeader();
      window.scrollTo({top:0,behavior:'instant'});
      return;
    }
    window.closeProfileSheetPublic();
    if(settingsPage)settingsPage.hidden=true;
    route = key;
    if($('metaSlotList'))$('metaSlotList').hidden = key !== 'resumo';
    HomeNav.goToSection(key);
    syncHeader();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function addModalCloseButtons(){
    document.querySelectorAll('.mm-card,.modal-card,.lpm-card').forEach(function(card){
      if(card.querySelector('.ui-modal-close'))return;
      var close=button('×',function(e){
        e.stopPropagation();
        var backdrop=card.closest('.mm-backdrop,.modal-backdrop');
        if(backdrop){
          backdrop.click();
          setTimeout(function(){if(backdrop.classList.contains('visible'))backdrop.classList.remove('visible');},0);
          return;
        }
        var languageModal=card.closest('#langPopupModal');
        if(languageModal)languageModal.classList.remove('is-open');
      },'ui-icon-button ui-modal-close');
      close.setAttribute('aria-label',say('Fechar','Close'));
      card.append(close);
    });
  }
  function start() {
    if (started || !window.SmartSomaAppReady) return;
    started = true;
    document.body.classList.add('ui-v2');
    document.documentElement.classList.add('ui-v2');
    addModalCloseButtons();
    var nav = create('aside', 'ui-sidebar', '<nav class="ui-navigation" aria-label="Menu principal"></nav><button type="button" class="ui-mobile-nav-brand" aria-label="Ir para Início"><img src="logopeq.png" alt="Smart Soma"></button>');
    $('appRoot').prepend(nav);
    nav.querySelector('.ui-mobile-nav-brand').addEventListener('click',function(){go('resumo');});
    function openSettingsProfile(){
      go('ajustes');
      if(window.SmartSomaSettings)window.SmartSomaSettings.open('sheetScreenDadosPessoais',say('Editar perfil','Edit profile'));
    }
    ['resumo','semana','downloads','ajustes'].forEach(function(key){
      var n=button('',function(){go(key);},'ui-nav-item');
      n.dataset.uiRoute=key; n.innerHTML=svg(key)+'<span class="ui-nav-short" aria-hidden="true"></span>'; nav.querySelector('nav').append(n);
    });
    var header=create('header','ui-header','<div class="ui-header-personal"><button type="button" id="uiHeaderAvatar" class="ui-header-avatar"></button><div class="ui-header-copy"><p id="uiHeaderDate" class="ui-eyebrow"></p><h1 id="uiHeaderTitle"></h1></div></div><div class="ui-header-actions"><button type="button" id="uiNews" class="ui-icon-button">'+svg('news')+'<span id="uiNewsBadge" class="ui-news-badge" hidden></span></button><button type="button" id="uiAdd" class="ui-add">'+svg('plus')+'</button></div>');
    $('appRoot').prepend(header);
    $('uiHeaderAvatar').addEventListener('click',openSettingsProfile);
    var headerAvatar=$('headerAvatarBtn');
    if(headerAvatar)headerAvatar.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();openSettingsProfile();},true);
    $('uiAdd').addEventListener('click',function(){window.closeProfileSheetPublic(); if(window.SmartSomaUI.openEntry) SmartSomaUI.openEntry(); else PlataformaModals.uber.open();});
    $('uiNews').setAttribute('aria-label',say('Novidades','News'));
    if(window.Capacitor&&window.Capacitor.isNativePlatform()) $('openTermosMenuBtn').target='_self';
    $('homeListPageSemana').prepend(heading('semana'));
    $('tamanhoOptionP').querySelector('.tamanho-option-letter').textContent='A';
    $('tamanhoOptionG').querySelector('.tamanho-option-letter').textContent='A';
    var theme=button('',function(){$('btnToggleTheme').click();syncHeader();},'sheet-action-btn');
    theme.id='uiThemeRow'; theme.innerHTML=svg('ajustes')+'<span data-ui-text="theme"></span>'; $('openTermosMenuBtn').before(theme);
    var viewControls=$('subHeaderViewToggleGroup');
    var filters=create('div','semana-filter-controls');
    var filterFields=create('div','semana-filter-fields');
    var weekModeDivider=create('span','semana-filter-divider');
    var viewModeLabels=create('span','semana-view-toggle-labels');
    var viewModeLabel=create('span','semana-view-toggle-active-label');
    var viewModeInactiveLabel=create('span','semana-view-toggle-inactive-label');
    var viewControlsRow=create('div','semana-view-controls');
    weekModeDivider.setAttribute('aria-hidden','true');
    viewModeLabel.id='semanaViewToggleActiveLabel';
    viewModeInactiveLabel.id='semanaViewToggleInactiveLabel';
    viewModeLabel.textContent='Lista';
    viewModeInactiveLabel.textContent='Tabela';
    filterFields.append($('semanaMonthPrev').parentNode,$('semanaWeekPicker').parentNode);
    viewModeLabels.append(viewModeLabel,viewModeInactiveLabel);
    viewControls.append(viewModeLabels);
    viewControlsRow.append(viewControls);
    filters.append(filterFields,weekModeDivider,viewControlsRow);
    $('semanaWeeksContainer').before(filters);
    var earningsTitle=$('semanaEarningsTitle'), earningsHeading=earningsTitle&&earningsTitle.parentElement, metricSlot=$('semanaMetricSlot');
    if(earningsTitle)earningsTitle.textContent=say('FATURAÇÃO','REVENUE');
    if(earningsHeading&&metricSlot){
      filters.after(earningsHeading);
      earningsHeading.after(metricSlot);
    }
    viewControls.hidden=false;
    var originalGo=HomeNav.goToSection;
    HomeNav.goToSection=function(key){ key=(key==='default'||key==='ganhos'||key==='despesas')?'resumo':key; if(!returning&&routeHistory[routeHistory.length-1]!==key)routeHistory.push(key); if(key!=='semana')calendarWeekSelection=false; route=key; if($('uiSettingsPage'))$('uiSettingsPage').hidden=true; originalGo(key==='downloads'?'relatorio':key); syncHeader(); };
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
    window.addEventListener('resize',syncHeader);
    setupStickyPeriodControls();
    setupStickyWeekFilters();
    document.addEventListener('languageChanged',function(){
      translate();syncHeader();
      requestAnimationFrame(refreshData);
      setTimeout(refreshData,160);
    });
    setupPages();
    setupNews();
    syncSidebarAccount();
    translate(); go('resumo');
    document.dispatchEvent(new CustomEvent('smartSomaUIReady'));
  }
  function setupStickyPeriodControls(){
    var controls=$('resumoPeriodControls'), header=document.querySelector('.ui-header');
    if(!controls||!header)return;
    function update(){
      var visible=!$('homeListPageResumo').hidden;
      controls.classList.toggle('is-sticky',visible&&controls.getBoundingClientRect().top<=header.getBoundingClientRect().bottom+.5);
    }
    window.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update,{passive:true});
    requestAnimationFrame(update);
  }
  function setupStickyWeekFilters(){
    var controls=document.querySelector('.semana-filter-controls'), header=document.querySelector('.ui-header');
    if(!controls||!header)return;
    var frame=0;
    function update(){
      frame=0;
      var visible=route==='semana'&&!$('homeListPageSemana').hidden;
      if(!visible){controls.classList.remove('is-sticky');return;}
      var top=controls.getBoundingClientRect().top,threshold=header.getBoundingClientRect().bottom;
      controls.classList.toggle('is-sticky',top<=threshold+1);
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(update);}
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    document.addEventListener('semanaPageShown',schedule);
    schedule();
  }
  function money(value) { return Number(value).toLocaleString(I18N.t('lang.code'),{style:'currency',currency:'EUR'}); }
  function syncSidebarAccount(){
    var name=$('sheetUsername').textContent.trim()||say('Utilizador','User');
    var source=document.querySelector('#sheetAvatar img');
    var avatar=$('uiHeaderAvatar');avatar.replaceChildren();avatar.setAttribute('aria-label',say('Abrir ajustes de ','Open settings for ')+name);if(source){var image=create('img');image.src=source.src;image.alt='';avatar.append(image);}else avatar.textContent=name.split(/\s+/).slice(0,2).map(function(part){return part[0]||'';}).join('').toUpperCase();
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
  function daysInSelectedWeek() {
    var monday=ResumoPeriod.getWeekRange(ResumoPeriod.getRefDate()).monday;
    return Array.from({length:7},function(_,i){var d=new Date(monday);d.setDate(monday.getDate()+i);return SmartSomaReadModel.day(d);});
  }
  function setupPages() {
    // Reposition existing elements, retaining their IDs, listeners and references.
    var summary=$('resumoLiveContent');
    var settingsPage=create('section','home-list-page');
    settingsPage.id='uiSettingsPage';settingsPage.hidden=true;
    var settingsContent=$('sheetScreenDefault').querySelector('.sheet-content');
    settingsPage.append(settingsContent);
    $('sheetScreenDefault').append(create('div','sheet-content ui-settings-placeholder'));
    document.querySelector('.home-list-inner').append(settingsPage);
    summary.prepend($('metaSlotList'));
    $('metaSlotList').after($('resumoPeriodControls'));
    var dashboard=create('div','ui-dashboard-bottom','<section class="home-card ui-chart-panel"><div class="ui-panel-head"><div><p class="ui-eyebrow" id="uiChartEyebrow"></p><h2 id="uiChartTitle"></h2></div><button type="button" id="uiChartDetails" class="ui-text-button"></button></div><div id="uiChart"></div></section><section class="home-card ui-overview-expenses"><div class="ui-panel-head"><h2 id="uiOverviewExpensesTitle"></h2><button type="button" id="uiOverviewFixed" class="ui-text-button"></button></div><div id="uiOverviewFixedGroup" hidden><p class="ui-expense-section-label" id="uiOverviewFixedLabel"></p><div id="uiOverviewFixedRows"></div></div><p class="ui-expense-section-label" id="uiOverviewDailyLabel"></p><div id="uiOverviewExpenseRows"></div><div class="ui-overview-expense-total"><span id="uiOverviewExpenseTotalLabel"></span><strong id="uiOverviewExpenseTotal"></strong></div></section>');
    summary.append(dashboard);
    $('uiChartDetails').addEventListener('click',function(){
      go('semana');
    });
    $('uiOverviewFixed').addEventListener('click',openFixedExpensesPage);
    var goal=create('div','ui-goal-progress','<div class="ui-goal-watermark" aria-hidden="true"><svg viewBox="0 0 240 240" focusable="false"><text x="120" y="178" text-anchor="middle">$</text></svg></div><div class="ui-goal-topline"><span class="ui-goal-tag" id="uiGoalTag"></span><button type="button" id="uiGoalEdit" class="ui-goal-edit"></button><span id="uiGoalPeriod"></span></div><div class="ui-goal-grid"><div class="ui-goal-copy"><h2 id="uiGoalTitle"></h2><p id="uiGoalCopy"></p><div class="ui-goal-actions" hidden><button type="button" id="uiGoalGross"></button><button type="button" id="uiGoalNet"></button></div></div><div class="ui-goal-number"><span id="uiGoalProgressLabel"></span><strong id="uiGoalPercent"></strong><small id="uiGoalAmounts"></small><small id="uiGoalType"></small></div></div><div class="ui-progress-wrap"><div class="ui-progress-track" id="uiGoalTrack" role="progressbar" aria-valuemin="0" aria-valuemax="100"><div id="uiGoalFill"></div></div><div id="uiGoalDays" class="ui-goal-days"></div></div>');
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
    metrics.after(dashboard);
    setupEntry(); setupSettings();
    var refreshQueued=false;
    function schedule(){if(refreshQueued)return;refreshQueued=true;queueMicrotask(function(){refreshQueued=false;refreshData();});}
    ['homeBadgesSaved','plataformasChanged','despesasFixasChanged','metaSemanalConfigChanged','languageChanged','cloudCacheReady','resumoPeriodChanged'].forEach(function(name){document.addEventListener(name,schedule);});
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
      n.append(date,label,value);
      if(row.id!==undefined&&row.id!==null){
        var remove=button('×',function(){window.DespesasDiarias.openDeleteConfirm(row.id,row.label,row.date);},'ui-expense-delete');
        remove.setAttribute('aria-label',say('Excluir despesa: ','Delete expense: ')+row.label);
        n.append(remove);
      }
      target.append(n);
    });
  }
  function records(days){
    var names=platforms();var result=[];
    days.slice().reverse().forEach(function(d){
      names.forEach(function(p){var value=p.id==='uber'?d.uber:p.id==='bolt'?d.bolt:d.platforms[p.id]||0;if(value)result.push({date:d.date,label:p.nome,value:value});});
      d.entries.forEach(function(e){result.push({date:d.date,label:e.descricao,value:e.valor,expense:true});});
    });return result;
  }
  var dayChartView='platforms';
  function refreshData(){
    var day=SmartSomaReadModel.day(ResumoPeriod.getRefDate());
    var period=document.querySelector('.period-chip.selected').dataset.period;
    $('uiChartTitle').textContent=say('O teu ritmo','Your rhythm');
    $('uiChartEyebrow').textContent=period==='dia'?say('DIA EM MOVIMENTO','DAY IN MOTION'):period==='mes'?say('MÊS EM MOVIMENTO','MONTH IN MOTION'):say('SEMANA EM MOVIMENTO','WEEK IN MOTION');
    $('uiChartDetails').textContent=say('Ver semana completa →','View full week →');
    $('uiChartDetails').hidden=period!=='semana';
    $('uiOverviewExpensesTitle').textContent=say('Despesas','Expenses');$('uiOverviewFixed').textContent=say('Configurar','Configure');$('uiOverviewFixedLabel').textContent=say('DESPESAS FIXAS','FIXED EXPENSES');$('uiOverviewDailyLabel').textContent=say('DESPESAS DO PERÍODO','PERIOD EXPENSES');$('uiOverviewExpenseTotalLabel').textContent=say('Total de despesas no período','Total expenses in period');
    var days=daysInPeriod();renderOverviewExpenses(days);
    if(period==='dia')renderDayChart(day);else if(period==='mes')renderMonthChart(days);else renderChart(daysInSelectedWeek());
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
    if(cfg&&pct<100){var remaining=create('strong');remaining.textContent=money(Math.max(0,cfg.valor-goalWeek.achieved));$('uiGoalCopy').append(say('Faltam ','Remaining '),remaining,say(' para atingir a meta semanal.',' to reach the weekly goal.'));}
    else $('uiGoalCopy').textContent=cfg?say('Objetivo cumprido. Cada percurso contou.','Goal achieved. Every journey counted.'):say('Define uma meta em bruto ou líquido e acompanha o teu progresso.','Set a gross or net goal and follow your progress.');
    $('uiGoalGross').textContent=say('Bruto','Gross');$('uiGoalNet').textContent=say('Líquido','Net');
    $('uiGoalGross').setAttribute('aria-pressed',String(!cfg||cfg.tipo==='bruto'));
    $('uiGoalNet').setAttribute('aria-pressed',String(!!cfg&&cfg.tipo==='liquido'));
    $('uiGoalGross').disabled=$('uiGoalNet').disabled=!goalWeek.current;
    $('uiGoalEdit').textContent=goalWeek.current?(cfg?say('Editar meta ↗','Edit goal ↗'):say('Definir meta ↗','Set goal ↗')):say('Consultar meta ↗','View goal ↗');
    $('uiGoalProgressLabel').textContent=say('Progresso','Progress');
    $('uiGoalPercent').textContent=cfg?pct+'%':'—';
    $('uiGoalAmounts').textContent=cfg?money(goalWeek.achieved)+say(' de ',' of ')+money(cfg.valor):say('Meta por definir','No goal set');
    $('uiGoalType').textContent=cfg?say('Concluído','Completed'):say('Meta por definir','No goal set');
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
    var target=$('uiChart'),rhythm=create('div','ui-rhythm-chart'),maxGross=Math.max.apply(null,days.map(function(d){return d.gross;}).concat([0]));
    var legend=create('div','ui-rhythm-legend');
    [["expense",say('Despesas','Expenses')],["net",say('Lucro líquido','Net profit')],["gross",say('Ganhos brutos','Gross earnings')]].forEach(function(item){var entry=create('span','ui-rhythm-legend-item');entry.append(create('i','ui-rhythm-legend-dot '+item[0]),document.createTextNode(item[1]));legend.append(entry);});
    rhythm.setAttribute('role','list');rhythm.setAttribute('aria-label',say('Ritmo semanal','Weekly rhythm'));
    var weekdayLabels=I18N.list('weekday.abbr')||[],weekdayFull=I18N.list('weekday.full')||[],today=new Date();today.setHours(0,0,0,0);
    days.forEach(function(d){
      var index=(d.date.getDay()+6)%7,weekdayLabel=weekdayLabels[index]||shortDate(d.date),scale=maxGross?Math.min(100,d.gross/maxGross*100):0,expenseScale=maxGross?Math.min(100,d.expenses/maxGross*100):0,netScale=d.gross?Math.max(0,Math.min(100,d.net/d.gross*100)):0;
      var row=create('div','ui-rhythm-row'+(d.date.getTime()===today.getTime()?' is-today':''));row.setAttribute('role','listitem');
      row.setAttribute('aria-label',(weekdayFull[index]||weekdayLabel)+': '+money(d.expenses)+say(' em despesas, ',' in expenses, ')+money(d.net)+say(' líquido e ',' net and ')+money(d.gross)+say(' brutos',' gross'));
      var label=create('span','ui-rhythm-day-label');label.textContent=weekdayLabel;
      var expenseRail=create('span','ui-rhythm-expense-rail'),expenseBar=create('span','ui-rhythm-expense-bar');expenseBar.style.width=expenseScale+'%';expenseRail.append(expenseBar);
      var zero=create('span','ui-rhythm-zero');
      var incomeRail=create('span','ui-rhythm-income-rail'),incomeBar=create('span','ui-rhythm-income-bar'),netBar=create('span','ui-rhythm-net'),grossBar=create('span','ui-rhythm-gross');incomeBar.style.width=scale+'%';netBar.style.flexBasis=netScale+'%';incomeBar.append(netBar,grossBar);incomeRail.append(incomeBar);
      row.append(label,expenseRail,zero,incomeRail);rhythm.append(row);
    });
    var best=days.reduce(function(result,d){return d.gross>result.gross?d:result;},{gross:0}),bestDay='';
    if(best.date){var bestIndex=(best.date.getDay()+6)%7;bestDay=weekdayFull[bestIndex]||weekdayLabels[bestIndex]||shortDate(best.date);}
    var highlight=create('p','ui-rhythm-highlight');highlight.textContent=best.gross>0?'⭐ '+say('Melhor dia: ','Best day: ')+bestDay+', '+money(best.gross)+say(' brutos',' gross'):say('Ainda não há ganhos registados nesta semana.','No earnings recorded this week yet.');
    target.replaceChildren(legend,rhythm,highlight);
  }
  function renderDayChart(day){
    var target=$('uiChart'),tabs=create('div','ui-chart-tabs'),platformTab=button(say('Por plataforma','By platform'),function(){dayChartView='platforms';renderDayChart(day);},'ui-chart-tab'),balanceTab=button(say('Balanço do dia','Daily balance'),function(){dayChartView='balance';renderDayChart(day);},'ui-chart-tab');
    platformTab.classList.toggle('is-active',dayChartView==='platforms');balanceTab.classList.toggle('is-active',dayChartView==='balance');platformTab.setAttribute('aria-pressed',String(dayChartView==='platforms'));balanceTab.setAttribute('aria-pressed',String(dayChartView==='balance'));tabs.append(platformTab,balanceTab);
    if(dayChartView==='balance'){
      var balanceValues=[{name:say('Ganhos brutos','Gross earnings'),value:day.gross,color:'#176c47'},{name:say('Despesas','Expenses'),value:day.expenses,color:'#db756a'},{name:say('Lucro líquido','Net profit'),value:Math.abs(day.net),color:'#d4f53c'}],balanceTotal=balanceValues.reduce(function(sum,item){return sum+item.value;},0),balanceOffset=0,balanceStops=balanceValues.map(function(item){var end=balanceTotal?balanceOffset+item.value/balanceTotal*100:100,stop=item.color+' '+balanceOffset+'% '+end+'%';balanceOffset=end;return stop;}),balanceDonut=create('div','ui-day-donut'),balanceCenter=create('div','ui-day-donut-center ui-day-donut-net');balanceDonut.style.background=balanceTotal?'conic-gradient('+balanceStops.join(',')+')':'var(--card-line)';balanceCenter.innerHTML='<strong>'+money(day.net)+'</strong><span>'+say('Lucro líquido','Net profit')+'</span>';balanceDonut.append(balanceCenter);var balanceLegend=create('div','ui-day-donut-legend');balanceValues.forEach(function(item){var row=create('div','ui-day-donut-item'),dot=create('i'),label=create('span'),value=create('strong');dot.style.background=item.color;label.textContent=item.name;value.textContent=money(item.value);row.append(dot,label,value);balanceLegend.append(row);});target.replaceChildren(tabs,balanceDonut,balanceLegend);return;
    }
    var values=platforms().map(function(p){return{name:p.nome,value:p.id==='uber'?day.uber:p.id==='bolt'?day.bolt:(day.platforms||{})[p.id]||0};}).filter(function(item){return item.value>0;});if(day.expenses>0)values.push({name:say('Despesas','Expenses'),value:day.expenses,expense:true});
    var total=values.reduce(function(sum,item){return sum+item.value;},0),colors=['#d4f53c','#176c47','#6f9f75','#a8dd42','#db756a'],offset=0,stops=values.map(function(item,index){var end=total?offset+item.value/total*100:100,stop=colors[index%colors.length]+' '+offset+'% '+end+'%';offset=end;return stop;});
    var donut=create('div','ui-day-donut');donut.style.background=total?'conic-gradient('+stops.join(',')+')':'var(--card-line)';var center=create('div','ui-day-donut-center');center.innerHTML='<strong>'+money(day.gross)+'</strong><span>'+say('Total do dia','Day total')+'</span>';donut.append(center);
    var legend=create('div','ui-day-donut-legend');if(values.length)values.forEach(function(item,index){var row=create('div','ui-day-donut-item'),dot=create('i'),label=create('span'),percent=create('strong');dot.style.background=colors[index%colors.length];label.textContent=item.name;percent.textContent=(item.value/total*100).toLocaleString(I18N.t('lang.code'),{maximumFractionDigits:0})+'%';row.append(dot,label,percent);legend.append(row);});else legend.append(create('p','ui-empty',say('Ainda não há registos neste dia.','There are no entries for this day yet.')));
    target.replaceChildren(tabs,donut,legend);
  }
  function renderMonthChart(days){
    var target=$('uiChart'),weeks=[];days.forEach(function(day){var index=Math.floor((day.date.getDate()-1)/7);if(!weeks[index])weeks[index]={gross:0};weeks[index].gross+=day.gross;});if(!weeks.length)weeks=[{gross:0}];
    var max=Math.max.apply(null,weeks.map(function(week){return week.gross;}).concat([0])),chart=create('div','ui-month-chart');weeks.forEach(function(week,index){var bar=create('div','ui-month-bar'),fill=create('i'),label=create('span');fill.style.height=(max?Math.max(4,week.gross/max*100):4)+'%';fill.title=money(week.gross);label.textContent=say('Semana ','Week ')+(index+1);bar.append(fill,label);chart.append(bar);});
    var best=weeks.reduce(function(result,week,index){return week.gross>result.gross?{gross:week.gross,index:index}:result;},{gross:0,index:0}),highlight=create('p','ui-rhythm-highlight');highlight.textContent=best.gross>0?'⭐ '+say('Melhor semana: Semana ','Best week: Week ')+(best.index+1)+say(' foi a tua mais lucrativa: ',' was your most profitable: ')+money(best.gross):say('Ainda não há ganhos registados neste mês.','No earnings recorded this month yet.');target.replaceChildren(chart,highlight);
  }
  function openFixedExpensesPage(){
    if(window.SmartSomaUI)window.SmartSomaUI.go('ajustes');
    window.setTimeout(function(){
      if(window.SmartSomaSettings)window.SmartSomaSettings.open('sheetScreenDespesasFixas',say('Despesas fixas','Fixed expenses'));
    },160);
  }
  function renderOverviewExpenses(days){
    var fixedSource=$('despesaFixaLembreteEl');
    var fixedRows=fixedSource?Array.from(fixedSource.querySelectorAll('.despesa-card')).map(function(card){return{label:(card.querySelector('.despesa-card-desc')||{}).textContent||'',detail:(card.querySelector('.despesa-card-sub')||{}).textContent||''};}):[];
    $('uiOverviewFixedGroup').hidden=!fixedRows.length;$('uiOverviewFixedRows').replaceChildren();
    fixedRows.forEach(function(row){var item=create('div','ui-overview-expense-row ui-fixed-expense-row'),label=create('span'),detail=create('small');label.textContent=row.label;detail.textContent=row.detail;item.append(label,detail);$('uiOverviewFixedRows').append(item);});
    var dailyEntries=[];
    days.slice().reverse().forEach(function(day){
      try {
        var saved=window.cloudGet&&window.cloudGet('despesasDiarias:'+day.key),items=saved&&JSON.parse(saved).items||[];
        items.forEach(function(entry){dailyEntries.push({id:entry.id,date:day.date,label:entry.descricao,value:Number(entry.valor)||0,expense:true});});
      } catch(e) {}
    });
    tableRows($('uiOverviewExpenseRows'),dailyEntries);
    $('uiOverviewExpenseTotal').textContent=money(days.reduce(function(total,day){return total+day.expenses;},0));
  }
  function setupNews(){
    var notice=window.SmartSomaNewsNotice;
    if(!notice||!notice.id||!notice.title||!notice.text)return;
    var storageKey='smartsoma:news:archive';
    var archive=[];
    try { archive=JSON.parse(localStorage.getItem(storageKey)||'[]');if(!Array.isArray(archive))archive=[]; } catch(e) { archive=[]; }
    var modal=create('div','ui-news-backdrop','<section class="ui-news-card" role="dialog" aria-modal="true" aria-labelledby="uiNewsTitle"><div class="ui-panel-head"><h2 id="uiNewsTitle"></h2><button type="button" id="uiNewsClose" class="ui-icon-button" aria-label="Fechar">×</button></div><div class="ui-news-divider"></div><div class="ui-news-tabs"><button type="button" id="uiNewsNew"></button><button type="button" id="uiNewsArchive"></button></div><div id="uiNewsContent" class="ui-news-content"></div></section>');
    var popup=create('div','ui-news-popup','<strong id="uiNewsPopupTitle"></strong><p id="uiNewsPopupText"></p><div><button type="button" id="uiNewsPopupClose" class="ui-button ui-secondary"></button><button type="button" id="uiNewsPopupRead" class="ui-button"></button></div>');
    var activeTab='new',readingNotice=null;
    document.body.append(modal,popup);
    function save(){try{localStorage.setItem(storageKey,JSON.stringify(archive));}catch(e){}}
    function isArchived(id){return archive.some(function(item){return item.id===id;});}
    function archiveNotice(){if(isArchived(notice.id))return;archive.unshift({id:notice.id,title:notice.title,text:notice.text,sentAt:notice.sentAt,readAt:new Date().toISOString()});save();}
    function newItems(){return isArchived(notice.id)?[]:[notice];}
    function messageDate(item){var date=new Date(item.sentAt||item.readAt);if(isNaN(date.getTime()))return '';return String(date.getDate()).padStart(2,'0')+'/'+String(date.getMonth()+1).padStart(2,'0')+'/'+date.getFullYear();}
    function updateBadge(){var unread=newItems().length,badge=$('uiNewsBadge');badge.hidden=!unread;badge.textContent=unread||'';}
    function render(){
      var items=activeTab==='new'?(readingNotice?[readingNotice]:newItems()):archive;
      $('uiNewsTitle').textContent=say('Novidades','News');
      $('uiNewsNew').classList.toggle('is-active',activeTab==='new');$('uiNewsArchive').classList.toggle('is-active',activeTab==='archive');
      $('uiNewsNew').textContent=say('Novas','New');$('uiNewsArchive').textContent=say('Arquivo','Archive');
      updateBadge();
      $('uiNewsContent').replaceChildren();
      if(!items.length){var empty=create('p','ui-news-empty');empty.textContent=activeTab==='new'?say('Não há novidades por ler.','There are no unread updates.'):say('O arquivo ainda está vazio.','The archive is empty.');$('uiNewsContent').append(empty);return;}
      items.forEach(function(item){var article=create('article','ui-news-item'+(item.id===notice.id&&activeTab==='new'?' is-highlighted':''));var title=create('h3');var date=create('small','ui-news-date');var text=create('p');title.textContent=item.title;date.textContent=messageDate(item);text.textContent=item.text;article.append(title,date,text);$('uiNewsContent').append(article);});
    }
    function open(tab,markAsRead){activeTab=tab||'new';readingNotice=null;if(markAsRead&&!isArchived(notice.id)){readingNotice=notice;archiveNotice();}render();modal.classList.add('visible');}
    function close(){modal.classList.remove('visible');readingNotice=null;render();}
    function closePopup(){popup.classList.remove('visible');}
    $('uiNews').addEventListener('click',function(){closePopup();open('new',true);});
    $('uiNewsClose').addEventListener('click',close);modal.addEventListener('click',function(e){if(e.target===modal)close();});
    $('uiNewsNew').addEventListener('click',function(){activeTab='new';render();});$('uiNewsArchive').addEventListener('click',function(){activeTab='archive';render();});
    $('uiNewsPopupClose').addEventListener('click',closePopup);$('uiNewsPopupRead').addEventListener('click',function(){closePopup();open('new',true);});
    $('uiNewsPopupTitle').textContent=say('Nova mensagem','New message');$('uiNewsPopupText').textContent=notice.title;
    $('uiNewsPopupClose').textContent=say('Fechar','Close');$('uiNewsPopupRead').textContent=say('Ler','Read');
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(modal.classList.contains('visible'))close();else closePopup();}});
    updateBadge();
    if(!isArchived(notice.id))window.setTimeout(function(){popup.classList.add('visible');},900);
  }
  var entryMode='income',entryScreen='home',chosen=null,entryReturnFocus=null,restoreKmComponent=function(){},mountKmComponent=function(){};
  function setupEntry(){
    var dialog=create('dialog','ui-entry-dialog','<form id="uiEntryForm"><div class="ui-panel-head"><h2 id="uiEntryTitle"></h2><button type="button" id="uiEntryClose" class="ui-icon-button" aria-label="Fechar">×</button></div><p class="ui-entry-section-label">Data:</p><button type="button" id="uiEntryDate" class="ui-entry-date-selector" aria-haspopup="dialog"></button><p id="uiEntryTypeLabel" class="ui-entry-section-label">Tipo:</p><div class="ui-entry-tabs" id="uiEntryTabs"><button type="button" id="uiEntryIncome"></button><button type="button" id="uiEntryExpense"></button><button type="button" id="uiEntryKm">KM</button></div><div id="uiEntryHomeContent"><p id="uiPlatformHint" class="ui-platform-hint"></p><div class="ui-platform-selector" id="uiPlatformSelector"><div id="uiPlatformChoices" class="ui-platform-choices"></div></div></div><div id="uiEntryFormContent" hidden><label id="uiEntryDescriptionLabel"><span id="uiDescriptionLabel"></span><input id="uiEntryDescription" maxlength="60"></label><label><span id="uiValueLabel"></span><div class="ui-entry-amount"><span>€</span><input id="uiEntryValue" inputmode="decimal" autocomplete="off" required aria-label="Valor" placeholder="0,00"></div></label><p id="uiEntryHint" class="ui-muted" aria-live="polite"></p><p id="uiEntryError" class="ui-error" role="alert"></p><button type="submit" id="uiEntrySave" class="ui-button"></button></div><div id="uiEntryKmContent" hidden></div></form>');
    var backdrop=create('div','ui-entry-backdrop');dialog.id='uiEntryDialog';dialog.setAttribute('aria-labelledby','uiEntryTitle');document.body.append(backdrop,dialog);
    var retro=create('div','ui-entry-retro-backdrop','<section class="ui-entry-retro-card" role="dialog" aria-modal="true" aria-labelledby="uiEntryRetroTitle"><div class="ui-panel-head"><h2 id="uiEntryRetroTitle"></h2><button type="button" id="uiEntryRetroClose" class="ui-icon-button" aria-label="Fechar">×</button></div><p id="uiEntryRetroCopy"></p><div class="ui-entry-retro-actions"><button type="button" id="uiEntryRetroCancel" class="ui-button ui-secondary"></button><button type="button" id="uiEntryRetroConfirm" class="ui-button"></button></div></section>');
    var pendingEntry=null;document.body.append(retro);
    var distanceCard=$('distanciaModalCard'),kmContent=$('uiEntryKmContent');
    var kmNodes=distanceCard?['.distancia-mode-row','#distanciaModoHelperText','#distanciaTotalForm','#distanciaInicioFimForm','#distanciaSalvarBtn'].map(function(selector){return distanceCard.querySelector(selector);}):[];
    restoreKmComponent=function(){
      if(!distanceCard)return;
      kmNodes.forEach(function(node){if(node)distanceCard.append(node);});
      kmContent.hidden=true;
      var save=$('distanciaSalvarBtn');if(save)save.textContent=I18N.t('app.save');
    };
    mountKmComponent=function(){
      kmNodes.forEach(function(node){if(node)kmContent.append(node);});
      kmContent.hidden=false;
      if(window.DistanciaModo)window.DistanciaModo.restore();
      $('distanciaSalvarBtn').textContent=say('Guardar','Save');
    };
    $('uiEntryClose').addEventListener('click',function(){if(entryScreen==='home')dialog.close();else{entryMode='income';entryScreen='home';chosen=null;renderEntry();}});
    backdrop.addEventListener('click',function(){dialog.close();});
    dialog.addEventListener('close',function(){restoreKmComponent();backdrop.classList.remove('visible');if(entryReturnFocus)entryReturnFocus.focus();});
    $('uiEntryDate').addEventListener('click',function(){GanhosDate.open();});
    function closeRetro(){pendingEntry=null;retro.classList.remove('visible');}
    $('uiEntryRetroClose').addEventListener('click',closeRetro);
    $('uiEntryRetroCancel').addEventListener('click',closeRetro);
    retro.addEventListener('click',function(e){if(e.target===retro)closeRetro();});
    $('uiEntryIncome').addEventListener('click',function(){entryMode='income';entryScreen='home';chosen=null;renderEntry();});
    $('uiEntryExpense').addEventListener('click',function(){entryMode='expense';entryScreen='expense';chosen=null;renderEntry();});
    $('uiEntryKm').addEventListener('click',function(){entryMode='km';entryScreen='km';chosen=null;renderEntry();});
    $('distanciaSalvarBtn').addEventListener('click',function(){if(entryMode==='km'){dialog.close();refreshData();}});
    function commitEntry(value,desc){
      if(window.SmartSomaPro && !SmartSomaPro.isPro){dialog.close();if(window.abrirModalSubExpirada)abrirModalSubExpirada();return;}
      if(entryMode==='income'){
        if(chosen.id==='uber'||chosen.id==='bolt'){
          $(chosen.id+'ValorInput').value=String(value);$(chosen.id+'SalvarBtn').click();
        }else{HomeBadges.setPlat(chosen.id,value);}
      }else{
        $('despesasSemanaDescInput').value=desc;$('despesasSemanaValorInput').value=String(value);$('despesasSemanaSalvarBtn').click();
      }
      dialog.close();refreshData();
    }
    $('uiEntryRetroConfirm').addEventListener('click',function(){if(!pendingEntry)return;var entry=pendingEntry;closeRetro();commitEntry(entry.value,entry.desc);});
    $('uiEntryForm').addEventListener('submit',function(e){
      e.preventDefault();
      var value=Number($('uiEntryValue').value.trim().replace(',','.'));
      if(!Number.isFinite(value)||value<0||value>999.99||!$('uiEntryValue').value.trim()||(entryMode==='expense'&&value===0)){$('uiEntryError').textContent=say('Insere um valor válido até 999,99 €.','Enter a valid amount up to €999.99.');return;}
      if(entryMode==='income'){
        if(!chosen){$('uiEntryError').textContent=say('Seleciona uma plataforma.','Select a platform.');return;}
      }else{
        var desc=$('uiEntryDescription').value.trim();
        if(!desc){$('uiEntryError').textContent=say('Adiciona uma descrição.','Add a description.');return;}
      }
      var selected=GanhosDate.get(),today=new Date();today.setHours(0,0,0,0);
      if(selected.getTime()<today.getTime()){
        pendingEntry={value:value,desc:entryMode==='expense'?desc:''};
        $('uiEntryRetroTitle').textContent=say('Confirmar lançamento retroativo','Confirm backdated entry');
        $('uiEntryRetroCopy').textContent=say('Atenção: Está a registar esta informação numa data passada ('+GanhosDate.formatLabel(selected)+'). Deseja confirmar o lançamento retroativo?','Attention: you are recording this information on a past date ('+GanhosDate.formatLabel(selected)+'). Do you want to confirm the backdated entry?');
        $('uiEntryRetroCancel').textContent=say('Voltar','Back');$('uiEntryRetroConfirm').textContent=say('Confirmar','Confirm');retro.classList.add('visible');return;
      }
      commitEntry(value,entryMode==='expense'?desc:'');
    });
    GanhosDate.onChange(function(){if(dialog.open)renderEntry();});
    SmartSomaUI.openEntry=openEntry;
  }
  function openEntry(mode){
    window.closeAllOverlays();window.closeProfileSheetPublic();entryReturnFocus=document.activeElement;
    GanhosDate.set(new Date());
    entryMode=mode||'income';entryScreen=mode==='expense'?'expense':mode==='km'?'km':'home';chosen=null;$('uiEntryValue').value='';$('uiEntryDescription').value='';renderEntry();
    var entryDialog=$('uiEntryDialog');entryDialog.previousElementSibling.classList.add('visible');
    if(typeof entryDialog.show==='function')entryDialog.show();else entryDialog.showModal();
  }
  function renderEntry(){
    var income=entryMode==='income',km=entryMode==='km',home=entryScreen==='home',incomeForm=entryScreen==='income';
    var title=$('uiEntryTitle');title.replaceChildren();
    if(incomeForm&&chosen){
      title.classList.add('ui-entry-title-with-icon');
      if(chosen.img&&(chosen.id==='uber'||chosen.id==='bolt'||SmartSomaSecurity.isSafeImageUrl(chosen.img))){var image=create('img','ui-entry-title-icon');image.src=chosen.img;image.alt='';title.append(image);}
      var titleText=create('span');titleText.textContent=say('Ganhos ','Earnings ')+chosen.nome;title.append(titleText);
    }else{title.classList.remove('ui-entry-title-with-icon');title.textContent=home?t('record'):entryScreen==='expense'?say('Nova Despesa','New expense'):say('Registrar KM','Record KM');}
    var selected=GanhosDate.get(),today=new Date();today.setHours(0,0,0,0);selected=new Date(selected);selected.setHours(0,0,0,0);
    $('uiEntryDate').innerHTML=svg('semana')+'<span>'+(selected.getTime()===today.getTime()?say('HOJE','TODAY'):GanhosDate.formatLabel(selected))+'</span>';
    $('uiEntryDate').classList.toggle('is-past-date',selected.getTime()<today.getTime());
    $('uiPlatformHint').textContent=say('Selecione a plataforma:','Select a platform:');
    $('uiEntryIncome').textContent=say('Ganhos','Earnings');$('uiEntryExpense').textContent=t('despesas');
    $('uiEntryIncome').setAttribute('aria-pressed',String(income));$('uiEntryExpense').setAttribute('aria-pressed',String(entryMode==='expense'));$('uiEntryKm').setAttribute('aria-pressed',String(km));
    $('uiEntryTypeLabel').hidden=!home;$('uiEntryTabs').hidden=!home;$('uiEntryHomeContent').hidden=!home;$('uiEntryFormContent').hidden=home||km;
    $('uiEntryClose').innerHTML=home?'×':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg>';$('uiEntryClose').setAttribute('aria-label',home?say('Fechar','Close'):say('Voltar','Back'));
    if(km){mountKmComponent();return;}
    restoreKmComponent();
    if(home){
      $('uiPlatformChoices').replaceChildren();
      platforms().forEach(function(p){var n=button('',function(){chosen=p;entryMode='income';entryScreen='income';$('uiEntryValue').value=String(p.id==='uber'||p.id==='bolt'?HomeBadges.get()[p.id]||'':HomeBadges.getPlat(p.id)||'');renderEntry();},'ui-platform-choice');n.setAttribute('aria-label',p.nome);n.dataset.platform=p.id;var avatar=create('span','ui-platform-choice-avatar');if(p.img && (p.id==='uber'||p.id==='bolt'||SmartSomaSecurity.isSafeImageUrl(p.img))){var image=create('img');image.src=p.img;image.alt='';avatar.append(image);}else avatar.textContent=p.nome.slice(0,2).toUpperCase();var label=create('span','ui-platform-choice-label');label.textContent=p.nome;n.append(avatar,label);$('uiPlatformChoices').append(n);});
      return;
    }
    $('uiEntryDescriptionLabel').hidden=income;$('uiEntryDescription').required=!income;
    $('uiDescriptionLabel').textContent=say('Descrição','Description');$('uiValueLabel').textContent=say('Valor','Amount');
    $('uiEntrySave').textContent=say('Guardar','Save');$('uiEntryError').textContent='';
    $('uiEntryHint').textContent=income?(chosen?say('Total do dia na '+chosen.nome,'Daily total on '+chosen.nome):say('Total do dia','Daily total')):say('A despesa será guardada na data selecionada.','The expense will be saved for the selected date.');
    if(income&&chosen&&Number($('uiEntryValue').value)>0)$('uiEntryHint').textContent=say('Já existe um registo. Guardar substitui o total deste dia.','An entry exists. Saving replaces this day’s total.');
  }
  function setupSettings(){
    var profileLabel=$('openDadosPessoaisBtn').querySelector('span');profileLabel.removeAttribute('data-i18n');profileLabel.removeAttribute('data-ui-text');profileLabel.textContent='Editar';
    var helpLabel=$('openAjudaBtn').querySelector('span');helpLabel.removeAttribute('data-i18n');helpLabel.dataset.uiText='help';
    var settings=$('uiSettingsPage').querySelector('.sheet-content');
    var columns=create('div','ui-settings-columns');
    var management=create('div','sheet-actions ui-settings-group');
    var preferences=create('div','sheet-actions ui-settings-group');
    management.dataset.title=say('Gestão','Management');
    preferences.dataset.title=say('Preferências','Preferences');
    ['openDespesasFixasBtn','openMultiplataformaBtn'].forEach(function(id){management.append($(id));});
    ['openIdiomaBtn','openTamanhoBtn','uiThemeRow'].forEach(function(id){preferences.append($(id));});
    columns.append(management,preferences);
    var profileCard=settings.querySelector('.sheet-profile-row');
    profileCard.append($('sheetProActiveBadge'),$('openDadosPessoaisBtn'));
    function syncProfileBackground(){
      var profileImage=profileCard.querySelector('.sheet-avatar img');
      var source=profileImage&&(profileImage.currentSrc||profileImage.src);
      profileCard.style.setProperty('--profile-photo',source?'url("'+source.replace(/"/g,'\\"')+'")':'none');
      profileCard.classList.toggle('has-profile-photo',!!source);
    }
    syncProfileBackground();
    new MutationObserver(syncProfileBackground).observe($('sheetAvatar'),{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
    profileCard.after(columns);
    var support=$('openApagarDadosBtn').closest('.sheet-actions');
    if(support) support.dataset.title=say('Conta e suporte','Account and support');
    var contact=button('',null,'sheet-action-btn');contact.id='openContactoBtn';
    contact.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg><span data-ui-text="contact"></span>';
    support.prepend(contact,$('openAjudaBtn'));
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
    $('sheetScreenContacto').querySelector('.sheet-content').innerHTML='<section class="ui-help-hero"><p class="ui-eyebrow">SMARTSOMA</p><h2 id="uiHelpTitle"></h2><a href="mailto:contacto@smartsoma.pt">contacto@smartsoma.pt</a><p>Lisboa, Portugal</p></section>';
    help.innerHTML='<section class="home-card ui-faq"><h2 id="uiFaqTitle">FAQ</h2><div id="uiFaqItems"></div></section>';

    /* Subpáginas de Ajustes: reaproveitam os ecrãs e a lógica existente,
       mas deixam de abrir o painel/modal legado. */
    var settingsPage=$('uiSettingsPage');
    var subpage=create('section','ui-settings-subpage');
    var subpageHead=create('div','ui-settings-subpage-head');
    var back=button('',function(){closeSettingsSubpage();},'ui-settings-back');
    back.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span></span>';
    var subpageTitle=create('h2','');
    var subpageBody=create('div','ui-settings-subpage-body');
    subpageHead.append(back,subpageTitle);subpage.append(subpageHead,subpageBody);subpage.hidden=true;settingsPage.append(subpage);
    var activeContent=null,activeScreen=null,settingsHistory=[];
    function closeSettingsSubpage(preserveHistory){
      if(activeContent&&activeScreen){activeScreen.append(activeContent);activeScreen.hidden=true;activeScreen.classList.remove('is-active');}
      activeContent=null;activeScreen=null;subpageBody.replaceChildren();subpage.hidden=true;settings.hidden=false;window.scrollTo({top:0,behavior:'instant'});
      if(!preserveHistory)settingsHistory=[];
    }
    function openSettingsSubpage(screenId,title,restoring){
      var screen=$(screenId),content=screen&&screen.querySelector('.sheet-content');
      if(!content)return;
      if(activeContent&&activeContent!==content)closeSettingsSubpage(true);
      if(!restoring&&(!settingsHistory.length||settingsHistory[settingsHistory.length-1].id!==screenId))settingsHistory.push({id:screenId,title:title});
      if(screenId==='sheetScreenIdioma'&&window.IdiomaScreen)window.IdiomaScreen.prepare();
      if(screenId==='sheetScreenTamanho'&&window.TamanhoScreen)window.TamanhoScreen.prepare();
      if(screenId==='sheetScreenMultiplataforma'&&window.Multiplataformas)window.Multiplataformas.prepare();
      activeContent=content;activeScreen=screen;screen.hidden=true;screen.classList.remove('is-active');
      subpageTitle.textContent=title;back.querySelector('span').textContent=say('Voltar para Ajustes','Back to Settings');
      subpageBody.replaceChildren(content);settings.hidden=true;subpage.hidden=false;window.closeProfileSheetPublic();window.scrollTo({top:0,behavior:'instant'});
    }
    var settingRoutes={
      openDadosPessoaisBtn:'sheetScreenDadosPessoais',openDespesasFixasBtn:'sheetScreenDespesasFixas',
      openMultiplataformaBtn:'sheetScreenMultiplataforma',openIdiomaBtn:'sheetScreenIdioma',
      openTamanhoBtn:'sheetScreenTamanho',openContactoBtn:'sheetScreenContacto',openAjudaBtn:'sheetScreenAjuda',
      openApagarDadosBtn:'sheetScreenApagarDados',sheetAvatar:'sheetScreenDadosPessoais',
      dpChangePasswordBtn:'sheetScreenPasswordChange'
    };
    document.addEventListener('click',function(event){
      var target=event.target.closest('[id]');if(!target||!settingRoutes[target.id])return;
      if(!settingsPage.contains(target)&&target.id!=='dpChangePasswordBtn')return;
      event.preventDefault();event.stopImmediatePropagation();
      var label=target.querySelector('span:not(.sheet-action-value)')||target;
      openSettingsSubpage(settingRoutes[target.id],target.id==='sheetAvatar'?say('Editar perfil','Edit profile'):label.textContent.trim());
    },true);
    document.addEventListener('click',function(event){
      if(!event.target.closest('#langSaveBtn'))return;
      // O ecrã original regressa a Ganhos; volta pelo router visual para
      // manter o Início completo, incluindo o cartão de meta.
      queueMicrotask(function(){go('resumo');refreshData();});
    },true);
    function backSettingsSubpage(){
      if(!activeContent)return false;
      settingsHistory.pop();
      if(settingsHistory.length){var previous=settingsHistory[settingsHistory.length-1];openSettingsSubpage(previous.id,previous.title,true);}
      else closeSettingsSubpage();
      return true;
    }
    window.SmartSomaSettings={open:openSettingsSubpage,close:closeSettingsSubpage,back:backSettingsSubpage};

    var previousScroll=0,navTimer;
    function syncMobileNavigation(scrollTop){
      var next=Number(scrollTop)||0;
      if(Math.abs(next-previousScroll)<4)return;
      var scrollingDown=next>previousScroll;
      previousScroll=next;
      if(document.querySelector('dialog[open],.mm-backdrop.visible,.modal-backdrop.visible,.ui-news-backdrop.visible,.ui-entry-retro-backdrop.visible'))return;
      clearTimeout(navTimer);
      if(!scrollingDown){document.body.classList.remove('ui-mobile-nav-hidden');return;}
      document.body.classList.add('ui-mobile-nav-hidden');
      navTimer=setTimeout(function(){document.body.classList.remove('ui-mobile-nav-hidden');},1500);
    }
    var homeListView=$('homeListView');
    if(homeListView)homeListView.addEventListener('scroll',function(){syncMobileNavigation(homeListView.scrollTop);},{passive:true});
    window.addEventListener('scroll',function(){syncMobileNavigation(window.scrollY||document.documentElement.scrollTop);},{passive:true});
    var mobileFaqs=[
      ['Como registar ou corrigir ganhos?','Toca em +, confirma a data, escolhe a plataforma e introduz o total do dia. Toca em Guardar. Se já existir um valor, o novo substitui o anterior.','How do I record or correct earnings?','Tap +, confirm the date, choose a platform and enter the daily total. Tap Save. If a value already exists, the new one replaces it.'],
      ['Como registar despesas e quilómetros?','Toca em + e escolhe Despesas ou KM. Para despesas, introduz a descrição e o valor. Para quilómetros, usa Km Total ou confirma as leituras de Início e Fim. Depois toca em Guardar. Para excluir uma despesa diária, toca no X junto dela em Início e confirma.','How do I record expenses and distance?','Tap + and choose Expenses or KM. For expenses, enter a description and amount. For distance, use Total km or confirm the Start and End readings. Then tap Save. To delete a daily expense, tap its X on Home and confirm.'],
      ['Posso registar dados de dias anteriores?','Sim. No formulário de registo, toca na data e escolhe o dia no calendário. Para ganhos e despesas, confirma o aviso de lançamento retroativo. Datas futuras não podem ser selecionadas.','Can I record data for previous days?','Yes. In the entry form, tap the date and choose a day in the calendar. For earnings and expenses, confirm the backdated entry. Future dates cannot be selected.'],
      ['Como consultar os meus resultados?','Em Início, encontras as informações da semana atual. Em Semana, podes consultar os detalhes e outros períodos, alternar entre Lista e Tabela e tocar num dia da lista para ver os detalhes.','How do I view my results?','Home shows the current week. In Week, view details and other periods, switch between List and Table, and tap a day in the list to see its details.'],
      ['Como funciona a meta semanal?','Em Início, toca em Definir meta ou Editar meta, introduz o valor e escolhe Bruto ou Líquido. O bruto soma os ganhos das plataformas; o líquido desconta as despesas aplicáveis. Também podes consultar metas anteriores.','How does the weekly goal work?','On Home, tap Set goal or Edit goal, enter the amount and choose Gross or Net. Gross adds platform earnings; net subtracts applicable expenses. You can also view previous goals.'],
      ['Como configurar despesas fixas e plataformas?','Em Ajustes → Despesas Fixas, adiciona uma descrição e um valor em euros ou uma percentagem do bruto semanal. As despesas fixas são contabilizadas na segunda-feira. Em Ajustes → Multiplataforma, podes adicionar outras plataformas.','How do I configure fixed expenses and platforms?','In Settings → Fixed expenses, add a description and a euro amount or percentage of weekly gross earnings. Fixed expenses are counted on Monday. In Settings → Multi-platform, add other platforms.'],
      ['Como descarregar um relatório?','Abre Downloads, seleciona o mês e toca em Baixar PDF. Em Relatórios anteriores, podes gerar novamente relatórios de meses com registos.','How do I download a report?','Open Downloads, choose a month and tap Download PDF. Under Previous reports, generate reports again for months with entries.'],
      ['Como alterar as preferências ou gerir a subscrição?','Em Ajustes, podes alterar o idioma, o tamanho da fonte e o modo escuro. Para gerir a subscrição, toca em Editar no card de perfil e depois em Gerir subscrição, quando disponível.','How do I change preferences or manage my subscription?','In Settings, change the language, font size and dark mode. To manage your subscription, tap Edit on the profile card, then Manage subscription when available.'],
      ['A aplicação funciona sem internet?','Com uma sessão já iniciada e os dados disponíveis no dispositivo, podes continuar offline. As alterações ficam guardadas localmente e são enviadas quando a ligação regressa e a subscrição permite a sincronização.','Does the app work offline?','With an existing session and data available on the device, you can work offline. Changes are stored locally and sent when the connection returns and the subscription permits syncing.']
    ];
    function labels(){management.dataset.title=say('Gestão','Management');preferences.dataset.title=say('Preferências','Preferences');support.dataset.title=say('Conta e suporte','Account and support');fixedAdd.textContent=say('Adicionar despesa fixa','Add fixed expense');helper.textContent=say('Despesas semanais, em € ou % do bruto. Entram na segunda-feira; a percentagem acompanha os ganhos. Ao excluir, as semanas anteriores ficam preservadas.','Weekly expenses, in € or % of gross. Added on Monday; percentages follow earnings. Deleting preserves previous weeks.');$('uiHelpTitle').textContent=say('Estamos por perto.','We are here to help.');$('uiFaqItems').replaceChildren();mobileFaqs.forEach(function(f){var n=create('details');var q=create('summary');q.textContent=say(f[0],f[2]);var p=create('p');p.textContent=say(f[1],f[3]);n.append(q,p);$('uiFaqItems').append(n);});}
    function navLabels(){var labels=say(['Início','Semana','Downloads','Ajustes'],['Home','Week','Downloads','Settings']);document.querySelectorAll('.ui-nav-short').forEach(function(n,i){n.textContent=labels[i];});}
    labels();navLabels();document.addEventListener('languageChanged',function(){labels();navLabels();});
  }
  function nativeBack(){
    var retro=document.querySelector('.ui-entry-retro-backdrop.visible');
    if(retro){$('uiEntryRetroCancel').click();return true;}
    var news=document.querySelector('.ui-news-backdrop.visible');
    if(news){$('uiNewsClose').click();return true;}
    var dialog=document.querySelector('dialog[open]');
    if(dialog){var close=dialog.querySelector('#uiEntryClose,.ui-modal-close');if(close)close.click();else dialog.close();return true;}
    var overlay=document.querySelector('.mm-backdrop.visible,.modal-backdrop.visible');
    if(overlay){overlay.click();return true;}
    if(window.SmartSomaSettings&&window.SmartSomaSettings.back())return true;
    if(routeHistory.length>1){routeHistory.pop();returning=true;try{go(routeHistory[routeHistory.length-1]);}finally{returning=false;}return true;}
    if(route!=='resumo'){returning=true;try{go('resumo');}finally{returning=false;}return true;}
    return false;
  }
  window.SmartSomaUI={start:start,go:go,back:nativeBack,t:t,svg:svg,create:create,button:button,translate:translate,syncHeader:syncHeader,refreshSidebar:syncSidebarAccount};
  document.addEventListener('smartSomaAppReady',function(){setTimeout(start,0);});
  if (window.SmartSomaAppReady) start();
})();
