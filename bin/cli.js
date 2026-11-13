#!/usr/bin/env node
/**
 * Universal QA Dashboard - CLI & Local Live Server
 * Zero dependências externas (usa apenas APIs nativas do Node.js).
 * 
 * Uso:
 *   npx qa-universal-dashboard
 *   node bin/cli.js --results ./test-results --open
 *   node bin/cli.js --build --output ./dist/report.html
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const UniversalParser = require('../src/parsers/universal-parser');

// Parse dos argumentos CLI
const args = process.argv.slice(2);
function getArg(flag, defaultValue = null) {
  const index = args.indexOf(flag);
  if (index !== -1 && args[index + 1]) {
    return args[index + 1];
  }
  return defaultValue;
}

const hasFlag = (flag) => args.includes(flag);

const port = parseInt(getArg('--port', '3000'), 10);
const resultsPath = getArg('--results', null);
const outputPath = getArg('--output', './dist/index.html');
const shouldOpen = hasFlag('--open') || hasFlag('-o');
const isBuild = hasFlag('--build');
const isDemo = hasFlag('--demo');

console.log('\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════════');
console.log('\x1b[36m%s\x1b[0m', '           UNIVERSAL QA TEST DASHBOARD (v1.0.0)                 ');
console.log('\x1b[36m%s\x1b[0m', '  Playwright • Cypress • Robot Framework • Selenium • Pytest   ');
console.log('\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════════\n');

// 1. MODO BUILD: GERA ARQUIVO HTML ESTÁTICO ÚNICO (STANDALONE BUNDLE)
if (isBuild) {
  generateStaticBundle(resultsPath, outputPath);
  process.exit(0);
}

// 2. MODO SERVIDOR LOCAL (LIVE-PREVIEW)
startLocalServer();

function startLocalServer() {
  const srcDir = path.join(__dirname, '..', 'src');
  const demoReportsDir = path.join(__dirname, '..', 'demo-reports');

  let preloadedData = null;
  if (resultsPath && fs.existsSync(resultsPath)) {
    preloadedData = loadAndParseFile(resultsPath);
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
    console.log('\x1b[90mPressione Ctrl+C para encerrar o servidor.\x1b[0m\n');

    if (shouldOpen) {
      openBrowser(url);
    }
  });
}

function loadAndParseFile(targetPath) {
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
  return UniversalParser.detectAndParse(content, path.basename(fileToRead));
}

function generateStaticBundle(sourcePath, outPath) {
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
  const univJs = fs.readFileSync(path.join(srcDir, 'parsers', 'universal-parser.js'), 'utf-8');

  let reportData = null;
  if (sourcePath && fs.existsSync(sourcePath)) {
    reportData = loadAndParseFile(sourcePath);
  }

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
      ${univJs}
      ${shaderJs}
      ${appJs}
      ${reportData ? `\nwindow.universalQaState.suiteData = ${JSON.stringify(reportData)};\napplyLoadedReport(window.universalQaState.suiteData, "Build Export");\n` : ''}
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
}

function openBrowser(url) {
  const startCmd = process.platform === 'win32' ? 'start' : (process.platform === 'darwin' ? 'open' : 'xdg-open');
  exec(`${startCmd} ${url}`);
}
