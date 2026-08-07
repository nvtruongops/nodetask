const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const targetDir = path.join(ctx.workspaceRoot, 'apps/web/src');
    if (!ctx.fs.existsSync(targetDir)) {
      ctx.logger.pass('Chưa có thư mục apps/web/src để kiểm định Frontend UI.');
      return { passed: true };
    }

    const scanFiles = (dir) => {
      let results = [];
      const list = ctx.fs.readdirSync(dir);
      list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = ctx.fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results = results.concat(scanFiles(fullPath));
        } else if (/\.(tsx|jsx|ts|js|json)$/.test(file)) {
          results.push(fullPath);
        }
      });
      return results;
    };

    const files = scanFiles(targetDir);
    let violations = 0;

    const forbiddenDummyPatterns = [
      { regex: /Alex\s+Johnson/i, label: 'Alex Johnson' },
      { regex: /alex@organization\.com/i, label: 'alex@organization.com' },
      { regex: /Nguyễn\s+Văn\s+A/i, label: 'Nguyễn Văn A' },
      { regex: /nguyenvana@tochuc\.com/i, label: 'nguyenvana@tochuc.com' },
      { regex: /John\s+Doe/i, label: 'John Doe' },
      { regex: /user@domain\.com/i, label: 'user@domain.com' },
      { regex: /you@domain\.com/i, label: 'you@domain.com' },
      { regex: /ten@tochuc\.com/i, label: 'ten@tochuc.com' }
    ];

    for (const file of files) {
      const content = ctx.fs.readFileSync(file, 'utf8');
      const relPath = path.relative(ctx.workspaceRoot, file);

      // Check 1: No hardcoded max-w-7xl
      if ((file.endsWith('.tsx') || file.endsWith('.jsx')) && content.includes('max-w-7xl')) {
        ctx.logger.warn(`File ${relPath} chứa hardcode 'max-w-7xl'. Hãy chuyển sang dùng Container Tokens hoặc clamp().`);
        violations++;
      }

      // Check 2: No icon imports
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        const forbiddenLibs = ['lucide-react', 'react-icons', '@heroicons', '@tabler/icons-react'];
        for (const lib of forbiddenLibs) {
          if (content.includes(`from '${lib}'`) || content.includes(`from "${lib}"`)) {
            ctx.logger.warn(`File ${relPath} vi phạm Zero-Icon rule (import từ '${lib}').`);
            violations++;
          }
        }
      }

      // Check 3: HARD Check - No dummy sample placeholders (Alex Johnson, John Doe, etc.)
      for (const pattern of forbiddenDummyPatterns) {
        if (pattern.regex.test(content)) {
          ctx.logger.error(`File ${relPath} vi phạm Quy tắc Placeholder Ô nhập liệu: CẤM sử dụng tên/email mẫu hư cấu '${pattern.label}'. Hãy sử dụng hướng dẫn thao tác chức năng súc tích.`);
          violations++;
        }
      }
    }

    if (violations === 0) {
      ctx.logger.pass('Mã nguồn Frontend UI hoàn toàn tuân thủ Implementation Schema Contract (0 hardcode max-w-7xl, 0 icon imports, 0 dummy placeholders).');
    }

    return { passed: violations === 0 };
  }
};
