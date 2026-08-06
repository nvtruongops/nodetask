const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const policy = ctx.policies['zero-icon'];
    if (!policy) {
      ctx.logger.warn('Zero Icon policy missing in policies/zero-icon.json');
      return { passed: true };
    }

    const webSrcDir = path.join(ctx.workspaceRoot, 'apps/web/src');
    if (!ctx.fs.existsSync(webSrcDir)) {
      ctx.logger.pass('Chưa có apps/web/src (Sẽ tự động kiểm tra khi tạo Web app).');
      return { passed: true };
    }

    let violations = 0;
    function scanDir(dir) {
      const entries = ctx.fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist'].includes(entry.name)) {
            scanDir(fullPath);
          }
        } else if (entry.isFile() && /\.(tsx|jsx|ts|js)$/.test(entry.name)) {
          const content = ctx.fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            policy.disallowedPackages.forEach(pkg => {
              if (line.includes(`from '${pkg}'`) || line.includes(`from "${pkg}"`)) {
                const relPath = path.relative(ctx.workspaceRoot, fullPath);
                ctx.logger.error(`${relPath}:${idx + 1} -> Import icon package bị cấm '${pkg}'`);
                violations++;
              }
            });
          });
        }
      }
    }

    scanDir(webSrcDir);
    if (violations === 0) {
      ctx.logger.pass('Mã nguồn Frontend hoàn toàn tuân thủ Zero-Icon rule (0 vi phạm).');
    }

    return { passed: violations === 0 };
  }
};
