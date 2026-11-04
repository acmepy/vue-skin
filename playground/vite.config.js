import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { iconForge } from 'icon-forge/vite'
import { verifyAdapterIsolation } from './build/adapterIsolation.js'
import { availableAdapters } from './src/adapters.js'

export default defineConfig(({ mode }) => {
  const names = availableAdapters.map(item => item.value)
  const selected = process.env.VITE_UI_SKIN || loadEnv(mode, process.cwd(), 'VITE_').VITE_UI_SKIN || (names.includes(mode) ? mode : 'bootstrap')
  if (!names.includes(selected)) throw new Error('VITE_UI_SKIN debe ser: ' + names.join(', '))
  return {
    resolve: { alias: { '#skin-adapter': fileURLToPath(new URL(`../packages/${selected}/src/index.js`, import.meta.url)), '#skin-demo-style': fileURLToPath(new URL(selected === 'bootstrap' ? './src/empty.css' : selected === 'basecoat' ? './src/basecoat-demo.css' : './src/framework-demo.css', import.meta.url)) } },
    define: { __VUE_SKIN_ADAPTER__: JSON.stringify(selected) },
    build: {
      manifest: true,
      rollupOptions: { input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        bootstrap: fileURLToPath(new URL('./bootstrap.html', import.meta.url)),
        basecoat: fileURLToPath(new URL('./basecoat.html', import.meta.url)),
        terminal: fileURLToPath(new URL('./terminal.html', import.meta.url)),
        konsta: fileURLToPath(new URL('./konsta.html', import.meta.url)),
        slate: fileURLToPath(new URL('./slate.html', import.meta.url))
      } }
    },
    plugins: [vue(), iconForge({ component: 'UiIcon', source: ['src', ...names.map(name => `../packages/${name}/src`), '../packages/layouts/src'] }), {
      name: 'verify-adapter-isolation',
      generateBundle(options, bundle) {
        verifyAdapterIsolation(bundle, selected)
      }
    }]
  }
})
