import { createVueSkin } from '@vue-skin/core'
import Basecoat from '@vue-skin/basecoat'
import { startPlayground } from './start.js'
import './basecoat-demo.css'

startPlayground(createVueSkin({ adapter: Basecoat }), 'basecoat')
