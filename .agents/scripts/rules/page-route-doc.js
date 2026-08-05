const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Page Route Document Specification Schema Validation',
  id: 'PAGE_ROUTE_DOC_SCHEMA',
  category: 'specification',
  severity: 'warning',

  execute(ctx) {
    const policy = ctx.policies['page-route-doc'];
    if (!policy || policy.enabled === false) return;

    const targetDir = path.join(ctx.rootDir, policy.targetDir || 'docs/page_routes');
    if (!fs.existsSync(targetDir)) {
      ctx.logPass('Chưa có thư mục docs/page_routes để kiểm định.');
      return;
    }

    // 6 mandatory sections contract for frontend page route docs
    const requiredSections = policy.requiredSections || [
      'Overview',
      'Route Config',
      'Component Tree',
      'State & Data Flow',
      'Interactions',
      'Accessibility'
    ];

    const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.md'));
    if (files.length === 0) {
      ctx.logPass('Cấu trúc docs/page_routes/ đã sẵn sàng (Chưa có file .md nào để scan).');
      return;
    }

    let totalViolations = 0;

    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Extract markdown headings (# Heading, ## Heading, ### Heading)
      const headings = (content.match(/^#{1,4}\s+(.+)$/gm) || [])
        .map(h => h.replace(/^#{1,4}\s+/, '').trim());

      const missingSections = requiredSections.filter(sec => {
        return !headings.some(h => h.toLowerCase().includes(sec.toLowerCase()));
      });

      if (missingSections.length > 0) {
        ctx.logWarn(`File docs/page_routes/${file} thiếu ${missingSections.length} sections bắt buộc: ${missingSections.join(', ')}`);
        totalViolations++;
      } else {
        ctx.logPass(`File docs/page_routes/${file} tuân thủ 100% 6 Sections Specification Contract.`);
      }
    }

    if (totalViolations === 0) {
      ctx.logPass('Tất cả các file trong docs/page_routes/ hoàn toàn tuân thủ Specification Schema Contract.');
    }
  }
};
