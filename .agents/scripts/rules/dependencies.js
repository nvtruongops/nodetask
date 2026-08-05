const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Whitelist Dependencies Check',
  execute(ctx) {
    const policy = ctx.policies['dependencies'];
    if (!policy) {
      ctx.logWarn('Dependencies policy missing in policies/dependencies.json');
      return;
    }

    const webPkgPath = path.join(ctx.rootDir, 'apps/web/package.json');
    if (!fs.existsSync(webPkgPath)) {
      ctx.logPass('Chưa có apps/web/package.json (Sẽ tự động kiểm tra khi cài dependencies).');
      return;
    }

    try {
      const pkg = JSON.parse(fs.readFileSync(webPkgPath, 'utf8'));
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      let violations = 0;

      const forbidden = policy.web?.forbiddenStateManagers || [];
      forbidden.forEach(dep => {
        if (allDeps[dep]) {
          ctx.logFail(`apps/web/package.json -> Khai báo State Manager không hợp lệ '${dep}' (Chỉ cho phép Zustand/React Query)`);
          violations++;
        }
      });

      if (violations === 0) {
        ctx.logPass('Dependencies trong apps/web/package.json hợp lệ và nằm trong Whitelist.');
      }
    } catch (err) {
      ctx.logFail(`Không thể parse file apps/web/package.json: ${err.message}`);
    }
  }
};
