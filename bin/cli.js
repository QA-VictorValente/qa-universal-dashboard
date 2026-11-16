#!/usr/bin/env node
/**
 * Universal QA Dashboard - CLI, Runner & Local Live Server
 * Zero dependências externas (usa apenas APIs nativas do Node.js).
 * 
 * Exemplos de Uso:
 *   npx qa-universal-dashboard --results ./mochawesome.json --framework "Cypress JS" --open
 *   npx qa-universal-dashboard --run "npx cypress run" --results ./mochawesome.json --open
 *   npx qa-universal-dashboard --build --results ./test-results --open
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec, execSync, spawnSync } = require('child_process');

const UniversalParser = require('../src/parsers/universal-parser');

// Parse dos argumentos CLI
const args = process.argv.slice(2);
function getArg(flags, defaultValue = null) {
  const flagList = Array.isArray(flags) ? flags : [flags];
  for (const flag of flagList) {
    const index = args.indexOf(flag);
    if (index !== -1 && args[index + 1]) {
      return args[index + 1];
    }
  }
  return defaultValue;
}

const hasFlag = (flags) => {
  const flagList = Array.isArray(flags) ? flags : [flags];
  return flagList.some(f => args.includes(f));
};

if (hasFlag(['--help', '-h'])) {
  printHelp();
  process.exit(0);
}

const port = parseInt(getArg(['--port', '-p'], '3000'), 10);
let resultsPath = getArg(['--results', '-r'], null);
const outputPath = getArg(['--output', '-o'], './dist/index.html');
const frameworkOverride = getArg(['--framework', '-f'], null);
const runCommand = getArg(['--run'], null);
const shouldOpen = hasFlag(['--open', '-O']);
const isBuild = hasFlag(['--build', '-b']);
const isDemo = hasFlag(['--demo']);

console.log('\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════════');
console.log('\x1b[36m%s\x1b[0m', '           UNIVERSAL QA TEST DASHBOARD (v1.0.0)                 ');
console.log('\x1b[36m%s\x1b[0m', '  Playwright • Cypress • Robot • Selenium • Pytest • k6 Perf   ');
console.log('\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════════\n');

// 0. EXECUÇÃO DE COMANDO DE TESTES (SE ESPECIFICADO VIA --run)
if (runCommand) {
  console.log(`\x1b[33m⚡ Executando suíte de testes:\x1b[0m \x1b[1m${runCommand}\x1b[0m\n`);
  const runResult = spawnSync(runCommand, { shell: true, stdio: 'inherit' });
  const exitCode = runResult.status !== null ? runResult.status : 0;
  console.log(`\n\x1b[32m✔ Execução de testes finalizada (Código de saída: ${exitCode})\x1b[0m\n`);
}

// Auto-descoberta de arquivo de resultados se não foi informado
if (!resultsPath && !isDemo) {
  resultsPath = autoDiscoverResults();
}

// 1. MODO BUILD: GERA ARQUIVO HTML ESTÁTICO ÚNICO (STANDALONE BUNDLE)
if (isBuild) {
  generateStaticBundle(resultsPath, outputPath, frameworkOverride);
  if (shouldOpen) {
    console.log(`\x1b[32m✔ Abrindo dashboard estático no navegador...\x1b[0m`);
    openBrowser(path.resolve(outputPath));
  }
  process.exit(0);
}

// 2. MODO SERVIDOR LOCAL (LIVE-PREVIEW)
startLocalServer();

function autoDiscoverResults() {
  const commonPaths = [
    'mochawesome-report/mochawesome.json',
    'cypress/reports/mochawesome.json',
    'cypress/results.json',
    'playwright-report/results.json',
    'test-results/results.json',
    'test-results',
    'k6-summary.json',
    'summary.json',
    'output.xml',
    'results/output.xml',
    'report.xml',
    'test-results.xml',
    'target/surefire-reports',
    'test-output/testng-results.xml'
  ];

  for (const candidate of commonPaths) {
    const fullPath = path.resolve(process.cwd(), candidate);
    if (fs.existsSync(fullPath)) {
      console.log(`\x1b[35m🔍 Arquivo de teste detectado automaticamente:\x1b[0m ${candidate}`);
      return fullPath;
    }
  }
  return null;
}

function startLocalServer() {
  const srcDir = path.join(__dirname, '..', 'src');
  const demoReportsDir = path.join(__dirname, '..', 'demo-reports');

  let preloadedData = null;
  if (resultsPath && fs.existsSync(resultsPath)) {
    preloadedData = loadAndParseFile(resultsPath, frameworkOverride);
  } else if (frameworkOverride) {
    // Se for modo demo com framework customizado
    preloadedData = null;
  }

  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];

    // API endpoint para retornar dados pré-carregados se fornecido via CLI
    if (reqUrl === '/api/current-report') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(preloadedData || {}));
      return;
    }

    if (reqUrl === '/') reqUrl = '/index.html';

    let filePath;
    if (reqUrl.startsWith('/demo-reports/')) {
      filePath = path.join(demoReportsDir, reqUrl.replace('/demo-reports/', ''));
    } else {
      filePath = path.join(srcDir, reqUrl);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`404: Arquivo não encontrado (${reqUrl})`);
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`Erro no servidor: ${err.code}`);
        }
      } else {
        // Se for o index.html e tiver dados pré-carregados, injeta diretamente
        if (reqUrl === '/index.html' && preloadedData) {
          const injectedHtml = content.toString().replace(
            '// Carrega suíte padrão',
            `window.universalQaState.suiteData = ${JSON.stringify(preloadedData)};\napplyLoadedReport(window.universalQaState.suiteData, "Arquivo Local");\n// Carrega suíte padrão`
          );
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(injectedHtml);
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      }
    });
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`\x1b[32m✔ Dashboard pronto e rodando em:\x1b[0m \x1b[1m\x1b[34m${url}\x1b[0m`);
    if (resultsPath) {
      console.log(`\x1b[33m⚡ Ingerindo resultados de:\x1b[0m ${resultsPath}`);
    }
    if (frameworkOverride) {
      console.log(`\x1b[35m🏷️  Framework marcado:\x1b[0m ${frameworkOverride}`);
    }
    console.log('\x1b[90mPressione Ctrl+C para encerrar o servidor.\x1b[0m\n');

    if (shouldOpen) {
      openBrowser(url);
    }
  });
}

function loadAndParseFile(targetPath, customFramework = null) {
  const stat = fs.statSync(targetPath);
  let fileToRead = targetPath;

  if (stat.isDirectory()) {
    // Procura primeiro xml ou json dentro da pasta
    const files = fs.readdirSync(targetPath);
    const candidate = files.find(f => f.endsWith('.xml') || f.endsWith('.json'));
    if (candidate) {
      fileToRead = path.join(targetPath, candidate);
    } else {
      console.warn(`Aviso: Nenhum arquivo .xml ou .json encontrado em ${targetPath}`);
      return null;
    }
  }

  const content = fs.readFileSync(fileToRead, 'utf-8');
  const parsed = UniversalParser.detectAndParse(content, path.basename(fileToRead));

  if (parsed && parsed.summary && customFramework) {
    parsed.summary.framework = customFramework;
    parsed.summary.engine = customFramework;
  }
  return parsed;
}

function generateStaticBundle(sourcePath, outPath, customFramework = null) {
  console.log(`\x1b[33m⚡ Gerando relatório HTML estático único em:\x1b[0m ${outPath}`);

  const srcDir = path.join(__dirname, '..', 'src');
  const indexHtml = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf-8');
  const stylesCss = fs.readFileSync(path.join(srcDir, 'assets', 'css', 'styles.css'), 'utf-8');
  const shaderJs = fs.readFileSync(path.join(srcDir, 'assets', 'js', 'shader-radar.js'), 'utf-8');
  const appJs = fs.readFileSync(path.join(srcDir, 'assets', 'js', 'app.js'), 'utf-8');

  const junitJs = fs.readFileSync(path.join(srcDir, 'parsers', 'junit-parser.js'), 'utf-8');
  const robotJs = fs.readFileSync(path.join(srcDir, 'parsers', 'robot-parser.js'), 'utf-8');
  const pwJs = fs.readFileSync(path.join(srcDir, 'parsers', 'playwright-parser.js'), 'utf-8');
  const cyJs = fs.readFileSync(path.join(srcDir, 'parsers', 'cypress-parser.js'), 'utf-8');
  const k6Js = fs.readFileSync(path.join(srcDir, 'parsers', 'k6-parser.js'), 'utf-8');
  const univJs = fs.readFileSync(path.join(srcDir, 'parsers', 'universal-parser.js'), 'utf-8');

  let reportData = null;
  if (sourcePath && fs.existsSync(sourcePath)) {
    reportData = loadAndParseFile(sourcePath, customFramework);
  }

  // Se passou framework mas não tem arquivo, ajusta o demo data padrão
  const frameworkPatch = customFramework ? `
    if (window.universalQaState && window.universalQaState.suiteData && window.universalQaState.suiteData.summary) {
      window.universalQaState.suiteData.summary.framework = ${JSON.stringify(customFramework)};
      const fwBadge = document.getElementById('header-framework-badge');
      if (fwBadge) fwBadge.textContent = ${JSON.stringify(customFramework)};
    }
  ` : '';

  // Embutir CSS
  let bundle = indexHtml.replace(
    '<link rel="stylesheet" href="assets/css/styles.css"/>',
    `<style>\n${stylesCss}\n</style>`
  );

  // Embutir Scripts
  const scriptsBundle = `
    <script>
      ${junitJs}
      ${robotJs}
      ${pwJs}
      ${cyJs}
      ${k6Js}
      ${univJs}
      ${shaderJs}
      ${appJs}
      ${reportData ? `\nwindow.universalQaState.suiteData = ${JSON.stringify(reportData)};\napplyLoadedReport(window.universalQaState.suiteData, "Build Export");\n` : ''}
      ${frameworkPatch}
    </script>
  `;

  bundle = bundle.replace(
    /<script src="parsers\/[^>]+><\/script>/g,
    ''
  ).replace(
    /<script src="assets\/js\/[^>]+><\/script>/g,
    ''
  );

  bundle = bundle.replace('</body>', `${scriptsBundle}\n</body>`);

  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outPath, bundle, 'utf-8');
  console.log(`\x1b[32m✔ Relatório estático gerado com sucesso!\x1b[0m Tamanho: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
  if (customFramework) {
    console.log(`\x1b[35m🏷️  Framework marcado no dashboard:\x1b[0m ${customFramework}`);
  }
}

function openBrowser(target) {
  let openUrl = target;
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    openUrl = path.resolve(target);
  }
  try {
    if (process.platform === 'win32') {
      execSync(`explorer.exe "${openUrl}"`, { stdio: 'ignore' });
    } else if (process.platform === 'darwin') {
      execSync(`open "${openUrl}"`, { stdio: 'ignore' });
    } else {
      execSync(`xdg-open "${openUrl}"`, { stdio: 'ignore' });
    }
  } catch (_) {
    try {
      const startCmd = process.platform === 'win32' ? 'start ""' : (process.platform === 'darwin' ? 'open' : 'xdg-open');
      execSync(`${startCmd} "${openUrl}"`, { shell: true, stdio: 'ignore' });
    } catch (e) {
      console.warn('Erro ao abrir navegador:', e.message);
    }
  }
}

function printHelp() {
  console.log(`
Uso:
  qa-universal-dashboard [opções]
  qa-dashboard [opções]

Opções:
  -r, --results <caminho>     Arquivo ou pasta de resultados (.json ou .xml)
  -f, --framework <nome>      Nome do framework/linguagem a ser marcado (ex: "Cypress", "Playwright C#", "Robot Framework")
  --run "<comando>"           Executa o comando de testes antes de gerar/abrir o dashboard
  -O, --open                  Abre automaticamente o dashboard no navegador padrão
  -b, --build                 Gera um arquivo HTML estático único (zero-dependency)
  -o, --output <caminho>      Caminho de saída do HTML estático (padrão: ./dist/index.html)
  -p, --port <número>         Porta do servidor local HTTP (padrão: 3000)
  --demo                      Inicia com dados executivos de demonstração
  -h, --help                  Exibe este menu de ajuda

Exemplos Práticos:

  1. Executar testes do Cypress e abrir o dashboard automaticamente:
     npx qa-universal-dashboard --run "npx cypress run" --framework "Cypress" --open

  2. Gerar HTML estático e abrir após rodar Cypress:
     npx qa-universal-dashboard --build --results mochawesome-report/mochawesome.json --framework "Cypress JS" --open

  3. Rodar com Playwright C# ou TypeScript:
     npx qa-universal-dashboard --build --results test-results/results.json --framework "Playwright C# .NET 8" --open

  4. Rodar com Robot Framework:
     npx qa-universal-dashboard --build --results output.xml --framework "Robot Framework Python" --open

  5. Executar teste de carga com k6 e abrir relatório de performance & SLAs:
     npx qa-universal-dashboard --run "k6 run --summary-export=summary.json script.js" --results summary.json --framework "k6 Performance" --open

  6. Servidor local interativo:
     npx qa-universal-dashboard --results ./test-results --port 3333 --open
`);
}

