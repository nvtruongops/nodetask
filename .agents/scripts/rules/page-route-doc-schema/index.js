const path = require('path');
const meta = require('./meta.json');

function extractSectionContent(fullContent, sectionName) {
  const lines = fullContent.split('\n');
  let inSection = false;
  let sectionLines = [];

  const mainKeyword = sectionName.split('&')[0].trim().toLowerCase();

  for (const line of lines) {
    const isHeading = /^#{1,4}\s+(.+)$/.test(line);
    if (isHeading) {
      const headingText = line.replace(/^#{1,4}\s+/, '').trim();
      const headingLevel = (line.match(/^#{1,4}/) || ['#'])[0].length;

      if (headingText.toLowerCase().includes(mainKeyword)) {
        inSection = true;
        continue;
      } else if (inSection && headingLevel <= 2) {
        // Only terminate if we hit another level 1 or level 2 heading
        break;
      }
    }
    if (inSection) {
      sectionLines.push(line);
    }
  }

  return sectionLines.join('\n');
}

module.exports = {
  meta,
  async execute(ctx) {
    const policy = ctx.policies['page-route-doc'];
    if (!policy || policy.enabled === false) return { passed: true };

    const targetDir = path.join(ctx.workspaceRoot, policy.targetDir || 'docs/page_routes');
    if (!ctx.fs.existsSync(targetDir)) {
      ctx.logger.pass('Chưa có thư mục docs/page_routes để kiểm định.');
      return { passed: true };
    }

    const sectionRules = {
      'Overview & Route ID': { mustContain: ['Route ID'] },
      'Route Config & Navigation Metadata': { mustContain: ['URL Path'] },
      'SEO & Social Meta Specification': { mustContain: ['Title'] },
      'Loading Strategy & Code Splitting': { mustContain: ['Lazy Load'] },
      'Permission Matrix & RBAC': { mustContain: ['GUEST', 'USER'] },
      'API Dependency & Serverpod RPC': { mustContain: ['RPC'] },
      'Page State Machine & UI Transitions': { mustContain: ['IDLE'] },
      'Component Inventory & Tree': { mustContain: ['Component'] },
      'Error Mapping & Handling': { mustContain: ['Error'] },
      'Acceptance Criteria & QA Scenarios': { mustContain: ['Scenario:'] },
      'Accessibility': { mustContain: ['a11y'] }
    };

    const files = ctx.fs.readdirSync(targetDir).filter(f => f.endsWith('.md'));
    if (files.length === 0) {
      ctx.logger.pass('Cấu trúc docs/page_routes/ đã sẵn sàng (Chưa có file .md nào để scan).');
      return { passed: true };
    }

    let totalViolations = 0;

    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const content = ctx.fs.readFileSync(filePath, 'utf8');
      const headings = (content.match(/^#{1,4}\s+(.+)$/gm) || []).map(h => h.replace(/^#{1,4}\s+/, '').trim());

      let fileViolations = [];

      for (const [secName, rules] of Object.entries(sectionRules)) {
        const keywords = secName.split('&')[0].trim().toLowerCase();
        const hasHeading = headings.some(h => h.toLowerCase().includes(keywords));

        if (!hasHeading) {
          fileViolations.push(`Thiếu Section [${secName}]`);
          continue;
        }

        const secContent = extractSectionContent(content, secName);
        if (!secContent || secContent.trim().length === 0 || secContent.trim() === 'TODO' || secContent.trim() === 'later') {
          fileViolations.push(`Section [${secName}] rỗng hoặc chỉ chứa placeholder TODO/later`);
          continue;
        }

        if (rules.mustContain) {
          const missingKeywords = rules.mustContain.filter(kw => !secContent.includes(kw));
          if (missingKeywords.length > 0) {
            fileViolations.push(`Section [${secName}] thiếu từ khóa/contract bắt buộc: ${missingKeywords.map(k => `'${k}'`).join(', ')}`);
          }
        }
      }

      if (fileViolations.length > 0) {
        ctx.logger.warn(`File docs/page_routes/${file} phát hiện ${fileViolations.length} lỗi vi phạm Contract:\n  - ${fileViolations.join('\n  - ')}`);
        totalViolations += fileViolations.length;
      } else {
        ctx.logger.pass(`File docs/page_routes/${file} tuân thủ 100% Specification Contract Schema.`);
      }
    }

    if (totalViolations === 0) {
      ctx.logger.pass('Tất cả các file trong docs/page_routes/ hoàn toàn tuân thủ Specification Schema Contract.');
    }

    return { passed: totalViolations === 0 };
  }
};
