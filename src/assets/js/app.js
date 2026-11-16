/**
 * Universal QA Dashboard - Core Application Engine
 * Gerencia o estado global, navegação entre as 6 visões, ingestão de dados (Drag & Drop),
 * tema (Dark/Light) e renderização reativa dos componentes.
 */

window.universalQaState = {
  currentTheme: 'dark', // 'dark' | 'light'
  activeView: 'visao-geral',
  searchQuery: '',
  filterStatus: 'all',
  filterModule: 'all',
  selectedTestCase: null,
  suiteData: null
};

// Dados de Demonstração Padrão de Alta Fidelidade (IzzyWay ERP / E-commerce Suite)
const DEFAULT_DEMO_DATA = {
  summary: {
    total: 136,
    passed: 109,
    failed: 27,
    skipped: 0,
    flaky: 2,
    passRate: 80.1,
    durationMs: 2601000,
    durationFormatted: '43m 21s',
    timestamp: '20/10/2026 • 09:01:39',
    framework: 'Playwright C# .NET 8 / Universal',
    environment: 'Staging Enterprise • Headless Chromium',
    slaPassed: true,
    slaTarget: 75.0
  },
  modules: [
    { name: 'VaiDeFood', total: 34, passed: 11, failed: 23, passRate: 32.4, status: 'critical' },
    { name: 'Produto', total: 6, passed: 2, failed: 4, passRate: 33.3, status: 'attention' },
    { name: 'Financeiro', total: 20, passed: 20, failed: 0, passRate: 100, status: 'conform' },
    { name: 'Movimentação', total: 22, passed: 22, failed: 0, passRate: 100, status: 'conform' },
    { name: 'API', total: 23, passed: 23, failed: 0, passRate: 100, status: 'conform' },
    { name: 'Estoque', total: 16, passed: 16, failed: 0, passRate: 100, status: 'conform' },
    { name: 'Administrativo', total: 7, passed: 7, failed: 0, passRate: 100, status: 'conform' },
    { name: 'Configuração', total: 4, passed: 4, failed: 0, passRate: 100, status: 'conform' },
    { name: 'Manufatura', total: 4, passed: 4, failed: 0, passRate: 100, status: 'conform' }
  ],
  tests: [
    {
      id: 'TC-001',
      name: 'FazerPedidoCompletoComPagamentoPixOnlineMobile',
      module: 'VaiDeFood',
      status: 'failed',
      durationMs: 19000,
      durationFormatted: '19.0s',
      framework: 'Playwright C#',
      category: 'Timeout / Elemento Indisponível',
      confidence: 94,
      aiDiagnostic: {
        rootCause: 'O componente GetByRole(AriaRole.Row, new() { Name = "Pix" }) não foi renderizado a tempo na tela de checkout mobile, devido à latência no gateway PSP simulado.',
        suggestedFix: 'Substituir o seletor por GetByTestId("pix-payment-row") e aumentar timeout explícito de polling de 5s para 10s no step de carregamento da fatura.',
        file: 'Tests\\TestAutomated\\Page\\Web\\VaiDeFood\\PedidoPage.cs',
        line: 162,
        snippet: [
          { line: 159, code: 'await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);' },
          { line: 160, code: 'await Page.GetByTestId("checkout-confirm-btn").ClickAsync();' },
          { line: 161, code: '// Seleção de forma de liquidação online' },
          { line: 162, code: 'await Page.GetByRole(AriaRole.Row, new() { Name = "Pix" }).ClickAsync();', isError: true },
          { line: 163, code: 'await Page.GetByTestId("pix-generate-qr").WaitForAsync();' }
        ],
        impact: '1 Page Object e fluxo crítico de checkout mobile afetado',
        evidenceNote: 'Playwright esgotou o tempo de espera (15000ms). WebM Frame #420 (00:18.4)'
      },
      errorDetails: {
        message: 'System.TimeoutException : Timeout 15000ms exceeded waiting for locator',
        stackTrace: `System.TimeoutException : Timeout 15000ms exceeded.
Call log:
  - waiting for GetByRole(AriaRole.Row, new() { Name = "Pix" })
  - locator resolved to <div class="checkout-method-row skeleton-loading">...</div>
  - attempting click action
  - waiting for element to be visible, enabled and stable
  - element was not visible within 15000ms
   at Microsoft.Playwright.Core.Locator.ClickAsync(LocatorClickOptions options)
   at Tests.TestAutomated.Page.Web.VaiDeFood.PedidoPage.FazerPedidoCompletoComPagamentoPixOnlineMobile() in Tests\\TestAutomated\\Page\\Web\\VaiDeFood\\PedidoPage.cs:line 162`
      },
      evidence: { hasVideo: true, hasScreenshot: true, videoTime: '00:19.0' }
    },
    {
      id: 'TC-002',
      name: 'NaoDeveSalvarSemPreencherTributacaoFiscal',
      module: 'Produto',
      status: 'failed',
      durationMs: 29000,
      durationFormatted: '29.0s',
      framework: 'Playwright C#',
      category: 'Timeout / Elemento Indisponível',
      confidence: 81,
      aiDiagnostic: {
        rootCause: 'O modal de tributação não abriu a aba "PIS/COFINS" dentro do tempo limite.',
        suggestedFix: 'Adicionar espera explícita WaitForSelectorAsync("#tab-tributacao-icms") antes de preencher os campos.',
        file: 'Tests\\Produto\\CadastroPage.cs',
        line: 95,
        impact: 'Módulo de Cadastro de Produto e Regras Fiscais',
        evidenceNote: 'Timeout de 15000ms atingido na aba tributária.'
      },
      errorDetails: {
        message: 'System.TimeoutException: Element #tab-tributacao-icms was not interactable',
        stackTrace: 'Tests.Produto.CadastroPage.PreencherTributacao() in Tests\\Produto\\CadastroPage.cs:line 95'
      },
      evidence: { hasVideo: true, hasScreenshot: true, videoTime: '00:29.0' }
    },
    {
      id: 'TC-003',
      name: 'NaoDevePermitirCancelamentoSemJustificativa',
      module: 'VaiDeFood',
      status: 'failed',
      durationMs: 18200,
      durationFormatted: '18.2s',
      framework: 'Playwright C#',
      category: 'Falha de Asserção (Value mismatch)',
      confidence: 92,
      aiDiagnostic: {
        rootCause: 'Mensagem de validação esperada "Justificativa obrigatória" divergiu do retornado pelo backend "Campo inválido".',
        suggestedFix: 'Alinhar asserção com o contrato atualizado da API v2 de Cancelamento de Pedidos.',
        file: 'Tests\\VaiDeFood\\PedidoPage.cs',
        line: 204,
        impact: 'Regra de negócio de cancelamento com estorno',
        evidenceNote: 'Asserção falhou no NUnit Core.'
      },
      errorDetails: {
        message: 'NUnit.Framework.AssertionException : Expected: "Justificativa obrigatória" but was: "Campo inválido"',
        stackTrace: 'Tests.VaiDeFood.PedidoPage.ValidarCancelamento() in Tests\\VaiDeFood\\PedidoPage.cs:line 204'
      },
      evidence: { hasVideo: true, hasScreenshot: true, videoTime: '00:18.2' }
    },
    {
      id: 'TC-004',
      name: 'ValidarTimeoutAoGerarChavePixDuplicada',
      module: 'VaiDeFood',
      status: 'failed',
      durationMs: 22400,
      durationFormatted: '22.4s',
      framework: 'Playwright C#',
      category: 'Socket & Gateway Latency',
      confidence: 85,
      aiDiagnostic: {
        rootCause: 'PSP Mock retornou HTTP 504 Gateway Timeout após tentativa de geração concorrente.',
        suggestedFix: 'Implementar retry exponencial no client do PSP com backoff de 500ms.',
        file: 'Tests\\VaiDeFood\\PedidoPage.cs',
        line: 289,
        impact: 'Resiliência de rede e gateway de pagamento',
        evidenceNote: 'SocketException gerado aos 20s.'
      },
      errorDetails: {
        message: 'System.Net.Sockets.SocketException: Connection timed out after 20000ms',
        stackTrace: 'Tests.VaiDeFood.PedidoPage.AguardarConfirmacaoPix() in Tests\\VaiDeFood\\PedidoPage.cs:line 289'
      },
      evidence: { hasVideo: true, hasScreenshot: true, videoTime: '00:22.4' }
    },
    {
      id: 'TC-005',
      name: 'DeveCalcularSaldoConsolidadoDiarioComSucesso',
      module: 'Financeiro',
      status: 'passed',
      durationMs: 18200,
      durationFormatted: '18.2s',
      framework: 'Playwright C#',
      category: 'Sucesso',
      evidence: { hasVideo: false, hasScreenshot: false }
    },
    {
      id: 'TC-006',
      name: 'DeveBaixarTituloComAcrescimoEJuros',
      module: 'Financeiro',
      status: 'passed',
      durationMs: 19400,
      durationFormatted: '19.4s',
      framework: 'Playwright C#',
      category: 'Sucesso',
      evidence: { hasVideo: false, hasScreenshot: false }
    },
    {
      id: 'TC-007',
      name: 'RegistrarContagemFisicaComAjusteAutomatico',
      module: 'Estoque',
      status: 'passed',
      durationMs: 19800,
      durationFormatted: '19.8s',
      framework: 'Playwright C#',
      category: 'Sucesso',
      evidence: { hasVideo: false, hasScreenshot: false }
    },
    {
      id: 'TC-008',
      name: 'POST /api/v1/auth/token - DeveRetornarJwtValido',
      module: 'API',
      status: 'passed',
      durationMs: 450,
      durationFormatted: '0.5s',
      framework: 'Playwright C#',
      category: 'Sucesso',
      evidence: { hasVideo: false, hasScreenshot: false }
    },
    {
      id: 'TC-009',
      name: 'ImportarXmlNfeComRateioDeCustos',
      module: 'Movimentação',
      status: 'passed',
      durationMs: 28400,
      durationFormatted: '28.4s',
      framework: 'Playwright C#',
      category: 'Sucesso',
      evidence: { hasVideo: false, hasScreenshot: false }
    },
    {
      id: 'TC-010',
      name: 'ClonarPromocaoCopiandoItensEModalidades',
      module: 'Movimentação',
      status: 'passed',
      durationMs: 14200,
      durationFormatted: '14.2s',
      framework: 'Playwright C#',
      category: 'Sucesso',
      evidence: { hasVideo: false, hasScreenshot: false }
    }
  ]
};

