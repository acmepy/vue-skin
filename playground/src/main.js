import { createApp } from 'vue'
import App from './App.vue'
import { skin } from './skin.js'

createApp(App)
  .use(skin)
  .mount('#app')
