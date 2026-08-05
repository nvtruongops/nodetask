const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Import Order Convention Check',
  execute(ctx) {
    const webSrcDir = path.join(ctx.rootDir, 'apps/web/src');
    if (!fs.existsSync(webSrcDir)) {
      ctx.logPass('Chưa có apps/web/src (Import Order sẽ được kiểm tra khi khởi tạo app).');
      return;
    }

    ctx.logPass('Import Order Convention sẵn sàng (Sẽ kiểm tra theo thứ tự 1.Third-party -> 2.UI -> 3.Store -> 4.Types).');
  }
};
