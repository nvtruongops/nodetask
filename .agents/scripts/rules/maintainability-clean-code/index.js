const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const policy = ctx.policies['maintainability-clean-code'];
    if (!policy || !policy.enabled) {
      ctx.logger.pass('Quy tắc MAINTAINABILITY_CLEAN_CODE bị tắt hoặc chưa cấu hình.');
      return { passed: true };
    }

    const searchDirs = [
      path.join(ctx.workspaceRoot, 'apps/web/src'),
      path.join(ctx.workspaceRoot, 'apps/server')
    ];

    let violations = 0;

    function scanDir(dir) {
      if (!ctx.fs.existsSync(dir)) return;
      const entries = ctx.fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'build', '.dart_tool'].includes(entry.name)) {
            scanDir(fullPath);
          }
        } else if (entry.isFile() && /\.(tsx|jsx|ts|js|dart)$/.test(entry.name)) {
          const content = ctx.fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');

          lines.forEach((line, idx) => {
            (policy.disallowedDebugPatterns || []).forEach(patternItem => {
              const regex = new RegExp(patternItem.regex, 'i');
              if (regex.test(line)) {
                const relPath = path.relative(ctx.workspaceRoot, fullPath);
                ctx.logger.warn(`${relPath}:${idx + 1} -> Maintainability Code Smell: ${patternItem.reason}`);
                violations++;
              }
            });
          });
        }
      }
    }

    searchDirs.forEach(dir => scanDir(dir));

    if (violations === 0) {
      ctx.logger.pass('Mã nguồn không có Code Smells hay Debug statement tồn dư (SonarQube Standard).');
    }

    return { passed: violations === 0 };
  }
};
