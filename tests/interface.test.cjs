const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createApp, dateKey } = require('./app-harness.cjs');
const settle = () => new Promise(resolve => setTimeout(resolve, 180));
function submit(a) { a.el('uiEntryForm').dispatchEvent(new a.w.Event('submit', { bubbles:true, cancelable:true })); }
function setup(t,seed={}) { const a=createApp(seed,{ui:true}); t.after(a.close);return a; }

test('Android back returns through settings and visited pages to home',t=>{
  const a=setup(t);
  a.w.SmartSomaUI.go('semana');
  a.w.SmartSomaUI.go('ajustes');
  a.click('openAjudaBtn');
  assert.ok(a.w.document.querySelector('.ui-settings-subpage:not([hidden]) #uiFaqItems'));
  assert.equal(a.w.SmartSomaUI.back(),true);
  assert.equal(a.w.document.querySelector('.ui-settings-subpage').hidden,true);
  assert.equal(a.w.SmartSomaUI.back(),true);
  assert.equal(a.w.document.body.dataset.uiRoute,'semana');
  assert.equal(a.w.SmartSomaUI.back(),true);
  assert.equal(a.w.document.body.dataset.uiRoute,'resumo');
  assert.equal(a.w.SmartSomaUI.back(),false);
});

test('mobile navigation returns 1.5 seconds after actual scrolling',async t=>{
  const a=setup(t);
  const list=a.el('homeListView');
  list.scrollTop=80;
  list.dispatchEvent(new a.w.Event('scroll'));
  assert.equal(a.w.document.body.classList.contains('ui-mobile-nav-hidden'),true);
  await new Promise(resolve=>setTimeout(resolve,1600));
  assert.equal(a.w.document.body.classList.contains('ui-mobile-nav-hidden'),false);
  list.dispatchEvent(new a.w.Event('scroll'));
  assert.equal(a.w.document.body.classList.contains('ui-mobile-nav-hidden'),false);
});

test('scrolling up immediately reveals navigation and scrolling down still hides it',t=>{
  const a=setup(t),list=a.el('homeListView');
  list.scrollTop=100;list.dispatchEvent(new a.w.Event('scroll'));
  assert.equal(a.w.document.body.classList.contains('ui-mobile-nav-hidden'),true);
  list.scrollTop=80;list.dispatchEvent(new a.w.Event('scroll'));
  assert.equal(a.w.document.body.classList.contains('ui-mobile-nav-hidden'),false);
  list.scrollTop=120;list.dispatchEvent(new a.w.Event('scroll'));
  assert.equal(a.w.document.body.classList.contains('ui-mobile-nav-hidden'),true);
});

test('header and central logo account for device safe areas',()=>{
  const css=fs.readFileSync('ui-v2.css','utf8');
  assert.match(css,/--ui-header:calc\(82px \+ var\(--ui-safe-top\)\)/);
  assert.match(css,/padding-top:calc\(16px \+ var\(--ui-safe-top\)\)/);
  assert.match(css,/\.ui-mobile-nav-brand \{[^}]*top:calc\(50% - var\(--ui-safe-bottom\) \/ 2\)/);
});

