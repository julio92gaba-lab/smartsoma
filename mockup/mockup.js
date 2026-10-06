(() => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const data = {
    bruto: { earned: 516, target: 600, percent: 84, remaining: 84 },
    liquido: { earned: 382.4, target: 450, percent: 85, remaining: 67.6 }
  };
  const euro = value => value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });

  function openView(name) {
    const button = $(`.nav-item[data-view="${name}"]`);
    const titles = { inicio: 'Bom dia, João <span>✦</span>', ganhos: 'Ganhos diários', despesas: 'Despesas', semana: 'Detalhe semanal', relatorios: 'Relatórios', ajustes: 'Ajustes', ajuda: 'Ajuda e tutorial' };
    $$('.nav-item').forEach(item => item.classList.toggle('active', button ? item === button : false));
    $$('[data-content]').forEach(view => view.classList.toggle('active', view.dataset.content === button.dataset.view));
    $('.topbar').classList.toggle('subpage', name !== 'inicio');
    $('#page-title').innerHTML = titles[name];
  }
  $$('.nav-item').forEach(button => button.addEventListener('click', () => openView(button.dataset.view)));
  $('.profile').addEventListener('click', () => openView('ajustes'));

  $$('.goal-type').forEach(button => button.addEventListener('click', () => {
    const goal = data[button.dataset.type];
    $$('.goal-type').forEach(item => item.classList.toggle('active', item === button));
    $('#earned').textContent = euro(goal.earned);
    $('#target').textContent = euro(goal.target);
    $('#remaining').textContent = euro(goal.remaining);
    $('#goal-percent').textContent = `${goal.percent}%`;
    $('#progress-fill').style.width = `${goal.percent}%`;
  }));

  $$('#open-entry, .view-heading .add-button').forEach(button => button.addEventListener('click', () => $('#entry-modal').classList.add('open')));
  $$('.close-modal').forEach(button => button.addEventListener('click', () => button.closest('.entry-modal').classList.remove('open')));
  $('#entry-modal').addEventListener('click', event => { if (event.target === event.currentTarget) event.currentTarget.classList.remove('open'); });
  $$('.choice').forEach(button => button.addEventListener('click', () => $$('.choice').forEach(item => item.classList.toggle('active', item === button))));
  $$('.entry-type .choice').forEach(button => button.addEventListener('click', () => {
    const type = button.dataset.entryType;
    $('.entry-platform-wrap').hidden = type !== 'ganho';
    $('#entry-description-wrap').hidden = type === 'km';
    $('#entry-value-wrap').querySelector('label')?.remove;
    $('#entry-value-wrap').firstChild.textContent = type === 'km' ? 'Quilómetros ' : 'Valor ';
    $('#entry-helper').textContent = type === 'ganho' ? 'Seleciona a plataforma onde recebeste este rendimento.' : type === 'despesa' ? 'Regista uma despesa avulsa do dia.' : 'Podes lançar o total ou a diferença entre início e fim.';
  }));
  $('.save-entry').addEventListener('click', () => $('#entry-modal').classList.remove('open'));

  const demoModal = $('#demo-modal');
  const demoText = {
    'Editar meta ↗': ['Meta semanal', 'Define o teu objetivo visualmente em bruto ou líquido.', 'goal'],
    'Esta semana ⌄': ['Selecionar período', 'Escolhe o intervalo que queres consultar.', 'period'],
    'Gerir plataformas →': ['Multiplataforma', 'Adiciona, edita ou reorganiza as plataformas que aparecem nos teus ganhos.', 'platform'],
    'Editar distância': ['Quilómetros percorridos', 'Escolhe como queres registar a distância do dia.', 'distance'],
    '↓ Descarregar PDF': ['Relatório pronto', 'No produto real, este passo irá gerar o teu PDF. Aqui é apenas uma pré-visualização.', 'report'],
    'Ver detalhe →': ['Ritmo dos teus ganhos', 'Uma vista expandida do gráfico por semana, com bruto e líquido.', 'chart'],
    'Ver todos →': ['Todos os registos', 'Lista completa de ganhos e despesas do período selecionado.', 'list'],
    '+ Adicionar': ['Nova despesa fixa', 'Despesas que se repetem todas as semanas, em valor fixo ou percentagem do bruto.', 'fixed'],
    'Perfil e dados da conta': ['Perfil e Dados da Conta', 'Atualiza os dados associados à tua conta.', 'profile'],
    'Despesas fixas': ['Despesas Fixas', 'Estes valores são lançados uma vez por semana, à segunda-feira.', 'fixed-list'],
    'Multiplataforma': ['Multiplataforma', 'Adiciona ou remove plataformas além de Uber e Bolt.', 'platform'],
    'Idioma': ['Idioma', 'Escolhe o idioma apresentado no SmartSoma.', 'language'],
    'Tamanho do texto': ['Tamanho da fonte', 'Escolhe o tamanho que torna a leitura mais confortável.', 'font'],
    'Ajuda e tutorial': ['Tutorial', 'Podes voltar a ver o guia de utilização sempre que quiseres.', 'tutorial'],
    'Limpar dados de demonstração': ['Apagar dados', 'A eliminação dos dados é permanente e irreversível. A tua conta continua ativa.', 'delete'],
    'Terminar sessão': ['Terminar sessão', 'Queres terminar a sessão neste dispositivo?', 'signout'],
    'Notificações': ['Notificações', 'Não tens notificações novas.', 'notifications'],
    'Falar connosco': ['Falar connosco', 'Envia uma mensagem à equipa SmartSoma.', 'contact'],
    'Termos e Privacidade': ['Termos e Privacidade', 'Consulta as condições de utilização e a política de privacidade.', 'legal']
  };
  function openDemo(title, description, type = 'default') {
    $('#demo-title').textContent = title;
    $('#demo-copy').textContent = description;
    const body = $('#demo-body');
    const tag = $('#demo-tag');
    tag.textContent = type === 'report' ? 'EXPORTAÇÃO' : type === 'goal' ? 'META SEMANAL' : 'CONFIGURAÇÃO';
    const templates = {
      goal: '<div class="demo-switch"><button class="active">Bruto</button><button>Líquido</button></div><div class="demo-fields"><label>Valor da meta<input value="600,00" inputmode="decimal"></label></div><div class="demo-option active"><span>Aplicar despesas fixas<small>Inclui as despesas recorrentes desta semana.</small></span><b>✓</b></div>',
      distance: '<div class="demo-switch"><button class="active">Km total</button><button>Início e fim</button></div><p class="entry-helper">Insere apenas o total percorrido no dia, ou guarda o km inicial e final para calcular automaticamente.</p><div class="demo-fields"><label>Quilómetros do dia<input value="0" inputmode="decimal"></label><label>Km início<input placeholder="Ex.: 48 210" inputmode="numeric"></label><label>Km fim<input placeholder="Introduz no fim do dia" inputmode="numeric"></label></div>',
      platform: '<div class="demo-options"><button class="demo-option active"><span>Uber<small>Ativa · ganhos lançados</small></span><b>✓</b></button><button class="demo-option active"><span>Bolt<small>Ativa · ganhos lançados</small></span><b>✓</b></button><button class="demo-option"><span>+ Adicionar nova plataforma</span><b>›</b></button></div>',
      fixed: '<p class="entry-helper">Adiciona gastos que se repetem todas as semanas, como aluguer do carro ou taxas. Podes usar um valor em euros ou uma percentagem do ganho bruto. São lançados à segunda-feira.</p><div class="demo-switch"><button class="active">Valor fixo</button><button>% do bruto</button></div><div class="demo-fields"><label>Descrição<input value="Aluguer do carro"></label><label>Valor<input value="80,00"></label></div>',
      period: '<div class="demo-options"><button class="demo-option active" data-period="semana"><span>Esta semana<small>30 set — 6 out</small></span><b>✓</b></button><button class="demo-option" data-period="mes"><span>Este mês<small>Outubro 2026</small></span><b>›</b></button><button class="demo-option" data-period="personalizado"><span>Intervalo personalizado</span><b>›</b></button></div>',
      report: '<div class="demo-success">✓ Pré-visualização do relatório concluída.</div><div class="demo-option"><span>Outubro 2026<small>2 184,00 € brutos · 1 701,10 € líquidos</small></span><b>PDF</b></div>',
      chart: '<div class="demo-switch"><button class="active">Bruto</button><button>Líquido</button></div><div class="demo-success">O gráfico será alimentado pelos registos diários existentes quando for implementado no produto.</div>',
      list: '<div class="demo-options"><div class="demo-option"><span>Uber<small>Hoje · 16:42</small></span><b>+ €74,20</b></div><div class="demo-option"><span>Combustível<small>Hoje · 09:25</small></span><b>− €52,30</b></div></div>',
      profile: '<div class="demo-fields"><label>Nome<input value="João Martins"></label><label>Email<input value="joao@exemplo.pt"></label></div><div class="demo-options"><button class="demo-option"><span>Alterar foto de perfil</span><b>›</b></button><button class="demo-option"><span>Alterar password</span><b>›</b></button><button class="demo-option"><span>Subscrição SmartSoma Pro<small>Ativa · faltam 11 dias de teste</small></span><b>›</b></button><button class="demo-option"><span>Gerir subscrição na Creem</span><b>↗</b></button></div>',
      'fixed-list': '<div class="demo-options"><button class="demo-option"><span>Aluguer do carro<small>€80,00 · semanal</small></span><b>›</b></button><button class="demo-option"><span>Taxa de plataforma<small>8% do bruto semanal</small></span><b>›</b></button><button class="demo-option"><span>+ Adicionar despesa fixa</span><b>›</b></button></div>',
      language: '<div class="demo-options"><button class="demo-option active"><span>🇵🇹 Português (Portugal)</span><b>✓</b></button><button class="demo-option"><span>🇬🇧 English</span><b>›</b></button></div>',
      font: '<div class="demo-options"><button class="demo-option"><span style="font-size:11px">Pequeno</span><b>›</b></button><button class="demo-option active"><span>Normal</span><b>✓</b></button><button class="demo-option"><span style="font-size:16px">Grande</span><b>›</b></button></div>',
      tutorial: '<div class="demo-success">O tutorial explica como registar ganhos, despesas, quilometragem e acompanhar a meta semanal.</div>',
      delete: '<div class="demo-options"><button class="demo-option"><span>Esta semana</span><b>›</b></button><button class="demo-option"><span>Este mês</span><b>›</b></button><button class="demo-option"><span>Todos os dados</span><b>›</b></button></div>',
      signout: '<div class="demo-success">A tua sessão termina apenas depois de confirmares esta ação.</div>',
      notifications: '<div class="demo-success">Não tens notificações novas.</div>',
      contact: '<div class="demo-fields"><label>Assunto<input value="Preciso de ajuda"></label><label>Mensagem<input placeholder="Escreve a tua mensagem"></label></div>',
      legal: '<div class="demo-options"><button class="demo-option"><span>Termos de utilização</span><b>›</b></button><button class="demo-option"><span>Política de privacidade</span><b>›</b></button></div>'
    };
    body.innerHTML = templates[type] || '<div class="demo-fields"><label>Nome do registo<input value="'+title+'"></label><label>Descrição<input placeholder="Adiciona uma descrição"></label></div>';
    body.querySelectorAll('[data-period]').forEach(button => button.addEventListener('click', () => {
      const periods = { semana:{label:'Esta semana',earned:'€516,00',target:'€600,00',percent:'84%',net:'€382,40',gross:'€516,00',expense:'€133,60',km:'318 km'}, mes:{label:'Outubro 2026',earned:'€2 184,00',target:'€2 500,00',percent:'87%',net:'€1 701,10',gross:'€2 184,00',expense:'€482,90',km:'1 206 km'}, personalizado:{label:'1 — 15 outubro',earned:'€1 042,00',target:'€1 200,00',percent:'87%',net:'€805,20',gross:'€1 042,00',expense:'€236,80',km:'614 km'} };
      const p = periods[button.dataset.period]; $('.range-button').innerHTML = `${p.label} <span>⌄</span>`; $('#earned').textContent=p.earned; $('#target').textContent=p.target; $('#goal-percent').textContent=p.percent; $$('.metric-card h3')[0].textContent=p.net; $$('.metric-card h3')[1].textContent=p.gross; $$('.metric-card h3')[2].textContent=p.expense; $$('.metric-card h3')[3].innerHTML=`${p.km.split(' ')[0]} <em>km</em>`; demoModal.classList.remove('open');
    }));
    demoModal.classList.add('open');
  }
  $('#demo-confirm').addEventListener('click', () => demoModal.classList.remove('open'));
  demoModal.addEventListener('click', event => { if (event.target === demoModal) demoModal.classList.remove('open'); });
  $$('.edit-goal, .range-button, .text-link, .platform-tile:not(.add-platform), .outline-button, .fixed-list li, .settings-group button, .danger-zone button, .report-row button, .date-controls button').forEach(item => item.addEventListener('click', () => {
    const label = (item.querySelector('strong')?.textContent || item.textContent).trim().replace(/\s+/g, ' ');
    const known = demoText[label];
    if (known) openDemo(...known); else openDemo(label.replace(/[›→↓]/g, '').trim() || 'Detalhe', 'Confirma ou atualiza os dados deste registo.');
  }));
  $$('.add-platform').forEach(item => item.addEventListener('click', () => openDemo('Adicionar plataforma', 'Escolhe a plataforma que queres mostrar no teu registo diário.', 'platform')));
  $$('.platform-tile[data-entry-platform]').forEach(item => item.addEventListener('click', () => { $('#entry-platform').value = item.dataset.entryPlatform; $('#entry-modal').classList.add('open'); }));
  $$('.more').forEach(item => item.addEventListener('click', () => openDemo('Opções da meta', 'Edita, consulta o histórico ou repõe a meta semanal.', 'goal')));
  $$('.round-btn').forEach(item => item.addEventListener('click', () => openDemo('Notificações', 'Aqui aparecem lembretes de registos, metas e períodos por fechar.')));
  $$('.add-record').forEach(item => item.addEventListener('click', () => $('#entry-modal').classList.add('open')));
  $$('.table-row button').forEach(item => item.addEventListener('click', () => openDemo('Opções do registo', 'Edita ou remove visualmente este registo de demonstração.')));
  $$('.report-download').forEach(item => item.addEventListener('click', () => openDemo(...demoText['↓ Descarregar PDF'])));
  $$('.segment').forEach(segment => segment.querySelectorAll('button').forEach(button => button.addEventListener('click', () => segment.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button)))));
  $('#week-view-toggle')?.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { const list = button.textContent.trim() === 'Lista'; $('#week-table').hidden = list; $('#week-list').hidden = !list; }));
  const settingsGroup = $('.settings-columns');
  if (settingsGroup) settingsGroup.insertAdjacentHTML('afterend', '<article class="panel settings-group mock-extra"><p class="eyebrow">APLICAÇÃO E SUPORTE</p><button id="dark-mode-toggle"><span>◐</span><div><strong>Modo escuro</strong><small>Usar aparência escura</small></div><i>›</i></button><button class="support-action"><span>✉</span><div><strong>Falar connosco</strong><small>Ajuda e sugestões</small></div><i>›</i></button><button class="legal-action"><span>§</span><div><strong>Termos e Privacidade</strong><small>Condições de utilização</small></div><i>›</i></button></article>');
  $('#dark-mode-toggle')?.addEventListener('click', () => document.body.classList.toggle('mock-dark'));
  $$('.support-action,.legal-action').forEach(item => { const title = item.querySelector('strong').textContent; item.addEventListener('click', () => openDemo(...demoText[title])); });
  $$('.settings-group button').filter(item => item.querySelector('strong')?.textContent === 'Ajuda e tutorial').forEach(item => item.addEventListener('click', () => { demoModal.classList.remove('open'); openView('ajuda'); }));
  $('#tutorial-open')?.addEventListener('click', () => openDemo('Tutorial SmartSoma', 'O tutorial mostra o registo de ganhos, despesas, quilometragem e a meta semanal.', 'tutorial'));
  document.addEventListener('click', event => { if (event.target.closest('.settings-group button')?.textContent.includes('Ajuda e tutorial')) { demoModal.classList.remove('open'); openView('ajuda'); } });

  const canvas = $('#confetti');
  const context = canvas.getContext('2d');
  function celebrate() {
    const card = $('#goal-card');
    card.classList.remove('achieved');
    void card.offsetWidth;
    card.classList.add('achieved');
    $('#goal-percent').textContent = '100%';
    $('#progress-fill').style.width = '100%';
    $('#remaining').textContent = '€0,00';
    $('#toast').classList.add('show');
    setTimeout(() => $('#toast').classList.remove('show'), 3600);

    const rect = canvas.getBoundingClientRect();
    const scale = devicePixelRatio || 1;
    canvas.width = rect.width * scale; canvas.height = rect.height * scale;
    context.scale(scale, scale);
    const colors = ['#d4f53c', '#1e9e5a', '#f3b64c', '#f06f55', '#8067d9', '#ffffff'];
    const pieces = Array.from({ length: 150 }, (_, index) => ({
      x: rect.width * (.35 + Math.random() * .3), y: rect.height * .3,
      vx: (Math.random() - .5) * 12, vy: -4 - Math.random() * 12,
      gravity: .22 + Math.random() * .09, size: 5 + Math.random() * 7,
      rotation: Math.random() * Math.PI, spin: (Math.random() - .5) * .25, color: colors[index % colors.length]
    }));
    let frame = 0;
    const draw = () => {
      context.clearRect(0, 0, rect.width, rect.height);
      pieces.forEach(piece => {
        piece.x += piece.vx; piece.y += piece.vy; piece.vy += piece.gravity; piece.rotation += piece.spin;
        context.save(); context.translate(piece.x, piece.y); context.rotate(piece.rotation);
        context.fillStyle = piece.color; context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * .66); context.restore();
      });
      frame += 1;
      if (frame < 110) requestAnimationFrame(draw); else context.clearRect(0, 0, rect.width, rect.height);
    };
    requestAnimationFrame(draw);
  }
  $('#finish-goal').addEventListener('click', celebrate);
})();
