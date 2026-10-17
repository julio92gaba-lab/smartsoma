const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createApp, dateKey } = require('./app-harness.cjs');
const settle = () => new Promise(resolve => setTimeout(resolve, 180));
function submit(a) { a.el('uiEntryForm').dispatchEvent(new a.w.Event('submit', { bubbles:true, cancelable:true })); }
function setup(t,seed={}) { const a=createApp(seed,{ui:true}); t.after(a.close);return a; }

test('UI keeps four navigation items, mobile brand and redirects retired routes to overview',async t=>{
  const a=setup(t);a.w.SmartSomaUI.start();await settle();
  assert.equal(a.w.document.querySelectorAll('.ui-nav-item').length,4);
  assert.deepEqual([...a.w.document.querySelectorAll('.ui-nav-full')].map(n=>n.textContent),['Visão geral','Detalhes da semana','Downloads','Ajustes']);
  assert.deepEqual([...a.w.document.querySelectorAll('.ui-nav-short')].map(n=>n.textContent),['Início','Semana','Downloads','Ajustes']);
  assert.equal(a.w.document.querySelector('.ui-mobile-nav-brand img').getAttribute('src'),'logopeq.png');
  a.w.SmartSomaUI.go('semana');await settle();a.w.document.querySelector('.ui-mobile-nav-brand').click();await settle();assert.equal(a.w.document.body.dataset.uiRoute,'resumo');
  assert.equal(a.el('uiChart').querySelectorAll('.ui-rhythm-row').length,7);
  assert.equal(a.el('uiHeaderTitle').textContent,'Olá, Utilizador.');
  assert.equal(a.el('uiHeaderAvatar').textContent,'U');a.el('sheetAvatar').innerHTML='<img src="https://example.com/avatar.jpg">';a.w.SmartSomaUI.refreshSidebar();
  for(const id of ['uiSidebarAvatar','uiHeaderAvatar'])assert.equal(a.el(id).querySelector('img').src,'https://example.com/avatar.jpg');
  a.click('uiHeaderAvatar');
  assert.equal(a.el('homeListPageResumo').classList.contains('is-fading'),true);await settle();
  assert.equal(a.w.document.body.dataset.uiRoute,'ajustes');
  a.w.SmartSomaUI.go('ganhos');assert.equal(a.el('uiSettingsPage').classList.contains('is-fading'),true);await settle();
  assert.equal(a.w.document.body.dataset.uiRoute,'resumo');
  const ids=[...a.w.document.querySelectorAll('[id]')].map(n=>n.id);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual(a.errors,[]);
  for(const route of ['semana','downloads','resumo']){
    a.w.SmartSomaUI.go(route);await settle();
    assert.equal(a.w.document.body.dataset.uiRoute,route);
    assert.equal(a.w.document.querySelectorAll('.home-list-page:not([hidden])').length,1);
    assert.equal(a.el('uiHeaderAvatar').hidden,false);
    assert.ok(a.el('uiHeaderAvatar').querySelector('img'));
  }
  for(const route of ['ganhos','despesas']){a.w.SmartSomaUI.go(route);await settle();assert.equal(a.w.document.body.dataset.uiRoute,'resumo');}
});

test('header stylesheet never hides the avatar outside the overview',()=>{
  const css=fs.readFileSync('ui-v2.css','utf8');
  assert.doesNotMatch(css,/ui-header-avatar\s*\{\s*display\s*:\s*none/i);
  assert.match(css,/body\.ui-v2 \.ui-header \.ui-header-avatar\s*\{[^}]*display:grid !important;[^}]*visibility:visible !important;/);
});

