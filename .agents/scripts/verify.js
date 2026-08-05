/**
 * Modular Rule Engine Verification Runner for AI Agent Guardrails
 * 
 * Architecture Stages:
 *   1. Loader Phase   : Load Manifest, Skill Registry, and Policy JSON configurations
 *   2. Plugin Registry : Load and register rule plugins dynamically from rules/
 *   3. Engine Execution: Execute enabled rules with context, logging passes/fails
 *   4. Reporter Engine: Format & output summary report (Console / JSON)
 * 
 * Usage:
 *   node .agents/scripts/verify.js                     (Standard mode: fails on ERRORS only)
 *   node .agents/scripts/verify.js --strict            (Strict mode: fails on ERRORS & WARNINGS)
 *   node .agents/scripts/verify.js --category=architecture (Filter by category)
 *   node .agents/scripts/verify.js --rule=ZERO_ICON     (Filter by rule ID)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const MANIFEST_PATH = path.join(ROOT_DIR, '.agents/manifest.json');
const REGISTRY_PATH = path.join(ROOT_DIR, '.agents/registry.json');
const POLICIES_DIR = path.join(ROOT_DIR, '.agents/policies');
const RULES_DIR = path.join(ROOT_DIR, '.agents/scripts/rules');

// Parse CLI Arguments
const args = process.argv.slice(2);
const isStrict = args.includes('--strict');
const categoryFilter = (args.find(a => a.startsWith('--category=')) || '').split('=')[1];
const ruleFilter = (args.find(a => a.startsWith('--rule=')) || '').split('=')[1];

// ==============================================================================
// 1. LOADER PHASE
// ==============================================================================
class GovernanceLoader {
  static loadManifest() {
    if (fs.existsSync(MANIFEST_PATH)) {
      try {
        return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      } catch (err) {
        console.error(`⚠️ Unable to parse manifest.json: ${err.message}`);
      }
    }
    return { schemaVersion: 1, governanceVersion: '1.3.0' };
  }

  static loadRegistry() {
    if (fs.existsSync(REGISTRY_PATH)) {
      try {
        return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
      } catch (err) {
        console.error(`⚠️ Unable to parse registry.json: ${err.message}`);
      }
    }
    return { skills: {} };
  }

  static loadPolicies() {
    const policies = {};
    if (!fs.existsSync(POLICIES_DIR)) return policies;

    const files = fs.readdirSync(POLICIES_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const key = path.basename(file, '.json');
        try {
          policies[key] = JSON.parse(fs.readFileSync(path.join(POLICIES_DIR, file), 'utf8'));
        } catch (err) {
          console.error(`❌ [ERROR] Error reading policy JSON ${file}:`, err.message);
        }
      }
    }
    return policies;
  }

  static loadRulePlugins() {
    if (!fs.existsSync(RULES_DIR)) return [];
    return fs.readdirSync(RULES_DIR)
      .filter(f => f.endsWith('.js'))
      .map(file => ({
        fileName: file,
        key: path.basename(file, '.js'),
        module: require(path.join(RULES_DIR, file))
      }));
  }
}

// ==============================================================================
// 2. ENGINE RUNNER & PLUGIN REGISTRY
// ==============================================================================
class RuleEngine {
  constructor() {
    this.manifest = GovernanceLoader.loadManifest();
    this.registry = GovernanceLoader.loadRegistry();
    this.policies = GovernanceLoader.loadPolicies();
    this.plugins = GovernanceLoader.loadRulePlugins();
    this.results = [];
    this.counts = { pass: 0, fail: 0, warn: 0, info: 0 };
  }

  execute() {
    for (const plugin of this.plugins) {
      const policyKey = plugin.key;
      const policy = this.policies[policyKey] || {};
      const ruleModule = plugin.module;

      const ruleId = policy.id || ruleModule.id || policyKey.toUpperCase();
      const enabled = policy.enabled !== undefined ? policy.enabled : true;
      const category = policy.category || ruleModule.category || 'general';
      const severity = (policy.severity || ruleModule.severity || 'error').toLowerCase();
      const ruleName = ruleModule.name || plugin.fileName;

      // Filter checks
      if (!enabled) continue;
      if (categoryFilter && category.toLowerCase() !== categoryFilter.toLowerCase()) continue;
      if (ruleFilter && ruleId.toLowerCase() !== ruleFilter.toLowerCase()) continue;

      let ruleFailCount = 0;
      let ruleWarnCount = 0;
      let ruleInfoCount = 0;

      const ctx = {
        rootDir: ROOT_DIR,
        manifest: this.manifest,
        registry: this.registry,
        policies: this.policies,
        severity,
        logPass: (msg) => {
          console.log(`  [PASS] ${msg}`);
          this.counts.pass++;
        },
        logFail: (msg) => {
          console.log(`  [FAIL] ${msg}`);
          this.counts.fail++;
          ruleFailCount++;
        },
        logWarn: (msg) => {
          console.log(`  [WARNING] ${msg}`);
          this.counts.warn++;
          ruleWarnCount++;
        },
        logInfo: (msg) => {
          console.log(`  [INFO] ${msg}`);
          this.counts.info++;
          ruleInfoCount++;
        }
      };

      console.log(`\n▶️ Executing Rule [${ruleId}]: ${ruleName} [Category: ${category.toUpperCase()} | Severity: ${severity.toUpperCase()}]`);

      try {
        ruleModule.execute(ctx);
      } catch (err) {
        ctx.logFail(`Exception executing rule ${plugin.fileName}: ${err.message}`);
      }

      let ruleStatus = 'PASS';
      if (ruleFailCount > 0) ruleStatus = 'FAIL';
      else if (ruleWarnCount > 0) ruleStatus = isStrict ? 'FAIL (STRICT)' : 'WARNING';
      else if (ruleInfoCount > 0) ruleStatus = 'INFO';

      this.results.push({
        id: ruleId,
        name: ruleName,
        category,
        severity,
        status: ruleStatus
      });
    }

    return this.results;
  }
}

// ==============================================================================
// 3. REPORTER ENGINE
// ==============================================================================
class ConsoleReporter {
  static render(results, counts, manifest) {
    const govVersion = manifest.governanceVersion || '1.3.0';
    const schemaVer = manifest.schemaVersion || 1;

    console.log(`\n================================================================`);
    console.log(`📊 VERIFICATION SUMMARY REPORT (Gov v${govVersion} | Schema v${schemaVer})`);
    console.log(`================================================================`);

    results.forEach(res => {
      const icon = res.status.includes('FAIL') ? '❌' : res.status === 'WARNING' ? '⚠️' : res.status === 'INFO' ? 'ℹ️' : '✅';
      console.log(`${icon} [${res.status}] [${res.severity.toUpperCase()}] [${res.category.toUpperCase()}] - ${res.name} (${res.id})`);
    });

    console.log(`----------------------------------------------------------------`);
    console.log(`Total Passed: ${counts.pass} | Errors: ${counts.fail} | Warnings: ${counts.warn} | Info: ${counts.info}`);
    console.log(`================================================================\n`);

    const hasFailed = counts.fail > 0 || (isStrict && counts.warn > 0);
    if (hasFailed) {
      console.error(`🔥 VERIFICATION FAILED! Vui lòng khắc phục các lỗi vi phạm trước khi merge/commit.`);
      process.exit(1);
    } else {
      console.log(`🎉 TẤT CẢ CÁC QUY TẮC ĐỀU HỢP LỆ!`);
      process.exit(0);
    }
  }
}

// Main Execution Entrypoint
function main() {
  const manifest = GovernanceLoader.loadManifest();
  console.log(`\n🤖 AI AGENT RULE ENGINE VERIFICATION [Governance v${manifest.governanceVersion || '1.3.0'} | Strict Mode: ${isStrict ? 'ON 🛡️' : 'OFF ⚡'}]`);
  console.log(`================================================================`);

  const engine = new RuleEngine();
  const results = engine.execute();
  ConsoleReporter.render(results, engine.counts, manifest);
}

main();
