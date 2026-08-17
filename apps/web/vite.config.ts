import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: false,
    },
    esbuild: {
      // In production: automatically drop console and debugger statements to prevent data leaks & bloat
      drop: isProd ? ['console', 'debugger'] : [],
    },
    build: {
      target: 'esnext',
      sourcemap: !isProd,
      minify: isProd ? 'esbuild' : false,
      chunkSizeWarningLimit: 600,
    },
  };
});

