/**
 * Universal Test Ingestion Engine
 * Autodetecta o formato do arquivo (XML/JSON/Framework) e delega para o parser correto.
 * Compatível com Node.js e Navegador.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    const JUnitParser = require('./junit-parser');
    const RobotParser = require('./robot-parser');
    const PlaywrightParser = require('./playwright-parser');
    const CypressParser = require('./cypress-parser');
    module.exports = factory(JUnitParser, RobotParser, PlaywrightParser, CypressParser);
  } else {
    root.UniversalParser = factory(
      root.JUnitParser,
      root.RobotParser,
      root.PlaywrightParser,
      root.CypressParser
    );
  }
})(typeof self !== 'undefined' ? self : this, function (JUnitParser, RobotParser, PlaywrightParser, CypressParser) {

  function detectAndParse(content, fileName = 'report') {
    const trimmed = content.trim();

    // 1. JSON (Playwright ou Cypress Mochawesome)
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const json = JSON.parse(trimmed);
        
        // Verifica se é Mochawesome (Cypress)
        if (json.results || (json.stats && json.stats.suites !== undefined)) {
          return CypressParser.parse(json, fileName);
        }
        
        // Verifica se é Playwright JSON
        if (json.config && json.suites) {
          return PlaywrightParser.parse(json, fileName);
        }
        
        // Fallback para Playwright parser se tiver suites
        if (json.suites) {
          return PlaywrightParser.parse(json, fileName);
        }
      } catch (e) {
        console.warn('Erro ao decodificar JSON:', e);
      }
    }

    // 2. XML (Robot Framework vs JUnit / xUnit / Selenium)
    if (trimmed.startsWith('<') || trimmed.includes('<?xml')) {
      // Robot Framework
      if (trimmed.includes('<robot') || trimmed.includes('generator="Robot')) {
        return RobotParser.parse(content, fileName);
      }

      // JUnit / xUnit / Playwright JUnit / Pytest / Selenium / TestNG
      return JUnitParser.parse(content, fileName);
    }

    // Caso não reconhecido, tenta JUnit como padrão
    return JUnitParser.parse(content, fileName);
  }

  return {
    detectAndParse
  };
});
