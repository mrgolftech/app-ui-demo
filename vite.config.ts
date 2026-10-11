import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative paths work both under GitHub Pages /app-ui-demo/ and inside an APK.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', emptyOutDir: true }
});
