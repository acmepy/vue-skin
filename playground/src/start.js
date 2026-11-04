import { createApp } from 'vue'
import App from './App.vue'
import LayoutPreview from './LayoutPreview.vue'
import { getLayoutPreview } from './layoutPreview.js'

export function startPlayground(skin, adapter) {
  const layout = getLayoutPreview(window.location.search)
  return createApp(layout ? LayoutPreview : App, layout ? { layout } : undefined)
    .provide('playgroundAdapter', adapter)
    .use(skin)
    .mount('#app')
}
