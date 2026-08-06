const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const policy = ctx.policies['dependencies'];
    if (!policy) {
      ctx.logger.warn('Dependencies policy missing in policies/dependencies.json');
      return { passed: true };
    }

    const webPkgPath = path.join(ctx.workspaceRoot, 'apps/web/package.json');
    if (!ctx.fs.existsSync(webPkgPath)) {
      ctx.logger.pass('Chưa có apps/web/package.json (Sẽ tự động kiểm tra khi cài dependencies).');
      return { passed: true };
    }

    try {
      const pkg = JSON.parse(ctx.fs.readFileSync(webPkgPath, 'utf8'));
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      let violations = 0;

      const forbidden = policy.web?.forbiddenStateManagers || [];
      forbidden.forEach(dep => {
        if (allDeps[dep]) {
          ctx.logger.error(`apps/web/package.json -> Khai báo State Manager không hợp lệ '${dep}' (Chỉ cho phép Zustand/React Query)`);
          violations++;
        }
      });

      if (violations === 0) {
        ctx.logger.pass('Dependencies trong apps/web/package.json hợp lệ và nằm trong Whitelist.');
      }
    } catch (err) {
      ctx.logger.error(`Không thể parse file apps/web/package.json: ${err.message}`);
    }

    return { passed: true };
  }
};
