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
    total: 134,
    passed: 107,
    failed: 25,
    skipped: 2,
    flaky: 3,
    passRate: 79.9,
    durationMs: 2479000,
    durationFormatted: '41m 19s',
    timestamp: '13/11/2026 • 19:30:00',
    framework: 'Playwright C# .NET 8 / Universal',
    environment: 'Staging Enterprise • Headless Chromium',
    slaPassed: true,
    slaTarget: 75.0
  },
  modules: [
    { name: 'Financeiro', total: 20, passed: 20, failed: 0, passRate: 100, status: 'conform' },
    { name: 'Configuração', total: 4, passed: 4, failed: 0, passRate: 100, status: 'conform' },
    { name: 'Estoque', total: 16, passed: 16, failed: 0, passRate: 100, status: 'conform' },
    { name: 'Administrativo', total: 9, passed: 9, failed: 0, passRate: 100, status: 'conform' },
    { name: 'Movimentação', total: 22, passed: 22, failed: 0, passRate: 100, status: 'conform' },
    { name: 'API', total: 23, passed: 23, failed: 0, passRate: 100, status: 'conform' },
    { name: 'VaiDeFood', total: 34, passed: 11, failed: 23, passRate: 32, status: 'critical' },
    { name: 'Produto', total: 6, passed: 2, failed: 4, passRate: 33, status: 'attention' },
    { name: 'Manufatura', total: 2, passed: 2, failed: 0, passRate: 100, status: 'conform' }
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
    document.body.style.backgroundColor = '#0c0c0e';
    document.body.style.color = '#ffffff';
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    document.body.style.backgroundColor = '#f5f2eb';
    document.body.style.color = 'rgb(41, 37, 36)';
  }

  window.universalQaState.currentTheme = newTheme;

  // Atualiza Shader WebGL
  if (window.TacticalRadarShader) {
    window.TacticalRadarShader.setTheme(newTheme);
  }

  // Atualiza ícone do botão
  const themeBtnIcon = document.getElementById('theme-toggle-icon');
  const themeBtnText = document.getElementById('theme-toggle-text');
  if (themeBtnIcon) {
    themeBtnIcon.textContent = newTheme === 'dark' ? 'dark_mode' : 'light_mode';
  }
  if (themeBtnText) {
    themeBtnText.textContent = newTheme === 'dark' ? 'Escuro' : 'Claro';
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
      badge = '<span class="text-[#e2e4e9] font-semibold text-[10px] bg-[#202228] border border-[#353842] px-1.5 py-0.2 rounded uppercase">Atenção</span>';
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
          <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${isPassed ? 'bg-secondary-container/40 text-[#86efac] border border-secondary-muted/40' : 'bg-error-container/60 text-[#fca5a5] border border-error-muted/40'}">
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

  // O primeiro é destacado como Hero Card e os demais em acordeão
  const hero = failedTests[0];
  const others = failedTests.slice(1);

  let html = `
    <!-- Hero Diagnostic Card -->
    <article class="w-full card-executive rounded-xl shadow-md overflow-hidden mb-space-lg flex flex-col p-space-lg">
      <div class="flex items-start lg:items-center justify-between gap-space-md border-b border-surface-container-high/60 pb-space-md">
        <div class="flex items-center gap-space-sm flex-wrap">
          <span class="px-space-sm py-1 rounded bg-[#450a0a]/70 text-[#fca5a5] border border-[#7f1d1d]/60 font-label-sm text-label-sm font-bold uppercase tracking-wider flex items-center gap-1">
            <span class="material-symbols-outlined text-[15px]">cancel</span> FALHA CRÍTICA
          </span>
          <h2 class="font-headline-sm text-headline-sm font-bold tracking-tight">${hero.name}</h2>
          <span class="px-space-sm py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">${hero.module}</span>
          <span class="px-space-sm py-0.5 rounded bg-error-container/40 text-on-error-container font-label-sm text-label-sm">${hero.category || 'Timeout'}</span>
        </div>
        <div class="flex items-center gap-space-sm shrink-0">
          <div class="flex items-center gap-1 text-primary">
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span class="font-label-md text-label-md font-semibold">${hero.confidence || 94}% Confiança IA</span>
          </div>
          <span class="text-outline text-label-sm">•</span>
          <span class="font-mono text-label-sm">${hero.durationFormatted}</span>
        </div>
      </div>

      <!-- AI Copilot Diagnostic Panel -->
      <div class="mt-space-lg grid grid-cols-1 lg:grid-cols-3 gap-space-md bg-surface-container-lowest/60 p-space-md rounded-xl border border-surface-container-high">
        <div class="flex flex-col gap-space-xs p-space-sm bg-surface-container-low rounded-lg">
          <div class="flex items-center gap-1.5 text-error">
            <span class="material-symbols-outlined text-[18px]">troubleshoot</span>
            <span class="font-label-md text-label-md font-bold uppercase tracking-wider">Causa Provável</span>
          </div>
          <p class="font-body-sm text-body-sm leading-relaxed">${hero.aiDiagnostic ? hero.aiDiagnostic.rootCause : (hero.errorDetails ? hero.errorDetails.message : 'Timeout ou seletor inexistente.')}</p>
        </div>
        <div class="flex flex-col gap-space-xs p-space-sm bg-surface-container-low rounded-lg">
          <div class="flex items-center gap-1.5 text-primary">
            <span class="material-symbols-outlined text-[18px]">build_circle</span>
            <span class="font-label-md text-label-md font-bold uppercase tracking-wider">Ajuste Recomendado</span>
          </div>
          <p class="font-body-sm text-body-sm leading-relaxed">${hero.aiDiagnostic ? hero.aiDiagnostic.suggestedFix : 'Adicionar espera explícita ou usar data-testid'}</p>
        </div>
        <div class="flex flex-col gap-space-xs p-space-sm bg-surface-container-low rounded-lg">
          <div class="flex items-center gap-1.5 text-secondary">
            <span class="material-symbols-outlined text-[18px]">videocam</span>
            <span class="font-label-md text-label-md font-bold uppercase tracking-wider">Evidência</span>
          </div>
          <p class="font-body-sm text-body-sm leading-relaxed">${hero.aiDiagnostic ? hero.aiDiagnostic.evidenceNote : 'Captura de vídeo gravada.'}</p>
          <div class="mt-auto pt-2 flex items-center justify-between">
            <span class="text-label-sm font-mono text-on-surface-variant">WebM Frame #420</span>
            <button onclick="openVideoPlayer('${hero.name}')" class="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm font-semibold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">play_arrow</span> Reproduzir
            </button>
          </div>
        </div>
      </div>

      <!-- Playwright Stacktrace Snippet -->
      <div class="mt-space-md rounded-lg bg-surface-container-low p-space-md flex flex-col gap-space-xs border border-surface-container-high">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs text-error">
            <span class="material-symbols-outlined text-[18px]">terminal</span>
            <span class="font-label-md text-label-md font-bold">Stacktrace & Runner Exception</span>
          </div>
          <button onclick="copyToClipboard('${escapeJsString(hero.errorDetails ? hero.errorDetails.stackTrace : '')}')" class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">content_copy</span> Copiar Log
          </button>
        </div>
        <pre class="bg-surface-container-lowest p-space-sm rounded font-mono text-[12px] leading-relaxed overflow-x-auto text-on-surface border border-surface-container-high"><code>${hero.errorDetails ? hero.errorDetails.stackTrace : 'Nenhum log gravado'}</code></pre>
      </div>

      <!-- Action Ribbon -->
      <div class="mt-space-md flex flex-wrap items-center justify-between gap-space-sm pt-space-md border-t border-surface-container-high/60">
        <div class="flex items-center gap-space-xs flex-wrap">
          <button onclick="copyToClipboard('npx playwright test --grep ${hero.name}')" class="h-9 px-space-sm rounded bg-surface-container hover:bg-surface-container-high font-label-md text-label-md flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">terminal</span> Copiar Comando Test
          </button>
          <button onclick="showToast('Trace Viewer aberto no navegador local!')" class="h-9 px-space-sm rounded bg-surface-container hover:bg-surface-container-high font-label-md text-label-md flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">visibility</span> Playwright Trace
          </button>
          <button onclick="showToast('Ticket de incidente criado no Jira: #QA-8492')" class="h-9 px-space-sm rounded bg-surface-container hover:bg-surface-container-high font-label-md text-label-md flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">bug_report</span> Criar Issue Jira
          </button>
        </div>
        <button onclick="showToast('Fix sugerido aprovado e enviado para PR!')" class="h-9 px-space-md rounded bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-90 active:scale-95 transition-all">
          <span class="material-symbols-outlined text-[18px]">verified</span> Aprovar Fix Sugerido
        </button>
      </div>
    </article>
  `;

  if (others.length > 0) {
    html += `
      <div class="flex items-center justify-between mb-space-sm px-space-xs">
        <span class="font-headline-sm text-headline-sm font-bold">Outras Falhas Pendentes (${others.length})</span>
        <span class="text-body-sm text-on-surface-variant">Ordenado por severidade</span>
      </div>
      <div class="flex flex-col gap-space-sm">
        ${others.map(o => `
          <div class="card-executive p-space-md rounded-xl flex items-center justify-between gap-space-md">
            <div class="flex items-center gap-space-sm flex-wrap flex-1">
              <span class="px-space-sm py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold uppercase">Falha</span>
              <span class="font-headline-sm text-headline-sm font-semibold hover:text-primary cursor-pointer" onclick="inspectTestDetails('${o.id}')">${o.name}</span>
              <span class="px-space-sm py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">${o.module}</span>
            </div>
            <div class="flex items-center gap-space-md shrink-0">
              <span class="font-mono text-label-sm text-on-surface-variant">${o.durationFormatted}</span>
              <button onclick="inspectTestDetails('${o.id}')" class="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors" title="Expandir Diagnóstico">
                <span class="material-symbols-outlined text-[18px]">visibility</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  container.innerHTML = html;
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
  if (!drawer || !content) return;

  content.innerHTML = `
    <div class="flex flex-col gap-space-md">
      <div class="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
        <span class="font-mono text-label-sm text-primary font-bold">${test.id}</span>
        <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase ${test.status === 'passed' ? 'bg-secondary-container/40 text-[#86efac]' : 'bg-error-container/60 text-[#fca5a5]'}">${test.status}</span>
      </div>
      <div>
        <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">${test.name}</h3>
        <p class="text-on-surface-variant text-body-sm mt-0.5">Módulo: ${test.module} • Duração: ${test.durationFormatted}</p>
      </div>

      ${test.errorDetails ? `
        <div class="p-space-md rounded-lg bg-surface-container-low border border-surface-container-high flex flex-col gap-2">
          <span class="font-label-md text-label-md font-bold text-error flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">error</span> Mensagem de Erro
          </span>
          <p class="font-mono text-[12px] text-on-surface">${test.errorDetails.message}</p>
          <pre class="bg-surface-container-lowest p-space-sm rounded font-mono text-[11px] overflow-x-auto text-on-surface-variant mt-2"><code>${test.errorDetails.stackTrace}</code></pre>
        </div>
      ` : `
        <div class="p-space-md rounded-lg bg-surface-container-low border border-surface-container-high text-emerald-400 flex items-center gap-2">
          <span class="material-symbols-outlined text-[20px]">check_circle</span>
          <span class="font-label-md text-label-md">Executado com êxito sem asserções violadas.</span>
        </div>
      `}

      <div class="flex items-center gap-space-sm mt-space-md">
        <button onclick="copyToClipboard('${test.name}')" class="flex-1 py-2 rounded bg-surface-container hover:bg-surface-container-high font-label-md text-label-md flex items-center justify-center gap-1">
          <span class="material-symbols-outlined text-[16px]">content_copy</span> Copiar Nome
        </button>
        <button onclick="closeDrawer()" class="px-space-md py-2 rounded bg-primary-container text-on-primary font-label-md text-label-md font-semibold">
          Fechar
        </button>
      </div>
    </div>
  `;

  drawer.classList.remove('translate-x-full');
}

function closeDrawer() {
  const drawer = document.getElementById('detail-drawer');
  if (drawer) drawer.classList.add('translate-x-full');
}

// Helpers
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copiado para a área de transferência!');
  });
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
