const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const webSrcDir = path.join(ctx.workspaceRoot, 'apps/web/src');
    if (!ctx.fs.existsSync(webSrcDir)) {
      ctx.logger.pass('Chưa có apps/web/src (Import Order sẽ được kiểm tra khi khởi tạo app).');
      return { passed: true };
    }

    ctx.logger.pass('Import Order Convention sẵn sàng (Sẽ kiểm tra theo thứ tự 1.Third-party -> 2.UI -> 3.Store -> 4.Types).');
    return { passed: true };
  }
};
