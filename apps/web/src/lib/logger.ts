import { ENV } from './env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LOG_LEVEL_PRIORITIES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

let currentLogLevel: LogLevel = ENV.logLevel;

/**
 * Structured Logger for nodetask Client Application.
 * In DEV: Rich formatted logging with namespaces, timestamps, and payload inspection.
 * In PROD: DEBUG/INFO calls are no-ops; only WARN/ERROR are outputted to avoid sensitive data leakage.
 */
class StructuredLogger {
  private namespace: string;

  constructor(namespace = 'APP') {
    this.namespace = namespace;
  }

  /**
   * Set global minimum log level at runtime.
   */
  static setLogLevel(level: LogLevel): void {
    currentLogLevel = level;
  }

  /**
   * Get current log level.
   */
  static getLogLevel(): LogLevel {
    return currentLogLevel;
  }

  /**
   * Create a namespaced logger instance (e.g. 'AUTH', 'RPC', 'STORE', 'DND').
   */
  static createNamespace(namespace: string): StructuredLogger {
    return new StructuredLogger(namespace);
  }

  private shouldLog(level: LogLevel): boolean {
    if (currentLogLevel === 'silent') return false;
    return LOG_LEVEL_PRIORITIES[level] >= LOG_LEVEL_PRIORITIES[currentLogLevel];
  }

  private formatPrefix(level: LogLevel): string {
    const time = new Date().toISOString().substring(11, 23);
    return `[nodetask:${this.namespace}] [${level.toUpperCase()}] ${time}`;
  }

  debug(...args: unknown[]): void {
    if (!this.shouldLog('debug')) return;
    if (ENV.isDev) {
      // eslint-disable-next-line no-console
      console.debug(`%c${this.formatPrefix('debug')}`, 'color: #888888; font-weight: bold;', ...args);
    }
  }

  info(...args: unknown[]): void {
    if (!this.shouldLog('info')) return;
    if (ENV.isDev) {
      // eslint-disable-next-line no-console
      console.info(`%c${this.formatPrefix('info')}`, 'color: #0088cc; font-weight: bold;', ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (!this.shouldLog('warn')) return;
    // eslint-disable-next-line no-console
    console.warn(`%c${this.formatPrefix('warn')}`, 'color: #ff9900; font-weight: bold;', ...args);
  }

  error(...args: unknown[]): void {
    if (!this.shouldLog('error')) return;
    // eslint-disable-next-line no-console
    console.error(`%c${this.formatPrefix('error')}`, 'color: #ff3333; font-weight: bold;', ...args);
  }

  time(label: string): void {
    if (!ENV.isDev || !this.shouldLog('debug')) return;
    // eslint-disable-next-line no-console
    console.time(`[nodetask:${this.namespace}:TIMER] ${label}`);
  }

  timeEnd(label: string): void {
    if (!ENV.isDev || !this.shouldLog('debug')) return;
    // eslint-disable-next-line no-console
    console.timeEnd(`[nodetask:${this.namespace}:TIMER] ${label}`);
  }
}

export const logger = StructuredLogger;
export const appLogger = StructuredLogger.createNamespace('CORE');
export const rpcLogger = StructuredLogger.createNamespace('RPC');
export const authLogger = StructuredLogger.createNamespace('AUTH');
export const storeLogger = StructuredLogger.createNamespace('STORE');
