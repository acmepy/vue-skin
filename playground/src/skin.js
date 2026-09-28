import { createVueSkin } from '@vue-skin/core'
import BootstrapSkin from '@vue-skin/bootstrap'

export const skin = createVueSkin({ adapter: BootstrapSkin })
export const uiDialog = skin.dialog