// Funções de Easing e Animação Numérica (Count-Up)
function animateValue(element, start, end, duration, isFloat = false) {
  if (!element) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * easeProgress;
    
    if (isFloat) {
      element.textContent = current.toFixed(1);
    } else {
      element.textContent = Math.floor(current);
    }
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      if (isFloat) element.textContent = end.toFixed(1);
      else element.textContent = end;
    }
  };
  window.requestAnimationFrame(step);
}

function runInitialAnimations() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    animateValue(el, 0, target, 1200);
  });
  
  document.querySelectorAll('[data-count-float]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-count-float'));
    animateValue(el, 0, target, 1300, true);
  });

  const donutCenter = document.getElementById('donut-center-value');
  if (donutCenter) {
    const target = window.universalQaState.suiteData ? window.universalQaState.suiteData.summary.passRate : 79.9;
    animateValue(donutCenter, 0, target, 1400, true);
  }

  updateDonutArc();

  const progressBars = document.querySelectorAll('.progress-fill');
  progressBars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-target') || '0%';
    const delay = parseInt(bar.getAttribute('data-delay') || '100', 10);
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, delay);
  });
}

function updateDonutArc() {
  const failArc = document.getElementById('donut-arc-fail');
  const successArc = document.getElementById('donut-arc-success');
  if (!failArc || !successArc) return;

  const data = window.universalQaState.suiteData || DEFAULT_DEMO_DATA;
  const total = data.summary.total || 1;
  const passed = data.summary.passed || 0;
  const failed = data.summary.failed || 0;

  const circumference = 402; // 2 * PI * 64 ≈ 402.12
  const passDash = Math.round((passed / total) * circumference);
  const failDash = Math.round((failed / total) * circumference);

  failArc.setAttribute('stroke-dasharray', `${failDash} ${circumference}`);
  failArc.setAttribute('data-tooltip', `Falhas: ${failed} testes (${((failed/total)*100).toFixed(1)}%)`);

  successArc.setAttribute('stroke-dasharray', `${passDash} ${circumference}`);
  successArc.setAttribute('data-tooltip', `Aprovados: ${passed} testes (${((passed/total)*100).toFixed(1)}%)`);

  failArc.style.strokeDashoffset = '402';
  successArc.style.strokeDashoffset = '402';
  
  setTimeout(() => {
    failArc.style.strokeDashoffset = '0';
    successArc.style.strokeDashoffset = `-${failDash}`;
  }, 150);
}

// ============================================================
// SELEÇÃO INTERATIVA DO GRÁFICO DONUT E LEGENDA
// ============================================================
window.universalQaState.selectedDonutCategory = null;

function selectDonutCategory(category) {
  const failArc = document.getElementById('donut-arc-fail');
  const successArc = document.getElementById('donut-arc-success');
  const centerValue = document.getElementById('donut-center-value');
  const centerCaption = document.getElementById('donut-center-caption');

  const legendSuccess = document.getElementById('donut-legend-success');
  const legendFail = document.getElementById('donut-legend-fail');
  const legendSkipped = document.getElementById('donut-legend-skipped');

  const data = window.universalQaState.suiteData || DEFAULT_DEMO_DATA;
  const total = data.summary.total || 1;
  const passed = data.summary.passed || 0;
  const failed = data.summary.failed || 0;
  const skipped = data.summary.skipped || 0;

  // Toggle: se clicar no que já está selecionado, desseleciona
  if (window.universalQaState.selectedDonutCategory === category) {
    window.universalQaState.selectedDonutCategory = null;
    resetDonutSelection();
    return;
  }

  window.universalQaState.selectedDonutCategory = category;

  // Limpa classes anteriores de seleção em todos os itens
  [legendSuccess, legendFail, legendSkipped].forEach(el => {
    if (el) {
      el.classList.remove('donut-legend-selected', 'border-blue-500', 'border-red-500', 'border-gray-400', 'bg-blue-900/40', 'bg-red-900/40', 'bg-gray-800/60', 'opacity-35', 'scale-[1.02]');
    }
  });

  if (category === 'success') {
    // 1. Destaca o arco azul
    if (successArc) {
      successArc.style.strokeWidth = '18';
      successArc.style.filter = 'drop-shadow(0 0 12px rgba(37,99,235,0.9))';
      successArc.style.opacity = '1';
    }
    if (failArc) {
      failArc.style.strokeWidth = '12';
      failArc.style.filter = 'none';
      failArc.style.opacity = '0.25';
    }

    // 2. Destaca o card Aprovados na legenda
    if (legendSuccess) {
      legendSuccess.classList.add('donut-legend-selected', 'border-blue-500', 'bg-blue-900/40', 'scale-[1.02]');
    }
    if (legendFail) legendFail.classList.add('opacity-35');
    if (legendSkipped) legendSkipped.classList.add('opacity-35');

    // 3. Atualiza texto central do Donut
    if (centerValue) centerValue.textContent = `${((passed / total) * 100).toFixed(1)}`;
    if (centerCaption) {
      centerCaption.textContent = 'APROVADOS';
      centerCaption.className = 'text-[11px] uppercase tracking-widest text-blue-400 font-bold mt-1 transition-all';
    }
  } else if (category === 'fail') {
    // 1. Destaca o arco vermelho
    if (failArc) {
      failArc.style.strokeWidth = '18';
      failArc.style.filter = 'drop-shadow(0 0 12px rgba(239,68,68,0.9))';
      failArc.style.opacity = '1';
    }
    if (successArc) {
      successArc.style.strokeWidth = '12';
      successArc.style.filter = 'none';
      successArc.style.opacity = '0.25';
    }

    // 2. Destaca o card Falhas na legenda
    if (legendFail) {
      legendFail.classList.add('donut-legend-selected', 'border-red-500', 'bg-red-900/40', 'scale-[1.02]');
    }
    if (legendSuccess) legendSuccess.classList.add('opacity-35');
    if (legendSkipped) legendSkipped.classList.add('opacity-35');

    // 3. Atualiza texto central do Donut
    if (centerValue) centerValue.textContent = `${((failed / total) * 100).toFixed(1)}`;
    if (centerCaption) {
      centerCaption.textContent = 'FALHAS';
      centerCaption.className = 'text-[11px] uppercase tracking-widest text-red-400 font-bold mt-1 transition-all';
    }
  } else if (category === 'skipped') {
    if (failArc) {
      failArc.style.strokeWidth = '12';
      failArc.style.opacity = '0.25';
    }
    if (successArc) {
      successArc.style.strokeWidth = '12';
      successArc.style.opacity = '0.25';
    }

    if (legendSkipped) {
      legendSkipped.classList.add('donut-legend-selected', 'border-gray-400', 'bg-gray-800/60', 'scale-[1.02]');
    }
    if (legendSuccess) legendSuccess.classList.add('opacity-35');
    if (legendFail) legendFail.classList.add('opacity-35');

    if (centerValue) centerValue.textContent = `${((skipped / total) * 100).toFixed(1)}`;
    if (centerCaption) {
      centerCaption.textContent = 'IGNORADOS';
      centerCaption.className = 'text-[11px] uppercase tracking-widest text-gray-400 font-bold mt-1 transition-all';
    }
  }
}

function resetDonutSelection() {
  window.universalQaState.selectedDonutCategory = null;

  const failArc = document.getElementById('donut-arc-fail');
  const successArc = document.getElementById('donut-arc-success');
  const centerValue = document.getElementById('donut-center-value');
  const centerCaption = document.getElementById('donut-center-caption');

  const legendSuccess = document.getElementById('donut-legend-success');
  const legendFail = document.getElementById('donut-legend-fail');
  const legendSkipped = document.getElementById('donut-legend-skipped');

  const data = window.universalQaState.suiteData || DEFAULT_DEMO_DATA;

  if (failArc) {
    failArc.style.strokeWidth = '14';
    failArc.style.filter = 'none';
    failArc.style.opacity = '1';
  }
  if (successArc) {
    successArc.style.strokeWidth = '14';
    successArc.style.filter = 'none';
    successArc.style.opacity = '1';
  }

  if (centerValue) centerValue.textContent = data.summary.passRate.toFixed(1);
  if (centerCaption) {
    centerCaption.textContent = 'APROVADOS';
    centerCaption.className = 'text-[10px] uppercase tracking-widest text-blue-400 font-semibold mt-1 transition-all';
  }

  [legendSuccess, legendFail, legendSkipped].forEach(el => {
    if (el) {
      el.classList.remove('donut-legend-selected', 'border-blue-500', 'border-red-500', 'border-gray-400', 'bg-blue-900/40', 'bg-red-900/40', 'bg-gray-800/60', 'opacity-35', 'scale-[1.02]');
    }
  });
}

// ============================================================
// NAVEGAÇÃO DOS TOP KPIS PARA EXECUÇÕES COM FILTRO
// ============================================================
function navigateToExecutions(statusFilter = 'all') {
  switchView('execucoes-e-resultados');
  setStatusFilter(statusFilter);
}

function setStatusFilter(statusFilter) {
  window.universalQaState.filterStatus = statusFilter;

  // Atualiza botões pills visuais
  document.querySelectorAll('.qa-status-pill').forEach(pill => {
    const s = pill.getAttribute('data-status');
    if (s === statusFilter) {
      pill.classList.add('bg-blue-600', 'text-white', 'border-blue-500');
      pill.classList.remove('bg-[#18191e]', 'text-gray-400', 'border-[#282a30]');
    } else {
      pill.classList.remove('bg-blue-600', 'text-white', 'border-blue-500');
      pill.classList.add('bg-[#18191e]', 'text-gray-400', 'border-[#282a30]');
    }
  });

  applyQaFilters();
}

function handleSearchInput(val) {
  window.universalQaState.searchQuery = val;
  applyQaFilters();
}

