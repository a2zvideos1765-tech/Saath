import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true, 
    host: true, // This allows you to view the site on your mobile via your local network IP
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html'),
        services: resolve(__dirname, 'services/index.html'),
        portfolio: resolve(__dirname, 'portfolio/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
});
