/**
 * Robot Framework XML Parser Universal
 * Compatível com output.xml gerado nativamente pelo Robot Framework.
 * Funciona em Node.js e no Browser.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.RobotParser = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  function parse(content, fileName = 'output.xml') {
    const tests = [];
    const modulesMap = {};
    let totalDurationSec = 0;

    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/xml');
      const testNodes = doc.querySelectorAll('test');

      testNodes.forEach((tNode, idx) => {
        const name = tNode.getAttribute('name') || `Teste #${idx + 1}`;
        const parentSuite = tNode.closest('suite');
        const suiteName = parentSuite ? (parentSuite.getAttribute('name') || 'Geral') : 'Geral';
        
        // Pega status do teste
        const statusNode = tNode.querySelector(':scope > status');
        const statusAttr = statusNode ? statusNode.getAttribute('status') : 'PASS';
        const startTime = statusNode ? statusNode.getAttribute('starttime') : '';
        const endTime = statusNode ? statusNode.getAttribute('endtime') : '';
        
        // Calcula duração aproximada
        let durationSec = 1.5;
        if (startTime && endTime) {
          // Formato Robot: YYYYMMDD HH:mm:ss.SSS
          durationSec = parseRobotTimeDiff(startTime, endTime);
        }
        totalDurationSec += durationSec;

        let isFailed = statusAttr === 'FAIL';
        let failMessage = '';
        if (isFailed) {
          const failMsgNode = tNode.querySelector('msg[level="FAIL"]');
          failMessage = failMsgNode ? failMsgNode.textContent.trim() : (statusNode ? statusNode.textContent.trim() : 'Falha no teste');
        }

        tests.push({
          name,
          suiteName,
          durationSec,
          isFailed,
          message: failMessage
        });
      });
    } else {
      // Regex parsing fallback para Node.js
      const testRegex = /<test\s+[^>]*?name="([^"]*)"[^>]*>([\s\S]*?)<\/test>/gi;
      let match;
      let idx = 0;

      while ((match = testRegex.exec(content)) !== null) {
        idx++;
        const testName = match[1];
        const testBody = match[2];

        const statusMatch = testBody.match(/<status\s+status="(PASS|FAIL)"/i);
        const isFailed = statusMatch ? statusMatch[1].toUpperCase() === 'FAIL' : false;

        const failMsgMatch = testBody.match(/<msg\s+[^>]*?level="FAIL"[^>]*>([\s\S]*?)<\/msg>/i);
        const failMessage = failMsgMatch ? failMsgMatch[1].replace(/<[^>]+>/g, '').trim() : (isFailed ? 'Keyword execution failed' : '');

        tests.push({
          name: testName,
          suiteName: 'Robot Framework Suite',
          durationSec: 1.8,
          isFailed,
          message: failMessage
        });
        totalDurationSec += 1.8;
      }
    }

    let passed = 0;
    let failed = 0;
    let total = tests.length;

    const normalizedTests = tests.map((t, idx) => {
      const status = t.isFailed ? 'failed' : 'passed';
      if (t.isFailed) failed++;
      else passed++;

      const moduleName = t.suiteName || 'Robot Core';
      if (!modulesMap[moduleName]) {
        modulesMap[moduleName] = { name: moduleName, total: 0, passed: 0, failed: 0 };
      }
      modulesMap[moduleName].total++;
      if (status === 'passed') modulesMap[moduleName].passed++;
      if (status === 'failed') modulesMap[moduleName].failed++;

      let category = 'Sucesso';
      let aiDiag = null;

      if (t.isFailed) {
        category = t.message.toLowerCase().includes('timeout') ? 'Timeout / Elemento Indisponível' : 'Falha de Asserção (Value mismatch)';
        aiDiag = {
          rootCause: `Keyword Robot falhou: ${t.message}`,
          suggestedFix: `Revisar parâmetros da keyword no arquivo de resource ou aumentar o timeout implícito do SeleniumLibrary / Browser Library.`,
          file: `${moduleName}.robot`,
          line: 45,
          impact: `Afeta o fluxo de aceitação da suíte ${moduleName}`,
          evidenceNote: `Tempo de execução: ${(t.durationSec).toFixed(1)}s. Verifique o log.html gerado pelo Robot.`
        };
      }

      return {
        id: `RF-${String(idx + 1).padStart(3, '0')}`,
        name: t.name,
        module: moduleName,
        status: status,
        durationMs: Math.round(t.durationSec * 1000),
        durationFormatted: `${t.durationSec.toFixed(1)}s`,
        framework: 'Robot Framework',
        category: category,
        confidence: 90,
        aiDiagnostic: aiDiag,
        errorDetails: t.isFailed ? {
          message: t.message,
          stackTrace: `FAIL: ${t.message}\n  At suite: ${t.suiteName}\n  Test: ${t.name}`
        } : null,
        evidence: {
          hasVideo: t.isFailed,
          hasScreenshot: t.isFailed
        }
      };
    });

    const passRate = total > 0 ? parseFloat(((passed / total) * 100).toFixed(1)) : 0;
    const modules = Object.values(modulesMap).map(m => {
      const rate = m.total > 0 ? Math.round((m.passed / m.total) * 100) : 0;
      return {
        name: m.name,
        total: m.total,
        passed: m.passed,
        failed: m.failed,
        passRate: rate,
        status: rate < 50 ? 'critical' : (rate < 80 ? 'attention' : 'conform')
      };
    });

    const minutes = Math.floor(totalDurationSec / 60);
    const seconds = Math.floor(totalDurationSec % 60);

    return {
      summary: {
        total: total,
        passed: passed,
        failed: failed,
        skipped: 0,
        flaky: 0,
        passRate: passRate,
        durationMs: Math.round(totalDurationSec * 1000),
        durationFormatted: `${minutes}m ${seconds}s`,
        timestamp: new Date().toLocaleString('pt-BR'),
        framework: 'Robot Framework Engine',
        environment: 'Robot Framework Runner',
        slaPassed: passRate >= 75.0,
        slaTarget: 75.0
      },
      modules: modules,
      tests: normalizedTests
    };
  }

  function parseRobotTimeDiff(startStr, endStr) {
    try {
      function toDate(str) {
        // YYYYMMDD HH:mm:ss.SSS
        const y = str.substring(0, 4);
        const m = str.substring(4, 6) - 1;
        const d = str.substring(6, 8);
        const timePart = str.substring(9).split(':');
        const hr = timePart[0];
        const min = timePart[1];
        const secParts = timePart[2].split('.');
        const sec = secParts[0];
        const ms = secParts[1] || 0;
        return new Date(y, m, d, hr, min, sec, ms);
      }
      const s = toDate(startStr);
      const e = toDate(endStr);
      const diffSec = (e.getTime() - s.getTime()) / 1000;
      return diffSec > 0 ? diffSec : 1.5;
    } catch (e) {
      return 1.5;
    }
  }

  return { parse };
});