test('week filters keep the same geometry while sticky',()=>{
  const css=fs.readFileSync('ui-v2.css','utf8');
  assert.match(css,/\.semana-filter-controls,\s*\.ui-v2 #homeListPageSemana \.semana-filter-controls\.is-sticky\s*\{[^}]*min-height:96px;[^}]*padding-top:5px;[^}]*padding-bottom:5px;[^}]*will-change:transform;/);
  assert.doesNotMatch(css,/\.semana-filter-controls\.is-sticky\s*\{[^}]*padding-bottom:3px/);
});

test('fixed chrome has readable text and avatars use Supabase Storage',()=>{
  const css=fs.readFileSync('ui-v2.css','utf8');
  const app=fs.readFileSync('app.js','utf8');
  const cloud=fs.readFileSync('cloud-init.js','utf8');
  const html=fs.readFileSync('app.html','utf8');
  const migration=fs.readFileSync('supabase/migrations/20261017043604_add_avatar_storage.sql','utf8');
  assert.match(css,/\.ui-v2 \.ui-header\s*\{[^}]*background:var\(--app-chrome\);[^}]*backdrop-filter:none;/);
  assert.match(css,/\.resumo-period-controls\.is-sticky[^}]*resumo-current-week-label[^}]*\{[^}]*color:#eef4ec;/);
  assert.match(css,/\.semana-filter-controls\.is-sticky[^}]*semana-view-toggle-active-label[^}]*\{[^}]*color:#eef4ec;/);
  assert.match(css,/\.semana-week-picker-num,[^{]*\{[^}]*background:#fff;[^}]*color:#183021;/);
  assert.match(html,/accept="[^"]*\.heic[^"]*image\/heif/);
  assert.match(html,/<script src="heic2any\.min\.js\?v=11"><\/script>/);
  assert.match(app,/'image\/heic': true/);
  assert.doesNotMatch(app,/MAX_IMAGE_BYTES/);
  assert.match(app,/window\.heic2any\(\{ blob: file, toType: 'image\/jpeg'/);
  assert.match(app,/SmartSomaAvatarStorage\.upload\(avatarBlob\)/);
  assert.match(cloud,/sb\.storage\.from\('avatars'\)\.upload\(objectPath, blob,[\s\S]*upsert: true/);
  assert.match(cloud,/getPublicUrl\(objectPath\)/);
  assert.match(cloud,/script\.src = 'app\.js\?v=11'/);
  assert.match(migration,/INSERT INTO storage\.buckets \(id, name, public, file_size_limit, allowed_mime_types\)/);
  assert.match(migration,/VALUES \([\s\S]*'avatars',[\s\S]*true,[\s\S]*NULL/);
  assert.match(migration,/FOR INSERT TO authenticated[\s\S]*storage\.foldername\(name\)/);
  assert.match(migration,/FOR UPDATE TO authenticated[\s\S]*owner_id = \(SELECT auth\.uid\(\)\)::text/);
});

test('modal overlays stay below the fixed header and weekly toggle icons remain compact',()=>{
  const css=fs.readFileSync('ui-v2.css','utf8');
  assert.match(css,/\.ui-v2 \.mm-backdrop,\.ui-v2 \.modal-backdrop\s*\{[^}]*top:var\(--ui-header\) !important;[^}]*align-items:flex-start !important;[^}]*overflow-y:auto;/);
  for(const selector of ['#langPopupModal','.ui-entry-retro-backdrop','.ui-news-backdrop']){
    const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    assert.match(css,new RegExp(escaped+'\\s*\\{[^}]*top:var\\(--ui-header\\)'));
  }
  assert.match(css,/#semanaPeriodModalBackdrop\s*\{[^}]*align-items:flex-start;/);
  assert.match(css,/#subHeaderViewToggleGroup \.semana-view-toggle-image\s*\{[^}]*width:24px;[^}]*height:24px;/);
  assert.match(css,/\.sub-header-view-toggle-btn\.is-active \.semana-view-toggle-image\s*\{[^}]*width:24px;[^}]*height:24px;/);
});

test('home rhythm uses the weekly divergent chart and lists only variable expenses from the selected period',async t=>{
  const monday=new Date();monday.setHours(0,0,0,0);monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
  const tuesday=new Date(monday);tuesday.setDate(tuesday.getDate()+1);
  const a=setup(t,{['homeBadgeValores:'+dateKey(monday)]:JSON.stringify({uber:120}),['homeBadgeValores:'+dateKey(tuesday)]:JSON.stringify({bolt:80}),['despesasDiarias:'+dateKey(monday)]:JSON.stringify({items:[{descricao:'Combustível',valor:20}]}),['despesasDiarias:'+dateKey(tuesday)]:JSON.stringify({items:[{descricao:'Portagem',valor:5}]}),despesasFixas:JSON.stringify({items:[{id:1,descricao:'Seguro',tipo:'euro',valor:30,desde:dateKey(monday)}]})});
  a.w.SmartSomaUI.start();a.w.document.querySelector('[data-period="semana"]').click();await settle();
  assert.equal(a.el('uiChart').querySelectorAll('.ui-rhythm-row').length,7);
  assert.match(a.el('uiChart').textContent,/Despesas.*Lucro líquido.*Ganhos brutos/);
  assert.match(a.el('uiChart').textContent,/Melhor dia: Segunda/);
  assert.equal(a.el('uiOverviewDailyLabel').textContent,'DESPESAS DO PERÍODO');
  assert.match(a.el('uiOverviewExpenseRows').textContent,/Combustível/);
  assert.match(a.el('uiOverviewExpenseRows').textContent,/Portagem/);
  assert.doesNotMatch(a.el('uiOverviewExpenseRows').textContent,/Seguro/);
  a.w.document.querySelector('[data-period="dia"]').click();await settle();
  assert.equal(a.el('uiChartEyebrow').textContent,'DIA EM MOVIMENTO');assert.equal(a.el('uiChart').querySelectorAll('.ui-chart-tab').length,2);
  a.el('uiChart').querySelectorAll('.ui-chart-tab')[1].click();assert.match(a.el('uiChart').textContent,/Ganhos brutos.*Despesas.*Lucro líquido/);
  a.w.document.querySelector('[data-period="mes"]').click();await settle();
  assert.equal(a.el('uiChartEyebrow').textContent,'MÊS EM MOVIMENTO');assert.ok(a.el('uiChart').querySelectorAll('.ui-month-bar').length>=4);assert.match(a.el('uiChart').textContent,/Melhor semana|Ainda não há ganhos/);
  let weeklyPageShown=0;a.w.document.addEventListener('semanaPageShown',()=>weeklyPageShown++);
  a.click('uiChartDetails');await new Promise(resolve=>setTimeout(resolve,340));
  assert.equal(a.w.document.body.dataset.uiRoute,'semana');
  assert.equal(a.el('homeListPageSemana').hidden,false);
  assert.equal(weeklyPageShown,1);
  assert.deepEqual(a.errors,[]);
});

test('daily rhythm follows the global period navigation date',async t=>{
  const today=new Date(),previous=new Date(today);previous.setDate(today.getDate()-1);
  const a=setup(t,{['homeBadgeValores:'+dateKey(previous)]:JSON.stringify({uber:90,bolt:30}),['despesasDiarias:'+dateKey(previous)]:JSON.stringify({items:[{descricao:'Portagem',valor:15}]})});
  a.w.document.querySelector('[data-period="dia"]').click();a.click('periodNavPrev');await settle();
  assert.match(a.el('uiChart').querySelector('.ui-day-donut-center').textContent,/120/);
  a.el('uiChart').querySelectorAll('.ui-chart-tab')[1].click();assert.ok(a.el('uiChart').querySelector('.ui-day-donut-net'));assert.match(a.el('uiChart').textContent,/120.*15.*105/);assert.deepEqual(a.errors,[]);
});

test('weekly view choice is stored and survives section navigation',async t=>{
  const a=setup(t);a.w.SmartSomaUI.go('semana');await settle();
  const weekContent=a.el('semanaLiveContent');
  assert.ok([...weekContent.children].indexOf(a.w.document.querySelector('.semana-filter-controls')) < [...weekContent.children].indexOf(a.el('semanaEarningsTitle').parentElement));
  a.click('subHeaderViewToggleGroup');
  assert.equal(a.w.localStorage.getItem('smartsoma:semana-view'),'table');
  assert.ok(a.w.document.body.classList.contains('semana-table-view'));
  a.w.SmartSomaUI.go('resumo');a.w.SmartSomaUI.go('semana');await settle();
  assert.ok(a.w.document.body.classList.contains('semana-table-view'));
  assert.deepEqual(a.errors,[]);
});

test('weekly list cards keep a stable header, compact spacing and expand normally',async t=>{
  const css=fs.readFileSync('ui-v2.css','utf8');
  assert.match(css,/\.semana-list-placeholder\s*\{[^}]*gap:8px;[^}]*padding-top:0;/);
  assert.doesNotMatch(css,/\.semana-list-placeholder\s*\{[^}]*overflow-anchor:none;/);
  assert.match(css,/\.semana-day-card\s*\{[^}]*margin-top:0;[^}]*padding:0;[^}]*background:var\(--card-bg\);/);
  assert.match(css,/\.semana-day-card:not\(\.is-expanded\) \.semana-day-card-header\s*\{[^}]*height:68px;[^}]*min-height:68px;/);
  assert.match(css,/M0,38 C80,29 120,29 200,42 C280,55 320,55 400,41 L400,0 L0,0 Z/);
  assert.match(css,/\.semana-day-card-details\s*\{[^}]*grid-template-rows:0fr;[^}]*transition:grid-template-rows/);
  const monday=new Date();monday.setHours(0,0,0,0);monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
  const a=setup(t,{
    ['homeBadgeValores:'+dateKey(monday)]:JSON.stringify({uber:100,bolt:50}),
    ['despesasDiarias:'+dateKey(monday)]:JSON.stringify({items:[{descricao:'Combustível',valor:20}]}),
    despesasFixas:JSON.stringify({items:[{id:1,descricao:'Seguro',tipo:'euro',valor:30,desde:dateKey(monday)}]})
  });a.w.SmartSomaUI.start();a.w.SmartSomaUI.go('semana');await settle();
  a.w.SemanaView.showList();
  const card=a.w.document.querySelector('.semana-day-card'),header=card.querySelector('.semana-day-card-header');
  assert.ok(card.querySelector('.semana-day-card-details-inner'));
  assert.deepEqual([...card.querySelectorAll('.semana-platform-icon img')].map(img=>img.getAttribute('src')),['01uber.png','02bolt.png']);
  assert.equal(a.el('semanaEarningsTitle').hidden,false);
  assert.equal(a.el('semanaEarningsSubtitle').textContent.trim(),'As despesas fixas aparecem apenas na tabela de despesas, e não na faturação.');
  assert.equal(card.querySelector('.semana-day-card-summary > span').textContent,'Resumo geral');
  assert.deepEqual([...card.querySelectorAll('.semana-day-card-metrics small')].map(el=>el.textContent),['Bruto','Despesas','Distância']);
  assert.equal(card.querySelectorAll('.semana-day-card-metrics > div').length,3);
  assert.doesNotMatch(card.querySelector('.semana-day-card-details-inner').textContent,/Lucro líquido/);
  assert.match(card.querySelector('.semana-day-card-details-inner').textContent,/Combustível/);
  assert.doesNotMatch(card.querySelector('.semana-day-card-details-inner').textContent,/Seguro|FIXA/);
  assert.match(a.el('semanaExpensesSlot').textContent,/Combustível/);
  assert.match(a.el('semanaExpensesSlot').textContent,/Seguro.*FIXA/);
  const cards=[...a.w.document.querySelectorAll('.semana-day-card')],secondCard=cards[1];
  header.click();assert.equal(card.classList.contains('is-expanded'),true);assert.equal(header.getAttribute('aria-expanded'),'true');assert.equal(a.w.document.documentElement.classList.contains('semana-list-is-animating'),true);
  assert.ok(cards.slice(1).every(item=>item.classList.contains('is-muted')));
  secondCard.click();assert.equal(card.classList.contains('is-expanded'),false);assert.equal(secondCard.classList.contains('is-expanded'),true);assert.equal(secondCard.classList.contains('is-muted'),false);
  a.w.document.querySelector('.semana-list-placeholder').dispatchEvent(new a.w.MouseEvent('click',{bubbles:true}));
  assert.ok(cards.every(item=>!item.classList.contains('is-expanded')&&!item.classList.contains('is-muted')));
  await new Promise(resolve=>setTimeout(resolve,380));assert.equal(a.w.document.documentElement.classList.contains('semana-list-is-animating'),false);
  a.w.SemanaView.showTable();
  const mondayDate=String(monday.getDate()).padStart(2,'0')+'/'+String(monday.getMonth()+1).padStart(2,'0');
  const mondayRow=[...a.w.document.querySelectorAll('.semana-week-block tbody tr')].find(row=>row.querySelector('.semana-cell-date')?.textContent===mondayDate);
  const mondayFinancial=[...mondayRow.querySelectorAll('.semana-metric-financeiro')].map(el=>el.textContent);
  assert.deepEqual(mondayFinancial,['€ 150.00','€ 20.00','€ 130.00']);
  assert.match(a.w.document.querySelector('.semana-metric-tabs').parentElement.querySelector('thead').textContent,/Ganhos.*KM.*€ \/ KM/);
  assert.match(a.el('semanaExpensesSlot').textContent,/€ 20.00.*€ 50.00/);
  assert.deepEqual(a.errors,[]);
});

