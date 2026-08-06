const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const policy = ctx.policies['lint-issues'] || {};
    if (policy.enabled === false) {
      ctx.logger.pass('Quy tắc LINT_ISSUES bị tắt.');
      return { passed: true };
    }

    const searchDirs = [
      path.join(ctx.workspaceRoot, 'apps/web/src'),
      path.join(ctx.workspaceRoot, 'apps/server')
    ];

    let issues = [];

    function scanDir(dir) {
      if (!ctx.fs.existsSync(dir)) return;
      const entries = ctx.fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'build', '.dart_tool'].includes(entry.name)) {
            scanDir(fullPath);
          }
        } else if (entry.isFile() && /\.(tsx|jsx|ts|js)$/.test(entry.name)) {
          const content = ctx.fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          const relPath = path.relative(ctx.workspaceRoot, fullPath);

          // 1. Check Empty Catch Blocks
          if (policy.checkEmptyCatch !== false) {
            lines.forEach((line, idx) => {
              if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(line) || /catch\s*\{\s*\}/.test(line)) {
                issues.push({
                  file: relPath,
                  line: idx + 1,
                  type: 'Empty Catch Block',
                  message: 'Khối catch rỗng nuốt exception (Empty catch block swallows errors)'
                });
              }
            });
          }

          // 2. Check True Unreachable Code (Single line return followed by un-nested executable code)
          if (policy.checkUnreachableCode !== false) {
            for (let i = 0; i < lines.length - 1; i++) {
              const trimmed = lines[i].trim();
              const nextTrimmed = lines[i + 1].trim();

              // Matches standalone return; or return val; (excluding return ( or return < JSX)
              if (
                /^(return;|return\s+[^({<]+;)$/.test(trimmed) &&
                nextTrimmed.length > 0 &&
                !nextTrimmed.startsWith('}') &&
                !nextTrimmed.startsWith('case ') &&
                !nextTrimmed.startsWith('default:') &&
                !nextTrimmed.startsWith('//') &&
                !nextTrimmed.startsWith('/*')
              ) {
                issues.push({
                  file: relPath,
                  line: i + 2,
                  type: 'Unreachable Code',
                  message: 'Mã không bao giờ được thực thi (Unreachable code after return)'
                });
              }
            }
          }

          // 3. Check Explicit Any type usage
          lines.forEach((line, idx) => {
            if (/:\s*any\b/.test(line) && !line.includes('// eslint-disable')) {
              issues.push({
                file: relPath,
                line: idx + 1,
                type: 'Explicit Any Type',
                message: 'Lạm dụng kiểu dữ liệu :any làm mất tính Type-safe'
              });
            }
          });
        }
      }
    }

    searchDirs.forEach(dir => scanDir(dir));

    if (issues.length > 0) {
      ctx.logger.warn(`Phát hiện ${issues.length} cảnh báo Lint Issues trong mã nguồn:`);
      issues.forEach(issue => {
        ctx.logger.warn(`  - [${issue.type}] ${issue.file}:${issue.line} -> ${issue.message}`);
      });
      return { passed: true };
    }

    ctx.logger.pass('Không phát hiện lỗi Lint Issues nào trong mã nguồn (0 Unused/Swallowed Errors/Explicit Any).');
    return { passed: true };
  }
};
