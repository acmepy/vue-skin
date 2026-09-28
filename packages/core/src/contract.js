export { requiredComponents } from './contracts/components.js'
import { requiredComponents } from './contracts/components.js'

export function validateAdapter(adapter) {
  if (!adapter || typeof adapter !== 'object') {
    throw new TypeError('[VueSkin] An adapter object is required.')
  }

  if (!adapter.name || typeof adapter.name !== 'string') {
    throw new TypeError('[VueSkin] Adapter must declare a non-empty "name".')
  }

  if (!adapter.components || typeof adapter.components !== 'object') {
    throw new TypeError(`[VueSkin] Adapter "${adapter.name}" must declare "components".`)
  }

  for (const component of requiredComponents) {
    if (!adapter.components[component]) {
      throw new TypeError(
        `[VueSkin] Adapter "${adapter.name}" does not implement required component "${component}".`
      )
    }
  }

  if (adapter.install && typeof adapter.install !== 'function') {
    throw new TypeError(`[VueSkin] Adapter "${adapter.name}" has an invalid "install" hook.`)
  }

  return adapter
}
