import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: { alias: { '#skin-adapter': fileURLToPath(new URL('./packages/bootstrap/src/index.js', import.meta.url)) } },
  define: { __VUE_SKIN_ADAPTER__: JSON.stringify('bootstrap') },
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['packages/**/test/**/*.spec.js']
  }
})
