import { z } from 'zod';

/**
 * Environment Schema Validator using Zod.
 * Ensures runtime validation of all environment variables across DEV and PROD.
 */
const envSchema = z.object({
  VITE_APP_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  VITE_SERVER_URL: z.string().url().default('http://localhost:8080'),
  VITE_APP_TITLE: z.string().default('nodetask'),
  VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'silent']).default('debug'),
  VITE_ENABLE_DEV_TOOLS: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  VITE_MOCK_DELAY_MS: z
    .string()
    .transform((val) => parseInt(val, 10) || 0)
    .default('0'),
});

const rawEnv = {
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV || (import.meta.env.DEV ? 'development' : 'production'),
  VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL || 'http://localhost:8080',
  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE || 'nodetask',
  VITE_LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || (import.meta.env.DEV ? 'debug' : 'warn'),
  VITE_ENABLE_DEV_TOOLS: String(import.meta.env.VITE_ENABLE_DEV_TOOLS ?? import.meta.env.DEV),
  VITE_MOCK_DELAY_MS: String(import.meta.env.VITE_MOCK_DELAY_MS ?? '0'),
};

const parsedEnv = envSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  // In development, report validation issues
  if (import.meta.env.DEV) {
    console.error('Invalid environment variables schema:', parsedEnv.error.format());
  }
}

const safeEnv = parsedEnv.success
  ? parsedEnv.data
  : {
      VITE_APP_ENV: import.meta.env.DEV ? ('development' as const) : ('production' as const),
      VITE_SERVER_URL: 'http://localhost:8080',
      VITE_APP_TITLE: 'nodetask',
      VITE_LOG_LEVEL: import.meta.env.DEV ? ('debug' as const) : ('warn' as const),
      VITE_ENABLE_DEV_TOOLS: Boolean(import.meta.env.DEV),
      VITE_MOCK_DELAY_MS: 0,
    };

export const ENV = {
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  appEnv: safeEnv.VITE_APP_ENV,
  serverUrl: safeEnv.VITE_SERVER_URL,
  appTitle: safeEnv.VITE_APP_TITLE,
  logLevel: safeEnv.VITE_LOG_LEVEL,
  enableDevTools: safeEnv.VITE_ENABLE_DEV_TOOLS && import.meta.env.DEV,
  mockDelayMs: safeEnv.VITE_MOCK_DELAY_MS,
} as const;

export type AppEnvironment = typeof ENV;
