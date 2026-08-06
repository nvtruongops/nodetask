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
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
          results.push(fullPath);
        }
      });
      return results;
    };

    const files = scanFiles(targetDir);
    let violations = 0;

    for (const file of files) {
      const content = ctx.fs.readFileSync(file, 'utf8');
      const relPath = path.relative(ctx.workspaceRoot, file);

      // Check 1: No hardcoded max-w-7xl
      if (content.includes('max-w-7xl')) {
        ctx.logger.warn(`File ${relPath} chứa hardcode 'max-w-7xl'. Hãy chuyển sang dùng Container Tokens hoặc clamp().`);
        violations++;
      }

      // Check 2: No icon imports
      const forbiddenLibs = ['lucide-react', 'react-icons', '@heroicons', '@tabler/icons-react'];
      for (const lib of forbiddenLibs) {
        if (content.includes(`from '${lib}'`) || content.includes(`from "${lib}"`)) {
          ctx.logger.warn(`File ${relPath} vi phạm Zero-Icon rule (import từ '${lib}').`);
          violations++;
        }
      }
    }

    if (violations === 0) {
      ctx.logger.pass('Mã nguồn Frontend UI hoàn toàn tuân thủ Implementation Schema Contract (0 hardcode max-w-7xl, 0 icon imports).');
    }

    return { passed: violations === 0 };
  }
};
