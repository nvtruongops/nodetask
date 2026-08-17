const path = require('path');
const meta = require('./meta.json');

function extractSectionContent(fullContent, sectionName) {
  const lines = fullContent.split('\n');
  let inSection = false;
  let sectionLines = [];
  let sectionHeadingLevel = 3;

  for (const line of lines) {
    const isHeading = /^#{1,4}\s+(.+)$/.test(line);
    if (isHeading) {
      const headingText = line.replace(/^#{1,4}\s+/, '').trim();
      const headingLevel = (line.match(/^#{1,4}/) || ['#'])[0].length;
      if (headingText.toLowerCase().includes(sectionName.toLowerCase())) {
        inSection = true;
        sectionHeadingLevel = headingLevel;
        continue;
      } else if (inSection && headingLevel <= sectionHeadingLevel) {
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
    const policy = ctx.policies['service-doc'];
    if (!policy || policy.enabled === false) return { passed: true };

    const targetDir = path.join(ctx.workspaceRoot, policy.targetDir || 'docs/services');
    if (!ctx.fs.existsSync(targetDir)) {
      ctx.logger.pass('No docs/services directory found to scan.');
      return { passed: true };
    }

    const sectionRules = {
      Overview: { mustContain: [] },
      Endpoints: { mustContain: ['Session session'], regex: [/[A-Z][a-zA-Z0-9]+Endpoint\.[a-zA-Z0-9]+\(/] },
      Request: { mustContain: ['interface'] },
      Response: { mustContain: ['interface'] },
      Validation: { mustContain: [] },
      Permissions: { mustContain: ['GUEST', 'USER', 'ORG_MEMBER', 'ORG_ADMIN', 'SYSTEM_ADMIN'] },
      Errors: { mustContain: ['HTTP Status'], regex: [/`[A-Z0-9_]+`/] },
      Events: { regex: [/[a-z0-9_]+\.[a-z0-9_]+/] },
      Cache: { mustContain: ['TTL', 'Invalidation'] },
      Examples: { mustContain: ['```typescript'] },
      Diagrams: { mustContain: ['```mermaid'] }
    };

    const files = ctx.fs.readdirSync(targetDir).filter(f => f.endsWith('.md'));
    if (files.length === 0) {
      ctx.logger.info('Cấu trúc docs/services/ đã sẵn sàng (Chưa có file .md nào để scan).');
      return { passed: true };
    }

    let totalViolations = 0;

    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const content = ctx.fs.readFileSync(filePath, 'utf8');
      const headings = (content.match(/^#{1,4}\s+(.+)$/gm) || []).map(h => h.replace(/^#{1,4}\s+/, '').trim());

      let fileViolations = [];

      for (const [secName, rules] of Object.entries(sectionRules)) {
        const hasHeading = headings.some(h => h.toLowerCase().includes(secName.toLowerCase()));
        if (!hasHeading) {
          fileViolations.push(`Thiếu Section [${secName}]`);
          continue;
        }

        const secContent = extractSectionContent(content, secName);
        if (!secContent || secContent.trim().length === 0 || secContent.trim() === 'TODO' || secContent.trim() === 'later') {
          fileViolations.push(`Section [${secName}] rỗng hoặc chỉ chứa placeholder TODO/later`);
          continue;
        }

        // Check mustContain keywords
        if (rules.mustContain) {
          const missingKeywords = rules.mustContain.filter(kw => !secContent.includes(kw));
          if (missingKeywords.length > 0) {
            fileViolations.push(`Section [${secName}] thiếu các từ khóa/roles bắt buộc: ${missingKeywords.map(k => `'${k}'`).join(', ')}`);
          }
        }

        // Check regex patterns
        if (rules.regex) {
          for (const reg of rules.regex) {
            if (!reg.test(secContent)) {
              fileViolations.push(`Section [${secName}] không đúng định dạng mẫu (Regex: ${reg.toString()})`);
            }
          }
        }
      }

      if (fileViolations.length > 0) {
        ctx.logger.warn(`File docs/services/${file} phát hiện ${fileViolations.length} lỗi vi phạm Contract:\n  - ${fileViolations.join('\n  - ')}`);
        totalViolations += fileViolations.length;
      } else {
        ctx.logger.pass(`File docs/services/${file} tuân thủ 100% Schema Validation Contract.`);
      }
    }

    if (totalViolations === 0) {
      ctx.logger.pass('Tất cả các file trong docs/services/ hoàn toàn tuân thủ Specification Schema Contract.');
    }

    return { passed: totalViolations === 0 };
  }
};