test('UI keeps four navigation items, mobile brand and redirects retired routes to overview',async t=>{
  const a=setup(t);a.w.SmartSomaUI.start();await settle();
  assert.equal(a.w.document.querySelectorAll('.ui-nav-item').length,4);
  assert.equal(a.w.document.querySelector('.ui-nav-full'),null);
  assert.deepEqual([...a.w.document.querySelectorAll('.ui-nav-short')].map(n=>n.textContent),['Início','Semana','Downloads','Ajustes']);
  assert.equal(a.w.document.querySelector('.ui-mobile-nav-brand img').getAttribute('src'),'logopeq.png');
  a.w.SmartSomaUI.go('semana');await settle();a.w.document.querySelector('.ui-mobile-nav-brand').click();await settle();assert.equal(a.w.document.body.dataset.uiRoute,'resumo');
  assert.equal(a.el('uiChart').querySelectorAll('.ui-rhythm-row').length,7);
  assert.equal(a.el('uiHeaderTitle').textContent,'Olá, Utilizador.');
  assert.equal(a.el('uiHeaderAvatar').textContent,'U');a.el('sheetAvatar').innerHTML='<img src="https://example.com/avatar.jpg">';a.w.SmartSomaUI.refreshSidebar();
  assert.equal(a.el('uiSidebarAvatar'),null);
  assert.equal(a.el('uiHeaderAvatar').querySelector('img').src,'https://example.com/avatar.jpg');
  a.click('uiHeaderAvatar');
  assert.equal(a.el('homeListPageResumo').hidden,true);
  assert.equal(a.el('uiSettingsPage').hidden,false);
  assert.ok(a.el('uiSettingsPage').querySelector('.ui-settings-subpage #dpNomeInput'));
  assert.equal(a.w.document.body.dataset.uiRoute,'ajustes');
  a.w.SmartSomaUI.go('ganhos');assert.equal(a.el('uiSettingsPage').hidden,true);
  assert.equal(a.el('homeListPageResumo').hidden,false);
  assert.equal(a.w.document.body.dataset.uiRoute,'resumo');
  const ids=[...a.w.document.querySelectorAll('[id]')].map(n=>n.id);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual(a.errors,[]);
  for(const route of ['semana','downloads','resumo']){
    a.w.SmartSomaUI.go(route);
    assert.equal(a.w.document.body.dataset.uiRoute,route);
    assert.equal(a.w.document.querySelectorAll('.home-list-page:not([hidden])').length,1);
    assert.equal(a.el('uiHeaderAvatar').hidden,false);
    assert.ok(a.el('uiHeaderAvatar').querySelector('img'));
  }
  for(const route of ['ganhos','despesas']){a.w.SmartSomaUI.go(route);await settle();assert.equal(a.w.document.body.dataset.uiRoute,'resumo');}
});

