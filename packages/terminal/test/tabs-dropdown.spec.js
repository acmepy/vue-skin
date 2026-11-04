import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createVueSkin } from '@vue-skin/core'
import Terminal from '../src/index.js'

const require = createRequire(import.meta.url)
const vendor = readFileSync(require.resolve('../src/styles/vendor/terminal.css'), 'utf8')
const integration = readFileSync(require.resolve('../src/styles/integration.css'), 'utf8')
let wrapper, target, stylesheet
afterEach(() => { wrapper?.unmount(); target?.remove(); stylesheet?.remove() })

describe('Terminal dropdown inside documentation tabs', () => {
  it('keeps native tab scrolling on the tablist without clipping a menu in the panel', async () => {
    stylesheet = document.createElement('style')
    stylesheet.textContent = vendor + integration
    document.head.append(stylesheet)
    target = document.createElement('div')
    document.body.append(target)
    const skin = createVueSkin({ adapter:Terminal, theme:{persist:false,target} })
    wrapper = mount({ template:`
      <UiTabs :items="[{ id:'preview', label:'Ejemplo' }, { id:'code', label:'Código' }]">
        <template #panel><UiCard title="Dropdown"><UiDropdown label="Acciones" :items="[{label:'Editar'},{label:'Duplicar'},{label:'Eliminar'}]" /></UiCard></template>
      </UiTabs>` }, { attachTo:target, global:{plugins:[skin]} })
    const panel = wrapper.get('[role="tabpanel"]')
    await panel.get('button[aria-haspopup="menu"]').trigger('click')
    const menu = panel.get('[role="menu"]')
    const tablist = wrapper.get('[role="tablist"]')
    expect(tablist.classes()).toContain('tabs')
    expect(getComputedStyle(tablist.element).overflowX).toBe('auto')
    expect(menu.element.closest('.tabs')).toBeNull()
    expect(wrapper.classes()).not.toContain('tabs')
    for (let parent = menu.element.parentElement; parent && parent !== target; parent = parent.parentElement) {
      const style = getComputedStyle(parent)
      for (const axis of ['overflow','overflowX','overflowY']) {
        expect(['hidden','auto','scroll','clip'], parent.className + ': ' + axis).not.toContain(style[axis])
      }
    }
    expect(getComputedStyle(panel.get('.tc-card').element).overflow).toBe('visible')
    expect(getComputedStyle(menu.element).position).toBe('absolute')
  })
})
