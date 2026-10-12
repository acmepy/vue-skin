import { describe, expect, it } from 'vitest'
import { componentContracts, requiredComponents, validateAdapter } from '../src/index.js'
import { createVueSkin } from '../src/plugin.js'

const components = Object.fromEntries(requiredComponents.map((name) => [name, {}]))

describe('adapter contract', () => {
  it('centralizes the public API names for every required component', () => {
    expect(Object.keys(componentContracts)).toEqual(requiredComponents)
    expect(componentContracts.Modal.props).toEqual(['modelValue', 'title', 'size', 'centered', 'closable'])
    expect(componentContracts.Input.props).toContain('error')
    expect(componentContracts.Container.props).toEqual(['fluid'])
    expect(componentContracts.Row.props).toEqual(['gap'])
    expect(componentContracts.Col.props).toEqual(['span', 'sm', 'md', 'lg', 'xl', 'xxl'])
    expect(componentContracts.DataTable.slots).toContain('actions')
    expect(requiredComponents).toContain('DataTableColumnButton')
    expect(requiredComponents).not.toContain('DataTableButton')
  })

  it('rejects an adapter missing a required component', () => {
    expect(() => validateAdapter({ name: 'incomplete', components: {} }))
      .toThrow('does not implement required component "Button"')
  })

  it('registers each component with the public Ui prefix', () => {
    const registered = new Map()
    const app = {
      component: (name, component) => registered.set(name, component),
      provide: () => {},
      config: { globalProperties: {} }
    }

    createVueSkin({ adapter: { name: 'test', components } }).install(app)

    expect([...registered.keys()]).toEqual([...requiredComponents.map((name) => `Ui${name}`), 'UiDialogHost'])
  })
})
