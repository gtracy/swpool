import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/index.jsx',
        'src/serviceWorker.js',
        'src/analytics.js',
        'src/setupTests.js',
        'src/**/*.test.jsx',
        'src/**/*.test.js',
      ],
      reporter: ['text', 'json', 'html'],
    },
  },
});
