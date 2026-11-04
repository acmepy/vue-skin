import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { iconForge } from 'icon-forge/vite'
import { verifyAdapterIsolation } from './build/adapterIsolation.js'

export default defineConfig(({ mode }) => {
  const selected = process.env.VITE_UI_SKIN || loadEnv(mode, process.cwd(), 'VITE_').VITE_UI_SKIN || (mode === 'basecoat' ? 'basecoat' : 'bootstrap')
  if (!['bootstrap', 'basecoat'].includes(selected)) throw new Error('VITE_UI_SKIN debe ser bootstrap o basecoat')
  return {
    resolve: { alias: { '#skin-adapter': fileURLToPath(new URL(`../packages/${selected}/src/index.js`, import.meta.url)), '#skin-demo-style': fileURLToPath(new URL(selected === 'basecoat' ? './src/basecoat-demo.css' : './src/empty.css', import.meta.url)) } },
    define: { __VUE_SKIN_ADAPTER__: JSON.stringify(selected) },
    build: {
      manifest: true,
      rollupOptions: { input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        bootstrap: fileURLToPath(new URL('./bootstrap.html', import.meta.url)),
        basecoat: fileURLToPath(new URL('./basecoat.html', import.meta.url))
      } }
    },
    plugins: [vue(), iconForge({ component: 'UiIcon', source: ['src', '../packages/bootstrap/src', '../packages/basecoat/src', '../packages/layouts/src'] }), {
      name: 'verify-adapter-isolation',
      generateBundle(options, bundle) {
        verifyAdapterIsolation(bundle, selected)
      }
    }]
  }
})
