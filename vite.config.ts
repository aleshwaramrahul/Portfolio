import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-anim': ['gsap', 'lenis'],
          'globe-data': ['./src/data/globeData.ts'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});

