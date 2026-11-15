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

[🚀 Início Rápido](#-início-rápido-em-1-comando) •
[📤 Como Subir no seu GitHub](#-como-subir-este-projeto-no-seu-github) •
[🌲 Como Usar no Cypress](#-exemplo-prático-com-cypress) •
[🎭 Outros Frameworks](#-como-integrar-com-qualquer-outro-framework) •
[🎯 Principais Recursos](#-principais-recursos) •
[🌐 Deploy no GitHub Pages](#-deploy-automático-no-github-pages)

</div>

---

## 🌟 Visão Geral

O **Universal QA Dashboard** foi desenvolvido para solucionar a carência de relatórios visuais modernos no ecossistema de testes automatizados. Diferente de soluções legadas e pesadas que exigem Java (como Allure) ou configurações complexas, este projeto oferece:

- **Zero Dependências Externas:** Feito em JavaScript Vanilla, WebGL nativo e Tailwind CSS compilável com APIs nativas do Node.js.
- **Multi-Framework & Multi-Linguagem:** Ingere automaticamente **Cypress**, **Playwright (C#, TS, JS, Python)**, **Robot Framework**, **Selenium (Java, Python, C#)** e **Pytest**.
- **Execução Automática & Auto-Open:** Roda seus testes, ingere o resultado, marca a linguagem/framework escolhida no topo e abre automaticamente o dashboard na sua tela!
- **Modo Standalone (Zero Servidor):** Pode gerar um único arquivo HTML auto-contido de ~260KB para enviar por e-mail, Slack, Teams ou publicar no CI/CD.
- **Design Executivo de Alta Fidelidade:** Alternância entre **Tema Escuro** (*Obsidian Stealth com radar WebGL*) e **Tema Claro** (*Executive Light com alto contraste e badges nítidos*).
- **Diagnóstico Assistido por IA:** Accordion interativo para abrir e fechar falhas com causa provável, ajuste recomendado no Page Object, evidência e stacktrace com cópia em 1 clique.

---

## 📤 Como Subir este Projeto no seu GitHub

Siga os passos abaixo no seu terminal para conectar e enviar o código para o seu repositório pessoal:

### Passo 1: Crie o repositório no GitHub
1. Acesse [github.com/new](https://github.com/new).
2. Dê o nome de **`qa-universal-dashboard`** (ou o nome que preferir).
3. Deixe o repositório como **Público** (ou Privado) e **NÃO** marque a opção de criar README ou .gitignore (pois já temos aqui).
4. Clique em **Create repository**.

### Passo 2: Comandos no Terminal
Abra o terminal na pasta do projeto (`qa-universal-dashboard`) e execute:

```bash
# 1. Altera a branch principal para 'main'
git branch -M main

# 2. Adiciona o endereço do seu repositório remoto (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/qa-universal-dashboard.git

# 3. Envia todos os commits e arquivos para o seu GitHub
git push -u origin main
```

> **Dica de Autenticação:** Se o Git solicitar suas credenciais, utilize seu **Personal Access Token (PAT)** do GitHub como senha (gerado em *Settings > Developer Settings > Personal access tokens* no GitHub) ou autentique via GitHub Desktop / Git Credential Manager.

---

## 🚀 Como Integrar com Qualquer Projeto de Teste

Você pode usar o dashboard em **qualquer linguagem** e **qualquer framework**. 

### 🌲 Exemplo Prático com Cypress

Suponha que você tem seu projeto Cypress e quer que, ao rodar um único comando, ele:
1. Execute todos os testes do Cypress.
2. Gere o relatório do dashboard com o framework marcado como **"Cypress JS"**.
3. Já abra imediatamente a tela no navegador!

#### Forma 1: Comando Único via CLI (`--run` com `--open`)
Basta rodar no seu terminal dentro do seu projeto:

```bash
npx qa-universal-dashboard --run "npx cypress run" --framework "Cypress JS" --open
```

O dashboard irá executar os testes ao vivo no seu console e, assim que o Cypress terminar, abrirá o relatório executivo na tela da pessoa com a tag `Cypress JS` marcada!

#### Forma 2: Adicionando no `package.json` do seu projeto Cypress
No `package.json` do seu projeto de automação, configure seus scripts:

```json
{
  "scripts": {
    "test": "cypress run",
    "test:dashboard": "cypress run; npx qa-universal-dashboard --build --framework \"Cypress JS\" --open"
  }
}
```

Agora, basta rodar:
```bash
npm run test:dashboard
```
* **O que acontece:** O Cypress roda todos os testes. Mesmo se houver falhas, o dashboard compila o arquivo estático único em `./dist/index.html` com o badge `Cypress JS` e abre instantaneamente no navegador padrão do desenvolvedor ou QA!

---

## 🎭 Como Integrar com Qualquer Outro Framework

### 1. Playwright (C# .NET)
No seu projeto C# com NUnit/xUnit:
```bash
# Executa os testes gerando o resultado e já abre o dashboard marcado com Playwright C#
npx qa-universal-dashboard --run "dotnet test --logger:\"junit;LogFilePath=results.xml\"" --results results.xml --framework "Playwright C# .NET 8" --open
```

### 2. Playwright (TypeScript / JavaScript)
No seu `playwright.config.ts`, garanta o reporter JSON ou JUnit:
```typescript
export default defineConfig({
  reporter: [['json', { outputFile: 'test-results/results.json' }]],
});
```
E rode:
```bash
npx qa-universal-dashboard --run "npx playwright test" --results test-results/results.json --framework "Playwright TS" --open
```

### 3. Robot Framework (Python)
O Robot Framework já gera nativamente o `output.xml`:
```bash
npx qa-universal-dashboard --run "robot --outputdir results tests/" --results results/output.xml --framework "Robot Framework" --open
```

### 4. Pytest (Python)
```bash
npx qa-universal-dashboard --run "pytest --junitxml=report.xml" --results report.xml --framework "Pytest Python" --open
```

### 5. Selenium (Java / Maven)
```bash
npx qa-universal-dashboard --run "mvn test" --results target/surefire-reports --framework "Selenium Java" --open
```

---

## 💻 Parâmetros da Linha de Comando (CLI)

```bash
npx qa-universal-dashboard [opções]
# ou
node bin/cli.js [opções]
```

| Opção | Abreviação | Descrição |
| :--- | :---: | :--- |
| `--run "<comando>"` | - | Executa a suíte de testes antes de gerar o relatório |
| `--framework "<nome>"` | `-f` | Nome do framework/linguagem a ser marcado (ex: `"Cypress JS"`, `"Playwright C#"`) |
| `--results <caminho>` | `-r` | Caminho do arquivo ou pasta com o `.json` ou `.xml` de resultado *(auto-detectado se omitido)* |
| `--open` | `-O` | Abre automaticamente o dashboard no navegador padrão |
| `--build` | `-b` | Gera o arquivo HTML estático único (standalone de ~260KB) |
| `--output <caminho>` | `-o` | Destino do HTML estático (padrão: `./dist/index.html`) |
| `--port <número>` | `-p` | Porta HTTP para o servidor local (padrão: `3000`) |
| `--demo` | - | Inicia com os dados executivos de demonstração |
| `--help` | `-h` | Exibe o menu interativo de ajuda |

---

## 🎯 Principais Recursos do Dashboard

1. **Scanner Radar Tático WebGL:** Animação reativa a 60 FPS com nós de teste dinâmicos.
2. **6 KPIs Executivos:** Total de testes, aprovados, falhas, ignorados, taxa de sucesso e duração com easing.
3. **Tendências & Matriz de Risco:** Comparativo delta run-over-run e classificação de criticidade de módulo (Crítico, Alto, Baixo) para decisão de Go/No-Go de deploy.
4. **Gráficos & Distribuição 3x3:** Donut SVG multi-segmentado e cards modulares com mini gauges e histórico individual.
5. **Testes com Falha & IA:** Accordion de abrir e fechar detalhes de erro com causa provável, ajuste recomendado, evidência gravada e stacktrace com botão para copiar log.
6. **Tema Claro & Escuro:** Cores calibradas para máxima legibilidade (fundo pastel suave e tipografia nítida sem smudges).

---

## 🌐 Deploy Automático no GitHub Pages

Este repositório já inclui um fluxo de GitHub Actions pré-configurado em `.github/workflows/deploy-pages.yml`.

1. Suba o projeto para o seu GitHub.
2. Acesse **Settings** > **Pages** no seu repositório.
3. Em **Source**, selecione **GitHub Actions**.
4. A cada `git push`, seu dashboard executivo será compilado e publicado automaticamente na URL pública do seu GitHub Pages!

---

## 📄 Licença

Distribuído sob a licença **MIT**. Sinta-se livre para utilizar, customizar e integrar em projetos comerciais e suítes de QA corporativas.
