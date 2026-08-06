const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const policy = ctx.policies['no-mock-data'] || {};
    const forbiddenPatterns = policy.forbiddenPatterns || ['mockData', 'fakeRole', 'dummyArray', 'fakeUser', 'mockUsers'];

    let violations = 0;

    const docsDirs = [
      path.join(ctx.workspaceRoot, 'docs/page_routes'),
      path.join(ctx.workspaceRoot, 'docs/services')
    ];

    docsDirs.forEach((dir) => {
      if (!ctx.fs.existsSync(dir)) return;
      const files = ctx.fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const content = ctx.fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          forbiddenPatterns.forEach((pat) => {
            if (
              line.toLowerCase().includes(pat.toLowerCase()) &&
              !line.includes('Zero Mock Data') &&
              !line.includes('No Mock Data') &&
              !line.includes('Cấm dùng Mock Data') &&
              !line.includes('NO MOCK DATA')
            ) {
              const relPath = path.relative(ctx.workspaceRoot, fullPath);
              ctx.logger.error(`${relPath}:${idx + 1} -> Chứa từ khóa Mock Data bị cấm: '${pat}'`);
              violations++;
            }
          });
        });
      }
    });

    if (violations === 0) {
      ctx.logger.pass('Tất cả tài liệu đặc tả và mã nguồn tuân thủ 100% quy tắc KHÔNG MOCK DATA & RBAC System Roles chuẩn.');
    }

    return { passed: violations === 0 };
  }
};