function applyQaFilters() {
  const query = (window.universalQaState.searchQuery || '').toLowerCase().trim();
  const statusFilter = window.universalQaState.filterStatus || 'all';

  let visibleCount = 0;
  const rows = document.querySelectorAll('.qa-test-row');

  rows.forEach(row => {
    const name = (row.getAttribute('data-test-name') || '').toLowerCase();
    const module = (row.getAttribute('data-module') || '').toLowerCase();
    const status = row.getAttribute('data-status') || '';
    const hasVideo = row.getAttribute('data-has-video') === 'true';

    let matchSearch = !query || name.includes(query) || module.includes(query);
    let matchStatus = true;

    if (statusFilter === 'passed') matchStatus = (status === 'passed');
    else if (statusFilter === 'failed') matchStatus = (status === 'failed');
    else if (statusFilter === 'skipped') matchStatus = (status === 'skipped');
    else if (statusFilter === 'video') matchStatus = hasVideo;

    if (matchSearch && matchStatus) {
      row.classList.remove('hidden');
      visibleCount++;
    } else {
      row.classList.add('hidden');
    }
  });

  const counter = document.getElementById('executions-visible-counter');
  if (counter) counter.textContent = visibleCount;
}

// Spotlight Mouse Effect
function initSpotlightCards() {
  const cards = document.querySelectorAll('.card-executive');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-200px');
      card.style.setProperty('--mouse-y', '-200px');
    });
  });
}

// Alternância de Tema (Dark / Light)
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';

  if (newTheme === 'dark') {
    html.classList.remove('light');
    html.classList.add('dark');
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    document.body.style.backgroundColor = '#0c0c0e';
    document.body.style.color = '#ffffff';
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#0f172a';
  }

  window.universalQaState.currentTheme = newTheme;
  try {
    localStorage.setItem('universal_qa_theme', newTheme);
  } catch (e) {}

  // Atualiza Shader WebGL
  if (window.TacticalRadarShader) {
    window.TacticalRadarShader.setTheme(newTheme);
  }

  // Atualiza ícone do botão
  const themeBtnIcon = document.getElementById('theme-toggle-icon');
  const themeBtnText = document.getElementById('theme-toggle-text');
  if (themeBtnIcon) {
    themeBtnIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
  }
  if (themeBtnText) {
    themeBtnText.textContent = newTheme === 'dark' ? 'Claro' : 'Escuro';
  }
}

// Navegação de Vistas (Tabs)
function switchView(viewName) {
  window.universalQaState.activeView = viewName;

  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) {
    targetPanel.classList.remove('hidden');
  }

  // Atualiza links de navegação
  document.querySelectorAll('nav a[data-path]').forEach(link => {
    const path = link.getAttribute('data-path');
    if (path === viewName) {
      link.classList.add('text-primary', 'font-semibold', 'border-b-2', 'border-primary');
      link.classList.remove('text-on-surface-variant');
    } else {
      link.classList.remove('text-primary', 'font-semibold', 'border-b-2', 'border-primary');
      link.classList.add('text-on-surface-variant');
    }
  });

  if (viewName === 'visao-geral') {
    setTimeout(runInitialAnimations, 100);
  }
}

// Ingestão de Dados por Drag and Drop
function setupDragAndDrop() {
  const dropZone = document.body;

  window.addEventListener('dragover', (e) => {
    e.preventDefault();
    document.body.classList.add('drop-zone-active');
  });

  window.addEventListener('dragleave', (e) => {
    if (e.clientX === 0 && e.clientY === 0) {
      document.body.classList.remove('drop-zone-active');
    }
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
    document.body.classList.remove('drop-zone-active');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      loadReportFile(files[0]);
    }
  });

  const fileInput = document.getElementById('file-upload-input');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        loadReportFile(e.target.files[0]);
      }
    });
  }
}

function loadReportFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;
    try {
      let parsed;
      if (window.UniversalParser) {
        parsed = window.UniversalParser.detectAndParse(content, file.name);
      } else {
        parsed = JSON.parse(content);
      }
      applyLoadedReport(parsed, file.name);
      showToast(`Relatório "${file.name}" carregado com sucesso!`);
    } catch (err) {
      console.error('Falha ao processar arquivo:', err);
      showToast(`Erro ao ler arquivo: ${err.message}`, 'error');
    }
  };
  reader.readAsText(file);
}

function applyLoadedReport(reportData, sourceName) {
  window.universalQaState.suiteData = reportData;

  // Se o relatório for do k6, renderiza a aba de k6 e navega diretamente para ela
  if (reportData.k6) {
    window.universalQaState.k6Data = reportData.k6;
    renderK6Dashboard(reportData.k6);
    switchView('k6-tests');
  }

  // Atualiza indicadores do cabeçalho
  const tsEl = document.getElementById('current-timestamp');
  if (tsEl) tsEl.textContent = reportData.summary.timestamp || new Date().toLocaleString();

  const fwEl = document.getElementById('header-framework-badge');
  if (fwEl) fwEl.textContent = reportData.summary.framework || 'Universal Test Report';

  const failBadge = document.getElementById('header-fail-badge');
  if (failBadge) failBadge.textContent = `${reportData.summary.failed} Falhas Detectadas`;

  // Atualiza KPIs Superiores
  const totalEl = document.getElementById('kpi-total-tests');
  if (totalEl) totalEl.setAttribute('data-count', reportData.summary.total);

  const passedEl = document.getElementById('kpi-passed-tests');
  if (passedEl) passedEl.setAttribute('data-count', reportData.summary.passed);

  const failedEl = document.getElementById('kpi-failed-tests');
  if (failedEl) failedEl.setAttribute('data-count', reportData.summary.failed);

  const skippedEl = document.getElementById('kpi-skipped-tests');
  if (skippedEl) skippedEl.setAttribute('data-count', reportData.summary.skipped || 0);

  const passRateEl = document.getElementById('kpi-pass-rate');
  if (passRateEl) passRateEl.setAttribute('data-count-float', reportData.summary.passRate);

  const durEl = document.getElementById('kpi-duration');
  if (durEl) durEl.textContent = reportData.summary.durationFormatted;

  // Renderiza lista de módulos
  renderModulesList(reportData.modules);

  // Renderiza tabela de testes na view de execuções
  renderExecutionsTable(reportData.tests);

  // Renderiza incidentes na view de falhas
  renderFailuresList(reportData.tests.filter(t => t.status === 'failed'));

  // Reexecuta animações visuais
  runInitialAnimations();
}