test('week period modal keeps selection pending until filter confirmation',async t=>{
  const a=setup(t);a.w.SmartSomaUI.start();a.w.SmartSomaUI.go('semana');await settle();
  const filters=a.w.document.querySelector('.semana-filter-controls');
  assert.ok(filters.contains(a.el('subHeaderViewToggleGroup')));
  const labelBefore=a.el('semanaWeekPickerLabel').textContent;
  a.click('semanaWeekPickerBtn');
  assert.equal(a.el('semanaPeriodModalBackdrop').classList.contains('visible'),true);
  const options=[...a.w.document.querySelectorAll('.semana-period-week-option')];
  assert.ok(options.length>=4);
  assert.ok(options.some(option=>option.classList.contains('is-current')));
  const selectedIndex=options.findIndex(option=>option.classList.contains('is-selected'));
  options[(selectedIndex+1)%options.length].click();
  assert.equal(a.el('semanaPeriodModalBackdrop').classList.contains('visible'),true);
  assert.equal(a.el('semanaWeekPickerLabel').textContent,labelBefore);
  a.click('semanaPeriodFilterBtn');await settle();
  assert.equal(a.el('semanaPeriodModalBackdrop').classList.contains('visible'),false);
  assert.notEqual(a.el('semanaWeekPickerLabel').textContent,labelBefore);
  assert.deepEqual(a.errors,[]);
});

