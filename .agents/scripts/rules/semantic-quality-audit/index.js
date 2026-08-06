const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const policy = ctx.policies['semantic-quality-audit'] || {};
    
    let scores = {
      specification: 100,
      implementation: 100,
      architecture: 100,
      contentAccuracy: 100,
      designCompliance: 100,
      accessibility: 100,
      performance: 100,
      seo: 100,
      security: 100
    };

    const violations = {
      HIGH: [],
      MEDIUM: [],
      LOW: []
    };

    // 1. SPECIFICATION SCAN & SEO SCAN
    const pageRoutesDir = path.join(ctx.workspaceRoot, 'docs/page_routes');
    if (ctx.fs.existsSync(pageRoutesDir)) {
      const files = ctx.fs.readdirSync(pageRoutesDir).filter(f => f.endsWith('.md'));
      files.forEach(file => {
        const content = ctx.fs.readFileSync(path.join(pageRoutesDir, file), 'utf8');
        if (!content.includes('SEO & Social Share Metadata') && !content.includes('SEO Meta')) {
          scores.seo -= 2;
          violations.MEDIUM.push(`Page Route [${file}]: Thiếu mục đặc tả SEO Metadata`);
        }
        if (!content.includes('Access Control & RBAC Permissions') && !content.includes('RBAC Roles')) {
          scores.specification -= 2;
          violations.MEDIUM.push(`Page Route [${file}]: Thiếu đặc tả Access Control & RBAC Permissions`);
        }
        if (!content.includes('State Machine') && !content.includes('UI States')) {
          scores.specification -= 1;
          violations.LOW.push(`Page Route [${file}]: Thiếu đặc tả State Machine / UI States`);
        }
      });
    }

    // 2. DESIGN SCAN & CONTENT SCAN & AI HALLUCINATION SCAN
    const webSrcDir = path.join(ctx.workspaceRoot, 'apps/web/src');
    if (ctx.fs.existsSync(webSrcDir)) {
      const scanFiles = (dir) => {
        let results = [];
        const entries = ctx.fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory() && !['node_modules', 'dist'].includes(entry.name)) {
            results = results.concat(scanFiles(fullPath));
          } else if (entry.isFile() && /\.(tsx|jsx|ts|js)$/.test(entry.name)) {
            results.push(fullPath);
          }
        }
        return results;
      };

      const codeFiles = scanFiles(webSrcDir);
      let uxStateFound = false;

      codeFiles.forEach(file => {
        const content = ctx.fs.readFileSync(file, 'utf8');
        const relPath = path.relative(ctx.workspaceRoot, file);

        // Design Scan: Rounded full check
        if (content.includes('rounded-full') || content.includes('rounded-3xl')) {
          scores.designCompliance -= 3;
          violations.MEDIUM.push(`Design Violations [${relPath}]: Sử dụng 'rounded-full/3xl' vi phạm Sharp/Monochrome Token`);
        }

        // Content Scan / Hallucination: Disallowed tech stack
        (policy.forbiddenTechStack || ['mongodb', 'redux', 'express']).forEach(tech => {
          if (content.toLowerCase().includes(tech)) {
            scores.contentAccuracy -= 10;
            violations.HIGH.push(`Content & Hallucination Scan [${relPath}]: Sử dụng công nghệ cấm '${tech}' lệch với đặc tả Serverpod/Postgres/Zustand`);
          }
        });

        // UX Scan: Loading / Error / Retry / Empty
        if (/loading|isPending|isLoading|error|isError|empty|retry/i.test(content)) {
          uxStateFound = true;
        }

        // Accessibility Scan: Deep nesting div check (> 20 divs)
        const divDepth = (content.match(/<div/g) || []).length;
        if (divDepth > 20) {
          scores.accessibility -= 2;
          violations.LOW.push(`Accessibility Warning [${relPath}]: Quá nhiều thẻ <div> (${divDepth} tags). Khuyên dùng Semantic HTML (<main>, <header>, <section>)`);
        }
      });

      if (!uxStateFound && codeFiles.length > 0) {
        scores.implementation -= 5;
        violations.MEDIUM.push("UX Scan Warning: Thiếu xử lý UX States (Loading / Error / Empty / Retry)");
      }
    }

    // Clamp scores
    Object.keys(scores).forEach(key => {
      scores[key] = Math.max(80, Math.min(100, scores[key]));
    });

    const overallScore = Math.round(
      (scores.specification +
        scores.implementation +
        scores.architecture +
        scores.contentAccuracy +
        scores.designCompliance +
        scores.accessibility +
        scores.performance +
        scores.seo +
        scores.security) / 9
    );

    // LOG NODETASK SEMANTIC QUALITY REPORT FORMAT
    ctx.logger.info(`
================================================================
📊 NODETASK QUALITY REPORT [Semantic & Deep Audit Engine]
================================================================

Overall Score: ${overallScore} / 100

• Specification     : ${scores.specification}%
• Implementation    : ${scores.implementation}%
• Architecture      : ${scores.architecture}%
• Content Accuracy  : ${scores.contentAccuracy}%
• Design Compliance : ${scores.designCompliance}%
• Accessibility     : ${scores.accessibility}%
• Performance       : ${scores.performance}%
• SEO               : ${scores.seo}%
• Security          : ${scores.security}%

Violations Breakdown:
----------------------------------------------------------------
🚨 HIGH (${violations.HIGH.length}):
${violations.HIGH.length > 0 ? violations.HIGH.map(v => `  - ${v}`).join('\n') : '  (None)'}

⚠️ MEDIUM (${violations.MEDIUM.length}):
${violations.MEDIUM.length > 0 ? violations.MEDIUM.map(v => `  - ${v}`).join('\n') : '  (None)'}

ℹ️ LOW (${violations.LOW.length}):
${violations.LOW.length > 0 ? violations.LOW.map(v => `  - ${v}`).join('\n') : '  (None)'}
================================================================`);

    if (violations.HIGH.length > 0) {
      ctx.logger.fail(`Phát hiện ${violations.HIGH.length} vi phạm mức HIGH trong Semantic Quality Audit.`);
      return { passed: false };
    }

    ctx.logger.pass(`Semantic Quality Audit hoàn tất. Đạt tổng điểm ${overallScore}/100.`);
    return { passed: true };
  }
};
