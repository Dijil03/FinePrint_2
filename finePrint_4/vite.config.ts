import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
    },
    build: {
      outDir: 'dist', // The output directory for the build
      sourcemap: false, // Clean production build without source maps
    },
    server: {
      open: true, // Opens browser automatically on npm run dev
    }
  };
});