test('quick entry opens a platform subpage and replaces its daily value',t=>{
  const a=setup(t);a.click('uiAdd');assert.equal(a.el('uiEntryDialog').open,true);
  assert.match(a.el('uiPlatformChoices').textContent,/Uber/);
  a.w.document.querySelector('[data-platform="uber"]').click();
  assert.equal(a.el('uiEntryTitle').textContent,'Ganhos Uber');
  assert.equal(a.el('uiEntryClose').getAttribute('aria-label'),'Voltar');
  a.click('uiEntryClose');a.w.document.querySelector('[data-platform="bolt"]').click();a.input('uiEntryValue','123,45');submit(a);
  assert.equal(a.w.HomeBadges.get().bolt,123.45);assert.equal(a.el('uiEntryDialog').open,false);
  a.click('uiAdd');a.w.document.querySelector('[data-platform="bolt"]').click();
  assert.equal(a.el('uiEntryValue').value,'123.45');a.input('uiEntryValue','40');submit(a);
  assert.equal(a.w.HomeBadges.get().bolt,40);
});

test('quick expense saves through the existing daily expense control and updates totals',async t=>{
  const a=setup(t);a.click('uiAdd');a.click('uiEntryExpense');a.input('uiEntryDescription','Portagem');a.input('uiEntryValue','5,25');submit(a);await settle();
  const saved=JSON.parse(a.cache['despesasDiarias:'+dateKey(new Date())]);
  assert.equal(saved.items[0].descricao,'Portagem');assert.equal(saved.items[0].valor,5.25);
  assert.equal(a.w.HomeBadges.get().despesas,5.25);assert.match(a.el('uiOverviewExpenseRows').textContent,/Portagem/);
  assert.equal(a.w.document.getElementById('uiRecentRows'),null);assert.deepEqual(a.errors,[]);
});

