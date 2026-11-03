import { requiredComponents, validateAdapter } from './contract.js'
import { createDialogService } from './dialog.js'
import { createThemeService, themeKey } from './theme.js'

export function createVueSkin({ adapter, theme: themeOptions } = {}) {
  const validAdapter = validateAdapter(adapter)
  const dialog = createDialogService(validAdapter)
  const theme = createThemeService(validAdapter, themeOptions)

  return {
    dialog,
    theme,
    install(app, options = {}) {
      for (const component of requiredComponents) {
        app.component(`Ui${component}`, validAdapter.components[component])
      }

      app.component('UiDialogHost', dialog.Host)
      app.provide('uiDialog', dialog)
      app.config.globalProperties.$uiDialog = dialog
      app.provide(themeKey, theme)
      theme.start()
      app.onUnmount?.(() => theme.stop())

      validAdapter.install?.(app, options)
    }
  }
}
