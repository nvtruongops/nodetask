const fs = require('fs');
const path = require('path');

const STATE_FILE = path.resolve(__dirname, '../../.sentry-state.json');
const TRANSCRIPT_CHAR_THRESHOLD = 350_000;
const MAX_REMINDERS = 2;

function loadAllStates() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (_) {}
  return {};
}

function saveAllStates(states) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(states, null, 2));
  } catch (_) {}
}

function hasEngramCheckpoint(transcriptContent) {
  return (
    transcriptContent.includes('"name":"mem_session_summary"') ||
    transcriptContent.includes('"name":"mem_save"')
  );
}

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
  const conversationId = input.conversationId || 'default';
  const invocationNum = input.invocationNum || 0;
  const transcriptPath = input.transcriptPath;

  if (transcriptPath && fs.existsSync(transcriptPath)) {
    const rawContent = fs.readFileSync(transcriptPath, 'utf-8');
    const rawCharCount = rawContent.length;

    const states = loadAllStates();
    let sessionState = states[conversationId] || {
      status: 'IDLE',
      lastInvocationNum: invocationNum,
      lastCharCount: rawCharCount,
      remindCount: 0
    };

    // 1. Reset về IDLE nếu phát hiện phiên mới hoặc transcript bị reset/compact
    if (
      invocationNum < sessionState.lastInvocationNum ||
      rawCharCount < sessionState.lastCharCount * 0.6
    ) {
      sessionState = {
        status: 'IDLE',
        lastInvocationNum: invocationNum,
        lastCharCount: rawCharCount,
        remindCount: 0
      };
    }

    sessionState.lastInvocationNum = invocationNum;
    sessionState.lastCharCount = rawCharCount;

    // 2. Xác nhận Checkpoint nếu đang ở trạng thái REQUESTED và transcript đã có lệnh lưu
    if (sessionState.status === 'CHECKPOINT_REQUESTED') {
      if (hasEngramCheckpoint(rawContent)) {
        sessionState.status = 'CHECKPOINTED';
        states[conversationId] = sessionState;
        saveAllStates(states);
        console.log(JSON.stringify({ injectSteps: [] }));
        process.exit(0);
      }
    }

    // 3. Kích hoạt Checkpoint lần đầu khi chạm ngưỡng ký tự
    if (rawCharCount >= TRANSCRIPT_CHAR_THRESHOLD && sessionState.status === 'IDLE') {
      sessionState.status = 'CHECKPOINT_REQUESTED';
      sessionState.remindCount = 1;
      states[conversationId] = sessionState;
      saveAllStates(states);

      console.log(
        JSON.stringify({
          injectSteps: [
            {
              ephemeralMessage: `[CONTEXT SENTRY]: Transcript size reached ~${Math.round(
                rawCharCount / 1024
              )}KB (Confidence: HEURISTIC). Please call mem_session_summary to persist critical state to Engram before compaction.`
            }
          ]
        })
      );
      process.exit(0);
    }

    // 4. Nhắc lại có giới hạn nếu Agent chưa lưu checkpoint
    if (
      sessionState.status === 'CHECKPOINT_REQUESTED' &&
      sessionState.remindCount < MAX_REMINDERS
    ) {
      sessionState.remindCount += 1;
      states[conversationId] = sessionState;
      saveAllStates(states);

      console.log(
        JSON.stringify({
          injectSteps: [
            {
              ephemeralMessage:
                '[URGENT - CONTEXT SENTRY]: Unsaved checkpoint detected. Please call mem_session_summary immediately.'
            }
          ]
        })
      );
      process.exit(0);
    }

    states[conversationId] = sessionState;
    saveAllStates(states);
  }
} catch (_) {}

console.log(JSON.stringify({ injectSteps: [] }));