test('mileage odometer persists the initial value and uses original final-minus-start calculation',t=>{
  const a=setup(t);a.click('listRowDistancia');a.click('distanciaModoInicioFimBtn');
  assert.equal(a.el('distanciaKmFimInput').disabled,true);
  a.input('distanciaKmInicioInput','10000');a.click('distanciaKmInicioUpdateBtn');
  assert.equal(a.el('distanciaKmFimInput').disabled,false);
  assert.equal(JSON.parse(a.cache['distanciaInicioFim:'+dateKey(new Date())]).inicio,10000);
  a.input('distanciaKmFimInput','10125');a.click('distanciaKmFimUpdateBtn');a.click('distanciaSalvarBtn');
  assert.equal(a.w.HomeBadges.get().distancia,125);
});

test('fixed expenses are on Monday, percentages include all platform earnings and history is retained',t=>{
  const monday=new Date();monday.setHours(0,0,0,0);monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
  const seed={despesasFixas:JSON.stringify({items:[{id:1,descricao:'Carro',tipo:'euro',valor:100,desde:dateKey(monday)},{id:2,descricao:'Taxa',tipo:'percentual',valor:10,desde:dateKey(monday)}]})};
  seed['homeBadgeValores:'+dateKey(monday)]=JSON.stringify({uber:200,bolt:100,distancia:50,despesas:0,plat:{extra:50}});
  const a=setup(t,seed);const d=a.w.SmartSomaReadModel.day(monday);
  assert.equal(d.gross,350);assert.equal(d.expenses,135);assert.equal(d.net,215);assert.equal(d.entries.length,2);
  const next=new Date(monday);next.setDate(next.getDate()+1);assert.equal(a.w.SmartSomaReadModel.day(next).expenses,0);
  a.cache['despesasFixasSkipSemana:'+dateKey(monday)]='1';assert.equal(a.w.SmartSomaReadModel.day(monday).expenses,0);
});

