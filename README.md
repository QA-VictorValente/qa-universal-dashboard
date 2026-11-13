# ⚡ Universal QA Test Dashboard

<div align="center">

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node: >=18](https://img.shields.io/badge/Node.js-Native%20Zero%20Deps-success.svg)
![Playwright](https://img.shields.io/badge/Playwright-Supported-2EAD33.svg?logo=playwright)
![Cypress](https://img.shields.io/badge/Cypress-Supported-17202C.svg?logo=cypress)
![Robot Framework](https://img.shields.io/badge/Robot%20Framework-Supported-00c0b5.svg?logo=robotframework)
![Selenium](https://img.shields.io/badge/Selenium-Supported-43B02A.svg?logo=selenium)
![Pytest](https://img.shields.io/badge/Pytest-Supported-0A9EDC.svg?logo=pytest)
![WebGL](https://img.shields.io/badge/WebGL-Tactical%20Radar%20Shader-purple.svg)

**O Dashboard Executivo Definitivo de QA, Telemetria e Observabilidade Multi-Framework.**  
*Transforme relatórios brutos do Playwright, Cypress, Robot Framework, Selenium e Pytest em uma experiência cinematográfica executiva de alto impacto.*

[🚀 Início Rápido](#-início-rápido-em-30-segundos) •
[🎯 Principais Recursos](#-principais-recursos) •
[🔌 Como Integrar com seu Framework](#-como-integrar-com-qualquer-framework) •
[📊 Os 3 Modos de Uso](#-os-3-modos-de-uso) •
[🌐 Deploy no GitHub Pages](#-deploy-automático-no-github-pages)

</div>

---

## 🌟 Visão Geral

O **Universal QA Dashboard** foi desenvolvido para solucionar a carência de relatórios visuais modernos no ecossistema de testes automatizados. Diferente de soluções legadas e pesadas que exigem Java ou configurações complexas, este projeto oferece:

- **Zero Dependências Externas:** Feito em JavaScript Vanilla, WebGL nativo e Tailwind CSS compilável.
- **Multi-Framework Nativo:** Ingere automaticamente **Playwright**, **Cypress**, **Robot Framework**, **Selenium**, **JUnit/xUnit** e **Pytest**.
- **Design Executivo de Alta Fidelidade:** Tema Escuro (*Obsidian Stealth com radar WebGL pulsante*) e Tema Claro (*Executive Soft Sand/Cream*) com alternância instantânea.
- **Diagnóstico Assistido por IA (QA Copilot):** Análise preditiva de causa raiz em falhas (timeouts, seletores quebrados, latência de PSP/gateway) com sugestão de ajuste de código.
- **Portabilidade Total:** Pode ser usado localmente via CLI, aberto diretamente no navegador com **Drag & Drop** ou publicado em 1 clique como página estática no **GitHub Pages**.

---

## 🎯 Principais Recursos

### 1. Scanner Radar Tático em WebGL
- Fundo reativo com animação de radar contínuo calculada em GPU (60 FPS).
- Nós de teste que pulsam ao serem varridos pelo feixe e reagem à posição do cursor do mouse.

### 2. Painel Executivo com 6 Top KPIs
- Contadores animados (*Count-Up easing*): **Total de Testes**, **Aprovados**, **Falhas**, **Ignorados**, **Taxa de Sucesso (%)** e **Duração Total**.
- Verificação automatizada de **SLA Corporativo de Qualidade** (ex: meta mínima de conformidade > 75%).

### 3. Donut SVG Reativo & Desempenho por Subsistema
- Gráfico Donut SVG com arcos interativos, transição suave de traço e tooltips dinâmicos.
- Barras de progresso com animação em cascata (*staggered delay*) separando módulos em estado **Conforme**, **Atenção** e **Crítico**.

### 4. Triagem Inteligente de Falhas & QA Copilot
- Painel com causa provável, ajuste recomendado no Page Object e cálculo de impacto.
- Destaque da linha de código causadora do erro com syntax highlighting.
- Botões de ação rápida para copiar comando de reprodução (`npx playwright test --grep ...`), abrir Trace Viewer ou criar ticket no Jira.

### 5. Reprodutor de Evidências & Player WebM
- Player de vídeo integrado para gravações de teste WebM/MP4.
- Timeline de frames e galeria de screenshots de erro.

### 6. Matriz de Risco & Tendências
- Heatmap de criticidade por módulo para tomada de decisão ágil de *Go / No-Go* em releases de produção.

---

## 🚀 Início Rápido em 30 Segundos

### Opção A: Duplo-Clique (Windows)
Apenas clone o repositório e dê dois cliques no arquivo:
```cmd
generate-dashboard.bat
```

### Opção B: Via Terminal / NPM
```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/qa-universal-dashboard.git
cd qa-universal-dashboard

# Inicie o dashboard no navegador local
npm start
```

### Opção C: Zero-Install (Apenas arraste e solte!)
Abra o arquivo `src/index.html` em qualquer navegador web e **arraste o seu arquivo de resultado (`.xml` ou `.json`) para dentro da tela**. O dashboard renderiza tudo instantaneamente!

---

## 📊 Os 3 Modos de Uso

```
┌────────────────────────────────────────────────────────────────────────┐
│                        UNIVERSAL QA DASHBOARD                          │
├──────────────────┬──────────────────────┬──────────────────────────────┤
│ 1. Drag & Drop   │ 2. CLI Local Runner  │ 3. CI/CD Static Export       │
│    (Navegador)   │    (Desenvolvimento) │    (GitHub Actions / Pages)  │
├──────────────────┼──────────────────────┼──────────────────────────────┤
│ Abra `index.html`│ Execute:             │ Gere um HTML único de 120KB  │
│ e solte qualquer │ `npm start` ou       │ com tudo embutido:           │
│ arquivo de teste │ `node bin/cli.js     │ `npm run build`              │
│ na janela.       │   --results ./tests` │ Publica no GitHub Pages      │
└──────────────────┴──────────────────────┴──────────────────────────────┘
```

---

## 🔌 Como Integrar com Qualquer Framework

### 🎭 1. Playwright (TypeScript / JavaScript / C# / Python)
No arquivo `playwright.config.ts`, basta habilitar o reporter JUnit ou JSON:
```typescript
export default defineConfig({
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
});
```
Depois execute o dashboard apontando para a pasta:
```bash
node bin/cli.js --results ./test-results/results.xml --open
```

---

### 🌲 2. Cypress
Gere o relatório JUnit nativo do Cypress ou use o mochawesome:
```bash
npx cypress run --reporter junit --reporter-options mochaFile=cypress/results/results.xml
```
Em seguida:
```bash
node bin/cli.js --results ./cypress/results/results.xml --open
```

---

### 🤖 3. Robot Framework
O Robot Framework já gera nativamente o arquivo `output.xml` em qualquer execução:
```bash
robot --outputdir results tests/
```
Para visualizar no dashboard:
```bash
node bin/cli.js --results ./results/output.xml --open
```

---

### ☕ 4. Selenium / JUnit / TestNG / NUnit
Seus testes em Java com Maven Surefire ou C# com NUnit geram arquivos `TEST-*.xml` em `target/surefire-reports` ou `TestResults/`:
```bash
node bin/cli.js --results ./target/surefire-reports/TEST-TestSuite.xml --open
```

---

### 🐍 5. Pytest
Execute o Pytest com a flag padrão de exportação JUnit:
```bash
pytest --junitxml=report.xml
node bin/cli.js --results ./report.xml --open
```

---

## 🌐 Deploy Automático no GitHub Pages

Este repositório já inclui um fluxo de GitHub Actions pré-configurado em `.github/workflows/deploy-pages.yml`.

1. Suba o projeto para o seu GitHub.
2. Acesse **Settings** > **Pages** no seu repositório.
3. Em **Source**, selecione **GitHub Actions**.
4. A cada `git push`, seu dashboard executivo será compilado e publicado automaticamente na URL pública do GitHub Pages!

---

## 📁 Estrutura do Repositório

```text
qa-universal-dashboard/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml       # Publicação automatizada no GitHub Pages
├── bin/
│   └── cli.js                     # CLI e servidor local com zero dependências
├── demo-reports/                  # Exemplos reais prontos para testar na hora!
│   ├── playwright/                # results.json e junit.xml
│   ├── cypress/                   # mochawesome.json
│   ├── robot/                     # output.xml nativo do Robot Framework
│   └── selenium/                  # testng-results.xml
├── src/
│   ├── index.html                 # Aplicação SPA executiva com Radar WebGL
│   ├── assets/
│   │   ├── css/styles.css         # Efeitos spotlight, elevações e glow
│   │   └── js/
│   │       ├── shader-radar.js    # Motor WebGL do Radar Tático (Dark & Light)
│   │       └── app.js             # Gerenciador de estado, animações e filtros
│   └── parsers/                   # Parsers universais client-side e Node.js
│       ├── universal-parser.js    # Autodetecção de formato
│       ├── junit-parser.js        # Parser JUnit/xUnit
│       ├── robot-parser.js        # Parser Robot Framework
│       ├── playwright-parser.js   # Parser Playwright JSON
│       └── cypress-parser.js      # Parser Cypress Mochawesome
├── generate-dashboard.bat         # Atalho de 1 clique para Windows
├── generate-dashboard.sh          # Atalho de 1 clique para Linux/macOS
├── package.json                   # Scripts npm
└── README.md                      # Documentação completa
```

---

## 💻 Comandos Disponíveis via CLI

| Comando | Descrição |
| :--- | :--- |
| `npm start` | Inicia o servidor local e abre o navegador em `http://localhost:3000` |
| `npm run dev` | Inicia o dashboard em modo watch |
| `npm run build` | Compila um arquivo estático standalone único em `dist/index.html` |
| `npm run demo:playwright` | Carrega os dados de exemplo do Playwright |
| `npm run demo:cypress` | Carrega os dados de exemplo do Cypress |
| `npm run demo:robot` | Carrega os dados de exemplo do Robot Framework |
| `npm run demo:selenium` | Carrega os dados de exemplo do Selenium |

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Sinta-se livre para utilizar, customizar e integrar em projetos comerciais e suítes de QA corporativas.