function renderModulesList(modules) {
  const container = document.getElementById('modules-container');
  if (!container || !modules) return;

  container.innerHTML = modules.map((m, idx) => {
    const isCritical = m.status === 'critical';
    const isAttention = m.status === 'attention';
    const delay = 100 + idx * 70;

    let badge = '';
    if (isCritical) {
      badge = '<span class="text-[#fca5a5] font-semibold text-[10px] bg-[#450a0a]/70 border border-[#7f1d1d]/60 px-1.5 py-0.2 rounded uppercase animate-pulse">Crítico</span>';
    } else if (isAttention) {
      badge = '<span class="badge-attention text-[#e2e4e9] font-semibold text-[10px] bg-[#202228] border border-[#353842] px-1.5 py-0.2 rounded uppercase">Atenção</span>';
    }

    return `
      <div class="pt-space-xs flex flex-col gap-1.5 group/module hover:bg-surface-container-high/40 px-2.5 py-1.5 rounded-lg transition-all duration-200">
        <div class="flex items-center justify-between font-label-md text-label-md">
          <div class="flex items-center gap-2">
            <span class="font-medium">${m.name}</span>
            ${badge}
          </div>
          <div class="flex items-center gap-2">
            <span class="text-primary font-medium">${m.passed} ok</span>
            <span class="text-outline text-label-sm">•</span>
            <span class="${m.failed > 0 ? 'text-[#fca5a5] font-semibold' : 'text-outline'}">${m.failed} falhas</span>
            <span class="font-semibold ml-1.5 px-1.5 py-0.5 rounded text-label-sm ${isCritical ? 'bg-[#450a0a]/70 border border-[#7f1d1d]/60 text-[#fca5a5]' : 'bg-primary-container/20 text-primary'}">${m.passRate}%</span>
          </div>
        </div>
        <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden flex">
          <div class="h-full bg-primary progress-fill" data-delay="${delay}" data-target="${m.passRate}%" style="width: ${m.passRate}%;"></div>
          ${m.failed > 0 ? `<div class="h-full bg-[#991b1b] progress-fill ${isCritical ? 'animate-critical-glow' : ''}" data-delay="${delay + 100}" data-target="${100 - m.passRate}%" style="width: ${100 - m.passRate}%;"></div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderExecutionsTable(tests) {
  const tbody = document.getElementById('executions-table-body');
  if (!tbody || !tests) return;

  tbody.innerHTML = tests.map(t => {
    const isPassed = t.status === 'passed';
    return `
      <tr class="qa-test-row border-b border-surface-container-high/60 hover:bg-surface-container-high/30 transition-colors" data-test-name="${t.name.toLowerCase()}" data-module="${t.module}" data-status="${t.status}" data-category="${t.category || ''}" data-has-video="${t.evidence ? t.evidence.hasVideo : false}">
        <td class="py-3 px-4">
          <span class="badge-status ${isPassed ? 'badge-status-pass bg-secondary-container/40 text-[#86efac] border border-secondary-muted/40' : 'badge-status-fail bg-error-container/60 text-[#fca5a5] border border-error-muted/40'} px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider inline-flex items-center justify-center">
            ${isPassed ? 'PASS' : 'FAIL'}
          </span>
        </td>
        <td class="py-3 px-4 font-medium max-w-md truncate" title="${t.name}">
          ${t.name}
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
            ${t.module}
          </span>
        </td>
        <td class="py-3 px-4 font-mono text-label-sm text-on-surface-variant">
          ${t.durationFormatted}
        </td>
        <td class="py-3 px-4">
          ${t.evidence && t.evidence.hasVideo ? `
            <button onclick="openVideoPlayer('${t.name}')" class="flex items-center gap-1 text-primary hover:underline text-label-sm">
              <span class="material-symbols-outlined text-[15px]">videocam</span> Assistir
            </button>
          ` : `<span class="text-outline text-label-sm">-</span>`}
        </td>
        <td class="py-3 px-4 text-right">
          <button onclick="inspectTestDetails('${t.id}')" class="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm">
            Inspecionar
          </button>
        </td>
      </tr>
    `;
  }).join('');

  applyQaFilters();
}

function renderFailuresList(failedTests) {
  const container = document.getElementById('failures-list-container');
  if (!container || !failedTests) return;

  if (failedTests.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-surface-container-lowest rounded-xl border border-surface-container-high">
        <span class="material-symbols-outlined text-emerald-500 text-[48px]">verified</span>
        <h3 class="font-headline-sm text-headline-sm font-bold mt-2">Nenhuma Falha Registrada!</h3>
        <p class="text-on-surface-variant text-body-sm mt-1">Todos os testes passaram com 100% de conformidade com a especificação.</p>
      </div>
    `;
    return;
  }

  let html = `
    <!-- Barra de Controle Superior: Total de Falhas e Ações de Abrir/Fechar -->
    <div class="flex items-center justify-between gap-4 mb-4 flex-wrap pb-2 border-b border-[#23252b]">
      <div class="flex items-center gap-3">
        <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
        <h2 class="text-base lg:text-lg font-bold text-white tracking-tight">Falhas Detectadas (${failedTests.length})</h2>
        <span class="px-2 py-0.5 rounded text-xs bg-red-950/60 text-red-300 border border-red-800/50 font-medium">Triagem Heurística Ativa</span>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="expandAllFailures()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2025] hover:bg-[#282a32] text-gray-300 hover:text-white border border-[#30333d] text-xs font-semibold transition-colors shadow-sm cursor-pointer" title="Expandir todos os detalhes">
          <span class="material-symbols-outlined text-[16px]">unfold_more</span>
          <span>Expandir Todos</span>
        </button>
        <button onclick="collapseAllFailures()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2025] hover:bg-[#282a32] text-gray-300 hover:text-white border border-[#30333d] text-xs font-semibold transition-colors shadow-sm cursor-pointer" title="Recolher todos os detalhes">
          <span class="material-symbols-outlined text-[16px]">unfold_less</span>
          <span>Recolher Todos</span>
        </button>
      </div>
    </div>

    <!-- Lista de Cards de Falhas Expansíveis (Accordion) -->
    <div class="flex flex-col gap-4">
      ${failedTests.map((test, idx) => {
        const isExpanded = idx === 0;
        const testSafeId = escapeHtml(test.id || `fail-${idx}`);
        const confidence = test.confidence || 94;
        const errMessage = test.errorDetails ? test.errorDetails.message : (test.aiDiagnostic ? test.aiDiagnostic.rootCause : 'Erro não especificado durante a asserção.');
        const stackTrace = test.errorDetails ? test.errorDetails.stackTrace : null;

        return `
          <article id="failure-card-${testSafeId}" class="w-full card-executive rounded-xl shadow-md overflow-hidden border border-[#23252b] bg-[#141519]/90 transition-all duration-200">
            <!-- Cabeçalho Clicável do Accordion -->
            <div onclick="toggleFailureCard('${testSafeId}')" class="p-4 lg:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.03] select-none transition-colors border-b ${isExpanded ? 'border-[#23252b]' : 'border-transparent'} failure-header-row">
              <div class="flex items-center gap-3 flex-wrap flex-1 min-w-0">
                <span class="badge-status badge-status-fail px-2.5 py-1 rounded bg-[#450a0a]/80 text-[#fca5a5] border border-[#7f1d1d]/80 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-sm">
                  <span class="material-symbols-outlined text-[15px]">cancel</span> FALHA CRÍTICA
                </span>
                <h3 class="text-sm lg:text-base font-bold text-white tracking-tight break-all hover:text-blue-400 transition-colors">${escapeHtml(test.name)}</h3>
                <span class="px-2.5 py-0.5 rounded bg-[#1e2025] text-gray-300 border border-[#2d3038] text-xs font-medium shrink-0">
                  ${escapeHtml(test.module || 'Geral')}
                </span>
                <span class="px-2.5 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/50 text-xs font-medium shrink-0">
                  ${escapeHtml(test.category || 'Timeout / Elemento Indisponível')}
                </span>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <div class="hidden sm:flex items-center gap-1 text-blue-400 font-semibold text-xs">
                  <span class="material-symbols-outlined text-[15px]">verified</span>
                  <span>${confidence}% IA</span>
                </div>
                <span class="hidden sm:inline text-gray-600 text-xs">•</span>
                <span class="font-mono text-xs text-gray-300 font-medium">${escapeHtml(test.durationFormatted)}</span>
                <button type="button" class="failure-toggle-btn flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1e2025] hover:bg-[#282a32] text-gray-300 hover:text-white border border-[#30333d] text-xs font-medium transition-colors pointer-events-none">
                  <span class="toggle-text">${isExpanded ? 'Fechar Detalhes' : 'Abrir Detalhes'}</span>
                  <span class="material-symbols-outlined text-[18px] transition-transform duration-200 toggle-icon">${isExpanded ? 'expand_less' : 'expand_more'}</span>
                </button>
              </div>
            </div>

            <!-- Corpo Expansível com Detalhes do Erro -->
            <div id="failure-body-${testSafeId}" class="failure-details-body ${isExpanded ? '' : 'hidden'} p-5 flex flex-col gap-4">
              <!-- Mensagem de Erro em Destaque -->
              <div class="rounded-xl bg-red-950/20 border border-red-900/40 p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <span class="material-symbols-outlined text-[18px]">error</span>
                  <span>Mensagem de Erro</span>
                </div>
                <div class="font-mono text-xs text-red-200 leading-relaxed whitespace-pre-wrap break-words bg-[#0a0a0c] p-3.5 rounded-lg border border-red-950/60">
                  ${escapeHtml(errMessage)}
                </div>
              </div>

              <!-- Painel Heurístico de Diagnóstico IA -->
              ${test.aiDiagnostic ? `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-[#0e0f12]/80 p-4 rounded-xl border border-[#23252b]">
                  <div class="flex flex-col gap-2 p-3.5 bg-[#141519] rounded-lg border border-[#23252b]">
                    <div class="flex items-center gap-1.5 text-red-400">
                      <span class="material-symbols-outlined text-[18px]">troubleshoot</span>
                      <span class="text-xs font-bold uppercase tracking-wider">Causa Provável</span>
                    </div>
                    <p class="text-xs text-gray-300 leading-relaxed">${escapeHtml(test.aiDiagnostic.rootCause || 'Falha de asserção ou timeout no locator')}</p>
                  </div>
                  <div class="flex flex-col gap-2 p-3.5 bg-[#141519] rounded-lg border border-[#23252b]">
                    <div class="flex items-center gap-1.5 text-blue-400">
                      <span class="material-symbols-outlined text-[18px]">build_circle</span>
                      <span class="text-xs font-bold uppercase tracking-wider">Ajuste Recomendado</span>
                    </div>
                    <p class="text-xs text-gray-300 leading-relaxed">${escapeHtml(test.aiDiagnostic.suggestedFix || 'Adicionar espera explícita ou usar data-testid resiliente')}</p>
                  </div>
                  <div class="flex flex-col gap-2 p-3.5 bg-[#141519] rounded-lg border border-[#23252b]">
                    <div class="flex items-center gap-1.5 text-emerald-400">
                      <span class="material-symbols-outlined text-[18px]">videocam</span>
                      <span class="text-xs font-bold uppercase tracking-wider">Evidência</span>
                    </div>
                    <p class="text-xs text-gray-300 leading-relaxed">${escapeHtml(test.aiDiagnostic.evidenceNote || 'Captura de vídeo gravada.')}</p>
                    <div class="mt-auto pt-2 flex items-center justify-between border-t border-[#23252b]/80">
                      <span class="text-[11px] font-mono text-gray-400">WebM Frame #420</span>
                      <button onclick="event.stopPropagation(); openVideoPlayer('${escapeJsString(test.name)}')" class="px-2.5 py-1 rounded bg-[#1e2025] hover:bg-[#282a32] text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1 border border-[#30333d] transition-colors cursor-pointer">
                        <span class="material-symbols-outlined text-[14px]">play_arrow</span> Reproduzir
                      </button>
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Stacktrace e Log do Runner -->
              ${stackTrace ? `
                <div class="rounded-xl bg-[#141519] p-4 flex flex-col gap-2.5 border border-[#23252b]">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                      <span class="material-symbols-outlined text-[18px]">terminal</span>
                      <span>Stacktrace & Runner Exception</span>
                    </div>
                    <button onclick="event.stopPropagation(); copyElementText('stacktrace-${testSafeId}')" class="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded bg-[#1e2025] hover:bg-[#282a32] border border-[#30333d] transition-colors cursor-pointer">
                      <span class="material-symbols-outlined text-[14px]">content_copy</span> Copiar Log
                    </button>
                  </div>
                  <pre class="bg-[#0a0a0c] p-3.5 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto text-gray-300 border border-[#23252b] max-h-60 overflow-y-auto"><code id="stacktrace-${testSafeId}">${escapeHtml(stackTrace)}</code></pre>
                </div>
              ` : ''}
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = html;
}

// Funções de Abrir/Fechar Accordion de Falhas
function toggleFailureCard(testId) {
  const body = document.getElementById(`failure-body-${testId}`);
  const card = document.getElementById(`failure-card-${testId}`);
  if (!body) return;

  const isHidden = body.classList.contains('hidden');
  const headerRow = card ? card.querySelector('.failure-header-row') : null;

  if (isHidden) {
    body.classList.remove('hidden');
    if (headerRow) {
      headerRow.classList.remove('border-transparent');
      headerRow.classList.add('border-[#23252b]');
    }
  } else {
    body.classList.add('hidden');
    if (headerRow) {
      headerRow.classList.add('border-transparent');
      headerRow.classList.remove('border-[#23252b]');
    }
  }

  if (card) {
    const btnText = card.querySelector('.toggle-text');
    const btnIcon = card.querySelector('.toggle-icon');
    if (btnText) btnText.textContent = isHidden ? 'Fechar Detalhes' : 'Abrir Detalhes';
    if (btnIcon) btnIcon.textContent = isHidden ? 'expand_less' : 'expand_more';
  }
}

function expandAllFailures() {
  document.querySelectorAll('.failure-details-body').forEach(b => b.classList.remove('hidden'));
  document.querySelectorAll('.failure-header-row').forEach(h => {
    h.classList.remove('border-transparent');
    h.classList.add('border-[#23252b]');
  });
  document.querySelectorAll('.failure-toggle-btn .toggle-text').forEach(t => t.textContent = 'Fechar Detalhes');
  document.querySelectorAll('.failure-toggle-btn .toggle-icon').forEach(i => i.textContent = 'expand_less');
}

function collapseAllFailures() {
  document.querySelectorAll('.failure-details-body').forEach(b => b.classList.add('hidden'));
  document.querySelectorAll('.failure-header-row').forEach(h => {
    h.classList.add('border-transparent');
    h.classList.remove('border-[#23252b]');
  });
  document.querySelectorAll('.failure-toggle-btn .toggle-text').forEach(t => t.textContent = 'Abrir Detalhes');
  document.querySelectorAll('.failure-toggle-btn .toggle-icon').forEach(i => i.textContent = 'expand_more');
}

// Player de Vídeo Modal
function openVideoPlayer(testName) {
  const modal = document.getElementById('video-modal');
  const title = document.getElementById('video-modal-title');
  if (modal && title) {
    title.textContent = `Reprodução de Evidência • ${testName}`;
    modal.classList.remove('hidden');
  }
}

function closeVideoPlayer() {
  const modal = document.getElementById('video-modal');
  if (modal) modal.classList.add('hidden');
}

// Drawer de Detalhes
function inspectTestDetails(testId) {
  const data = window.universalQaState.suiteData || DEFAULT_DEMO_DATA;
  const test = data.tests.find(t => t.id === testId);
  if (!test) return;

  const drawer = document.getElementById('detail-drawer');
  const content = document.getElementById('drawer-content');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer || !content) return;

  const isPassed = test.status === 'passed';

  content.innerHTML = `
    <!-- Header Fixo Superior com Botão Fechar -->
    <div class="px-6 py-4 bg-[#141519] border-b border-[#23252b] flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <span class="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2.5 py-1 rounded">
          ${escapeHtml(test.id)}
        </span>
        <span class="badge-status ${isPassed ? 'badge-status-pass bg-emerald-950/70 text-emerald-300 border border-emerald-800/60' : 'badge-status-fail bg-red-950/70 text-red-300 border border-red-800/60'} px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
          ${isPassed ? 'PASS' : 'FAIL'}
        </span>
        <span class="px-2.5 py-0.5 rounded bg-[#1e2025] text-gray-400 border border-[#2d3038] text-xs">
          ${escapeHtml(test.module || 'Geral')}
        </span>
      </div>
      <button onclick="closeDrawer()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202228] hover:bg-[#2b2e37] text-gray-300 hover:text-white border border-[#353842] text-xs font-semibold transition-all shadow-sm cursor-pointer">
        <span class="material-symbols-outlined text-[16px]">close</span>
        <span>Fechar</span>
      </button>
    </div>

    <!-- Corpo com Scroll Suave e Seções Espaçosas -->
    <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
      <!-- Identificação do Teste -->
      <div class="card-executive p-5 rounded-xl border border-[#23252b] bg-[#141519]/90 flex flex-col gap-3">
        <div>
          <span class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Nome da Execução</span>
          <h2 class="text-base font-bold text-white mt-1 leading-snug break-words">${escapeHtml(test.name)}</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#23252b]/80">
          <div>
            <span class="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Módulo</span>
            <p class="text-xs font-semibold text-gray-200 mt-0.5">${escapeHtml(test.module)}</p>
          </div>
          <div>
            <span class="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Duração</span>
            <p class="text-xs font-mono font-semibold text-gray-200 mt-0.5">${escapeHtml(test.durationFormatted)}</p>
          </div>
          <div>
            <span class="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Status</span>
            <p class="text-xs font-semibold ${isPassed ? 'text-emerald-400' : 'text-red-400'} mt-0.5 uppercase">${isPassed ? 'Aprovado' : 'Falha Crítica'}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-3 border-t border-[#23252b]/80">
          <button onclick="copyToClipboard('${escapeJsString(test.name)}')" class="flex-1 py-2 px-3 rounded-lg bg-[#1a1c22] hover:bg-[#232630] border border-[#2d3038] text-xs font-medium text-gray-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors">
            <span class="material-symbols-outlined text-[15px]">content_copy</span>
            <span>Copiar Nome</span>
          </button>
          <button onclick="copyToClipboard('npx playwright test --grep &quot;${escapeJsString(test.name)}&quot;')" class="flex-1 py-2 px-3 rounded-lg bg-[#1a1c22] hover:bg-[#232630] border border-[#2d3038] text-xs font-medium text-gray-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors">
            <span class="material-symbols-outlined text-[15px]">terminal</span>
            <span>Copiar Comando CLI</span>
          </button>
        </div>
      </div>

      ${test.errorDetails ? `
        <!-- Diagnóstico IA & Causa Raiz -->
        <div class="card-executive p-5 rounded-xl border border-red-900/30 bg-[#161214]/80 flex flex-col gap-3">
          <div class="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
            <span class="material-symbols-outlined text-[18px]">psychology</span>
            <span>Diagnóstico do Incidente & Análise Heurística</span>
          </div>
          <p class="text-xs text-gray-300 leading-relaxed">
            ${escapeHtml(test.aiDiagnostic ? test.aiDiagnostic.rootCause : test.errorDetails.message)}
          </p>
          ${test.aiDiagnostic && test.aiDiagnostic.suggestedFix ? `
            <div class="p-3 rounded-lg bg-[#111827]/70 border border-blue-900/40 flex flex-col gap-1">
              <span class="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">build_circle</span> Sugestão de Correção
              </span>
              <p class="text-xs text-blue-200 leading-relaxed">${escapeHtml(test.aiDiagnostic.suggestedFix)}</p>
            </div>
          ` : ''}
        </div>

        <!-- Mensagem de Erro -->
        <div class="card-executive p-5 rounded-xl border border-[#2a2b33] bg-[#141519]/90 flex flex-col gap-2.5">
          <div class="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
            <span class="material-symbols-outlined text-[18px]">error</span>
            <span>Mensagem de Erro Capturada</span>
          </div>
          <div class="p-3.5 rounded-lg bg-[#0a0a0c] border border-red-900/30 text-xs font-mono text-red-200 leading-relaxed whitespace-pre-wrap break-words">
            ${escapeHtml(test.errorDetails.message)}
          </div>
        </div>

        <!-- Stacktrace Completo -->
        <div class="card-executive p-5 rounded-xl border border-[#2a2b33] bg-[#141519]/90 flex flex-col gap-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-gray-300 font-bold text-xs uppercase tracking-wider">
              <span class="material-symbols-outlined text-[18px]">terminal</span>
              <span>Stacktrace & Runner Log</span>
            </div>
            <button onclick="copyElementText('drawer-stacktrace-code')" class="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded bg-[#1e2025] hover:bg-[#282a32] border border-[#30333d] transition-colors">
              <span class="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Copiar Stacktrace</span>
            </button>
          </div>
          <pre class="bg-[#0a0a0c] p-4 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto text-gray-300 border border-[#23252b] max-h-72 overflow-y-auto"><code id="drawer-stacktrace-code">${escapeHtml(test.errorDetails.stackTrace || 'Nenhum stacktrace disponível')}</code></pre>
        </div>
      ` : `
        <!-- Card de Sucesso -->
        <div class="p-6 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex flex-col gap-3">
          <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <span class="material-symbols-outlined text-[24px]">verified</span>
            <span>Executado com Êxito</span>
          </div>
          <p class="text-xs text-gray-300 leading-relaxed">
            O teste passou com 100% de conformidade com todas as asserções e sem divergências estruturais.
          </p>
        </div>
      `}
    </div>
  `;

  if (backdrop) backdrop.classList.remove('hidden');
  drawer.classList.remove('translate-x-full');
}

function closeDrawer() {
  const drawer = document.getElementById('detail-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (drawer) drawer.classList.add('translate-x-full');
  if (backdrop) backdrop.classList.add('hidden');
}

// Histórico de Execuções Persistido (Tendências & Matriz de Risco)
const RUN_HISTORY_DATA = [
  {
    executionDate: "20/10/2026 09:01:39",
    status: "Atual",
    duration: "43m 21s",
    total: 136,
    passed: 109,
    failed: 27,
    passRate: 80.1,
    classification: "Estável (80.1%)",
    engine: "Microsoft Playwright C# (x64)"
  },
  {
    executionDate: "19/10/2026 16:53:16",
    status: "Anterior",
    duration: "40m 26s",
    total: 136,
    passed: 108,
    failed: 28,
    passRate: 79.4,
    classification: "Instável (79.4%)",
    engine: "Microsoft Playwright C# (x64)"
  },
  {
    executionDate: "16/10/2026 15:20:00",
    status: "Histórico",
    duration: "38m 12s",
    total: 128,
    passed: 97,
    failed: 31,
    passRate: 75.8,
    classification: "Instável (75.8%)",
    engine: "Microsoft Playwright C# (x64)"
  }
];

function exportHistoryJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(RUN_HISTORY_DATA, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "history.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Histórico exportado com sucesso (history.json)!');
}

// Helpers
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copiado para a área de transferência!');
  });
}

function copyElementText(id) {
  const el = document.getElementById(id);
  if (el) {
    copyToClipboard(el.innerText || el.textContent);
  }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('app-toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 3000);
}

function escapeJsString(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
}

// Inicialização Geral no DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Verifica tema salvo no navegador
  try {
    const savedTheme = localStorage.getItem('universal_qa_theme');
    if (savedTheme === 'light') {
      toggleTheme();
    }
  } catch (e) {}

  // Inicializa o Radar WebGL
  if (window.TacticalRadarShader) {
    window.TacticalRadarShader.init('shader-canvas', window.universalQaState.currentTheme);
  }

  // Carrega suíte padrão
  applyLoadedReport(DEFAULT_DEMO_DATA, 'Default Demo');

  // Ativa Spotlights e Drag & Drop
  initSpotlightCards();
  setupDragAndDrop();

  // Ações dos botões do cabeçalho
  const refreshBtn = document.getElementById('btn-refresh');
  const refreshIcon = document.getElementById('refresh-icon');
  if (refreshBtn && refreshIcon) {
    refreshBtn.addEventListener('click', () => {
      refreshIcon.classList.add('rotate-[360deg]');
      setTimeout(() => refreshIcon.classList.remove('rotate-[360deg]'), 750);
      runInitialAnimations();
      showToast('Telemetria atualizada!');
    });
  }

  const copySummaryBtn = document.getElementById('btn-copy-summary');
  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', () => {
      const d = window.universalQaState.suiteData || DEFAULT_DEMO_DATA;
      const summary = `📊 Resumo Executivo QA:\n- Total: ${d.summary.total} testes\n- Aprovados: ${d.summary.passed} (${d.summary.passRate}%)\n- Falhas: ${d.summary.failed}\n- Duração: ${d.summary.durationFormatted}\n- Status: ${d.summary.slaPassed ? 'CONFORME SLA (>75%)' : 'ALERTA DE REGRESSÃO'}`;
      copyToClipboard(summary);
    });
  }

  // Atalho de Teclado '/' para focar busca
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      const searchInput = document.getElementById('qa-quick-search');
      if (searchInput) {
        searchInput.focus();
        switchView('execucoes-e-resultados');
      }
    }
  });
});