test('goal emits achievement once on crossing 100 percent and retains its original modal',t=>{
  const monday=new Date();monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
  const a=setup(t,{['metaSemanalConfig:'+dateKey(monday)]:JSON.stringify({valor:100,tipo:'bruto'})});
  let hits=0;a.w.document.addEventListener('metaSemanalAtingida',()=>hits++);
  a.input('uberValorInput','100');a.click('uberSalvarBtn');assert.equal(hits,1);
  a.input('uberValorInput','120');a.click('uberSalvarBtn');assert.equal(hits,1);
  a.click('btnMetaSemanal');assert.equal(a.el('metaSemanalModalBackdrop').classList.contains('visible'),true);
});

test('settings keeps account flows, two font sizes, legal link and complete FAQ',async t=>{
  const a=setup(t);a.w.SmartSomaUI.go('ajustes');a.click('openDadosPessoaisBtn');await settle();
  assert.ok(a.el('dpNomeInput'));assert.ok(a.el('dpEmailInput'));assert.ok(a.el('dpChangePasswordBtn'));assert.ok(a.el('dpUploadPhotoBtn'));
  assert.equal(a.el('uiSettingsPage').hidden,false);
  assert.equal(a.el('profileSheet').classList.contains('open'),false);
  assert.equal(a.el('uiSettingsPage').querySelector('.ui-settings-subpage').hidden,false);
  assert.equal(a.el('openTermosMenuBtn').href,'https://smartsoma.pt/legal');
  assert.equal(a.w.document.querySelectorAll('.tamanho-option').length,2);
  assert.match(a.el('tamanhoOptionP').textContent,/Normal/);
  assert.equal(a.w.document.querySelectorAll('#uiFaqItems details').length,11);
  a.w.I18N.setLang('en');await settle();assert.match(a.el('uiFaqTitle').textContent,/Frequently/);
  a.click('uiThemeRow');assert.ok(a.w.document.body.classList.contains('theme-dark'));assert.deepEqual(a.errors,[]);
});

test('settings menu opens internal pages and returns without the legacy sheet',t=>{
  const a=setup(t);a.w.SmartSomaUI.go('ajustes');
  const routes=[
    ['openDadosPessoaisBtn','sheetScreenDadosPessoais'],['openDespesasFixasBtn','sheetScreenDespesasFixas'],
    ['openMultiplataformaBtn','sheetScreenMultiplataforma'],['openIdiomaBtn','sheetScreenIdioma'],
    ['openTamanhoBtn','sheetScreenTamanho'],['openAjudaBtn','sheetScreenAjuda'],['openApagarDadosBtn','sheetScreenApagarDados']
  ];
  routes.forEach(([buttonId])=>{
    a.click(buttonId);
    const page=a.el('uiSettingsPage'),subpage=page.querySelector('.ui-settings-subpage');
    assert.equal(subpage.hidden,false);assert.equal(a.el('profileSheet').classList.contains('open'),false);
    assert.ok(subpage.querySelector('.sheet-content'));
    assert.notEqual(subpage.querySelector('h2').textContent.trim(),'');
    subpage.querySelector('.ui-settings-back').click();
    assert.equal(subpage.hidden,true);
  });
  assert.deepEqual(a.errors,[]);
});

test('quick entry blocks writes for inactive subscriptions',t=>{
  const a=setup(t);a.w.SmartSomaPro.isPro=false;a.click('uiAdd');a.w.document.querySelector('[data-platform="uber"]').click();a.input('uiEntryValue','30');submit(a);
  assert.equal(a.w.HomeBadges.get().uber,0);
});
