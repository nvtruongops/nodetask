const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const policy = ctx.policies['folder-structure'];
    if (!policy) {
      ctx.logger.warn('Folder structure policy missing in policies/folder-structure.json');
      return { passed: true };
    }

    let violations = 0;

    const expectedDocs = policy.expectedDocs || [];
    expectedDocs.forEach(docRelative => {
      const docPath = path.join(ctx.workspaceRoot, docRelative);
      if (!ctx.fs.existsSync(docPath)) {
        ctx.logger.error(`Thiếu tài liệu Core Spec bắt buộc: ${docRelative}`);
        violations++;
      }
    });

    const requiredDirs = policy.requiredDirectories || [];
    requiredDirs.forEach(dirRelative => {
      const dirPath = path.join(ctx.workspaceRoot, dirRelative);
      if (!ctx.fs.existsSync(dirPath)) {
        ctx.logger.error(`Thiếu thư mục bắt buộc: ${dirRelative}`);
        violations++;
      }
    });

    const agentsMd = path.join(ctx.workspaceRoot, '.agents/AGENTS.md');
    if (!ctx.fs.existsSync(agentsMd)) {
      ctx.logger.error('Thiếu file quy chuẩn trung tâm .agents/AGENTS.md');
      violations++;
    }

    const expectedGovFiles = policy.expectedGovernanceFiles || [];
    expectedGovFiles.forEach(govRelative => {
      const govPath = path.join(ctx.workspaceRoot, govRelative);
      if (!ctx.fs.existsSync(govPath)) {
        ctx.logger.error(`Thiếu file Governance bắt buộc: ${govRelative}`);
        violations++;
      }
    });

    if (violations === 0) {
      ctx.logger.pass('Cấu trúc 4 Core Docs và bộ khung .agents/ hoàn toàn hợp lệ.');
    }

    return { passed: violations === 0 };
  }
};
