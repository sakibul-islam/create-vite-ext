import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import zipPack from "vite-plugin-zip-pack";
import { name, displayName, version } from './package.json';
import manifest, { browser } from './src/manifest.config';
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    emptyOutDir: true,
    outDir: 'build',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/chunk-[hash].js',
      },
    },
  },
  server: {
    strictPort: true,
    hmr: {
      port: 8082,
    },
  },
  plugins: [
    react(),
    crx({ manifest, browser }),
    zipPack({
      inDir: 'build',
      outDir: 'build-zip',
      outFileName: `${(displayName || name).replace(/\s/g, "-")}_v${version}.zip`,
    })
  ],
});
