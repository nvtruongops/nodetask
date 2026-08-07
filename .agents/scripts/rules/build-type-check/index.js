const { execSync } = require('child_process');
const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const policy = ctx.policies['build-type-check'] || {};
    if (policy.enabled === false) {
      ctx.logger.pass('Quy tắc BUILD_TYPE_CHECK bị tắt.');
      return { passed: true };
    }

    const webDir = path.join(ctx.workspaceRoot, 'apps/web');
    if (!ctx.fs.existsSync(webDir)) {
      ctx.logger.pass('Không tìm thấy thư mục apps/web, bỏ qua kiểm tra TypeScript.');
      return { passed: true };
    }

    try {
      execSync('npx tsc --noEmit', {
        cwd: webDir,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      ctx.logger.pass('Mã nguồn Frontend qua 100% TypeScript Type-Check & JSX Syntax Validation (0 Error).');
      return { passed: true };
    } catch (err) {
      const output = err.stdout || err.stderr || err.message || '';
      const lines = output.split('\n').filter(l => l.includes('error TS') || l.includes('Error:'));

      ctx.logger.error(`Phát hiện ${lines.length || 1} lỗi TypeScript Type Check / Cú pháp trong mã nguồn:`);
      const reportedLines = lines.length > 0 ? lines : output.split('\n').filter(l => l.trim().length > 0);
      reportedLines.slice(0, 10).forEach(line => {
        ctx.logger.error(`  - ${line.trim()}`);
      });

      return { passed: false };
    }
  }
};
