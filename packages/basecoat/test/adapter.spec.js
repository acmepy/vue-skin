import { mount, flushPromises, DOMWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeAll, afterAll, describe, expect, it, vi } from 'vitest'
import { createVueSkin, requiredComponents, componentContracts, validateAdapter } from '@vue-skin/core'
import Basecoat from '../src/index.js'
import { UiAppLayout, UiDashboard, UiLogin } from '@vue-skin/layouts'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const integrationCss = readFileSync(createRequire(import.meta.url).resolve('../src/styles/integration.css'), 'utf8')

const wrappers = []
function render(component, props = {}, slots = {}) {
  const target = document.createElement('div')
  document.body.append(target)
  const skin = createVueSkin({ adapter: Basecoat, theme: { persist: false, target } })
  const wrapper = mount(typeof component === 'string' ? { template: component } : component, { props, slots, attachTo: target, global: { plugins: [skin], stubs: { UiChart: true } } })
  wrappers.push({ wrapper, target })
  return { wrapper, skin }
}
const showBefore = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const closeBefore = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value() { this.setAttribute('open', '') } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() { this.removeAttribute('open'); this.dispatchEvent(new Event('close')) } })
})
afterAll(() => {
  for (const [key, descriptor] of [['showModal', showBefore], ['close', closeBefore]]) {
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, key, descriptor)
    else delete HTMLDialogElement.prototype[key]
  }
})
afterEach(() => { wrappers.splice(0).forEach(({ wrapper, target }) => { wrapper.unmount(); target.remove() }); vi.restoreAllMocks(); vi.unstubAllGlobals() })

