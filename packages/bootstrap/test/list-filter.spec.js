import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createVueSkin } from '@vue-skin/core'
import BootstrapSkin from '../src/index.js'
const bootstrapCss = readFileSync(createRequire(import.meta.url).resolve('bootstrap/dist/css/bootstrap.css'), 'utf8')

let stylesheet
beforeAll(() => {
  stylesheet = document.createElement('style')
  stylesheet.textContent = bootstrapCss
  document.head.append(stylesheet)
})
afterAll(() => stylesheet.remove())

const render = (component) => mount(component, { attachTo: document.body, global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })
const visibleItems = (wrapper) => wrapper.findAll('.list-group-item').filter((item) => getComputedStyle(item.element).display !== 'none')
async function search(wrapper, text) {
  await wrapper.get('input[type="search"]').setValue(text)
  wrapper.get('button[aria-label="Buscar"]').element.click()
  await wrapper.vm.$nextTick()
}

describe('UiList filter', () => {
  it('searches on submit, ignores case and accents, and restores items when cleared', async () => {
    const wrapper = render({ template: '<UiList filter><UiListItem title="María" subtitle="Administración" /><UiListItem title="Luis" subtitle="Ventas" /></UiList>' })
    await wrapper.get('input').setValue('ADMINISTRACION')
    expect(visibleItems(wrapper)).toHaveLength(2)
    await wrapper.get('form').trigger('submit')
    expect(visibleItems(wrapper).map((item) => item.text())).toEqual(['MaríaAdministración'])
    await search(wrapper, 'inexistente')
    expect(visibleItems(wrapper)).toHaveLength(0)
    expect(wrapper.get('[role="status"]').text()).toBe('Sin resultados')
    await wrapper.get('input').setValue('')
    expect(visibleItems(wrapper)).toHaveLength(2)
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('searches trailing values and explicit slot keywords', async () => {
    const wrapper = render({ template: '<UiList filter><UiListItem title="Tarea" badge="Nuevo" /><UiListItem filter-text="perfil Ana"><strong>Contenido personalizado</strong></UiListItem><UiListItem header="Casa" footer="Principal" after="Editar" /></UiList>' })
    for (const [text, expected] of [['nuevo', 'TareaNuevo'], ['ana', 'Contenido personalizado'], ['editar', 'CasaPrincipalEditar']]) {
      await search(wrapper, text)
      expect(visibleItems(wrapper).map((item) => item.text())).toEqual([expected])
    }
    wrapper.unmount()
  })

  it('keeps only group headers with matching children and handles reactive reordering', async () => {
    const wrapper = render({
      data: () => ({ items: [
        { id: 'g1', title: 'Grupo uno', groupTitle: true },
        { id: 'a', title: 'Ana' },
        { id: 'g2', title: 'Grupo dos', groupTitle: true },
        { id: 'b', title: 'Luis' }
      ] }),
      template: '<UiList filter><UiListItem v-for="item in items" :key="item.id" v-bind="item" /></UiList>'
    })
    await search(wrapper, 'Luis')
    expect(visibleItems(wrapper).map((item) => item.text())).toEqual(['Grupo dos', 'Luis'])
    wrapper.vm.items = [wrapper.vm.items[0], wrapper.vm.items[3], wrapper.vm.items[2], wrapper.vm.items[1]]
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(visibleItems(wrapper).map((item) => item.text())).toEqual(['Grupo uno', 'Luis'])
    wrapper.vm.items = wrapper.vm.items.filter((item) => item.id !== 'b')
    await wrapper.vm.$nextTick()
    expect(visibleItems(wrapper)).toHaveLength(0)
    wrapper.unmount()
  })

  it('isolates filters between lists and stops filtering when disabled', async () => {
    const wrapper = render({
      data: () => ({ enabled: true, name: 'Ana' }),
      template: '<div><UiList :filter="enabled"><UiListItem :title="name" /></UiList><UiList><UiListItem title="Luis" /></UiList></div>'
    })
    await search(wrapper, 'Luis')
    expect(visibleItems(wrapper).map((item) => item.text())).toEqual(['Luis'])
    wrapper.vm.name = 'Luis'
    await wrapper.vm.$nextTick()
    expect(visibleItems(wrapper)).toHaveLength(2)
    wrapper.vm.name = 'Ana'
    wrapper.vm.enabled = false
    await wrapper.vm.$nextTick()
    expect(visibleItems(wrapper)).toHaveLength(2)
    expect(wrapper.find('form').exists()).toBe(false)
    wrapper.unmount()
  })
})