test('home places the weekly goal first without the promotional callout',t=>{
  const a=setup(t);a.w.SmartSomaUI.start();
  assert.equal(a.w.document.querySelector('.ui-home-callout'),null);
  assert.equal(a.el('resumoLiveContent').firstElementChild,a.el('metaSlotList'));
  assert.equal(fs.existsSync('car.png'),true);
  a.w.I18N.setLang('en');
  assert.equal(a.w.document.querySelector('.ui-home-callout'),null);
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

test('home period controls keep their geometry and rounded corners when unstuck',()=>{
  const css=fs.readFileSync('ui-v2.css','utf8');
  assert.match(css,/\.ui-v2 \.resumo-period-controls\s*\{[^}]*border-radius:14px;/);
  assert.match(css,/#resumoPeriodControls,\s*\.ui-v2 #resumoPeriodControls\.is-sticky\s*\{[^}]*min-height:58px;[^}]*padding:7px 8px;/);
  assert.match(css,/#resumoPeriodControls\.is-sticky\s*\{\s*border-color:[^;]+;\s*border-radius:0 0 14px 14px;/);
  assert.match(css,/\.resumo-current-week-label :is\(strong,span\)\s*\{\s*transition:color \.3s ease;/);
});

test('fixed chrome has readable text and avatars use Supabase Storage',()=>{
  const css=fs.readFileSync('ui-v2.css','utf8');
  const app=fs.readFileSync('app.js','utf8');
  const cloud=fs.readFileSync('cloud-init.js','utf8');
  const html=fs.readFileSync('app.html','utf8');
  const migration=fs.readFileSync('supabase/migrations/20261017043604_add_avatar_storage.sql','utf8');
  const keyMigration=fs.readFileSync('supabase/migrations/20261017061010_allow_dotted_user_data_keys.sql','utf8');
  assert.match(css,/\.ui-v2 \.ui-header\s*\{[^}]*background:var\(--app-chrome\);[^}]*backdrop-filter:none;/);
  assert.match(css,/\.resumo-period-controls\.is-sticky[^}]*resumo-current-week-label[^}]*\{[^}]*color:#eef4ec;/);
  assert.match(css,/\.semana-filter-controls\.is-sticky[^}]*semana-view-toggle-active-label[^}]*\{[^}]*color:#eef4ec;/);
  assert.match(css,/#resumoPeriodControls\.is-sticky #resumoCurrentWeekLabel > span\s*\{\s*color:#c8d8cb;/);
  assert.match(css,/\.semana-filter-fields \.semana-week-picker-btn,[^{]*\{[^}]*background:#fff;[^}]*color:#183021;/);
  assert.match(css,/\.semana-week-picker-num,[^{]*\{[^}]*background:#fff;[^}]*color:#183021;/);
  assert.match(html,/ui-v2\.css\?v=26/);
  assert.match(html,/accept="[^"]*\.heic[^"]*image\/heif/);
  assert.match(html,/<script src="heic2any\.min\.js\?v=12"><\/script>/);
  assert.match(app,/'image\/heic': true/);
  assert.doesNotMatch(app,/MAX_IMAGE_BYTES/);
  assert.match(app,/window\.heic2any\(\{ blob: file, toType: 'image\/jpeg'/);
  assert.match(app,/SmartSomaAvatarStorage\.upload\(avatarBlob\)/);
  assert.match(cloud,/sb\.storage\.from\('avatars'\)\.upload\(objectPath, blob,[\s\S]*upsert: true/);
  assert.match(cloud,/getPublicUrl\(objectPath\)/);
  assert.match(cloud,/script\.src = 'app\.js\?v=15'/);
  assert.match(cloud,/\^\[A-Za-z0-9:\._-\]\{1,120\}\$/);
  assert.match(migration,/INSERT INTO storage\.buckets \(id, name, public, file_size_limit, allowed_mime_types\)/);
  assert.match(migration,/VALUES \([\s\S]*'avatars',[\s\S]*true,[\s\S]*NULL/);
  assert.match(migration,/FOR INSERT TO authenticated[\s\S]*storage\.foldername\(name\)/);
  assert.match(migration,/FOR UPDATE TO authenticated[\s\S]*owner_id = \(SELECT auth\.uid\(\)\)::text/);
  assert.match(keyMigration,/CHECK \(key ~ '\^\[A-Za-z0-9:\._-\]\{1,120\}\$'\) NOT VALID/);
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

test('weekly table marks positive income and expenses, zero values and negative net',async t=>{
  const monday=new Date();monday.setHours(0,0,0,0);monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
  const a=setup(t,{
    ['homeBadgeValores:'+dateKey(monday)]:JSON.stringify({uber:.01,bolt:0}),
    ['despesasDiarias:'+dateKey(monday)]:JSON.stringify({items:[{descricao:'Despesa',valor:.02}]})
  });
  a.w.SmartSomaUI.start();a.w.SmartSomaUI.go('semana');await settle();a.w.SemanaView.showTable();
  const date=String(monday.getDate()).padStart(2,'0')+'/'+String(monday.getMonth()+1).padStart(2,'0');
  const rows=[...a.w.document.querySelectorAll('.semana-week-block tbody tr')];
  const row=rows.find(item=>item.querySelector('.semana-cell-date')?.textContent===date);
  const financial=row.querySelectorAll('.semana-metric-financeiro');
  assert.equal(financial[0].textContent,'€ 0.01');assert.ok(financial[0].classList.contains('has-value'));
  assert.equal(financial[1].textContent,'€ 0.02');assert.ok(financial[1].classList.contains('semana-cell-expense'));assert.ok(financial[1].classList.contains('has-value'));
  assert.equal(financial[2].textContent,'€ -0.01');assert.ok(financial[2].classList.contains('is-negative'));
  assert.ok(row.querySelector('.semana-metric-operacional.semana-cell-total').classList.contains('has-value'));
  const apps=row.querySelectorAll('.semana-metric-apps');assert.ok(apps[0].classList.contains('has-value'));
  assert.ok(!apps[1].classList.contains('has-value'));assert.ok(apps[1].querySelector('.semana-cell-value.is-zero'));
  const empty=rows.find(item=>item!==row && item.querySelector('.semana-metric-financeiro')?.textContent==='€ 0.00');
  assert.ok(empty);for(const cell of empty.querySelectorAll('.semana-cell-total')){assert.ok(!cell.classList.contains('has-value'));assert.ok(cell.querySelector('.semana-cell-value.is-zero'));}
  const css=fs.readFileSync('ui-v2.css','utf8');
  assert.match(css,/\.semana-cell-total\.has-value::after/);assert.match(css,/\.semana-cell-expense\.has-value::after[^}]*var\(--danger\)/);
  assert.match(css,/\.semana-cell-total\.has-value::after[^}]*width:min\(56px, calc\(100% - 18px\)\)/);
  assert.doesNotMatch(css,/--semana-bar-size/);assert.doesNotMatch(fs.readFileSync('app.js','utf8'),/--semana-bar-size/);
  assert.match(css,/\.semana-cell-value\.is-zero\s*\{\s*opacity:/);assert.match(css,/\.semana-cell-liquido\.is-negative\s*\{\s*color:var\(--danger\)/);
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

test('mobile home deletes only the confirmed daily expense and recalculates other days safely',async t=>{
  const today=new Date(),monday=new Date(today);monday.setHours(0,0,0,0);monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
  const other=new Date(monday);other.setDate(other.getDate()+1);
  const seed={
    ['homeBadgeValores:'+dateKey(monday)]:JSON.stringify({uber:100,distancia:30,despesas:45}),
    ['homeBadgeValores:'+dateKey(other)]:JSON.stringify({despesas:7}),
    ['metaSemanalConfig:'+dateKey(monday)]:JSON.stringify({valor:100,tipo:'liquido'}),
    ['despesasDiarias:'+dateKey(monday)]:JSON.stringify({seq:2,items:[{id:1,descricao:'Combustível',valor:20},{id:2,descricao:'Portagem',valor:5}]}),
    ['despesasDiarias:'+dateKey(other)]:JSON.stringify({seq:1,items:[{id:1,descricao:'Estacionamento',valor:7}]}),
    despesasFixas:JSON.stringify({items:[{id:1,descricao:'Seguro',tipo:'euro',valor:20,desde:dateKey(monday)}]})
  };
  const a=createApp(seed,{ui:true,mobile:true});t.after(a.close);await settle();
  const selectedBefore=dateKey(a.w.GanhosDate.get());
  assert.equal(a.el('uiGoalPercent').textContent,'48%');
  const buttons=()=>[...a.el('uiOverviewExpenseRows').querySelectorAll('.ui-expense-delete')];
  assert.equal(buttons().length,3);
  assert.equal(a.el('uiOverviewFixedRows').querySelector('.ui-expense-delete'),null);
  const fuel=()=>buttons().find(btn=>btn.getAttribute('aria-label').includes('Combustível'));
  fuel().click();assert.ok(a.el('despesaDiariaConfirmBackdrop').classList.contains('visible'));
  assert.match(a.el('despesaDiariaConfirmText').textContent,/Combustível/);
  a.click('despesaDiariaConfirmCancelBtn');assert.equal(JSON.parse(a.cache['despesasDiarias:'+dateKey(monday)]).items.length,2);
  fuel().click();a.click('despesaDiariaConfirmDeleteBtn');await settle();
  assert.deepEqual(JSON.parse(a.cache['despesasDiarias:'+dateKey(monday)]).items.map(item=>item.id),[2]);
  assert.equal(JSON.parse(a.cache['despesasDiarias:'+dateKey(other)]).items[0].id,1);
  assert.equal(a.w.SmartSomaReadModel.day(monday).expenses,25);
  assert.equal(JSON.parse(a.cache['homeBadgeValores:'+dateKey(monday)]).despesas,25);
  assert.equal(dateKey(a.w.GanhosDate.get()),selectedBefore);
  assert.doesNotMatch(a.el('uiOverviewExpenseRows').textContent,/Combustível/);
  assert.match(a.el('uiOverviewExpenseRows').textContent,/Portagem|Estacionamento/);
  assert.equal(buttons().length,2);assert.equal(a.el('uiMetricExpensesValue').textContent.includes('32,00'),true);
  assert.equal(a.el('uiGoalPercent').textContent,'68%');
  a.w.SmartSomaUI.go('semana');assert.equal(a.el('homeListPageSemana').querySelector('.ui-expense-delete'),null);
  assert.deepEqual(a.errors,[]);
});

test('mobile FAQ uses approved concise content in both languages',t=>{
  const a=createApp({},{ui:true,mobile:true});t.after(a.close);
  assert.equal(a.el('uiFaqItems').querySelectorAll('details').length,9);
  assert.match(a.el('uiFaqItems').textContent,/Em Início, encontras as informações da semana atual/);
  assert.match(a.el('uiFaqItems').textContent,/Para excluir uma despesa diária/);
  assert.doesNotMatch(a.el('uiFaqItems').textContent,/Visão geral|contacto@|Gerir plataformas/);
  a.w.I18N.setLang('en');assert.equal(a.el('uiFaqItems').querySelectorAll('details').length,9);
  assert.match(a.el('uiFaqItems').textContent,/To delete a daily expense/);
  assert.deepEqual(a.errors,[]);
});

test('daily expense deletion respects cancellation and the subscription gate',async t=>{
  const key='despesasDiarias:'+dateKey(new Date());
  const a=createApp({[key]:JSON.stringify({seq:2,items:[{id:1,descricao:'Lavagem',valor:10},{id:2,descricao:'Comida',valor:5}]})},{ui:true,mobile:true});t.after(a.close);
  const remove=()=>a.el('uiOverviewExpenseRows').querySelector('.ui-expense-delete');
  remove().click();a.click('despesaDiariaConfirmCancelBtn');assert.equal(JSON.parse(a.cache[key]).items.length,2);
  remove().click();a.w.SmartSomaPro.isPro=false;a.click('despesaDiariaConfirmDeleteBtn');
  assert.equal(JSON.parse(a.cache[key]).items.length,2);
  a.w.SmartSomaPro.isPro=true;remove().click();a.click('despesaDiariaConfirmDeleteBtn');await settle();
  assert.equal(JSON.parse(a.cache[key]).items.length,1);
  assert.equal(a.w.HomeBadges.get().despesas,a.w.SmartSomaReadModel.day(new Date()).expenses);
  assert.equal(a.w.HomeBadges.get().despesas,5);
  assert.deepEqual(a.errors,[]);
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
  assert.equal(a.w.document.querySelectorAll('#uiFaqItems details').length,9);
  a.w.I18N.setLang('en');await settle();assert.equal(a.el('uiFaqTitle').textContent,'FAQ');
  a.click('uiThemeRow');assert.ok(a.w.document.body.classList.contains('theme-dark'));assert.deepEqual(a.errors,[]);
});

test('settings menu opens internal pages and returns without the legacy sheet',t=>{
  const a=setup(t);a.w.SmartSomaUI.go('ajustes');
  const routes=[
    ['openDadosPessoaisBtn','sheetScreenDadosPessoais'],['openDespesasFixasBtn','sheetScreenDespesasFixas'],
    ['openMultiplataformaBtn','sheetScreenMultiplataforma'],['openIdiomaBtn','sheetScreenIdioma'],
    ['openTamanhoBtn','sheetScreenTamanho'],['openContactoBtn','sheetScreenContacto'],['openAjudaBtn','sheetScreenAjuda'],['openApagarDadosBtn','sheetScreenApagarDados']
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

test('contact and FAQ use a single visual card without changing other settings pages',t=>{
  const css=fs.readFileSync('ui-v2.css','utf8');
  assert.match(css,/body\.ui-v2 \.ui-settings-subpage-body:has\(\.ui-help-hero\),\s*body\.ui-v2 \.ui-settings-subpage-body:has\(\.ui-faq\)\s*\{[^}]*padding:0;[^}]*border:0;[^}]*background:transparent;[^}]*box-shadow:none;/);
  assert.ok(css.indexOf('body.ui-v2 .ui-settings-subpage-body:has(.ui-help-hero)')>css.indexOf('body.ui-v2.theme-dark :is(.home-card'));
  const a=setup(t);a.w.SmartSomaUI.go('ajustes');
  for(const [buttonId,selector] of [['openContactoBtn','.ui-help-hero'],['openAjudaBtn','.ui-faq']]){
    a.click(buttonId);
    const body=a.el('uiSettingsPage').querySelector('.ui-settings-subpage-body');
    assert.equal(body.querySelectorAll(selector).length,1);
    assert.equal(body.querySelectorAll('.ui-help-hero,.ui-faq').length,1);
    body.parentElement.querySelector('.ui-settings-back').click();
  }
  a.click('openIdiomaBtn');
  const body=a.el('uiSettingsPage').querySelector('.ui-settings-subpage-body');
  assert.equal(body.querySelector('.ui-help-hero,.ui-faq'),null);
  assert.ok(body.querySelector('#langOptionsList'));assert.deepEqual(a.errors,[]);
});

test('contact fields remain visible when the Android keyboard resizes the viewport',async t=>{
  const a=createApp({},{ui:true,mobile:true,nativeAndroid:true});t.after(a.close);
  a.w.SmartSomaUI.go('ajustes');a.click('openContactoBtn');
  const field=a.el('uiContactSubject');
  a.w.document.querySelector('.ui-header').getBoundingClientRect=()=>({bottom:82});
  field.getBoundingClientRect=()=>({top:260,bottom:305});
  const scrolls=[];a.w.scrollBy=options=>scrolls.push(options.top);
  field.focus();await settle();assert.deepEqual(scrolls,[]);
  a.w.visualViewport.height=280;
  a.w.visualViewport.dispatchEvent(new a.w.Event('resize'));await settle();
  assert.deepEqual(scrolls,[162]);
  field.blur();a.w.visualViewport.dispatchEvent(new a.w.Event('resize'));await settle();
  assert.deepEqual(scrolls,[162]);
});

test('contact keeps identity from the session and allows safe retries',async t=>{
  const a=setup(t);
  a.w.currentUser={id:'test-user'};
  a.w.currentUserEmail='pessoa@example.com';
  a.el('sheetUsername').textContent='Pessoa Teste';
  const calls=[];
  let finish;
  a.w.supabaseClient={functions:{invoke:(name,{body})=>{
    calls.push({name,id:body.get('id'),subject:body.get('subject'),message:body.get('message')});
    return new Promise(resolve=>{finish=resolve;});
  }}};
  a.w.SmartSomaUI.go('ajustes');a.click('openContactoBtn');
  assert.equal(a.el('uiContactName').value,'Pessoa Teste');
  assert.equal(a.el('uiContactEmail').value,'pessoa@example.com');
  a.el('uiContactSubject').value='Ajuda';a.el('uiContactMessage').value='A minha mensagem';
  const submitContact=()=>a.el('uiContactForm').dispatchEvent(new a.w.Event('submit',{bubbles:true,cancelable:true}));
  submitContact();
  assert.equal(a.el('uiContactSubject').disabled,true);
  assert.equal(a.el('uiContactMessage').disabled,true);
  assert.equal(a.el('uiContactAttachment').disabled,true);
  assert.equal(calls[0].name,'support-contact');
  finish({error:new Error('offline')});await settle();
  assert.equal(a.el('uiContactSubject').disabled,false);
  assert.equal(a.el('uiContactMessage').value,'A minha mensagem');
  assert.match(a.el('uiContactStatus').textContent,/Não foi possível/);
  submitContact();assert.equal(calls[1].id,calls[0].id);
  finish({data:{ok:true},error:null});await settle();
  assert.match(a.el('uiContactStatus').textContent,/Mensagem enviada/);
  assert.equal(a.el('uiContactMessage').value,'');
  assert.deepEqual(a.errors,[]);
});

test('desktop web aligns the support card without changing the native layout',()=>{
  const css=fs.readFileSync('ui-v2.css','utf8');
  const prepare=fs.readFileSync('scripts/prepare-capacitor.cjs','utf8');
  assert.match(css,/@media \(min-width:768px\)\s*\{\s*html:not\(:has\(link\[href="native-splash\.css"\]\)\) \.ui-v2 #uiSettingsPage \.sheet-actions:not\(\.ui-settings-group\)\s*\{\s*max-width:none;/);
  assert.match(prepare,/href="native-splash\.css"/);
});

test('settings groups contact and FAQ separately and preserves instant navigation',t=>{
  const a=setup(t);a.w.SmartSomaUI.go('ajustes');
  const groups=[...a.el('uiSettingsPage').querySelectorAll('.sheet-actions')].filter(group=>!group.hidden);
  assert.deepEqual(groups.map(group=>group.dataset.title),['Gestão','Preferências','Conta e suporte']);
  assert.deepEqual(groups.map(group=>[...group.children].map(node=>node.id)),[
    ['openDespesasFixasBtn','openMultiplataformaBtn'],
    ['openIdiomaBtn','openTamanhoBtn','uiThemeRow'],
    ['openContactoBtn','openAjudaBtn','openApagarDadosBtn','openTermosMenuBtn','btnSair']
  ]);
  assert.match(a.el('uiSettingsPage').querySelector('.sheet-credit-text').textContent,/© 2026 SmartSoma v1\.0 • By JC/);
  a.click('openContactoBtn');
  assert.equal(a.el('uiSettingsPage').querySelector('.ui-settings-subpage-head h2').textContent,'Contacto');
  assert.ok(a.el('uiSettingsPage').querySelector('.ui-help-hero a[href="mailto:contacto@smartsoma.pt"]'));
  assert.equal(a.el('uiSettingsPage').querySelector('.ui-faq'),null);
  a.el('uiSettingsPage').querySelector('.ui-settings-back').click();
  a.click('openAjudaBtn');
  assert.equal(a.el('uiSettingsPage').querySelector('.ui-settings-subpage-head h2').textContent,'Perguntas frequentes');
  assert.equal(a.el('uiSettingsPage').querySelector('.ui-help-hero'),null);
  assert.equal(a.el('uiFaqItems').querySelectorAll('details').length,9);
  a.w.SmartSomaUI.go('semana');assert.equal(a.el('homeListPageSemana').hidden,false);
  a.w.SmartSomaUI.go('downloads');assert.equal(a.el('homeListPageRelatorio').hidden,false);
  assert.equal(a.el('homeListPageSemana').hidden,true);
  a.w.SmartSomaUI.go('ajustes');assert.equal(a.el('uiSettingsPage').hidden,false);
  assert.equal(a.el('homeListPageRelatorio').hidden,true);
  assert.equal(a.w.document.querySelector('.home-list-page.is-fading'),null);
  assert.deepEqual(a.errors,[]);
});

test('quick entry blocks writes for inactive subscriptions',t=>{
  const a=setup(t);a.w.SmartSomaPro.isPro=false;a.click('uiAdd');a.w.document.querySelector('[data-platform="uber"]').click();a.input('uiEntryValue','30');submit(a);
  assert.equal(a.w.HomeBadges.get().uber,0);
});
