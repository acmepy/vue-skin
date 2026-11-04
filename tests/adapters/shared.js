import { mount, flushPromises, DOMWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeAll, afterAll, describe, expect, it, vi } from 'vitest'
import { createVueSkin, componentContracts, validateAdapter } from '@vue-skin/core'
import { UiAppLayout } from '@vue-skin/layouts'
import App from '../../playground/src/App.vue'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

export function adapterSuite(adapter, prefix) {
  const wrappers = []
  function render(component, props = {}, slots = {}) {
    const target = document.createElement('div')
    document.body.append(target)
    const previewAdapter = { ...adapter, components: { ...adapter.components, Chart: { props: ['data','type','title','height','options','label'], template: '<figure />' } } }
    const skin = createVueSkin({ adapter: previewAdapter, theme: { persist: false, target } })
    const wrapper = mount(typeof component === 'string' ? { template: component } : component, { props, slots, attachTo: target, global: { plugins: [skin], provide: { playgroundAdapter: adapter.name }, stubs: { UiChart: true } } })
    wrappers.push({ wrapper, target })
    return { wrapper, skin, target }
  }
  const oldShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
  const oldClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
  beforeAll(() => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value() { this.setAttribute('open', '') } })
    Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() { this.removeAttribute('open'); this.dispatchEvent(new Event('close')) } })
  })
  afterAll(() => {
    for (const [key, old] of [['showModal', oldShow], ['close', oldClose]]) {
      if (old) Object.defineProperty(HTMLDialogElement.prototype, key, old)
      else delete HTMLDialogElement.prototype[key]
    }
  })
  afterEach(() => {
    wrappers.splice(0).forEach(({ wrapper, target }) => { wrapper.unmount(); target.remove() })
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  describe(adapter.name + ' public adapter', () => {
    it('implements all public component props and installs independently', () => {
      expect(validateAdapter(adapter)).toBe(adapter)
      for (const [name, contract] of Object.entries(componentContracts)) {
        for (const prop of contract.props) expect(Object.keys(adapter.components[name].props ?? {}), name + '.' + prop).toContain(prop)
      }
    })

    it('renders button slots, loading, disabled links and card sections', async () => {
      const { wrapper } = render('<UiCard title="Perfil"><UiButton class="custom" style="color:red" loading><template #icon>+</template>Guardar</UiButton><UiLink href="/private" disabled>Privado</UiLink><template #list><UiList :filter="false"><UiListItem title="Detalle" /></UiList></template><template #footer>Pie</template></UiCard>')
      expect(wrapper.text()).toContain('Perfil')
      expect(wrapper.text()).toContain('Detalle')
      expect(wrapper.text()).toContain('Pie')
      expect(wrapper.get('button.custom').element.disabled).toBe(true)
      expect(wrapper.get('button.custom').text()).toContain('+')
      expect(wrapper.get('a').attributes('href')).toBeUndefined()
    })

    it('accepts numeric/date input and validates thrown messages on blur', async () => {
      const { wrapper } = render(adapter.components.Input, { type: 'number', modelValue: 0, label: 'Edad', validator: () => { throw new Error('Edad inválida') } })
      await wrapper.get('input').setValue('24')
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([24])
      await wrapper.get('input').trigger('blur')
      await flushPromises()
      expect(wrapper.get('[role="alert"]').text()).toBe('Edad inválida')
      expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
      expect(await wrapper.vm.validate()).toBe(false)
      await wrapper.setProps({ type: 'date', modelValue: '2026-11-04', validator: () => true })
      expect(wrapper.get('input').element.value).toBe('2026-11-04')
      await wrapper.get('input').trigger('blur')
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('supports floating select, checkbox/radio and custom switch values', async () => {
      const { wrapper } = render('<div><UiSelect label="Estado" floating :options="[{value:\'a\',label:\'Activo\'}]" /><UiCheckbox label="Acepto" /><UiRadio label="Plan" value="pro" /><UiSwitch label="Disponible" true-value="yes" false-value="no" /></div>')
      expect(wrapper.get('select').attributes('id')).toBeTruthy()
      expect(wrapper.get('label[for="' + wrapper.get('select').attributes('id') + '"]').text()).toBe('Estado')
      await wrapper.get('input[type="checkbox"]').setValue(true)
      await wrapper.get('input[type="radio"]').setValue(true)
      await wrapper.get('[role="switch"]').setValue(true)
      expect(wrapper.findComponent(adapter.components.Switch).emitted('update:modelValue').at(-1)).toEqual(['yes'])
    })

    it('filters list titles, media, after and badges from the second character', async () => {
      const { wrapper } = render('<UiList><UiListItem title="Álbum" subtitle="Queen" href="#song" :badge="12"><template #media><span>♫</span></template></UiListItem><UiListItem title="Contacto" header="Email" footer="Casa" after="Editar" /></UiList>')
      expect(wrapper.text()).toContain('12')
      expect(wrapper.text()).toContain('♫')
      const search = wrapper.get('input[type="search"]')
      await search.setValue('qu')
      await nextTick()
      const items = wrapper.findAll('[role="listitem"]')
      expect(items[0].isVisible()).toBe(true)
      expect(items[1].isVisible()).toBe(false)
      await search.setValue('q')
      expect(items[1].isVisible()).toBe(true)
      await search.setValue('editar')
      expect(items[0].isVisible()).toBe(false)
      expect(items[1].isVisible()).toBe(true)
    })

    it('filters autocomplete suggestions, selects with keyboard and rejects unmatched values', async () => {
      const { wrapper } = render(adapter.components.Autocomplete, { label: 'Cliente', data: [{label:'Ana Pérez',value:1},{label:'Juan López',value:2}] })
      const input = wrapper.get('input')
      await input.trigger('focus')
      await input.setValue('pé')
      expect(wrapper.findAll('[role="option"]')).toHaveLength(2)
      await input.trigger('keydown', { key:'ArrowDown' })
      await input.trigger('keydown', { key:'Enter' })
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['Ana Pérez'])
      expect(wrapper.emitted('select').at(-1)[0].value).toBe(1)
      await input.setValue('Desconocido')
      await input.trigger('blur')
      await flushPromises()
      expect(wrapper.get('[role="alert"]').text()).not.toBe('')
    })

    it('searches table data and exposes row actions with icon tooltips', async () => {
      const { wrapper } = render('<UiDataTable title="Clientes" :data="[{id:1,name:\'Ana\'},{id:2,name:\'Luis\'}]" :header="{name:{label:\'Nombre\'}}" filter><template #actions><UiButton>Nuevo</UiButton></template><template #detail="{row}"><UiDataTableColumnButton :items="[{label:\'Editar\',icon:\'mdi:pencil\',value:row.id}]" /></template></UiDataTable>')
      await wrapper.get('input[type="search"]').setValue('ana')
      await wrapper.get('form').trigger('submit')
      expect(wrapper.findAll('tbody tr')).toHaveLength(1)
      expect(wrapper.get('tbody').text()).toContain('Ana')
      expect(wrapper.get('tbody button').attributes('title')).toBe('Editar')
      expect(wrapper.text()).toContain('Nuevo')
    })

    it('opens dropdowns, supports keyboard navigation and emits selection', async () => {
      const { wrapper, target } = render(adapter.components.Dropdown, { label:'Opciones', items:[{label:'Editar',value:1},{label:'Deshabilitado',disabled:true},{label:'Documentación',href:'/docs'}] })
      const surface = new DOMWrapper(target)
      await wrapper.get('button').trigger('click')
      expect(surface.findAll('[role="menuitem"]')).toHaveLength(3)
      await surface.get('[role="menuitem"]').trigger('click')
      expect(wrapper.emitted('select').at(-1)[0].value).toBe(1)
      expect(surface.find('[role="menu"]').exists()).toBe(false)
    })

    it('changes tabs with keyboard and preserves ARIA associations', async () => {
      const { wrapper } = render(adapter.components.Tabs, { items:[{id:'a',label:'Uno',content:'Primero'},{id:'b',label:'Dos',content:'Segundo'}] })
      await wrapper.get('[role="tab"]').trigger('keydown', { key:'ArrowRight' })
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['b'])
      const selected = wrapper.get('[aria-selected="true"]')
      expect(document.getElementById(selected.attributes('aria-controls')).hidden).toBe(false)
    })

    it('shares appearance state between modal panel and all switchers', async () => {
      const { wrapper, skin, target } = render('<UiThemeSelector /><UiThemeSwitcher /><UiThemeSwitcher />')
      await wrapper.get('button[aria-label="Apariencia"]').trigger('click')
      for (const [label, mode, action, icon] of [['Oscuro','dark','Activar modo claro','mdi:weather-sunny'],['Claro','light','Activar modo oscuro','mdi:weather-night']]) {
        await wrapper.get(`button[aria-label="${label}"]`).trigger('click')
        expect(skin.theme.resolvedMode.value).toBe(mode)
        for (const button of wrapper.findAll(`button[aria-label="${action}"]`)) expect(button.get('span').classes()).toContain('icon:' + icon)
        expect(target.classList.contains('dark')).toBe(mode === 'dark')
      }
      await wrapper.get('button[aria-label="Verde"]').trigger('click')
      expect(skin.theme.state.color).toBe('green')
    })

    it('keeps shell icon buttons square and reserves space for the selected theme outline', () => {
      const stylesheet = document.createElement('style')
      stylesheet.textContent = readFileSync(createRequire(import.meta.url).resolve('../../packages/' + adapter.name + '/src/styles/integration.css'), 'utf8')
      document.head.append(stylesheet)
      try {
        const { wrapper } = render({ components: { UiAppLayout }, template:'<UiAppLayout title="App"><UiThemeSelector inline /></UiAppLayout>' })
        for (const label of ['Mostrar navegación', 'Activar modo oscuro', 'Apariencia']) {
          expect(getComputedStyle(wrapper.get(`button[aria-label="${label}"]`).element).minHeight).toBe('2rem')
        }
        expect(getComputedStyle(wrapper.get(`.${prefix}-theme-options`).element).paddingLeft).toBe('0.25rem')
      } finally { stylesheet.remove() }
    })

    it('resolves JS confirm/prompt dialogs and closes the blocking preloader', async () => {
      const { wrapper, skin } = render('<UiDialogHost />')
      const confirmed = skin.dialog.confirm('Continuar', 'Confirmación')
      await nextTick()
      await wrapper.get('dialog button[data-tone="primary"]').trigger('click')
      await expect(confirmed).resolves.toBe(true)
      const prompted = skin.dialog.prompt('Nombre', 'Cliente')
      await nextTick()
      await wrapper.get('dialog input').setValue('Ana')
      await wrapper.get('dialog button[data-tone="primary"]').trigger('click')
      await expect(prompted).resolves.toBe('Ana')
      const loading = skin.dialog.preloader('Cargando')
      await nextTick()
      expect(wrapper.find('dialog button[aria-label="Cerrar"]').exists()).toBe(false)
      loading.close()
      await nextTick()
      expect(wrapper.find('dialog').exists()).toBe(false)
    })

    it('hides autohide toasts and emits lifecycle events', async () => {
      vi.useFakeTimers()
      const { wrapper } = render(adapter.components.Toast, { modelValue:true, message:'Guardado', delay:50, autohide:true })
      expect(wrapper.get('[role="status"]').text()).toContain('Guardado')
      await vi.advanceTimersByTimeAsync(50)
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false])
      await wrapper.setProps({ modelValue:false })
      expect(wrapper.find('[role="status"]').exists()).toBe(false)
    })

    it('uses a persistent sidebar above its breakpoint and an overlay below it', async () => {
      const listeners = new Set()
      const media = { matches:true, addEventListener:(name,fn)=>listeners.add(fn), removeEventListener:(name,fn)=>listeners.delete(fn) }
      vi.stubGlobal('matchMedia', () => media)
      const { wrapper } = render(UiAppLayout, { title:'Tablet', header:'Menú', sections:[['home','Inicio']], sidebarWidth:'18rem' })
      expect(wrapper.find(`.${prefix}-sidebar-overlay`).exists()).toBe(false)
      expect(wrapper.get('aside').attributes('style')).toContain('18rem')
      media.matches = false
      listeners.forEach(fn => fn({matches:false}))
      await nextTick()
      expect(wrapper.get('aside').classes()).toContain(`${prefix}-sidebar-overlay`)
      await wrapper.get('aside').trigger('keydown', {key:'Escape'})
      expect(wrapper.get('aside').isVisible()).toBe(false)
    })

    it('renders every shared documentation example with the adapter', async () => {
      const { wrapper } = render(App)
      const ids = wrapper.findAll('aside a[href^="#"]').map(link => link.attributes('href'))
      expect(ids.length).toBeGreaterThan(30)
      for (const href of ids) {
        await wrapper.get(`aside a[href="${href}"]`).trigger('click')
        await flushPromises()
        expect(wrapper.get('main h1').text(), href).not.toBe('')
        expect(wrapper.find(`.${prefix}-tabs`).exists(), href).toBe(true)
      }
    })
  })
}