describe('Basecoat adapter contract', () => {
  it('implements and registers every required public component and prop', () => {
    expect(validateAdapter(Basecoat)).toBe(Basecoat)
    expect(Object.keys(Basecoat.components).sort()).toEqual([...requiredComponents].sort())
    for (const name of requiredComponents) {
      const declared = Object.keys(Basecoat.components[name].props ?? {})
      for (const prop of componentContracts[name].props) expect(declared, `${name}.${prop}`).toContain(prop)
    }
  })

  it('uses Basecoat button/card markup, supports slots, attributes, loading and disabled links', async () => {
    const { wrapper } = render('<UiCard title="Perfil"><UiButton class="custom" style="color: red" loading>Guardar</UiButton><UiLink href="/private" disabled>Enlace</UiLink><template #footer>Pie</template></UiCard>')
    expect(wrapper.get('.card > header h2').text()).toBe('Perfil')
    expect(wrapper.get('button').classes()).toContain('custom')
    expect(wrapper.get('button').attributes('data-variant')).toBe('primary')
    expect(wrapper.get('button').attributes('style')).toContain('color: red')
    expect(wrapper.get('button').element.disabled).toBe(true)
    expect(wrapper.get('a').attributes('href')).toBeUndefined()
    expect(wrapper.get('a').attributes('aria-disabled')).toBe('true')
    expect(wrapper.get('footer').text()).toBe('Pie')
  })

  it('binds native numeric/date inputs and propagates classes to the input instead of its field', async () => {
    const { wrapper } = render(Basecoat.components.Input, { modelValue: '', type: 'number', label: 'Edad' })
    await wrapper.get('input').setValue('24')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([24])
    await wrapper.setProps({ type: 'date', modelValue: '2026-11-03' })
    expect(wrapper.get('input').element.value).toBe('2026-11-03')
    await wrapper.get('input').setValue('2026-12-01')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['2026-12-01'])
  })

  it('preserves native button foreground/background contrast for links styled as buttons', () => {
    const stylesheet = document.createElement('style')
    stylesheet.textContent = '.btn { background-color:rgb(37,99,235); color:rgb(255,255,255); text-decoration:none; }' + integrationCss
    document.head.append(stylesheet)
    try {
      const { wrapper } = render('<div><UiLink href="?layout=app-layout" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Abrir layout en nueva pestaña</UiLink><UiLink href="#normal">Enlace normal</UiLink></div>')
      const button = wrapper.get('a.btn')
      expect(getComputedStyle(button.element).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(button.element).backgroundColor).toBe('rgb(37, 99, 235)')
      expect(button.element.matches('.bc-link:not(.btn)')).toBe(false)
      expect(wrapper.get('a[href="#normal"]').element.matches('.bc-link:not(.btn)')).toBe(true)
      expect(button.attributes('target')).toBe('_blank')
      expect(button.text()).toBe('Abrir layout en nueva pestaña')
    } finally { stylesheet.remove() }
  })

  it('validates on blur, exposes validate and associates help/error/tooltip with the field', async () => {
    const validator = vi.fn().mockRejectedValue(new Error('Mínimo tres caracteres'))
    const { wrapper } = render(Basecoat.components.Input, { label: 'Nombre', modelValue: 'A', validator, help: 'Ayuda', tooltip: 'Información adicional' })
    await wrapper.get('input').trigger('blur')
    await flushPromises()
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('label').attributes('title')).toBe('Información adicional')
    expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('input').attributes('id'))
    expect(wrapper.get('input').attributes('aria-describedby')).toContain(wrapper.get('.bc-error').attributes('id'))
    expect(wrapper.get('.bc-error').text()).toBe('Mínimo tres caracteres')
    validator.mockResolvedValue(true)
    expect(await wrapper.vm.validate()).toBe(true)
    await wrapper.setProps({ error: 'Error externo' })
    expect(wrapper.get('.bc-error').text()).toBe('Error externo')
  })

  it('supports native selects, floating labels, input groups and textarea events', async () => {
    const { wrapper } = render('<div><UiInput label="Correo" floating /><UiSelect label="Rol" floating :options="[{value:\'a\',label:\'Admin\'}]" /><UiInputGroup label="Importe" prefix="$"><template #suffix><UiButton>Aplicar</UiButton></template></UiInputGroup><UiTextarea label="Notas" /></div>')
    expect(wrapper.findAll('.bc-floating')).toHaveLength(2)
    expect(wrapper.get('.bc-floating input').attributes('placeholder')).toBe('Correo')
    expect(wrapper.get('.bc-input-addon').text()).toBe('$')
    expect(wrapper.get('.bc-input-group button').text()).toBe('Aplicar')
    await wrapper.get('select').setValue('a')
    await wrapper.get('textarea').setValue('Notas de prueba')
    expect(wrapper.get('textarea').element.value).toBe('Notas de prueba')
  })

  it.each(['Checkbox','Switch','Radio'])('binds %s and uses native accessible controls', async name => {
    const props = name === 'Radio' ? { modelValue: 'a', value: 'b' } : { modelValue: false }
    const { wrapper } = render(Basecoat.components[name], { ...props, label: 'Control', help: 'Ayuda' })
    await wrapper.get('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([name === 'Radio' ? 'b' : true])
    expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('input').attributes('id'))
    if (name === 'Switch') expect(wrapper.get('input').attributes('role')).toBe('switch')
  })

  it('filters lists from two characters and keeps only matching groups with accent-insensitive search', async () => {
    const { wrapper } = render('<UiList><UiListItem group-title title="Personas" /><UiListItem title="María" /><UiListItem group-title title="Música" /><UiListItem title="Queen" subtitle="Rock" badge="2" href="#queen" /></UiList>')
    const visible = () => wrapper.findAll('.bc-list-items > *').filter(item => item.element.style.display !== 'none')
    await wrapper.get('input').setValue('m')
    expect(visible()).toHaveLength(4)
    await wrapper.get('input').setValue('MARIA')
    expect(visible().map(item => item.text())).toEqual(['Personas','María'])
    await wrapper.get('input').setValue('rock')
    expect(visible().at(-1).text()).toContain('Queen')
    expect(visible().at(-1).find('.badge').text()).toBe('2')
    await wrapper.get('input').setValue('missing')
    expect(wrapper.get('[role="status"]').text()).toBe('Sin resultados')
    await wrapper.get('input').setValue('')
    expect(visible()).toHaveLength(4)
  })

  it('filters and selects autocomplete options by keyboard and validates against the dataset on blur', async () => {
    const { wrapper } = render(Basecoat.components.Autocomplete, { label: 'Cliente', data: [{ label: 'Cliente 001', value: 1 }, { label: 'Cliente 002', value: 2 }] })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('cl')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(2)
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')[0][0]).toEqual({ label: 'Cliente 001', value: 1 })
    await input.setValue('Cliente 00')
    await input.trigger('blur')
    expect(wrapper.get('.bc-error').text()).toContain('Seleccione una opción')
    await input.setValue('Cliente 002')
    expect(await wrapper.vm.validate()).toBe(true)
  })

  it('provides table actions, filters on submit and passes the filtered row to column actions', async () => {
    const { wrapper } = render('<UiDataTable :data="[{id:1,name:\'Ana\'},{id:2,name:\'Luis\'}]" filter><template #actions="{data,total}"><UiButton>Exportar {{data.length}}/{{total}}</UiButton></template><template #detail="{row}"><UiDataTableColumnButton :items="[{label:\'Editar \' + row.name,value:row.id}]" /></template></UiDataTable>')
    expect(wrapper.get('.bc-table-actions button').element.closest('form')).toBeNull()
    await wrapper.get('input').setValue('Luis')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    await wrapper.get('form').trigger('submit')
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.get('.bc-table-actions button').text()).toBe('Exportar 1/2')
    expect(wrapper.get('tbody button').attributes('title')).toBe('Editar Luis')
  })

  it('renders grouped icon actions with labels as tooltips', async () => {
    const { wrapper } = render(Basecoat.components.DataTableColumnButton, { items: [{ label: 'Editar', icon: 'mdi:pencil', value: 1 }] })
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.get('button').text()).toBe('')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Editar')
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('select')[0][0].value).toBe(1)
  })

  it('uses native dialogs with controlled visibility, semantic lifecycle and blocked preloader dismissal', async () => {
    const { wrapper } = render(Basecoat.components.Modal, { modelValue: true, title: 'Título', closable: false })
    expect(wrapper.get('dialog').element.open).toBe(true)
    const cancel = new Event('cancel', { cancelable: true })
    wrapper.get('dialog').element.dispatchEvent(cancel)
    expect(cancel.defaultPrevented).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.get('dialog').element.open).toBe(false)
    expect(wrapper.emitted('closed')).toHaveLength(1)
  })

  it.each(['info','success','warning','error'])('colors the entire %s header including its padding without coloring the body', type => {
    const stylesheet = document.createElement('style')
    stylesheet.textContent = '.bc-modal-content { padding:1.5rem; gap:1.5rem; }' + integrationCss
    document.head.append(stylesheet)
    try {
      const { wrapper } = render(Basecoat.components.Dialog, { type, title:'Título', message:'Mensaje de prueba' })
      const content = wrapper.get('article')
      const header = wrapper.get('article > header')
      expect(content.classes()).toContain('bc-modal-toned')
      expect(getComputedStyle(content.element).padding).toBe('0px')
      expect(getComputedStyle(content.element).gap).toBe('0')
      expect(getComputedStyle(header.element).width).toBe('100%')
      expect(getComputedStyle(header.element).minHeight).toBe('3.5rem')
      expect(getComputedStyle(header.element).paddingTop).toBe('1rem')
      expect(getComputedStyle(header.element).paddingBottom).toBe('1rem')
      expect(header.attributes('data-tone')).toBe(type === 'error' ? 'danger' : type)
      expect(wrapper.get('article > section').text()).toBe('Mensaje de prueba')
      expect(wrapper.get('article > section').attributes('data-tone')).toBeUndefined()
      expect(getComputedStyle(wrapper.get('article > section').element).padding).toBe('1.5rem')
      const plain = render(Basecoat.components.Modal, { title:'Modal normal' }).wrapper
      expect(plain.get('article').classes()).not.toContain('bc-modal-toned')
      expect(getComputedStyle(plain.get('article').element).padding).toBe('1.5rem')
    } finally { stylesheet.remove() }
  })

  it.each(['alert','info','success','warning','error','confirm'])('supports the %s dialog service from JavaScript', async type => {
    const { wrapper, skin } = render('<UiDialogHost />')
    const result = skin.dialog[type]('Mensaje', 'Título')
    await nextTick()
    expect(wrapper.get('dialog').element.open).toBe(true)
    expect(wrapper.get('dialog').text()).toContain('Mensaje')
    const buttons = wrapper.findAll('dialog footer button')
    await buttons.at(-1).trigger('click')
    await expect(result).resolves.toBe(type === 'confirm' ? true : undefined)
  })

  it('hides preloaders from JS and returns prompt text', async () => {
    const { wrapper, skin } = render('<UiDialogHost />')
    const handle = skin.dialog.preloader('Procesando')
    await nextTick()
    expect(wrapper.find('dialog header').exists()).toBe(false)
    handle.close()
    await nextTick(); await nextTick()
    expect(wrapper.find('dialog').exists()).toBe(false)
    const result = skin.dialog.prompt('Nombre', 'Proyecto', { label: 'Nombre', initialValue: 'Vue' })
    await nextTick()
    await wrapper.get('dialog input').setValue('Basecoat')
    await wrapper.findAll('dialog footer button').at(-1).trigger('click')
    await expect(result).resolves.toBe('Basecoat')
  })

  it('opens menus by keyboard, skips disabled items and emits the original selected option', async () => {
    const items = [{ label: 'Uno', value: 1 }, { label: 'No', disabled: true }, { label: 'Dos', value: 2 }]
    const { wrapper } = render(Basecoat.components.Dropdown, { label: 'Acciones', items })
    const surface = new DOMWrapper(wrapper.element.closest('[data-ui-basecoat]'))
    await wrapper.get('button').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.get('button[aria-haspopup]').attributes('aria-expanded')).toBe('true')
    expect(document.activeElement.textContent).toBe('Dos')
    await surface.findAll('[role="menuitem"]').at(-1).trigger('click')
    expect(wrapper.emitted('select')[0][0]).toEqual(items[2])
    expect(surface.find('[role="menu"]').exists()).toBe(false)
  })

  it('supports tabs, keyboard navigation and disabled tabs', async () => {
    const { wrapper } = render(Basecoat.components.Tabs, { modelValue: 'a', items: [{ id:'a',label:'Uno' }, { id:'b',label:'No',disabled:true }, { id:'c',label:'Tres' }] })
    await wrapper.get('[role="tab"]').trigger('keydown', { key:'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['c'])
    await wrapper.setProps({ modelValue:'c' })
    expect(wrapper.findAll('[role="tabpanel"]').filter(panel => !panel.element.hidden)).toHaveLength(1)
    expect(wrapper.findAll('[role="tab"]')[1].element.disabled).toBe(true)
  })

  it('renders native accordion details and emits toggles', async () => {
    const { wrapper } = render(Basecoat.components.Accordion, { items:[{id:'a',title:'Primero',content:'Contenido'}] })
    wrapper.get('details').element.open = true
    await wrapper.get('details').trigger('toggle')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['a'])
  })

  it('autohides toasts and stops timers on unmount', async () => {
    vi.useFakeTimers()
    const { wrapper } = render(Basecoat.components.Toast, { modelValue:true, message:'Mensaje', delay:100 })
    await vi.advanceTimersByTimeAsync(100)
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
    vi.useRealTimers()
  })

  it.each([
    ['primary','color-mix(in srgb,var(--primary) 10%,var(--background))','var(--foreground)'],
    ['secondary','color-mix(in srgb,#71717a 10%,var(--background))','var(--foreground)'],
    ['success','color-mix(in srgb,var(--bc-tone) 10%,var(--background))','var(--bc-tone)'],
    ['danger','color-mix(in srgb,var(--destructive) 14%,var(--background))','var(--destructive)'],
    ['warning','color-mix(in srgb,var(--bc-tone) 10%,var(--background))','var(--bc-tone)'],
    ['info','color-mix(in srgb,var(--bc-tone) 10%,var(--background))','var(--bc-tone)'],
    ['light','color-mix(in srgb,#f4f4f5 10%,var(--background))','var(--foreground)'],
    ['dark','color-mix(in srgb,var(--foreground) 14%,var(--background))','var(--foreground)']
  ])('applies the %s toast background and readable foreground to the visible content', (variant, background, foreground) => {
    const stylesheet = document.createElement('style')
    stylesheet.textContent = integrationCss
    document.head.append(stylesheet)
    try {
      const { wrapper } = render(Basecoat.components.Toast, { modelValue:true, variant, title:'Título', autohide:false }, { default:'<p>Mensaje personalizado</p>' })
      const toast = wrapper.get('.bc-toast')
      expect(getComputedStyle(toast.element).getPropertyValue('--bc-toast-bg').trim()).toBe(background)
      expect(getComputedStyle(toast.element).getPropertyValue('--bc-toast-fg').trim()).toBe(foreground)
      const visible = wrapper.get('.toast-content')
      expect(visible.element.parentElement).toBe(toast.element)
      const rule = [...stylesheet.sheet.cssRules].find(rule => rule.selectorText === '.bc-toast[data-tone] > .toast-content')
      expect(visible.element.matches(rule.selectorText)).toBe(true)
      expect(rule.style.background).toBe('var(--bc-toast-bg, var(--popover))')
      expect(rule.style.color).toBe('var(--bc-toast-fg, var(--popover-foreground))')
      expect(visible.text()).toContain('Título')
      expect(visible.text()).toContain('Mensaje personalizado')
      expect(visible.get('button').attributes('aria-label')).toBe('Cerrar')
    } finally { stylesheet.remove() }
  })

  it('updates toast variants reactively and keeps the normal background when the variant is absent', async () => {
    const stylesheet = document.createElement('style')
    stylesheet.textContent = '.toast-content { background-color:rgb(255,255,255); }' + integrationCss
    document.head.append(stylesheet)
    try {
      const { wrapper } = render(Basecoat.components.Toast, { modelValue:true, message:'Mensaje', autohide:false })
      expect(wrapper.get('.bc-toast').attributes('data-tone')).toBeUndefined()
      expect(getComputedStyle(wrapper.get('.toast-content').element).backgroundColor).toBe('rgb(255, 255, 255)')
      await wrapper.setProps({ variant:'warning' })
      expect(getComputedStyle(wrapper.get('.bc-toast').element).getPropertyValue('--bc-toast-bg').trim()).toBe('color-mix(in srgb,var(--bc-tone) 10%,var(--background))')
      await wrapper.setProps({ variant:'danger' })
      expect(getComputedStyle(wrapper.get('.bc-toast').element).getPropertyValue('--bc-toast-bg').trim()).toBe('color-mix(in srgb,var(--destructive) 14%,var(--background))')
      await wrapper.setProps({ variant:undefined })
      expect(getComputedStyle(wrapper.get('.toast-content').element).backgroundColor).toBe('rgb(255, 255, 255)')
    } finally { stylesheet.remove() }
  })

  it('keeps toast tints soft and uses brighter semantic text in dark mode', async () => {
    const stylesheet = document.createElement('style')
    stylesheet.textContent = integrationCss
    document.head.append(stylesheet)
    try {
      const { wrapper, skin } = render(Basecoat.components.Toast, { modelValue:true, variant:'success', autohide:false })
      const toast = wrapper.get('.bc-toast').element
      skin.theme.setMode('dark')
      await nextTick()
      expect(getComputedStyle(toast).getPropertyValue('--bc-toast-fg').trim()).toBe('#4ade80')
      await wrapper.setProps({ variant:'warning' })
      expect(getComputedStyle(toast).getPropertyValue('--bc-toast-fg').trim()).toBe('#facc15')
      await wrapper.setProps({ variant:'info' })
      expect(getComputedStyle(toast).getPropertyValue('--bc-toast-fg').trim()).toBe('#38bdf8')
      expect(getComputedStyle(toast).getPropertyValue('--bc-toast-bg').trim()).toContain('10%,var(--background)')
    } finally { stylesheet.remove() }
  })

  it('renders CSS grid widths, native theme controls and generic layouts', async () => {
    const { wrapper, skin } = render('<div><UiContainer fluid><UiRow gap="lg"><UiCol span="12" md="6">Columna</UiCol></UiRow></UiContainer><UiThemeSelector inline /><UiThemeSwitcher /></div>')
    expect(wrapper.get('.bc-col').classes()).toContain('bc-col-md-6')
    await wrapper.get('button[aria-label="Oscuro"]').trigger('click')
    expect(skin.theme.state.mode).toBe('dark')
    await wrapper.get('button[aria-label="Violeta"]').trigger('click')
    expect(skin.theme.state.color).toBe('purple')
    const layout = render(UiAppLayout, { title:'App', header:'Menú', sidebarWidth:'18rem', sections:[['home','Inicio']] })
    expect(layout.wrapper.get('nav.bc-navbar').text()).toContain('App')
    expect(layout.wrapper.get('aside').attributes('style')).toContain('18rem')
    const login = render(UiLogin)
    expect(login.wrapper.findAll('input')).toHaveLength(3)
    const dashboard = render(UiDashboard, { summary:[{id:'sales',label:'Ventas',value:10}], tables:[{id:'clients',data:[{name:'Ana'}]}] })
    expect(dashboard.wrapper.text()).toContain('Ventas')
    expect(dashboard.wrapper.get('table').text()).toContain('Ana')
  })

  it('switches sidebar modes, locks mobile scrolling, closes on Escape and cleans up', async () => {
    const listeners = new Set()
    const media = { matches: true, addEventListener: (event, fn) => listeners.add(fn), removeEventListener: (event,fn) => listeners.delete(fn) }
    vi.stubGlobal('matchMedia', () => media)
    const previousOverflow = document.body.style.overflow
    const { wrapper } = render(Basecoat.components.Sidebar, { modelValue: true, width: '18rem' }, { header: 'Menú', default: '<button>Inicio</button>', footer: 'Pie' })
    expect(wrapper.find('aside.bc-sidebar-overlay').exists()).toBe(false)
    expect(wrapper.get('header').text()).toBe('Menú')
    media.matches = false
    listeners.forEach(fn => fn({ matches: false }))
    await nextTick()
    expect(wrapper.classes()).toContain('bc-sidebar-overlay')
    expect(document.body.style.overflow).toBe('hidden')
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false])
    await wrapper.setProps({ modelValue: false })
    expect(document.body.style.overflow).toBe(previousOverflow)
    wrapper.unmount()
    expect(listeners.size).toBe(0)
  })

  it('opens the palette modal and keeps monochrome, vibrant and effective mode synchronized', async () => {
    const { wrapper, skin } = render('<UiThemeSelector /><UiThemeSwitcher />')
    await wrapper.get('button[aria-label="Apariencia"]').trigger('click')
    expect(wrapper.get('dialog').element.open).toBe(true)
    expect(wrapper.get('dialog article').classes()).toContain('bc-modal-sm')
    await wrapper.get('dialog button[aria-label="Oscuro"]').trigger('click')
    await wrapper.get('dialog button[aria-label="Verde"]').trigger('click')
    await wrapper.findAll('dialog [role="switch"]')[0].setValue(true)
    await wrapper.findAll('dialog [role="switch"]')[1].setValue(false)
    expect(skin.theme.state).toEqual({ mode:'dark',color:'green',vibrant:true,monochrome:false })
    await wrapper.get('dialog button[aria-label="Cerrar"]').trigger('click')
    expect(wrapper.find('dialog').exists()).toBe(false)
    expect(wrapper.get('button[aria-label="Activar modo claro"]').exists()).toBe(true)
  })

  it('keeps every switcher icon synchronized with modal choices in both directions', async () => {
    const { wrapper, skin } = render('<UiThemeSelector /><UiThemeSwitcher /><UiThemeSwitcher />')
    await wrapper.get('button[aria-label="Apariencia"]').trigger('click')
    for (const [label, mode, action, icon] of [
      ['Oscuro', 'dark', 'Activar modo claro', 'mdi:weather-sunny'],
      ['Claro', 'light', 'Activar modo oscuro', 'mdi:weather-night'],
      ['Oscuro', 'dark', 'Activar modo claro', 'mdi:weather-sunny']
    ]) {
      await wrapper.get(`dialog button[aria-label="${label}"]`).trigger('click')
      expect(skin.theme.resolvedMode.value).toBe(mode)
      const switches = wrapper.findAll(`button[aria-label="${action}"]`)
      expect(switches).toHaveLength(2)
      for (const button of switches) {
        expect(button.attributes('aria-pressed')).toBe(String(mode === 'dark'))
        expect(button.get('span').classes()).toContain(`icon:${icon}`)
      }
    }
    await wrapper.get('button[aria-label="Activar modo claro"]').trigger('click')
    expect(wrapper.get('dialog button[aria-label="Claro"]').attributes('aria-pressed')).toBe('true')
  })

  it('reserves space for selection outlines inside the scrollable appearance panel', () => {
    const stylesheet = document.createElement('style')
    stylesheet.textContent = integrationCss
    document.head.append(stylesheet)
    try {
      const { wrapper } = render('<UiThemeSelector inline />')
      const options = wrapper.get('.bc-theme-options').element
      expect(getComputedStyle(options).paddingLeft).toBe('0.25rem')
      expect(getComputedStyle(options).paddingRight).toBe('0.25rem')
    } finally { stylesheet.remove() }
  })
})
