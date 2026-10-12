import { createApp } from 'vue'
import App from './App.vue'
import LayoutPreview from './LayoutPreview.vue'
import { getLayoutPreview } from './layoutPreview.js'
import { skin } from './skin.js'

const layout = getLayoutPreview(window.location.search)
createApp(layout ? LayoutPreview : App, layout ? { layout } : undefined)
  .use(skin)
  .mount('#app')