// ============================================================
// GRÁFICOS & DISTRIBUIÇÃO POR MÓDULO DO ERP
// ============================================================
const MODULE_COLOR_MAP = {
  'VaiDeFood': '#ef4444',
  'API': '#3b82f6',
  'Movimentação': '#60a5fa',
  'Financeiro': '#93c5fd',
  'Estoque': '#bfdbfe',
  'Administrativo': '#e2e8f0',
  'Produto': '#f87171',
  'Configuração': '#cbd5e1',
  'Manufatura': '#94a3b8'
};

const MODULE_ARC_IDS = {
  'VaiDeFood': 'module-arc-vaidefood',
  'API': 'module-arc-api',
  'Movimentação': 'module-arc-movimentacao',
  'Financeiro': 'module-arc-financeiro',
  'Estoque': 'module-arc-estoque',
  'Administrativo': 'module-arc-administrativo',
  'Produto': 'module-arc-produto',
  'Configuração': 'module-arc-configuracao',
  'Manufatura': 'module-arc-manufatura'
};

let activeSelectedModule = null;

function focusModuleDonut(moduleName) {
  activeSelectedModule = (moduleName === 'all' || activeSelectedModule === moduleName) ? null : moduleName;
  updateModuleDonutVisuals(activeSelectedModule);
}

