import React, { useState } from 'react';
import { ENV } from '@/lib/env';
import { logger, LogLevel, authLogger } from '@/lib/logger';
import { useAuthStore, SystemRole } from '@/store/useAuthStore';

/**
 * DevToolbar: Zero-Icon Developer Ribbon & Debug Panel.
 * Rendered ONLY in Development mode (ENV.enableDevTools === true).
 * Tree-shaken and stripped completely from production builds.
 */
export const DevToolbar: React.FC = () => {
  if (!ENV.enableDevTools) {
    return null;
  }

  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLogLevel, setCurrentLogLevelState] = useState<LogLevel>(logger.getLogLevel());
  const [simulatedLatency, setSimulatedLatency] = useState<number>(ENV.mockDelayMs);
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const handleRoleSwitch = (role: SystemRole) => {
    authLogger.info(`[DEV BYPASS] Switching active user role to ${role}`);
    if (role === 'GUEST') {
      logout();
      return;
    }

    login(
      {
        id: `dev-user-${role.toLowerCase()}`,
        email: `${role.toLowerCase()}@nodetask.local`,
        fullName: `Dev Tester (${role})`,
        systemRole: role,
      },
      `dev_session_token_${role.toLowerCase()}`
    );
  };

  const handleLogLevelChange = (level: LogLevel) => {
    logger.setLogLevel(level);
    setCurrentLogLevelState(level);
    authLogger.info(`[DEV LOGGER] Log level set to [${level.toUpperCase()}]`);
  };

  const handleLatencyChange = (ms: number) => {
    setSimulatedLatency(ms);
    authLogger.info(`[DEV NETWORK] Simulated latency set to ${ms}ms`);
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-2 right-2 z-50">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="px-2 py-1 text-xs font-mono font-bold bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 border border-neutral-700 rounded shadow-md hover:opacity-90 transition-opacity"
        >
          [DEV: {isAuthenticated ? user?.systemRole : 'GUEST'}]
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Developer Debug Toolbar"
      className="fixed bottom-2 right-2 z-50 w-80 bg-neutral-950 text-neutral-200 border border-neutral-700 rounded-md p-3 text-xs font-mono shadow-2xl space-y-3"
    >
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="flex items-center space-x-2">
          <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-100 text-[10px] rounded font-bold uppercase">
            ENV: {ENV.appEnv}
          </span>
          <span className="text-[11px] font-semibold">Dev Debug Toolbar</span>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="text-neutral-400 hover:text-neutral-100 text-[10px] px-1 border border-neutral-800 rounded"
        >
          [Hide]
        </button>
      </div>

      {/* Role Switcher */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-neutral-400 uppercase font-semibold">
          Active Role: <span className="text-neutral-100">{isAuthenticated ? user?.systemRole : 'GUEST'}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {(['GUEST', 'USER', 'ORG_MEMBER', 'ORG_ADMIN', 'SYSTEM_ADMIN'] as SystemRole[]).map((role) => {
            const isActive = (!isAuthenticated && role === 'GUEST') || (isAuthenticated && user?.systemRole === role);
            return (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSwitch(role)}
                className={`px-1.5 py-1 text-[10px] border rounded transition-colors text-center truncate ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-950 border-neutral-100 font-bold'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                [{role.replace('SYSTEM_', 'SYS_').replace('ORG_', '')}]
              </button>
            );
          })}
        </div>
      </div>

      {/* Log Level Toggle */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-neutral-400 uppercase font-semibold">
          Console Logger: <span className="text-neutral-100 uppercase">{currentLogLevel}</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {(['debug', 'info', 'warn', 'silent'] as LogLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleLogLevelChange(level)}
              className={`px-1 py-0.5 text-[9px] border rounded text-center uppercase ${
                currentLogLevel === level
                  ? 'bg-neutral-200 text-neutral-900 font-bold border-neutral-200'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'
              }`}
            >
              [{level}]
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Network Latency */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-neutral-400 uppercase font-semibold">
          Simulated Latency: <span className="text-neutral-100">{simulatedLatency}ms</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[0, 200, 600, 1200].map((ms) => (
            <button
              key={ms}
              type="button"
              onClick={() => handleLatencyChange(ms)}
              className={`px-1 py-0.5 text-[9px] border rounded text-center ${
                simulatedLatency === ms
                  ? 'bg-neutral-200 text-neutral-900 font-bold border-neutral-200'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'
              }`}
            >
              [{ms}ms]
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-1 border-t border-neutral-800 flex items-center justify-between text-[10px]">
        <button
          type="button"
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
          }}
          className="text-neutral-400 hover:text-neutral-200 underline"
        >
          [Clear Storage & Reload]
        </button>
        <span className="text-neutral-500 text-[9px]">Serverpod :8080</span>
      </div>
    </aside>
  );
};
