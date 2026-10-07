const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createApp, dateKey } = require('./app-harness.cjs');
const settle = () => new Promise(r => setTimeout(r, 180));
function setup(t, seed = {}) { const a = createApp(seed, { ui:true }); t.after(a.close); return a; }

test('real cloud bootstrap hydrates before rendering and quick entry uses the existing sync queue',async t=>{
  const a=createApp({['homeBadgeValores:'+dateKey(new Date())]:JSON.stringify({uber:35,bolt:10})},{ui:true,cloudBoot:true});t.after(a.close);
  for(let i=0;i<20&&(a.el('homeListPageResumo').hidden||!a.w.SmartSomaUI.openEntry);i++) await settle();
  assert.equal(a.w._cacheReady,true);assert.equal(a.w.currentUser.id,'isolated-test');
  assert.equal(a.w.document.body.dataset.uiRoute,'resumo');
  assert.equal(a.el('homeListPageResumo').hidden,false);
  assert.equal(a.w.document.querySelectorAll('.home-list-page:not([hidden])').length,1);
  assert.equal(a.w.HomeBadges.get().uber,35);
  a.click('uiAdd');a.w.document.querySelector('[data-platform="uber"]').click();a.input('uiEntryValue','60');
  a.el('uiEntryForm').dispatchEvent(new a.w.Event('submit',{cancelable:true}));await settle();
  const saved=a.writes.filter(row=>row.key==='homeBadgeValores:'+dateKey(new Date())).at(-1);
  assert.equal(saved.user_id,'isolated-test');assert.equal(JSON.parse(saved.value).uber,60);
  assert.equal(JSON.parse(a.w.cloudGet(saved.key)).bolt,10);assert.deepEqual(a.errors,[]);
  Object.defineProperty(a.w.navigator,'onLine',{value:false,configurable:true});
  const sent=a.writes.length;await a.w.cloudSet('offlineRegression',JSON.stringify({value:7}));
  assert.equal(a.writes.length,sent);assert.match(a.w.localStorage.getItem('ss_q:isolated-test'),/offlineRegression/);
  Object.defineProperty(a.w.navigator,'onLine',{value:true,configurable:true});
  a.w.dispatchEvent(new a.w.Event('online'));await settle();
  assert.equal(a.writes.at(-1).key,'offlineRegression');
  assert.equal(a.w.localStorage.getItem('ss_q:isolated-test'),null);
});

test('calendar edits the selected day without changing today', async t => {
  const today = new Date(); const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  const a = setup(t, { ['homeBadgeValores:'+dateKey(today)]:JSON.stringify({uber:75}) });
  a.click('uiCalendar');
  if (yesterday.getMonth() !== today.getMonth()) a.click('mmCalPrevBtn');
  [...a.el('mmCalendarDays').querySelectorAll('button')].find(b => b.textContent === String(yesterday.getDate())).click();
  assert.equal(dateKey(a.w.GanhosDate.get()), dateKey(yesterday));
  a.click('uiAdd'); a.w.document.querySelector('[data-platform="uber"]').click();
  a.input('uiEntryValue','42');
  a.el('uiEntryForm').dispatchEvent(new a.w.Event('submit',{bubbles:true,cancelable:true}));
  await settle();
  assert.equal(JSON.parse(a.cache['homeBadgeValores:'+dateKey(yesterday)]).uber,42);
  assert.equal(JSON.parse(a.cache['homeBadgeValores:'+dateKey(today)]).uber,75);
  assert.match(a.el('uiDailyTitle').textContent,new RegExp(String(yesterday.getDate())));
  assert.deepEqual(a.errors,[]);
});

test('custom platform creation, quick entry and confirmed deletion preserve earlier history', async t => {
  const a = setup(t); a.click('uiManagePlatforms'); a.input('mpNovaInput','Entrega'); a.click('mpSalvarBtn');
  const p = a.w.SmartSomaReadModel.platforms()[0]; assert.equal(p.nome,'Entrega');
  const old = new Date(); old.setDate(old.getDate()-14);
  a.cache['homeBadgeValores:'+dateKey(old)] = JSON.stringify({plat:{[p.id]:20}});
  a.click('uiAdd'); a.w.document.querySelector('[data-platform="'+p.id+'"]').click();
  a.input('uiEntryValue','50'); a.el('uiEntryForm').dispatchEvent(new a.w.Event('submit',{cancelable:true}));
  assert.equal(a.w.HomeBadges.getPlat(p.id),50);
  a.click('uiManagePlatforms');
  assert.equal(a.el('mpListaAtuais').querySelectorAll('.mp-card-del').length,1);
  a.el('mpListaAtuais').querySelector('.mp-card-del').click();
  assert.ok(a.el('mpConfirmBackdrop').classList.contains('visible'));
  a.click('mpConfirmCancelBtn'); assert.equal(a.w.SmartSomaReadModel.platforms().length,1);
  a.el('mpListaAtuais').querySelector('.mp-card-del').click(); a.click('mpConfirmDeleteBtn'); await settle();
  assert.equal(a.w.SmartSomaReadModel.platforms().length,0);
  assert.equal(JSON.parse(a.cache['homeBadgeValores:'+dateKey(old)]).plat[p.id],20);
  assert.equal(a.el('mpListaAtuais').querySelectorAll('.mp-card').length,2);
  assert.deepEqual(a.errors,[]);
});

