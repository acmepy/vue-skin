import { createVueSkin } from '@vue-skin/core'
import adapter from '@vue-skin/konsta'
import { startPlayground } from './start.js'
import './framework-demo.css'

startPlayground(createVueSkin({ adapter }), 'konsta')
