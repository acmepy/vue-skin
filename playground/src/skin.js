import { createVueSkin } from '@vue-skin/core'
import Adapter from '#skin-adapter'

export const skin = createVueSkin({ adapter: Adapter })
export const uiDialog = skin.dialog
