import { createVueSkin } from '@vue-skin/core'
import adapter from '@vue-skin/slate'
import { startPlayground } from './start.js'
import './framework-demo.css'

startPlayground(createVueSkin({ adapter }), 'slate')
