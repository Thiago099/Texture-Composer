import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  //base: '/Texture-Composer/', // This setting is for github pages only
  build: {
    outDir: './TextureComposer\\TextureComposer\\public', // This setting is for web view only
    emptyOutDir: true,
  }
})
