const fs = require('fs');
const path = require('path');

/**
 * Script Lifecycle Guard Hook
 * Intercepts tool calls (write_to_file, replace_file_content, run_command)
 * to enforce script classification, environment independence, secret safety, and lifecycle rules.
 */

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
  const toolCall = input.toolCall;

  if (toolCall) {
    const toolName = toolCall.name;
    const args = toolCall.args || {};

    // 1. Intercept file creation / modifications targeting scripts
    if (toolName === 'write_to_file' || toolName === 'replace_file_content') {
      const targetFile = (args.TargetFile || '').replace(/\\/g, '/');
      const content = args.CodeContent || args.ReplacementContent || '';

      // Check if target is a script file
      if (/\.(js|ts|mjs|cjs|ps1|sh|py)$/i.test(targetFile) && (targetFile.includes('/scripts/') || targetFile.includes('/.agents/scripts/'))) {
        // Enforce proper directory placement (outside .agents/scripts)
        if (targetFile.includes('/scripts/') && !targetFile.includes('/scripts/reusable/') && !targetFile.includes('/scripts/tmp/') && !targetFile.includes('/.agents/scripts/')) {
          console.log(JSON.stringify({
            decision: 'block',
            reason: '[SCRIPT_LIFECYCLE_GUARD]: Scripts must be placed in either `scripts/reusable/` (for permanent tooling) or `scripts/tmp/` (for task-specific ephemeral scripts).'
          }));
          process.exit(0);
        }

        // Secret Scan
        const secretPatterns = [
          { regex: /(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{50,})/, label: 'GitHub Token' },
          { regex: /(sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z-_]{35})/, label: 'OpenAI / Google API Key' },
          { regex: /(eyJ[a-zA-Z0-9-_]{10,}\.eyJ[a-zA-Z0-9-_]{10,}\.[a-zA-Z0-9-_]{10,})/, label: 'Hardcoded JWT Token' },
          { regex: /AKIA[0-9A-Z]{16}/, label: 'AWS Access Key' }
        ];

        for (const pattern of secretPatterns) {
          if (pattern.regex.test(content)) {
            console.log(JSON.stringify({
              decision: 'block',
              reason: `[SCRIPT_LIFECYCLE_GUARD]: Hardcoded secret detected (${pattern.label}). Use environment variables instead.`
            }));
            process.exit(0);
          }
        }

        // Hardcoded Absolute Path Scan
        const absolutePathRegex = /(['"`])([a-zA-Z]:\\[^'"`]+|\/(Users|home|root)\/[^'"`]+)\1/;
        if (absolutePathRegex.test(content)) {
          console.log(JSON.stringify({
            decision: 'block',
            reason: '[SCRIPT_LIFECYCLE_GUARD]: Hardcoded absolute path detected. Use `process.env.NODETASK_ROOT` or equivalent environment variables.'
          }));
          process.exit(0);
        }

        // Forbidden Fallback to Hardcoded Path Scan
        const fallbackRegex = /process\.env\.[A-Z0-9_]+\s*\|\|\s*['"`]([a-zA-Z]:|\/(Users|home|root))/;
        if (fallbackRegex.test(content)) {
          console.log(JSON.stringify({
            decision: 'block',
            reason: '[SCRIPT_LIFECYCLE_GUARD]: Fallback to hardcoded absolute path detected. Scripts must fail-fast if required environment variables are missing.'
          }));
          process.exit(0);
        }
      }
    }
  }
} catch (_) {}

console.log(JSON.stringify({ decision: 'allow' }));
