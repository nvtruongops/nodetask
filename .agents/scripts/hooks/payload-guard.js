const fs = require('fs');

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
  const toolCall = input.toolCall;

  if (toolCall?.name === 'run_command') {
    const cmd = (toolCall.args?.CommandLine || '').trim();

    // 1. Chặn git diff trần trụi (dễ dump toàn bộ file diff không giới hạn)
    if (/^git diff(\s+)?$/.test(cmd)) {
      console.log(
        JSON.stringify({
          decision: 'allow',
          overwrite: { CommandLine: 'git diff --stat' }
        })
      );
      process.exit(0);
    }

    // 2. Chặn git log unpaged
    if (/^git log(\s+)?$/.test(cmd)) {
      console.log(
        JSON.stringify({
          decision: 'allow',
          overwrite: { CommandLine: 'git log -n 10 --oneline' }
        })
      );
      process.exit(0);
    }
  }
} catch (_) {}

console.log(JSON.stringify({ decision: 'allow' }));
