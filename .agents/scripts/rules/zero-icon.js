const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Zero Icon Rule Check',
  execute(ctx) {
    const policy = ctx.policies['zero-icon'];
    if (!policy) {
      ctx.logWarn('Zero Icon policy missing in policies/zero-icon.json');
      return;
    }

    const webSrcDir = path.join(ctx.rootDir, 'apps/web/src');
    if (!fs.existsSync(webSrcDir)) {
      ctx.logPass('Chưa có apps/web/src (Sẽ tự động kiểm tra khi tạo Web app).');
      return;
    }

    let violations = 0;
    function scanDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist'].includes(entry.name)) {
            scanDir(fullPath);
          }
        } else if (entry.isFile() && /\.(tsx|jsx|ts|js)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            policy.disallowedPackages.forEach(pkg => {
              if (line.includes(`from '${pkg}'`) || line.includes(`from "${pkg}"`)) {
                const relPath = path.relative(ctx.rootDir, fullPath);
                ctx.logFail(`${relPath}:${idx + 1} -> Import icon package bị cấm '${pkg}'`);
                violations++;
              }
            });
          });
        }
      }
    }

    scanDir(webSrcDir);
    if (violations === 0) {
      ctx.logPass('Mã nguồn Frontend hoàn toàn tuân thủ Zero-Icon rule (0 vi phạm).');
    }
  }
};