function previewModuleSlice(moduleName) {
  if (activeSelectedModule) return;
  updateModuleDonutVisuals(moduleName, true);
}

function resetModulePreview() {
  if (activeSelectedModule) return;
  updateModuleDonutVisuals(null);
}

function updateModuleDonutVisuals(mod, isHover = false) {
  const centerPct = document.getElementById('module-donut-center-pct');
  const centerTitle = document.getElementById('module-donut-center-title');
  const centerSub = document.getElementById('module-donut-center-sub');

  const data = window.universalQaState.suiteData || DEFAULT_DEMO_DATA;
  const totalSuiteTests = data.summary.total || 136;

  // Atualiza botões pills
  document.querySelectorAll('.module-filter-pill').forEach(pill => {
    const pillMod = pill.getAttribute('data-module');
    if ((!mod && pillMod === 'all') || (mod && pillMod === mod)) {
      pill.classList.add('bg-blue-600', 'text-white', 'border-blue-500');
      pill.classList.remove('bg-[#18191e]', 'text-gray-300', 'border-[#282a30]');
    } else {
      pill.classList.remove('bg-blue-600', 'text-white', 'border-blue-500');
      pill.classList.add('bg-[#18191e]', 'text-gray-300', 'border-[#282a30]');
    }
  });

  if (!mod) {
    if (centerPct) centerPct.textContent = '100%';
    if (centerTitle) centerTitle.textContent = 'Todos os Módulos';
    if (centerSub) centerSub.textContent = `${totalSuiteTests} testes no total`;

    // Reseta arcos
    Object.values(MODULE_ARC_IDS).forEach(arcId => {
      const el = document.getElementById(arcId);
      if (el) {
        el.style.strokeWidth = '16';
        el.style.opacity = '1';
        el.style.filter = 'none';
      }
    });
    return;
  }

  const moduleObj = (data.modules || []).find(m => m.name === mod) || { total: 0, passed: 0, failed: 0 };
  const pct = ((moduleObj.total / totalSuiteTests) * 100).toFixed(1);

  if (centerPct) centerPct.textContent = `${pct}%`;
  if (centerTitle) centerTitle.textContent = mod;
  if (centerSub) centerSub.textContent = `${moduleObj.total} testes (${moduleObj.passed} ok / ${moduleObj.failed} falhas)`;

  const targetArcId = MODULE_ARC_IDS[mod];
  Object.entries(MODULE_ARC_IDS).forEach(([mName, arcId]) => {
    const el = document.getElementById(arcId);
    if (!el) return;
    if (arcId === targetArcId) {
      el.style.strokeWidth = '22';
      el.style.opacity = '1';
      el.style.filter = `drop-shadow(0 0 10px ${MODULE_COLOR_MAP[mName] || '#3b82f6'})`;
    } else {
      el.style.strokeWidth = '14';
      el.style.opacity = '0.25';
      el.style.filter = 'none';
    }
  });
}

function filterModuleCardsGrid(filterType) {
  const cards = document.querySelectorAll('.module-card-item');
  const btnAll = document.getElementById('btn-filter-mod-all');
  const btnFailed = document.getElementById('btn-filter-mod-failed');
  const btnPassed = document.getElementById('btn-filter-mod-passed');

  [btnAll, btnFailed, btnPassed].forEach(b => {
    if (b) {
      b.classList.remove('bg-[#202228]', 'text-white');
      b.classList.add('text-gray-400');
    }
  });

  if (filterType === 'all' && btnAll) {
    btnAll.classList.add('bg-[#202228]', 'text-white');
    btnAll.classList.remove('text-gray-400');
  } else if (filterType === 'failed' && btnFailed) {
    btnFailed.classList.add('bg-[#202228]', 'text-white');
    btnFailed.classList.remove('text-gray-400');
  } else if (filterType === 'passed' && btnPassed) {
    btnPassed.classList.add('bg-[#202228]', 'text-white');
    btnPassed.classList.remove('text-gray-400');
  }

  cards.forEach(card => {
    const hasFail = card.getAttribute('data-has-fail') === 'true';
    if (filterType === 'all') {
      card.classList.remove('hidden');
    } else if (filterType === 'failed') {
      card.classList.toggle('hidden', !hasFail);
    } else if (filterType === 'passed') {
      card.classList.toggle('hidden', hasFail);
    }
  });
}