test('previous-week goal uses original historical calculation without writes', async t => {
  const monday = new Date(); monday.setDate(monday.getDate()-(monday.getDay()+6)%7-7);
  const a = setup(t, {
    ['metaSemanalConfig:'+dateKey(monday)]:JSON.stringify({valor:200,tipo:'bruto'}),
    ['homeBadgeValores:'+dateKey(monday)]:JSON.stringify({uber:100,bolt:50})
  });
  a.w.document.querySelector('[data-period="semana"]').click(); a.click('periodNavPrev'); await settle();
  assert.equal(a.el('uiGoalHistory').hidden,false);
  assert.match(a.el('uiGoalHistory').textContent,/75%/);
  assert.equal(a.el('uiGoalFill').style.width,'75%');
  const before=JSON.stringify(a.cache); a.click('uiGoalHistory');
  assert.match(a.el('metaSemanalHistBody').textContent,/150.00/);
  assert.equal(JSON.stringify(a.cache),before);
});

test('PDF report is generated with the real bundled libraries', async t => {
  const a = setup(t, { ['homeBadgeValores:'+dateKey(new Date())]:JSON.stringify({uber:150,bolt:40,distancia:80}) });
  a.w.eval(fs.readFileSync('jspdf.umd.min.js','utf8'));
  a.w.eval(fs.readFileSync('jspdf.plugin.autotable.min.js','utf8'));
  const Original=a.w.jspdf.jsPDF; let pdf;
  function Capture(options) { const doc=new Original(options); doc.save=name=>{pdf={name,content:doc.output()};}; return doc; }
  Capture.API=Original.API; a.w.jspdf.jsPDF=Capture;
  a.click('relatorioPageDownloadBtn'); await settle();
  assert.ok(pdf,'PDF save was called'); assert.match(pdf.name,/smartsoma-relatorio-\d{2}-\d{4}\.pdf/);
  assert.ok(pdf.content.startsWith('%PDF-')); assert.match(pdf.content,/150\.00/);
  assert.equal(a.el('relatorioPageDownloadBtn').disabled,false);
  assert.deepEqual(a.errors,[]);
});

for (const [label,data,error,active] of [
  ['active',{status:'active'},null,true],
  ['trial',{status:'trialing',trial_ends_at:new Date(Date.now()+86400000*5).toISOString()},null,true],
  ['canceled with paid time',{status:'canceled',current_period_end:new Date(Date.now()+86400000).toISOString()},null,true],
  ['expired',{status:'canceled',current_period_end:'2020-01-01'},null,false],
  ['no subscription',null,null,false],
  ['server failure',null,{message:'isolated failure'},false]
]) test('original subscription gate: '+label,async t=>{
  const a=setup(t); a.w._cacheReady=true; let flush=0,discard=0;
  a.w.cloudFlushPendingWrites=()=>flush++; a.w.cloudDiscardPendingWrites=()=>discard++;
  a.w.supabaseClient={auth:{onAuthStateChange(){}},from(table){assert.equal(table,'subscriptions');return{select(){return this;},eq(key,id){assert.equal(key,'user_id');assert.equal(id,'isolated-test');return this;},async maybeSingle(){return{data,error};}};}};
  const code=[...a.w.document.querySelectorAll('script:not([src])')].find(s=>s.textContent.includes('window.SmartSomaPro =')).textContent;
  a.w.eval(code); await settle();
  assert.equal(a.w.SmartSomaPro.isPro,active);
  assert.equal(a.el('subExpiradaBackdrop').classList.contains('visible'),!active);
  if(active) assert.ok(flush>0); else if(!error) assert.ok(discard>0);
  assert.deepEqual(a.errors,[]);
});

test('offline cache includes both new presentation assets and excludes test fixture',()=>{
  const source=fs.readFileSync('sw.js','utf8');
  assert.match(source,/'\/ui-v2.js'/); assert.match(source,/'\/ui-v2.css'/);
  assert.doesNotMatch(source,/__ui-test|visual-fixture/);
  assert.match(fs.readFileSync('.vercelignore','utf8'),/^tests\//m);
});

test('fixed expense creation and deletion require confirmation and refresh displayed totals',async t=>{
  const a=setup(t);a.w.SmartSomaUI.go('ajustes');a.click('openDespesasFixasBtn');a.click('uiFixedAdd');
  a.click('despesaTipoEuroBtn');a.input('despesaDescInput','Seguro');a.input('despesaValorInput','25');a.click('despesaSalvarBtn');await settle();
  const items=JSON.parse(a.cache.despesasFixas).items; assert.equal(items.length,1);assert.equal(items[0].valor,25);
  a.w.document.querySelector('[data-period="semana"]').click();await settle();
  assert.equal(a.el('summaryDespesasValue').textContent,'€25.00');
  assert.equal(a.el('summaryLiquidoValue').textContent,'€-25.00');
  a.w.document.querySelector('#sheetScreenDespesasFixas .despesa-delete-btn').click();
  assert.ok(a.el('despesaConfirmBackdrop').classList.contains('visible'));
  assert.ok(!JSON.parse(a.cache.despesasFixas).items[0].ate);
  a.click('despesaConfirmDeleteBtn');await settle();
  assert.ok(JSON.parse(a.cache.despesasFixas).items[0].ate);
  assert.equal(a.el('summaryDespesasValue').textContent,'€0.00');
});
