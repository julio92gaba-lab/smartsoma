const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createApp,dateKey}=require('./app-harness.cjs');
const settle=()=>new Promise(resolve=>setTimeout(resolve,180));
function setup(t,seed={}){const a=createApp(seed,{ui:true});t.after(a.close);return a;}
function monday(){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(d.getDay()+6)%7);return d;}
function offset(d,n){const result=new Date(d);result.setDate(result.getDate()+n);return result;}

test('home metrics keep the mockup order and use real net/km and expense ratio',async t=>{
  const date=dateKey(new Date());
  const a=setup(t,{['homeBadgeValores:'+date]:JSON.stringify({uber:150,bolt:50,distancia:100}),['despesasDiarias:'+date]:JSON.stringify({items:[{id:'fuel',descricao:'Fuel',valor:40}]})});
  await settle();
  assert.deepEqual([...a.w.document.querySelectorAll('.ui-metric p')].map(n=>n.textContent),['Lucro líquido','Ganhos brutos','Despesas','Distância']);
  assert.match(a.el('uiMetricNetValue').textContent,/160,00/);
  assert.match(a.el('uiMetricDistanceNote').textContent,/1,60.*líquidos/);
  assert.match(a.el('uiMetricExpensesNote').textContent,/20%/);
  assert.match(a.el('uiMetricGrossNote').textContent,/2 plataformas/);
  assert.deepEqual(a.errors,[]);
});

test('current week compares equal elapsed weekdays, not the whole previous week',async t=>{
  const mon=monday(),today=new Date(),priorDay=offset(today,-7);
  const seed={['homeBadgeValores:'+dateKey(today)]:JSON.stringify({uber:150}),['homeBadgeValores:'+dateKey(priorDay)]:JSON.stringify({uber:100})};
  const elapsed=(today.getDay()+6)%7;
  if(elapsed<6)seed['homeBadgeValores:'+dateKey(offset(mon,-1))]=JSON.stringify({uber:900});
  const a=setup(t,seed);await settle();
  assert.match(a.el('uiMetricNetNote').textContent,/\+50%.*mesmos dias da semana anterior/);
});

test('empty and negative data never display invalid percentages or divide by zero',async t=>{
  const a=setup(t);await settle();
  assert.match(a.el('uiMetricNetNote').textContent,/Sem base/);
  assert.match(a.el('uiMetricDistanceNote').textContent,/Sem quilometragem/);
  assert.match(a.el('uiMetricExpensesNote').textContent,/Sem ganhos/);
  assert.match(a.el('uiGoalTitle').textContent,/Dá uma direção/);
  const key=dateKey(new Date());a.cache['despesasDiarias:'+key]=JSON.stringify({items:[{id:'expense',descricao:'Fuel',valor:20}]});
  a.cache['homeBadgeValores:'+key]=JSON.stringify({distancia:10});a.w.SmartSomaUI.refresh();
  assert.match(a.el('uiMetricDistanceNote').textContent,/-2,00/);
  assert.doesNotMatch(a.w.document.querySelector('.ui-metrics').textContent,/NaN|Infinity/);
});

test('goal type uses existing save flow, preserves amount and exposes seven daily values',async t=>{
  const date=dateKey(new Date());
  const a=setup(t,{['metaSemanalConfig:'+dateKey(monday())]:JSON.stringify({valor:200,tipo:'bruto'}),['homeBadgeValores:'+date]:JSON.stringify({uber:100,despesas:20}),['despesasDiarias:'+date]:JSON.stringify({items:[{id:1,descricao:'Fuel',valor:20}]})});
  await settle();assert.ok(a.el('metaSemanalCard').querySelector('.ui-goal-watermark text'));assert.ok(a.el('uiGoalEdit').closest('.ui-goal-topline'));assert.equal(a.el('uiGoalType').textContent,'Concluído');a.click('uiGoalNet');await settle();
  const goal=JSON.parse(a.cache['metaSemanalConfig:'+dateKey(monday())]);
  assert.equal(goal.tipo,'liquido');assert.equal(goal.valor,200);
  assert.equal(a.el('uiGoalPercent').textContent,'40%');
  assert.equal(a.el('uiGoalNet').getAttribute('aria-pressed'),'true');
  assert.equal(a.el('uiGoalDays').children.length,7);
  assert.match(a.el('uiGoalDays').textContent,/80,00/);
  a.click('uiGoalEdit');assert.equal(a.el('metaSemanalModalBackdrop').classList.contains('visible'),true);
  assert.equal(a.el('metaSemanalValorInput').value,'200');
});

test('home goal keeps the single-crossing celebration and caps only the progress bar',async t=>{
  const a=setup(t,{['metaSemanalConfig:'+dateKey(monday())]:JSON.stringify({valor:100,tipo:'bruto'})});
  let events=0;a.w.document.addEventListener('metaSemanalAtingida',()=>events++);
  a.input('uberValorInput','120');a.click('uberSalvarBtn');await settle();
  assert.equal(events,1);assert.equal(a.el('uiGoalPercent').textContent,'120%');
  assert.equal(a.el('uiGoalFill').style.width,'100%');assert.match(a.el('uiGoalTitle').textContent,/atingida/);
  a.w.SmartSomaUI.refresh();assert.equal(events,1);
});

test('font assets are local, cached offline and mobile home selectors target the body',()=>{
  const css=fs.readFileSync('ui-v2.css','utf8'),html=fs.readFileSync('app.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
  for(const name of ['BricolageGrotesque-latin.woff2','DMSans-latin.woff2']){
    assert.equal(fs.readFileSync('fonts/'+name).subarray(0,4).toString(),'wOF2');assert.ok(css.includes(name)&&html.includes(name)&&sw.includes(name));
  }
  assert.match(css,/body\.ui-v2:not\(\.ui-home\) \.ui-header-copy/);
  assert.match(css,/\.ui-header h1 \{[^}]*text-overflow:ellipsis;[^}]*white-space:nowrap;/);
  assert.match(css,/\.ui-sidebar-avatar img,\.ui-header-avatar img \{[^}]*border-radius:inherit;[^}]*object-fit:cover;[^}]*object-position:center;/);
  assert.match(css,/body\.ui-v2\.ui-home \.ui-header-avatar:has\(img\) \{ background:transparent; \}/);
  assert.match(css,/body\.ui-v2\.ui-home \.ui-header-avatar:has\(img\) img \{ object-fit:contain; \}/);
  assert.match(css,/body\.ui-v2 \{ overflow:visible; \}/);
});
