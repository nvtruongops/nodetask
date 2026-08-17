const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    const policy = ctx.policies['script-lifecycle'] || {};
    if (policy.enabled === false) {
      ctx.logger.pass('Quy tắc SCRIPT_LIFECYCLE bị tắt.');
      return { passed: true };
    }

    let violations = 0;
    const scriptExts = policy.allowedScriptExtensions || ['.js', '.ts', '.mjs', '.cjs', '.ps1', '.sh', '.py'];

    // Helper: scan directory files recursively
    const scanDir = (dir, depth = 0) => {
      let results = [];
      if (!ctx.fs.existsSync(dir)) return results;
      const entries = ctx.fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          results = results.concat(scanDir(fullPath, depth + 1));
        } else if (entry.isFile() && scriptExts.some(ext => entry.name.endsWith(ext))) {
          results.push(fullPath);
        }
      }
      return results;
    };

    // 1. Kiểm tra Loose Scripts nằm trực tiếp ở thư mục /scripts (chưa phân loại)
    const rootScriptsDir = path.join(ctx.workspaceRoot, 'scripts');
    if (ctx.fs.existsSync(rootScriptsDir)) {
      const directEntries = ctx.fs.readdirSync(rootScriptsDir, { withFileTypes: true });
      for (const entry of directEntries) {
        if (entry.isFile() && scriptExts.some(ext => entry.name.endsWith(ext))) {
          const relPath = path.relative(ctx.workspaceRoot, path.join(rootScriptsDir, entry.name));
          ctx.logger.error(`File ${relPath} chưa được phân loại vòng đời. Bắt buộc đặt trong 'scripts/reusable/' hoặc 'scripts/tmp/'.`);
          violations++;
        }
      }
    }

    // 2. Quét toàn bộ scripts trong scripts/reusable, scripts/tmp và .agents/scripts
    const scriptDirsToScan = [
      path.join(ctx.workspaceRoot, 'scripts/reusable'),
      path.join(ctx.workspaceRoot, 'scripts/tmp'),
      path.join(ctx.workspaceRoot, '.agents/scripts')
    ];

    const allScriptFiles = [];
    scriptDirsToScan.forEach(d => {
      if (ctx.fs.existsSync(d)) {
        allScriptFiles.push(...scanDir(d));
      }
    });

    const secretPatterns = policy.forbiddenSecretPatterns || [
      { regex: '(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{50,})', label: 'GitHub Token' },
      { regex: '(sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z-_]{35})', label: 'OpenAI / Google API Key' },
      { regex: '(eyJ[a-zA-Z0-9-_]{10,}\\.eyJ[a-zA-Z0-9-_]{10,}\\.[a-zA-Z0-9-_]{10,})', label: 'Hardcoded JWT Token' },
      { regex: 'AKIA[0-9A-Z]{16}', label: 'AWS Access Key ID' }
    ];

    const fallbackPatterns = policy.forbiddenEnvFallbacks || [
      'process\\.env\\.[A-Z0-9_]+\\s*\\|\\|\\s*[\'"][a-zA-Z]:',
      'process\\.env\\.[A-Z0-9_]+\\s*\\|\\|\\s*[\'"](/Users/|/home/|/root/|/c/)'
    ];

    for (const filePath of allScriptFiles) {
      const content = ctx.fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const relPath = path.relative(ctx.workspaceRoot, filePath);

      // A. Quét Absolute Paths
      lines.forEach((line, idx) => {
        // Bỏ qua comment dòng giải thích quy tắc hoặc regex definitions
        if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.includes('regex:')) return;

        // Quét Windows Drive Path hoặc Unix user home path trong chuỗi string gán biến
        const absMatch = line.match(/(['"`])([a-zA-Z]:\\[^'"`\\]+|\/(Users|home|root)\/[^'"`]+)\1/);
        if (absMatch && !line.includes('STATE_FILE') && !line.includes('path.resolve') && !line.includes('path.join')) {
          ctx.logger.error(`${relPath}:${idx + 1} -> Chứa hardcoded absolute path '${absMatch[2]}'. Bắt buộc dùng process.env hoặc relative path.`);
          violations++;
        }

        // B. Quét Fallback sang Hardcoded Path
        fallbackPatterns.forEach(pat => {
          if (new RegExp(pat, 'i').test(line)) {
            ctx.logger.error(`${relPath}:${idx + 1} -> Sử dụng fallback sang hardcoded path. Script phải fail-fast nếu thiếu biến môi trường.`);
            violations++;
          }
        });

        // C. Quét Secrets
        secretPatterns.forEach(patItem => {
          const reg = new RegExp(patItem.regex, 'i');
          if (reg.test(line) && !line.includes('regex:') && !line.includes('label:')) {
            ctx.logger.error(`${relPath}:${idx + 1} -> Phát hiện Hardcoded Secret (${patItem.label}).`);
            violations++;
          }
        });
      });

      // D. Kiểm tra Manifest cho Reusable Scripts
      if (filePath.includes(path.normalize('scripts/reusable/'))) {
        const baseName = path.basename(filePath, path.extname(filePath));
        const dir = path.dirname(filePath);
        const manifestYaml = path.join(dir, `${baseName}.manifest.yaml`);
        const manifestJson = path.join(dir, `${baseName}.manifest.json`);

        if (!ctx.fs.existsSync(manifestYaml) && !ctx.fs.existsSync(manifestJson)) {
          ctx.logger.warn(`Reusable script [${relPath}] thiếu file manifest mô tả metadata (${baseName}.manifest.yaml).`);
        }
      }
    }

    // 3. Kiểm tra Audit Evidence cho Ephemeral Scripts đã xóa
    const evidenceDir = path.join(ctx.workspaceRoot, policy.evidenceDir || '.agents/evidence/scripts');
    if (ctx.fs.existsSync(evidenceDir)) {
      const evidenceFiles = scanDir(evidenceDir);
      const scriptTaskMap = {};

      for (const evFile of evidenceFiles) {
        if (evFile.endsWith('.json')) {
          try {
            const stat = ctx.fs.statSync(evFile);
            if (stat.size > 50 * 1024) {
              ctx.logger.warn(`Evidence file [${path.relative(ctx.workspaceRoot, evFile)}] vượt quá kích thước cho phép (>50KB). Chú ý không lưu stdout/diff lớn.`);
            }
            const evJson = JSON.parse(ctx.fs.readFileSync(evFile, 'utf8'));
            if (evJson.scriptId) {
              scriptTaskMap[evJson.scriptId] = (scriptTaskMap[evJson.scriptId] || 0) + 1;
            }
          } catch (_) {}
        }
      }

      // Phát hiện Ephemeral script có dấu hiệu tái sử dụng nhiều task
      Object.entries(scriptTaskMap).forEach(([scriptId, count]) => {
        if (count >= (policy.promotionThresholds?.executionCount || 3)) {
          ctx.logger.info(`💡 Script ID '${scriptId}' đã được ghi nhận chạy ${count} lần qua các task. Khuyến nghị nâng cấp thành Reusable Tooling.`);
        }
      });
    }

    if (violations === 0) {
      ctx.logger.pass('Hệ thống Script tuân thủ 100% Script Lifecycle Governance (Phân loại Reusable/Ephemeral, 0 Hardcoded Path, 0 Secret).');
    }

    return { passed: violations === 0 };
  }
};
