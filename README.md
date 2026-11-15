# ⚡ Universal QA Test Dashboard • Manual Oficial & Guia de Uso

<div align="center">

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node: >=18](https://img.shields.io/badge/Node.js-Zero%20Dependencies-success.svg)
![Playwright](https://img.shields.io/badge/Playwright-C%23%20%7C%20TS%20%7C%20Python-2EAD33.svg?logo=playwright)
![Cypress](https://img.shields.io/badge/Cypress-JS%20%7C%20TS-17202C.svg?logo=cypress)
![Robot Framework](https://img.shields.io/badge/Robot%20Framework-Python-00c0b5.svg?logo=robotframework)
![Selenium](https://img.shields.io/badge/Selenium-Java%20%7C%20Python%20%7C%20C%23-43B02A.svg?logo=selenium)
![Pytest](https://img.shields.io/badge/Pytest-Python-0A9EDC.svg?logo=pytest)
![WebGL](https://img.shields.io/badge/WebGL-Tactical%20Radar-purple.svg)

**O Dashboard Executivo Definitivo de QA, Telemetria e Observabilidade Multi-Framework.**  
*Este repositório contém o manual completo de configuração, integração, comandos e explicação detalhada de cada funcionalidade e tela da ferramenta.*

</div>

---

## 📑 Sumário

1. [O que é o Universal QA Dashboard e Como Funciona?](#1-o-que-é-o-universal-qa-dashboard-e-como-funciona)
2. [Quais Ferramentas e Linguagens Podem ser Incluídas?](#2-quais-ferramentas-e-linguagens-podem-ser-incluídas)
3. [Como Configurar no seu Projeto (Passo a Passo)](#3-como-configurar-no-seu-projeto-passo-a-passo)
   - [No Cypress](#-configuração-no-cypress-js--ts)
   - [No Playwright C# (.NET)](#-configuração-no-playwright-c-net-8)
   - [No Playwright TypeScript / JavaScript](#-configuração-no-playwright-typescript--javascript)
   - [No Robot Framework](#-configuração-no-robot-framework-python)
   - [No Pytest](#-configuração-no-pytest-python)
   - [No Selenium (Java / Maven)](#-configuração-no-selenium-java--maven)
4. [O Comando Mágico: Execução Automática com Auto-Open e Framework Marcado](#4-o-comando-mágico-execução-automática-com-auto-open-e-framework-marcado)
5. [Explicação Completa das Abas do Dashboard](#5-explicação-completa-das-abas-do-dashboard)
   - [Aba 1: Visão Geral](#aba-1-visão-geral)
   - [Aba 2: Execuções e Resultados](#aba-2-execuções-e-resultados)
   - [Aba 3: Testes com Falha & IA](#aba-3-testes-com-falha--ia-triagem-heurística)
   - [Aba 4: Evidências & Player WebM](#aba-4-evidências--player-webm)
   - [Aba 5: Gráficos & Distribuição](#aba-5-gráficos--distribuição)
   - [Aba 6: Tendências & Matriz de Risco](#aba-6-tendências--matriz-de-risco)
6. [Alternância de Temas (Tema Claro e Tema Escuro)](#6-alternância-de-temas-tema-claro-e-tema-escuro)
7. [Os 3 Modos de Uso da Ferramenta](#7-os-3-modos-de-uso-da-ferramenta)
8. [Deploy Automático no GitHub Pages](#8-deploy-automático-no-github-pages)
9. [Perguntas Frequentes (FAQ)](#9-perguntas-frequentes-faq)

---

## 1. O que é o Universal QA Dashboard e Como Funciona?

O **Universal QA Dashboard** foi criado para substituir relatórios legados e burocráticos (como o Allure, que exige instalação de Java, pacotes pesados e comandos complexos).

### Como ele funciona por baixo dos panos?
1. **Zero Dependências:** Funciona usando **apenas o Node.js nativo** (versão 18 ou superior). Você não precisa instalar bibliotecas externas pesadas.
2. **Motor de Autodetecção Heurística (`universal-parser.js`):** Você não precisa converter arquivos manualmente. O motor lê nativamente:
   - Relatórios em **JSON** (Playwright JSON, Cypress Mochawesome JSON).
   - Relatórios em **XML** (JUnit XML, xUnit XML, TestNG XML, Robot Framework `output.xml`, Pytest XML).
3. **Geração em Tempo Real:** Ele agrega os testes, calcula taxas de aprovação por módulo/pasta, classifica níveis de risco corporativo, detecta causa de falhas por inteligência heurística e monta uma interface interativa em SPA (Single Page Application).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMO O MOTOR PROCESSA                          │
├──────────────────────────┬──────────────────────┬──────────────────────┤
│ 1. Execução de Testes    │ 2. Parser Universal  │ 3. Dashboard Gerado  │
├──────────────────────────┼──────────────────────┼──────────────────────┤
│ Cypress, Playwright,     │ Lê .json ou .xml,    │ Gera arquivo único   │
│ Robot, Selenium ou Pytest│ calcula métricas por │ HTML ou abre server  │
│ geram arquivo de saída.  │ módulo e tria erros. │ na tela da pessoa!   │
└──────────────────────────┴──────────────────────┴──────────────────────┘
```

---

## 2. Quais Ferramentas e Linguagens Podem ser Incluídas?

Qualquer ferramenta que gere relatório em formato **JSON** ou **XML (JUnit/xUnit)** é suportada nativamente:

| Ferramenta | Linguagens Suportadas | Formatos Aceitos | Identificação Automática |
| :--- | :--- | :--- | :---: |
| **Cypress** | JavaScript, TypeScript | Mochawesome JSON, JUnit XML | ✅ Sim |
| **Playwright** | C# (.NET), TypeScript, JavaScript, Python | JSON nativo, JUnit XML | ✅ Sim |
| **Robot Framework** | Python | `output.xml` nativo do Robot | ✅ Sim |
| **Selenium WebDriver** | Java, Python, C#, JavaScript | TestNG XML, Surefire XML, JUnit XML | ✅ Sim |
| **Pytest** | Python | `--junitxml` XML padrão | ✅ Sim |
| **NUnit / xUnit / MSTest** | C# (.NET) | TRX, JUnit XML | ✅ Sim |
| **Jest / Vitest** | JavaScript, TypeScript | JUnit XML, JSON reporter | ✅ Sim |

---

## 3. Como Configurar no seu Projeto (Passo a Passo)

### 🌲 Configuração no Cypress (JS / TS)

No Cypress, você só precisa do reporter `mochawesome` (ou o próprio `junit` nativo):

1. **Instale o reporter (se ainda não tiver):**
   ```bash
   npm install --save-dev mochawesome
   ```

2. **Configure no `cypress.config.js`:**
   ```javascript
   const { defineConfig } = require("cypress");

   module.exports = defineConfig({
     e2e: {
       reporter: 'mochawesome',
       reporterOptions: {
         reportDir: 'cypress/reports',
         overwrite: true,
         html: false,
         json: true
       }
     }
   });
   ```

3. **No `package.json` do seu projeto Cypress:**
   ```json
   {
     "scripts": {
       "test": "cypress run",
       "test:report": "cypress run; npx qa-universal-dashboard --build --framework \"Cypress JS\" --open"
     }
   }
   ```

4. **Rodando:**
   ```bash
   npm run test:report
   ```
   *O Cypress executa os testes e, ao finalizar, o dashboard compila e já abre direto no seu navegador com o badge `Cypress JS` marcado!*

---

### 🎭 Configuração no Playwright C# (.NET 8)

Nos seus testes em C# (usando NUnit ou xUnit):

1. **Execute gerando arquivo JUnit:**
   ```bash
   dotnet test --logger:"junit;LogFilePath=test-results/results.xml"
   ```

2. **Gere o dashboard imediatamente:**
   ```bash
   npx qa-universal-dashboard --run "dotnet test --logger:\"junit;LogFilePath=test-results/results.xml\"" --results test-results/results.xml --framework "Playwright C# .NET 8" --open
   ```

---

### 🎭 Configuração no Playwright (TypeScript / JavaScript)

No arquivo `playwright.config.ts`:
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['json', { outputFile: 'test-results/results.json' }]
  ],
});
```

No `package.json`:
```json
{
  "scripts": {
    "test:report": "npx playwright test; npx qa-universal-dashboard --build --results test-results/results.json --framework \"Playwright TS\" --open"
  }
}
```

---

### 🤖 Configuração no Robot Framework (Python)

O Robot Framework gera nativamente o arquivo `output.xml` em toda execução. Basta rodar:

```bash
npx qa-universal-dashboard --run "robot --outputdir results tests/" --results results/output.xml --framework "Robot Framework Python" --open
```

---

### 🐍 Configuração no Pytest (Python)

Execute o Pytest com a flag `--junitxml`:

```bash
npx qa-universal-dashboard --run "pytest --junitxml=report.xml" --results report.xml --framework "Pytest Python" --open
```

---

### ☕ Configuração no Selenium (Java / Maven)

Projetos Maven já salvam relatórios em `target/surefire-reports`:

```bash
npx qa-universal-dashboard --run "mvn test" --results target/surefire-reports --framework "Selenium Java" --open
```

---

## 4. O Comando Mágico: Execução Automática com Auto-Open e Framework Marcado

Você pode usar o utilitário de linha de comando (`cli.js`) passando o comando de teste, a linguagem desejada e pedindo para abrir na hora:

```bash
npx qa-universal-dashboard --run "<seu-comando-de-teste>" --framework "<Linguagem/Framework>" --open
```

### Exemplo Real:
```bash
npx qa-universal-dashboard --run "npx cypress run" --framework "Cypress JS" --open
```

### O que acontece exatamente:
1. **Executa os testes:** Roda os testes no terminal exibindo o output em tempo real.
2. **Auto-Detecção:** Identifica o arquivo gerado (ex: `mochawesome.json`, `output.xml`, `results.json`).
3. **Marcação no Cabeçalho:** Insere a etiqueta escolhida (`<> Cypress JS`, `<> Playwright C#`, etc.) no topo da página.
4. **Disparo Automático:** Abre o dashboard no navegador padrão do usuário no mesmo instante.

### Lista de Parâmetros Disponíveis:

| Parâmetro | Atalho | O que faz |
| :--- | :---: | :--- |
| `--run "<comando>"` | - | Roda seu comando de teste antes de montar o dashboard |
| `--framework "<nome>"` | `-f` | Nome do framework e linguagem a ser exibido no cabeçalho |
| `--open` | `-O` | Abre automaticamente no navegador padrão após gerar |
| `--build` | `-b` | Gera um arquivo HTML único de ~260KB (zero servidor necessário) |
| `--results <caminho>` | `-r` | Caminho do arquivo ou pasta com o `.json` ou `.xml` *(auto-detectado se omitido)* |
| `--output <caminho>` | `-o` | Destino do HTML estático (padrão: `./dist/index.html`) |
| `--port <número>` | `-p` | Porta HTTP do servidor local (padrão: `3000`) |
| `--help` | `-h` | Exibe o menu com exemplos de uso no terminal |

---

## 5. Explicação Completa das Abas do Dashboard

O dashboard foi projetado como uma **Central de Observabilidade de QA Executiva**. Abaixo está o detalhamento de cada uma das suas 6 abas principais:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [VISÃO GERAL] [EXECUÇÕES] [TESTES COM FALHA & IA] [EVIDÊNCIAS] [GRÁFICOS] [TENDÊNCIAS]  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Aba 1: Visão Geral
* **Objetivo:** Oferecer a lideranças técnicas, gerentes e ao time de QA uma radiografia instantânea da saúde da versão em teste.
* **Componentes Principais:**
  - **Radar Tático WebGL em GPU:** Fundo dinâmico com simulação de radar contínuo a 60 FPS com nós reativos ao mouse.
  - **6 Top KPIs Executivos com animação Count-Up:**
    - `Total de Testes`
    - `Aprovados (Pass)`
    - `Falhas (Fail)`
    - `Ignorados (Skipped)`
    - `Taxa de Sucesso (%)` (com validação automática de meta mínima de SLA corporativo, ex: > 75%)
    - `Duração Total`
  - **Desempenho por Subsistema / Módulos:** Barras de progresso proporcionais classificadas em **Conforme**, **Atenção** e **Crítico**.

---

### Aba 2: Execuções e Resultados
* **Objetivo:** Auditoria minuciosa de cada teste individual da suíte.
* **Componentes Principais:**
  - **Filtros Rápidos em 1 Clique:** Botões para filtrar instantaneamente entre `Todos`, `Aprovados`, `Falhas` e `Ignorados`.
  - **Busca em Tempo Real:** Campo de pesquisa para filtrar pelo nome do teste ou pelo módulo.
  - **Tabela de Alta Densidade:**
    - Coluna de **Status** com badges nítidos (`PASS` em verde pastel, `FAIL` em vermelho pastel com alto contraste).
    - Nome do teste com tooltip.
    - Módulo do sistema.
    - Duração individual em milissegundos/segundos.
  - **Drawer Lateral de Inspeção Profunda:** Ao clicar em **"Inspecionar"**, uma gaveta lateral se abre suavemente, exibindo:
    - ID do caso de teste.
    - Botões rápidos para **Copiar Nome** e **Copiar Comando CLI**.
    - Diagnóstico Heurístico do erro.
    - Stacktrace formatado com botão **"Copiar Stacktrace"**.
    - Botão de fechar fixo no topo.

---

### Aba 3: Testes com Falha & IA (Triagem Heurística)
* **Objetivo:** Focar exclusivamente no que quebrou, acelerando a correção pelo time de desenvolvimento ou automação.
* **Componentes Principais:**
  - **Cards Expansíveis em Accordion (Abrir e Fechar):** Cada falha é um card que pode ser aberto e fechado com um clique no cabeçalho ou no botão **"Abrir Detalhes / Fechar Detalhes"**.
  - **Controles Globais:** Botões **"Expandir Todos"** e **"Recolher Todos"** no topo da lista.
  - **Bloco em Destaque da Mensagem de Erro:** Exibição clara e legível da asserção falha ou timeout do locator.
  - **Painel Heurístico IA:**
    - **Causa Provável:** Análise preditiva do motivo do erro (ex: latência de rede, seletor inexistente, race condition).
    - **Ajuste Recomendado:** Sugestão prática de código para resolver o problema (ex: adicionar espera explícita ou usar `data-testid`).
    - **Evidência:** Referência do frame WebM ou screenshot capturado.
  - **Stacktrace do Runner:** Código do log de erro com syntax highlighting e botão **"Copiar Log"** em 1 clique.

---

### Aba 4: Evidências & Player WebM
* **Objetivo:** Prova visual de execução para fins de auditoria e reprodução de bugs.
* **Componentes Principais:**
  - **Player de Vídeo Integrado:** Permite assistir à reprodução do teste diretamente pelo navegador.
  - **Controles de Vídeo:** Play, Pause, timeline de frames e indicação de timestamp do momento exato da falha.
  - **Galeria de Screenshots:** Miniaturas dos momentos em que o teste capturou o estado da tela.

---

### Aba 5: Gráficos & Distribuição
* **Objetivo:** Visualização estatística e proporcional da cobertura de testes agrupada pelas pastas e módulos do sistema.
* **Componentes Principais:**
  - **Donut SVG Multi-Segmentado:** Gráfico de rosca proporcional desenhado em SVG puro, com cores por módulo e animação suave ao passar o mouse.
  - **Painel de KPIs da Suíte:** Resumo de total, aprovados, falhas, taxa de conformidade e quantidade de módulos mapeados.
  - **Cards 3x3 de Módulos do Sistema:**
    - Card individual para cada módulo (ex: `Financeiro`, `Estoque`, `Checkout`, `API`, etc.).
    - Mini Gauge Circular com a porcentagem de aprovação do módulo.
    - Badges de alerta de risco (`Crítico`, `Atenção`, `100% OK`).
    - Lista expansível sanfonada interna para inspecionar cada teste que pertence àquele módulo sem sair da tela.

---

### Aba 6: Tendências & Matriz de Risco
* **Objetivo:** Permitir a tomada de decisão ágil de **Go / No-Go de Release** baseada em histórico de regressão.
* **Componentes Principais:**
  - **Evolução entre Rodadas (Delta Run-over-Run):** Compara a rodada atual com a rodada imediatamente anterior:
    - Variação da Taxa de Aprovação (ex: `79.4% → 80.1% (+0.7%)`).
    - Variação de Aprovados e Falhas Residuais.
    - Gap para meta mínima de Homologação.
  - **Histórico Persistido de Rodadas:** Tabela cronológica com as execuções salvas na máquina (`history.json`), com botão **"Exportar JSON"** para backup ou auditoria.
  - **Matriz de Estabilidade e Risco de Regressão por Módulo:**
    - Tabela de subsistemas classificando o nível de risco em **Crítico**, **Alto** ou **Baixo**.
    - Diagnóstico automatizado indicando onde está concentrado o maior volume de falhas da aplicação.

---

## 6. Alternância de Temas (Tema Claro e Tema Escuro)

O dashboard possui um botão no canto superior direito para alternar entre os temas instantaneamente:

* **🌙 Tema Escuro (Obsidian Stealth):**
  - Fundo em tom carbono escuro (`#0c0c0e`), tipografia de alto contraste e radar tático WebGL pulsante na GPU.
  - Ideal para ambientes de monitoramento, TVs de sala de guerra e uso prolongado sem fadiga visual.
* **☀️ Tema Claro (Executive Light):**
  - Fundo claro refinado (`#f8fafc`), cards brancos com elevação suave, bordas nítidas e badges pastel (`#fee2e2` para falhas e `#dcfce7` para sucessos).
  - 100% em conformidade com critérios de contraste e acessibilidade (WCAG AAA), sem textos borrados ou manchas escuras.

---

## 7. Os 3 Modos de Uso da Ferramenta

```
┌────────────────────────────────────────────────────────────────────────┐
│                         MODOS DE UTILIZAÇÃO                            │
├──────────────────┬──────────────────────┬──────────────────────────────┤
│ 1. Standalone    │ 2. CLI Runner / Live │ 3. Drag & Drop               │
│    (Zero Servidor│    (Desenvolvimento) │    (Navegador Puro)          │
├──────────────────┼──────────────────────┼──────────────────────────────┤
│ `npm run build`  │ `npx qa-dashboard`   │ Abra `index.html` no browser │
│ Gera HTML único  │ Servidor local       │ e arraste qualquer `.json`   │
│ de ~260KB.       │ com live-reload.     │ ou `.xml` para a janela!     │
└──────────────────┴──────────────────────┴──────────────────────────────┘
```

1. **Modo Standalone (`--build`):**
   - Gera um único arquivo HTML (`dist/index.html`) que contém todo o CSS, JS, gráficos e dados embutidos.
   - Perfeito para anexar no Jira, enviar por e-mail ou subir como artefato no pipeline de CI/CD.
2. **Modo CLI Runner (`--run` com `--open`):**
   - Executa os testes e abre o dashboard automaticamente no navegador padrão da pessoa.
3. **Modo Drag & Drop:**
   - Se você já tem um arquivo de teste salvo no seu computador, basta abrir o `index.html` e arrastá-lo para dentro da janela. O dashboard processa e renderiza tudo no mesmo segundo!

---

## 8. Deploy Automático no GitHub Pages

Este repositório já inclui um fluxo de integração contínua pré-configurado em `.github/workflows/deploy-pages.yml`:

1. No seu repositório no GitHub, acesse a aba **Settings**.
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Build and deployment > Source**, selecione **GitHub Actions**.
4. Pronto! A cada novo `git push` na branch `main`, seu dashboard executivo será compilado e publicado em uma URL pública acessível pela sua liderança e clientes.

---

## 9. Perguntas Frequentes (FAQ)

**P: Preciso instalar Java para rodar esse dashboard?**  
*R: Não! Diferente do Allure Framework, este projeto utiliza 100% JavaScript e APIs nativas do Node.js. Zero Java.*

**P: O que acontece se alguns testes falharem durante a execução do comando `--run`?**  
*R: O comando captura os testes normalmente. Mesmo que o executor retorne código de erro (exit code 1 devido a testes quebrados), o dashboard prossegue, processa o relatório com as falhas e abre o navegador automaticamente.*

**P: Posso personalizar os módulos do ERP / Sistema?**  
*R: Sim! O dashboard agrupa os testes dinamicamente com base nas pastas (`folders`), `describe` ou suites definidas no seu framework de teste.*

**P: Posso usar em testes de API e testes de UI ao mesmo tempo?**  
*R: Sim! O dashboard suporta testes de UI (Playwright, Cypress, Selenium) e testes de API (RestSharp, Axios, Supertest, Pytest Requests), organizando tudo na mesma interface.*

---

## 📄 Licença

Distribuído sob a licença **MIT**. Sinta-se livre para utilizar, customizar e integrar em projetos comerciais e suítes de QA corporativas.
