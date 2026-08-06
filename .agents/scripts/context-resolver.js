const fs = require('fs');
const path = require('path');

/**
 * Context Resolver & Intent Router CLI
 * Usage: node .agents/scripts/context-resolver.js --request "User request text"
 */

function parseArgs() {
  const args = process.argv.slice(2);
  let requestText = '';
  let format = 'text';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--request' && i + 1 < args.length) {
      requestText = args[i + 1];
      i++;
    } else if (args[i] === '--json') {
      format = 'json';
    }
  }

  return { requestText, format };
}

function resolveIntent(requestText, registry) {
  const lower = requestText.toLowerCase();
  const matchedSkills = new Set();
  const detectedIntents = [];

  // Keywords mapping to capabilities
  const intentRules = [
    {
      intent: 'SECURITY_AUDIT',
      keywords: ['security', 'auth', 'token', 'rbac', 'csrf', 'xss', 'login', 'permission', 'secret', 'bảo mật'],
      capabilities: ['sec:token-auth', 'sec:rbac', 'sec:csrf', 'sec:xss']
    },
    {
      intent: 'UI_DEVELOPMENT',
      keywords: ['ui', 'component', 'frontend', 'react', 'tailwind', 'style', 'page', 'screen', 'giao diện', 'màn hình'],
      capabilities: ['fe:react', 'fe:tailwind', 'ui:zero-icon']
    },
    {
      intent: 'API_DESIGN',
      keywords: ['api', 'endpoint', 'serverpod', 'rest', 'websocket', 'dịch vụ'],
      capabilities: ['api:rest', 'api:serverpod', 'doc:service-spec']
    },
    {
      intent: 'DATABASE_SCHEMA',
      keywords: ['db', 'database', 'schema', 'migration', 'table', 'ltree', 'occ', 'cơ sở dữ liệu'],
      capabilities: ['db:schema', 'db:migration']
    },
    {
      intent: 'PERFORMANCE_OPTIMIZATION',
      keywords: ['perf', 'performance', 'slow', 'optimize', 'cache', 'tối ưu', 'hiệu năng'],
      capabilities: ['perf:frontend', 'perf:api', 'perf:db-query']
    },
    {
      intent: 'TESTING',
      keywords: ['test', 'unit', 'integration', 'widget', 'kiểm thử'],
      capabilities: ['test:unit', 'test:integration']
    },
    {
      intent: 'ARCHITECTURE_GUARD',
      keywords: ['architecture', 'dependency', 'package', 'refactor', 'kiến trúc', 'phụ thuộc'],
      capabilities: ['arch:stack-lock', 'arch:dependency-whitelist', 'codegraph:impact-analysis']
    }
  ];

  for (const rule of intentRules) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      detectedIntents.push(rule.intent);
    }
  }

  if (detectedIntents.length === 0) {
    detectedIntents.push('GENERAL_TASK');
  }

  // Match skills from registry
  for (const [skillKey, skillDef] of Object.entries(registry.skills || {})) {
    const caps = skillDef.capabilities || [];
    for (const rule of intentRules) {
      if (detectedIntents.includes(rule.intent)) {
        if (caps.some(c => rule.capabilities.includes(c))) {
          matchedSkills.add(skillKey);
        }
      }
    }
  }

  // Always include core superpowers and ponytail mode
  matchedSkills.add('using-superpowers');
  matchedSkills.add('ponytail');

  // Convert matched skills to detailed list sorted by priority descending
  const resolvedSkills = Array.from(matchedSkills).map(key => {
    const info = registry.skills[key] || {};
    return {
      key,
      priority: info.priority || 50,
      executionMode: info.executionMode || 'sequential',
      description: info.description || '',
      manifestPath: info.manifestPath || info.path || '',
      capabilities: info.capabilities || []
    };
  }).sort((a, b) => b.priority - a.priority);

  return {
    intents: detectedIntents,
    skills: resolvedSkills
  };
}

function main() {
  const { requestText, format } = parseArgs();
  const rootDir = path.resolve(__dirname, '../..');

  const registryPath = path.join(rootDir, '.agents/registry.json');
  const pipelinePath = path.join(rootDir, '.agents/pipeline.json');

  if (!fs.existsSync(registryPath) || !fs.existsSync(pipelinePath)) {
    console.error('Error: registry.json or pipeline.json missing');
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));

  const result = resolveIntent(requestText, registry);

  if (format === 'json') {
    console.log(JSON.stringify({
      request: requestText,
      governanceVersion: registry.registryVersion,
      intents: result.intents,
      resolvedSkills: result.skills
    }, null, 2));
    return;
  }

  console.log(`\n================================================================`);
  console.log(`🧠 AGENT CONTEXT RESOLVER & INTENT ROUTER (Gov v${registry.registryVersion})`);
  console.log(`================================================================`);
  console.log(`📝 User Request : "${requestText || 'General Governance Query'}"`);
  console.log(`🎯 Detected Intents: ${result.intents.join(', ')}`);
  console.log(`----------------------------------------------------------------`);
  console.log(`🚀 RESOLVED SKILLS IN EXECUTION PRIORITY ORDER:`);

  result.skills.forEach((s, idx) => {
    console.log(`  ${idx + 1}. [P:${s.priority}] [${s.executionMode.toUpperCase()}] ${s.key}`);
    console.log(`     Capabilities: ${s.capabilities.join(', ')}`);
    console.log(`     Manifest    : ${s.manifestPath}`);
  });

  console.log(`================================================================\n`);
}

main();
