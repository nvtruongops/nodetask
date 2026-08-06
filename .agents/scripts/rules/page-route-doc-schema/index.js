const path = require('path');
const meta = require('./meta.json');

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

    const requiredSections = policy.requiredSections || [
      'Overview',
      'Route Config',
      'Component Tree',
      'State & Data Flow',
      'Interactions',
      'Accessibility'
    ];

    const files = ctx.fs.readdirSync(targetDir).filter(f => f.endsWith('.md'));
    if (files.length === 0) {
      ctx.logger.pass('Cấu trúc docs/page_routes/ đã sẵn sàng (Chưa có file .md nào để scan).');
      return { passed: true };
    }

    let totalViolations = 0;

    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const content = ctx.fs.readFileSync(filePath, 'utf8');

      const headings = (content.match(/^#{1,4}\s+(.+)$/gm) || [])
        .map(h => h.replace(/^#{1,4}\s+/, '').trim());

      const missingSections = requiredSections.filter(sec => {
        return !headings.some(h => h.toLowerCase().includes(sec.toLowerCase()));
      });

      if (missingSections.length > 0) {
        ctx.logger.warn(`File docs/page_routes/${file} thiếu ${missingSections.length} sections bắt buộc: ${missingSections.join(', ')}`);
        totalViolations++;
      } else {
        ctx.logger.pass(`File docs/page_routes/${file} tuân thủ 100% 6 Sections Specification Contract.`);
      }
    }

    if (totalViolations === 0) {
      ctx.logger.pass('Tất cả các file trong docs/page_routes/ hoàn toàn tuân thủ Specification Schema Contract.');
    }

    return { passed: totalViolations === 0 };
  }
};
