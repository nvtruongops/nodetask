/**
 * Rule Engine Verification Runner for AI Agent Guardrails
 * 
 * Usage:
 *   node .agents/scripts/verify.js          (Normal mode: fail on ERRORS only)
 *   node .agents/scripts/verify.js --strict (Strict mode: fail on ERRORS & WARNINGS)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const MANIFEST_PATH = path.join(ROOT_DIR, '.agents/manifest.json');
const POLICIES_DIR = path.join(ROOT_DIR, '.agents/policies');
const RULES_DIR = path.join(ROOT_DIR, '.agents/scripts/rules');

const isStrict = process.argv.includes('--strict');

let passCount = 0;
let failCount = 0;
let warnCount = 0;
let infoCount = 0;
const summaryResults = [];

function loadManifest() {
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (err) {
      console.error(`⚠️ Không thể parse .agents/manifest.json: ${err.message}`);
    }
  }
  return { governanceVersion: '1.0.0' };
}

function loadPolicies() {
  const policies = {};
  if (!fs.existsSync(POLICIES_DIR)) return policies;

  const files = fs.readdirSync(POLICIES_DIR);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const key = path.basename(file, '.json');
      try {
        policies[key] = JSON.parse(fs.readFileSync(path.join(POLICIES_DIR, file), 'utf8'));
      } catch (err) {
        console.error(`❌ [ERROR] Lỗi đọc policy JSON ${file}:`, err.message);
      }
    }
  }
  return policies;
}

function runEngine() {
  const manifest = loadManifest();
  const govVersion = manifest.governanceVersion || '1.0.0';

  console.log(`\n🤖 AI AGENT RULE ENGINE VERIFICATION [Governance v${govVersion} | Strict Mode: ${isStrict ? 'ON 🛡️' : 'OFF ⚡'}]`);
  console.log(`================================================================`);

  const policies = loadPolicies();
  if (!fs.existsSync(RULES_DIR)) {
    console.error(`❌ Không tìm thấy thư mục rules: ${RULES_DIR}`);
    process.exit(1);
  }

  const ruleFiles = fs.readdirSync(RULES_DIR).filter(f => f.endsWith('.js'));
  
  for (const file of ruleFiles) {
    const ruleModule = require(path.join(RULES_DIR, file));
    const ruleName = ruleModule.name || file;
    const policyKey = path.basename(file, '.js');
    const policy = policies[policyKey] || {};
    const severity = (policy.severity || ruleModule.severity || 'error').toLowerCase();

    let ruleStatus = 'PASS';
    let ruleFailCount = 0;
    let ruleWarnCount = 0;
    let ruleInfoCount = 0;

    console.log(`\n▶️ Executing Rule: ${ruleName} [Severity: ${severity.toUpperCase()}]`);

    const ctx = {
      rootDir: ROOT_DIR,
      policies,
      severity,
      logPass(msg) {
        console.log(`  [PASS] ${msg}`);
        passCount++;
      },
      logFail(msg) {
        console.log(`  [FAIL] ${msg}`);
        failCount++;
        ruleFailCount++;
      },
      logWarn(msg) {
        console.log(`  [WARNING] ${msg}`);
        warnCount++;
        ruleWarnCount++;
      },
      logInfo(msg) {
        console.log(`  [INFO] ${msg}`);
        infoCount++;
        ruleInfoCount++;
      }
    };

    try {
      ruleModule.execute(ctx);
    } catch (err) {
      ctx.logFail(`Ngoại lệ khi thực thi rule ${file}: ${err.message}`);
    }

    if (ruleFailCount > 0) ruleStatus = 'FAIL';
    else if (ruleWarnCount > 0) ruleStatus = isStrict ? 'FAIL (STRICT)' : 'WARNING';
    else if (ruleInfoCount > 0) ruleStatus = 'INFO';

    summaryResults.push({ name: ruleName, severity, status: ruleStatus });
  }

  // Output Final Summary Report
  console.log(`\n================================================================`);
  console.log(`📊 VERIFICATION SUMMARY REPORT (Governance v${govVersion})`);
  console.log(`================================================================`);
  summaryResults.forEach(res => {
    const icon = res.status.includes('FAIL') ? '❌' : res.status === 'WARNING' ? '⚠️' : res.status === 'INFO' ? 'ℹ️' : '✅';
    console.log(`${icon} [${res.status}] [${res.severity.toUpperCase()}] - ${res.name}`);
  });

  console.log(`----------------------------------------------------------------`);
  console.log(`Total Passed: ${passCount} | Errors: ${failCount} | Warnings: ${warnCount} | Info: ${infoCount}`);
  console.log(`================================================================\n`);

  const hasFailed = failCount > 0 || (isStrict && warnCount > 0);
  if (hasFailed) {
    console.error(`🔥 VERIFICATION FAILED! Vui lòng khắc phục các lỗi vi phạm trước khi merge/commit.`);
    process.exit(1);
  } else {
    console.log(`🎉 TẤT CẢ CÁC QUY TẮC ĐỀU HỢP LỆ!`);
    process.exit(0);
  }
}

runEngine();
