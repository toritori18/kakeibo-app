import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// バックエンドへのリクエストをプロキシ（開発時のCORS回避）
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
