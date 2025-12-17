/// <reference types='vitest' />
import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/theme',
  plugins: [],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    lib: {
      entry: 'src/index.ts',
      name: '@zetta/theme',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: [],
    },
  },
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/theme',
      provider: 'v8',
    },
  },
}));
