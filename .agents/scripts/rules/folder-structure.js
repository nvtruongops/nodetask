const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Folder & Core Docs Structure Check',
  execute(ctx) {
    const policy = ctx.policies['folder-structure'];
    if (!policy) {
      ctx.logWarn('Folder structure policy missing in policies/folder-structure.json');
      return;
    }

    let violations = 0;

    // Check 4 Core Docs
    const expectedDocs = policy.expectedDocs || [];
    expectedDocs.forEach(docRelative => {
      const docPath = path.join(ctx.rootDir, docRelative);
      if (!fs.existsSync(docPath)) {
        ctx.logFail(`Thiếu tài liệu Core Spec bắt buộc: ${docRelative}`);
        violations++;
      }
    });

    // Check Required Directories (docs, docs/services, .agents)
    const requiredDirs = policy.requiredDirectories || [];
    requiredDirs.forEach(dirRelative => {
      const dirPath = path.join(ctx.rootDir, dirRelative);
      if (!fs.existsSync(dirPath)) {
        ctx.logFail(`Thiếu thư mục bắt buộc: ${dirRelative}`);
        violations++;
      }
    });

    // Check AGENTS.md
    const agentsMd = path.join(ctx.rootDir, '.agents/AGENTS.md');
    if (!fs.existsSync(agentsMd)) {
      ctx.logFail('Thiếu file quy chuẩn trung tâm .agents/AGENTS.md');
      violations++;
    }

    // Check Governance Files (manifest.json, pipeline.json)
    const expectedGovFiles = policy.expectedGovernanceFiles || [];
    expectedGovFiles.forEach(govRelative => {
      const govPath = path.join(ctx.rootDir, govRelative);
      if (!fs.existsSync(govPath)) {
        ctx.logFail(`Thiếu file Governance bắt buộc: ${govRelative}`);
        violations++;
      }
    });

    if (violations === 0) {
      ctx.logPass('Cấu trúc 4 Core Docs và bộ khung .agents/ hoàn toàn hợp lệ.');
    }
  }
};
