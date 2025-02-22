import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    //base: '/Texture-Composer/', // This setting is for web only
    outDir: './TextureComposer\\TextureComposer\\public', // This setting is for web view only
    emptyOutDir: true, // also necessary
  }
})