function searchModuleCards(val) {
  const query = (val || '').toLowerCase().trim();
  const cards = document.querySelectorAll('.module-card-item');
  cards.forEach(card => {
    const mod = (card.getAttribute('data-module') || '').toLowerCase();
    if (!query || mod.includes(query)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function toggleModuleTestsAccordion(moduleName, btn) {
  const container = document.getElementById(`module-tests-${moduleName}`);
  if (!container) return;

  const isHidden = container.classList.contains('hidden');
  const icon = btn ? btn.querySelector('.material-symbols-outlined') : null;

  if (isHidden) {
    container.classList.remove('hidden');
    if (icon) icon.textContent = 'expand_less';

    // Se estiver vazio, popula com os testes do módulo
    if (container.children.length === 0) {
      const data = window.universalQaState.suiteData || DEFAULT_DEMO_DATA;
      const tests = (data.tests || []).filter(t => t.module === moduleName);
      if (tests.length === 0) {
        container.innerHTML = `<span class="text-[11px] text-gray-500 italic p-1">Nenhum detalhe adicional de teste encontrado.</span>`;
      } else {
        container.innerHTML = tests.map(t => {
          const isPass = t.status === 'passed';
          return `
            <div class="flex items-center justify-between p-1.5 rounded bg-[#16171b] border border-[#23252b] hover:bg-[#1e2025] transition-colors cursor-pointer" onclick="inspectTestDetails('${t.id}')">
              <div class="flex items-center gap-2 truncate pr-2">
                <span class="badge-status ${isPass ? 'badge-status-pass bg-emerald-950 text-emerald-400' : 'badge-status-fail bg-red-950 text-red-400'} text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">${isPass ? 'PASS' : 'FAIL'}</span>
                <span class="text-[11px] font-medium text-gray-200 truncate" title="${escapeHtml(t.name)}">${escapeHtml(t.name)}</span>
              </div>
              <span class="text-[10px] font-mono text-gray-400 shrink-0">${t.durationFormatted}</span>
            </div>
          `;
        }).join('');
      }
    }
  } else {
    container.classList.add('hidden');
    if (icon) icon.textContent = 'expand_more';
  }
}

function toggleAllModuleCards(expand) {
  const cards = document.querySelectorAll('.module-card-item');
  cards.forEach(card => {
    const mod = card.getAttribute('data-module');
    const container = document.getElementById(`module-tests-${mod}`);
    const btn = card.querySelector('button[onclick*="toggleModuleTestsAccordion"]');
    const icon = btn ? btn.querySelector('.material-symbols-outlined') : null;
    if (container) {
      if (expand) {
        if (container.classList.contains('hidden')) {
          toggleModuleTestsAccordion(mod, btn);
        }
      } else {
        container.classList.add('hidden');
        if (icon) icon.textContent = 'expand_more';
      }
    }
  });
}

function toggleSectionCollapse(elementId, btn) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const isHidden = el.classList.toggle('hidden');
  const span = btn ? btn.querySelector('span:not(.material-symbols-outlined)') : null;
  const icon = btn ? btn.querySelector('.material-symbols-outlined') : null;
  if (span) span.textContent = isHidden ? 'Expandir' : 'Recolher';
  if (icon) icon.textContent = isHidden ? 'expand_more' : 'expand_less';
}

function filterExecutionsByModule(moduleName) {
  switchView('execucoes-e-resultados');
  const searchInput = document.getElementById('qa-quick-search');
  if (searchInput) {
    searchInput.value = moduleName;
    handleSearchInput(moduleName);
  }
}

// ============================================================
// MÓDULO DE TESTES DE PERFORMANCE, CARGA & ESTRESSE (k6)
// ============================================================

const DEFAULT_K6_DATA = {
  testType: 'Teste de Carga & Estresse (Load/Stress)',
  fileName: 'k6-summary.json',
  vusMax: 100,
  vusCurrent: 100,
  httpReqsCount: 4822,
  rps: '80.3',
  iterationsCount: 2411,
  errorRatePct: '0.25',
  failedReqs: 12,
  passedReqs: 4810,
  durationFormatted: '1m 00s',
  slaPassed: true,
  latency: {
    avg: '182.4',
    min: '21.0',
    med: '145.2',
    max: '1240.5',
    p90: '285.3',
    p95: '392.1',
    p99: '712.8'
  },
  network: {
    dataReceivedMb: '18.45 MB',
    dataSentMb: '1.42 MB',
    connectingAvg: '14.2',
    tlsAvg: '18.6',
    waitingAvg: '154.2'
  },
  thresholds: [
    { metric: 'http_req_duration{expected_response:true}', expression: 'p(95) < 500ms', value: '392.1 ms', ok: true },
    { metric: 'http_req_duration{expected_response:true}', expression: 'p(99) < 1000ms', value: '712.8 ms', ok: true },
    { metric: 'http_req_failed', expression: 'rate < 0.01 (1%)', value: '0.25%', ok: true },
    { metric: 'checks', expression: 'rate > 0.95 (95%)', value: '99.5%', ok: true }
  ],
  checks: [
    { group: 'Autenticação & Login', name: 'status is 200 (Login API)', passes: 2411, fails: 0, rate: 100.0, ok: true },
    { group: 'Autenticação & Login', name: 'token JWT retornado no payload', passes: 2411, fails: 0, rate: 100.0, ok: true },
    { group: 'Checkout & Pagamento Pix', name: 'status is 200 ou 201 (Criação de Fatura)', passes: 2399, fails: 12, rate: 99.5, ok: true },
    { group: 'Checkout & Pagamento Pix', name: 'latência gateway PSP < 800ms', passes: 2385, fails: 26, rate: 98.9, ok: true },
    { group: 'Catálogo & Vitrine', name: 'tempo de resposta vitrine < 300ms', passes: 4822, fails: 0, rate: 100.0, ok: true }
  ],
  scenarios: {
    load: { vus: 100, rps: '80.3', p95: '392.1', errorRate: '0.25', total: 4822 },
    stress: { vus: 300, rps: '185.7', p95: '780.4', errorRate: '1.82', total: 11142 },
    smoke: { vus: 10, rps: '12.4', p95: '115.2', errorRate: '0.00', total: 620 }
  }
};

function renderK6Dashboard(data) {
  const container = document.getElementById('k6-dashboard-container');
  if (!container) return;

  const k6 = data || window.universalQaState.k6Data || DEFAULT_K6_DATA;
  window.universalQaState.k6Data = k6;

  const isSlaOk = k6.slaPassed !== false;
  const isSelected = window.universalQaState.k6SelectedCol || 'latency';

  container.innerHTML = `
    <!-- Top Hero Card com Informações Executivas e Seletor de Cenários -->
    <div class="card-executive p-6 rounded-xl flex flex-col justify-between border border-[#23252b] bg-[#141519]/90 shadow-lg">
      <div class="flex items-start lg:items-center justify-between gap-4 border-b border-[#23252b] pb-4 flex-wrap">
        <div class="flex items-center gap-3 flex-wrap">
          <span class="px-3 py-1 rounded bg-purple-950/80 border border-purple-800/80 text-purple-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span class="material-symbols-outlined text-[16px] text-purple-400">speed</span>
            ${escapeHtml(k6.testType || 'Teste de Carga')}
          </span>
          <h2 class="text-base lg:text-lg font-bold text-white tracking-tight">k6 Performance & Observabilidade de Carga</h2>
          <span class="px-2.5 py-0.5 rounded bg-[#1e2025] text-gray-300 border border-[#2d3038] text-xs font-mono">
            ${escapeHtml(k6.fileName || 'summary.json')}
          </span>
          <span class="text-xs text-gray-400 font-medium hidden sm:inline">
            Duração: <strong class="text-white">${k6.durationFormatted}</strong>
          </span>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs text-gray-400 font-medium hidden md:inline">Cenários k6:</span>
          <button onclick="switchK6Scenario('load')" class="px-2.5 py-1 rounded-lg bg-[#1e2025] hover:bg-[#282a32] text-xs font-medium border border-[#30333d] text-gray-200 transition-colors">
            ⚡ Carga (100 VUs)
          </button>
          <button onclick="switchK6Scenario('stress')" class="px-2.5 py-1 rounded-lg bg-[#1e2025] hover:bg-[#282a32] text-xs font-medium border border-[#30333d] text-gray-200 transition-colors">
            🔥 Estresse (300 VUs)
          </button>
          <button onclick="switchK6Scenario('smoke')" class="px-2.5 py-1 rounded-lg bg-[#1e2025] hover:bg-[#282a32] text-xs font-medium border border-[#30333d] text-gray-200 transition-colors">
            💨 Smoke (10 VUs)
          </button>
          <button onclick="exportK6SummaryJson()" class="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800/70 border border-purple-700/60 text-purple-200 text-xs font-semibold shadow-sm transition-all ml-2">
            <span class="material-symbols-outlined text-[14px]">download</span>
            <span>Exportar JSON</span>
          </button>
        </div>
      </div>

      <div class="pt-4 flex items-center justify-between gap-4 flex-wrap text-xs">
        <div class="flex items-center gap-2">
          <span class="text-gray-400">Resultado dos Thresholds:</span>
          ${isSlaOk ? `
            <span class="px-2.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">verified</span> 100% dos Critérios Conformes
            </span>
          ` : `
            <span class="px-2.5 py-0.5 rounded bg-red-950/70 border border-red-800/60 text-red-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">warning</span> Violação de SLA Detectada
            </span>
          `}
        </div>
        <div class="flex items-center gap-4 text-gray-400">
          <span>Passe o mouse ou clique sobre qualquer coluna abaixo para focar</span>
          <span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
        </div>
      </div>
    </div>

    <!-- AS 4 COLUNAS INTERATIVAS COM EFEITO HOVER E FOCO NA COLUNA MAIS IMPORTANTE -->
    <div class="k6-telemetry-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      
      <!-- Coluna 1: Usuários Virtuais (VUs) -->
      <div id="k6-col-vus" onclick="selectK6Column('vus')" class="k6-telemetry-col card-executive p-5 rounded-xl border border-[#23252b] bg-[#141519]/90 flex flex-col justify-between ${isSelected === 'vus' ? 'k6-col-selected' : ''}" title="Clique para fixar esta coluna">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-[#23252b]/80">
            <div class="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <span class="material-symbols-outlined text-[18px]">group</span>
              <span>Usuários Virtuais (VUs)</span>
            </div>
            <span class="text-[10px] text-gray-400 font-mono">Concorrência</span>
          </div>
          <div class="my-4">
            <span class="text-3xl font-extrabold text-white font-mono tracking-tight">${k6.vusMax}</span>
            <span class="text-xs text-gray-400 ml-1">VUs Pico</span>
          </div>
          <div class="flex flex-col gap-2 pt-2 border-t border-[#23252b]/60 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Vazão (RPS):</span>
              <strong class="text-white font-mono font-semibold">${k6.rps} req/s</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Iterações Completas:</span>
              <span class="text-gray-200 font-mono">${k6.iterationsCount.toLocaleString()}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Status de Rampa:</span>
              <span class="text-cyan-300 font-medium">100% Estabilizado</span>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-[#23252b]/60">
          <div class="w-full bg-[#1e2025] h-1.5 rounded-full overflow-hidden">
            <div class="bg-cyan-500 h-1.5 rounded-full" style="width: 100%"></div>
          </div>
        </div>
      </div>

      <!-- Coluna 2: Latência & Percentis (A COLUNA MAIS IMPORTANTE - PRÉ-SELECIONADA POR PADRÃO) -->
      <div id="k6-col-latency" onclick="selectK6Column('latency')" class="k6-telemetry-col card-executive p-5 rounded-xl border border-purple-500/80 bg-[#16131e]/95 flex flex-col justify-between ${isSelected === 'latency' ? 'k6-col-selected' : ''}" title="Clique para fixar esta coluna">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-purple-800/40">
            <div class="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
              <span class="material-symbols-outlined text-[18px]">timer</span>
              <span>Latência & Percentis</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-purple-900/70 border border-purple-700/60 text-purple-200 text-[10px] font-bold uppercase tracking-wider animate-pulse">
              Métrica Chave
            </span>
          </div>
          <div class="my-4">
            <span class="text-[11px] uppercase tracking-wider text-purple-300 font-semibold block">Percentil p(95) SLA:</span>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="text-3xl font-extrabold text-white font-mono tracking-tight">${k6.latency.p95}</span>
              <span class="text-xs text-purple-300 font-semibold">ms</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-purple-900/40 text-xs">
            <div class="p-2 rounded bg-[#100d16] border border-purple-900/30 flex flex-col">
              <span class="text-[10px] text-gray-400 uppercase">p(99) Cauda</span>
              <strong class="text-purple-300 font-mono mt-0.5">${k6.latency.p99} ms</strong>
            </div>
            <div class="p-2 rounded bg-[#100d16] border border-purple-900/30 flex flex-col">
              <span class="text-[10px] text-gray-400 uppercase">p(90)</span>
              <strong class="text-gray-200 font-mono mt-0.5">${k6.latency.p90} ms</strong>
            </div>
            <div class="p-2 rounded bg-[#100d16] border border-purple-900/30 flex flex-col">
              <span class="text-[10px] text-gray-400 uppercase">Mediana</span>
              <strong class="text-gray-200 font-mono mt-0.5">${k6.latency.med} ms</strong>
            </div>
            <div class="p-2 rounded bg-[#100d16] border border-purple-900/30 flex flex-col">
              <span class="text-[10px] text-gray-400 uppercase">Média</span>
              <strong class="text-gray-200 font-mono mt-0.5">${k6.latency.avg} ms</strong>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-purple-900/40 flex items-center justify-between text-[11px]">
          <span class="text-gray-400">Meta: <strong class="text-white">&lt; 500ms</strong></span>
          <span class="text-emerald-400 font-semibold flex items-center gap-0.5">
            <span class="material-symbols-outlined text-[13px]">check</span> Conforme SLA
          </span>
        </div>
      </div>

      <!-- Coluna 3: Confiabilidade & Taxa de Erro HTTP -->
      <div id="k6-col-errors" onclick="selectK6Column('errors')" class="k6-telemetry-col card-executive p-5 rounded-xl border border-[#23252b] bg-[#141519]/90 flex flex-col justify-between ${isSelected === 'errors' ? 'k6-col-selected' : ''}" title="Clique para fixar esta coluna">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-[#23252b]/80">
            <div class="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span class="material-symbols-outlined text-[18px]">verified</span>
              <span>Confiabilidade HTTP</span>
            </div>
            <span class="text-[10px] text-gray-400 font-mono">http_req_failed</span>
          </div>
          <div class="my-4">
            <span class="text-3xl font-extrabold ${parseFloat(k6.errorRatePct) > 1 ? 'text-red-400' : 'text-emerald-400'} font-mono tracking-tight">${k6.errorRatePct}%</span>
            <span class="text-xs text-gray-400 ml-1">Taxa de Erro</span>
          </div>
          <div class="flex flex-col gap-2 pt-2 border-t border-[#23252b]/60 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Requisições com Sucesso:</span>
              <strong class="text-emerald-400 font-mono font-semibold">${k6.passedReqs.toLocaleString()}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Falhas / Timeouts:</span>
              <span class="${k6.failedReqs > 0 ? 'text-red-400 font-bold' : 'text-gray-400'} font-mono">${k6.failedReqs}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Total Executado:</span>
              <span class="text-white font-mono">${k6.httpReqsCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-[#23252b]/60 flex items-center justify-between text-[11px]">
          <span class="text-gray-400">Tolerância: <strong class="text-white">&lt; 1.0%</strong></span>
          <span class="text-emerald-400 font-semibold flex items-center gap-0.5">
            <span class="material-symbols-outlined text-[13px]">check</span> Estável
          </span>
        </div>
      </div>

      <!-- Coluna 4: Rede & Handshake -->
      <div id="k6-col-network" onclick="selectK6Column('network')" class="k6-telemetry-col card-executive p-5 rounded-xl border border-[#23252b] bg-[#141519]/90 flex flex-col justify-between ${isSelected === 'network' ? 'k6-col-selected' : ''}" title="Clique para fixar esta coluna">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-[#23252b]/80">
            <div class="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <span class="material-symbols-outlined text-[18px]">wifi_tethering</span>
              <span>Rede & Handshake</span>
            </div>
            <span class="text-[10px] text-gray-400 font-mono">Tráfego</span>
          </div>
          <div class="my-4">
            <span class="text-3xl font-extrabold text-white font-mono tracking-tight">${k6.network.dataReceivedMb}</span>
            <span class="text-xs text-gray-400 ml-1">Recebidos</span>
          </div>
          <div class="flex flex-col gap-2 pt-2 border-t border-[#23252b]/60 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Dados Enviados:</span>
              <strong class="text-white font-mono">${k6.network.dataSentMb}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">DNS & Conexão:</span>
              <span class="text-gray-200 font-mono">${k6.network.connectingAvg} ms</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">TLS Handshake:</span>
              <span class="text-gray-200 font-mono">${k6.network.tlsAvg} ms</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">TTFB (Waiting):</span>
              <span class="text-gray-200 font-mono">${k6.network.waitingAvg} ms</span>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-[#23252b]/60">
          <div class="w-full bg-[#1e2025] h-1.5 rounded-full overflow-hidden">
            <div class="bg-blue-500 h-1.5 rounded-full" style="width: 85%"></div>
          </div>
        </div>
      </div>

    </div>

    <!-- SEÇÃO DUPLA: THRESHOLDS (SLAS) E CHECKS FUNCIONAIS POR ENDPOINT -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
      
      <!-- Card de Thresholds do k6 -->
      <div class="card-executive p-6 rounded-xl border border-[#23252b] bg-[#141519]/90 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between border-b border-[#23252b] pb-3 mb-4">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-purple-400">gavel</span>
              <h3 class="text-sm font-bold text-white uppercase tracking-wider">Critérios de Aceite & Thresholds (SLA)</h3>
            </div>
            <span class="text-xs text-gray-400 font-mono">${k6.thresholds.length} Regras Auditadas</span>
          </div>
          <div class="flex flex-col gap-2.5">
            ${k6.thresholds.map(th => `
              <div class="p-3 rounded-lg bg-[#111216] border border-[#23252b] flex items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-2 h-2 rounded-full ${th.ok ? 'bg-emerald-400' : 'bg-red-400'} shrink-0"></span>
                  <span class="font-mono text-gray-300 truncate" title="${escapeHtml(th.metric)}">${escapeHtml(th.metric)}</span>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <span class="font-mono text-purple-300 font-semibold">${escapeHtml(th.expression)}</span>
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase ${th.ok ? 'bg-emerald-950/70 border border-emerald-800/60 text-emerald-300' : 'bg-red-950/70 border border-red-800/60 text-red-300'}">
                    ${th.ok ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-[#23252b] text-[11px] text-gray-400 flex items-center justify-between">
          <span>Critério Corporativo: Latência p95 &lt; 500ms e Erro &lt; 1%</span>
          <span class="text-emerald-400 font-semibold">100% Homologado</span>
        </div>
      </div>

      <!-- Card de Checks & Grupos de Endpoints -->
      <div class="card-executive p-6 rounded-xl border border-[#23252b] bg-[#141519]/90 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between border-b border-[#23252b] pb-3 mb-4">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-blue-400">checklist</span>
              <h3 class="text-sm font-bold text-white uppercase tracking-wider">Checks Funcionais por Endpoint</h3>
            </div>
            <span class="text-xs text-gray-400 font-mono">${k6.checks.length} Validações Ativas</span>
          </div>
          <div class="flex flex-col gap-2.5">
            ${k6.checks.map(c => `
              <div class="p-3 rounded-lg bg-[#111216] border border-[#23252b] flex items-center justify-between gap-3 text-xs">
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="px-1.5 py-0.2 rounded text-[10px] bg-[#1e2025] text-gray-300 border border-[#2d3038] font-medium shrink-0">${escapeHtml(c.group)}</span>
                    <span class="font-medium text-white truncate" title="${escapeHtml(c.name)}">${escapeHtml(c.name)}</span>
                  </div>
                  <span class="text-[10px] text-gray-500 mt-0.5">${c.passes.toLocaleString()} ok • ${c.fails} falhas</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="font-mono text-xs font-bold ${c.ok ? 'text-emerald-400' : 'text-red-400'}">${c.rate}%</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.ok ? 'bg-emerald-950/70 border border-emerald-800/60 text-emerald-300' : 'bg-red-950/70 border border-red-800/60 text-red-300'}">
                    ${c.ok ? 'OK' : 'ALERTA'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-[#23252b] text-[11px] text-gray-400 flex items-center justify-between">
          <span>Integridade de Payloads e Status Codes das APIs</span>
          <span class="text-blue-400 font-semibold">Monitoramento Contínuo</span>
        </div>
      </div>

    </div>
  `;
}

// Funções de Interação e Seleção de Coluna k6
function selectK6Column(colType) {
  window.universalQaState.k6SelectedCol = colType;
  document.querySelectorAll('.k6-telemetry-col').forEach(col => {
    col.classList.remove('k6-col-selected');
  });
  const target = document.getElementById(`k6-col-${colType}`);
  if (target) {
    target.classList.add('k6-col-selected');
    const names = { vus: 'Concorrência & VUs', latency: 'Latência & Percentis', errors: 'Confiabilidade HTTP', network: 'Rede & Tráfego' };
    showToast(`Coluna Selecionada: ${names[colType] || colType}`);
  }
}

function switchK6Scenario(scenarioKey) {
  const current = window.universalQaState.k6Data || DEFAULT_K6_DATA;
  if (!current.scenarios || !current.scenarios[scenarioKey]) return;
  const s = current.scenarios[scenarioKey];
  current.vusMax = s.vus;
  current.rps = s.rps;
  current.latency.p95 = s.p95;
  current.errorRatePct = s.errorRate;
  current.httpReqsCount = s.total;
  current.passedReqs = Math.round(s.total * (1 - parseFloat(s.errorRate)/100));
  current.failedReqs = s.total - current.passedReqs;
  current.slaPassed = parseFloat(s.errorRate) <= 1.0;

  if (scenarioKey === 'stress') {
    current.testType = 'Teste de Estresse Máximo (Stress Test)';
  } else if (scenarioKey === 'smoke') {
    current.testType = 'Smoke Test Rápido (Smoke Test)';
  } else {
    current.testType = 'Teste de Carga & Estresse (Load Test)';
  }

  renderK6Dashboard(current);
  showToast(`Cenário k6 carregado: ${scenarioKey.toUpperCase()} (${s.vus} VUs)`);
}

function exportK6SummaryJson() {
  const data = window.universalQaState.k6Data || DEFAULT_K6_DATA;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `k6-summary-report-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Relatório k6 exportado em JSON!');
}

