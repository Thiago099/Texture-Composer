import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: './TextureComposerApp\\TextureComposerApp\\public',
    emptyOutDir: true, // also necessary
  }
})
