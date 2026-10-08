const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp, dateKey } = require('./app-harness.cjs');
const settle = () => new Promise(resolve => setTimeout(resolve, 180));
function submit(a) { a.el('uiEntryForm').dispatchEvent(new a.w.Event('submit', { bubbles:true, cancelable:true })); }
function setup(t,seed={}) { const a=createApp(seed,{ui:true}); t.after(a.close);return a; }

test('UI initializes once with six sections, unique IDs and no runtime errors',async t=>{
  const a=setup(t);a.w.SmartSomaUI.start();await settle();
  assert.equal(a.w.document.querySelectorAll('.ui-nav-item').length,6);
  assert.equal(a.el('uiChart').querySelectorAll('.ui-rhythm-row').length,7);
  const ids=[...a.w.document.querySelectorAll('[id]')].map(n=>n.id);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual(a.errors,[]);
  for(const route of ['ganhos','semana','relatorio','despesas','resumo']){
    a.w.SmartSomaUI.go(route);await settle();
    assert.equal(a.w.document.body.dataset.uiRoute,route);
    assert.equal(a.w.document.querySelectorAll('.home-list-page:not([hidden])').length,1);
  }
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
  let weeklyPageShown=0;a.w.document.addEventListener('semanaPageShown',()=>weeklyPageShown++);
  a.click('uiChartDetails');await new Promise(resolve=>setTimeout(resolve,340));
  assert.equal(a.w.document.body.dataset.uiRoute,'semana');
  assert.equal(a.el('homeListPageSemana').hidden,false);
  assert.equal(weeklyPageShown,1);
  assert.deepEqual(a.errors,[]);
});

test('quick entry requires platform and supports selecting, deselecting and replacing',t=>{
  const a=setup(t);a.click('uiAdd');assert.equal(a.el('uiEntryDialog').open,true);
  a.input('uiEntryValue','50');submit(a);assert.match(a.el('uiEntryError').textContent,/plataforma/);
  a.w.document.querySelector('[data-platform="uber"]').click();
  assert.equal(a.el('uiPlatformName').textContent,'Uber');
  a.w.document.querySelector('[data-platform="uber"]').click();assert.equal(a.el('uiPlatformName').textContent,'Selecione');
  a.w.document.querySelector('[data-platform="bolt"]').click();a.input('uiEntryValue','123,45');submit(a);
  assert.equal(a.w.HomeBadges.get().bolt,123.45);assert.equal(a.el('uiEntryDialog').open,false);
  a.click('uiIncomeAdd');a.w.document.querySelector('[data-platform="bolt"]').click();
  assert.equal(a.el('uiEntryValue').value,'123.45');a.input('uiEntryValue','40');submit(a);
  assert.equal(a.w.HomeBadges.get().bolt,40);
});

test('quick expense saves through the existing daily expense control and updates totals',async t=>{
  const a=setup(t);a.click('uiAdd');a.click('uiEntryExpense');a.input('uiEntryDescription','Portagem');a.input('uiEntryValue','5,25');submit(a);await settle();
  const saved=JSON.parse(a.cache['despesasDiarias:'+dateKey(new Date())]);
  assert.equal(saved.items[0].descricao,'Portagem');assert.equal(saved.items[0].valor,5.25);
  assert.equal(a.w.HomeBadges.get().despesas,5.25);assert.match(a.el('uiExpenseRows').textContent,/Portagem/);
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
  assert.ok(a.el('profileSheet').classList.contains('open'));
  assert.equal(a.el('openTermosMenuBtn').href,'https://smartsoma.pt/legal');
  assert.equal(a.w.document.querySelectorAll('.tamanho-option').length,2);
  assert.match(a.el('tamanhoOptionP').textContent,/Normal/);
  assert.equal(a.w.document.querySelectorAll('#uiFaqItems details').length,11);
  a.w.I18N.setLang('en');await settle();assert.match(a.el('uiFaqTitle').textContent,/Frequently/);
  a.click('uiThemeRow');assert.ok(a.w.document.body.classList.contains('theme-dark'));assert.deepEqual(a.errors,[]);
});

test('quick entry blocks writes for inactive subscriptions',t=>{
  const a=setup(t);a.w.SmartSomaPro.isPro=false;a.click('uiAdd');a.w.document.querySelector('[data-platform="uber"]').click();a.input('uiEntryValue','30');submit(a);
  assert.equal(a.w.HomeBadges.get().uber,0);
});
