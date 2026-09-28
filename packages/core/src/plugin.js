import { requiredComponents, validateAdapter } from './contract.js'
import { createDialogService } from './dialog.js'

export function createVueSkin({ adapter } = {}) {
  const validAdapter = validateAdapter(adapter)
  const dialog = createDialogService(validAdapter)

  return {
    dialog,
    install(app, options = {}) {
      for (const component of requiredComponents) {
        app.component(`Ui${component}`, validAdapter.components[component])
      }

      app.component('UiDialogHost', dialog.Host)
      app.provide('uiDialog', dialog)
      app.config.globalProperties.$uiDialog = dialog

      validAdapter.install?.(app, options)
    }
  }
}
