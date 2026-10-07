// Synthetic values only. No session, no production APIs, no credentials.
(function(){
  var cache={};
  var today=new Date();today.setHours(0,0,0,0);
  var monday=new Date(today);monday.setDate(today.getDate()-(today.getDay()+6)%7);
  function key(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  for(var i=0;i<7;i++){var d=new Date(monday);d.setDate(d.getDate()+i);if(d>today)break;cache['homeBadgeValores:'+key(d)]=JSON.stringify({uber:90+i*15,bolt:40+i*10,despesas:15,distancia:90+i*8});cache['despesasDiarias:'+key(d)]=JSON.stringify({items:[{id:'expense-'+i,descricao:'Combustível',valor:15}]});}
  cache['mydocs.profile']=JSON.stringify({name:'João Silva'});
  cache['metaSemanalConfig:'+key(monday)]=JSON.stringify({valor:650,tipo:'bruto'});
  cache['metaSemanalLastPromptWeek']=key(monday);
  cache['tutorialVisto']='1';
  window._cloudCache=cache;
  window.cloudGet=function(k){return cache[k]||null;};
  window.cloudSet=function(k,v){cache[k]=v;return Promise.resolve();};
  window.cloudRemove=function(k){delete cache[k];return Promise.resolve();};
  window.currentUser={id:'visual-qa'};window.currentUserEmail='teste@example.invalid';
  window.SmartSomaPro={isPro:true,entitlementChecked:false};
  document.getElementById('splash')?.remove();
})();
