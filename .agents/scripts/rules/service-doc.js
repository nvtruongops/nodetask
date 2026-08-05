const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Service Document Specification Schema Validation',
  id: 'SERVICE_DOC_SCHEMA',
  category: 'specification',
  severity: 'warning',

  execute(ctx) {
    const policy = ctx.policies['service-doc'];
    if (!policy || policy.enabled === false) return;

    const targetDir = path.join(ctx.rootDir, policy.targetDir || 'docs/services');
    if (!fs.existsSync(targetDir)) {
      ctx.logPass('No docs/services directory found to scan.');
      return;
    }

    // 10 mandatory sections contract
    const requiredSections = [
      'Overview',
      'Endpoints',
      'Request',
      'Response',
      'Validation',
      'Permissions',
      'Errors',
      'Events',
      'Cache',
      'Examples'
    ];

    const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.md'));
    if (files.length === 0) {
      ctx.logInfo('Cấu trúc docs/services/ đã sẵn sàng (Chưa có file .md nào để scan).');
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
        ctx.logWarn(`File docs/services/${file} thiếu ${missingSections.length} sections bắt buộc: ${missingSections.join(', ')}`);
        totalViolations++;
      } else {
        ctx.logPass(`File docs/services/${file} tuân thủ 100% 10 Sections Specification Contract.`);
      }
    }

    if (totalViolations === 0) {
      ctx.logPass('Tất cả các file trong docs/services/ hoàn toàn tuân thủ Specification Schema Contract.');
    }
  }
};
