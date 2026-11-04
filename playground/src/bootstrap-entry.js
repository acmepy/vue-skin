import { createVueSkin } from '@vue-skin/core'
import Bootstrap from '@vue-skin/bootstrap'
import { startPlayground } from './start.js'

startPlayground(createVueSkin({ adapter: Bootstrap }), 'bootstrap')
