import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVueSkin } from '@vue-skin/core'
import BootstrapSkin from '../src/index.js'

describe('Bootstrap adapter', () => {
  it('satisfies and installs the Vue Skin contract', () => {
    const wrapper = mount({ template: '<UiButton>Guardar</UiButton>' }, {
      global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] }
    })

    expect(wrapper.get('button').classes()).toContain('btn-primary')
    expect(wrapper.text()).toContain('Guardar')
  })

  it('binds input v-model and exposes validation accessibility', async () => {
    const wrapper = mount({
      data: () => ({ value: '' }),
      template: '<UiInput v-model="value" label="Nombre" help="Ayuda" error="Requerido" />'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    const input = wrapper.get('input')
    await input.setValue('Ada')

    expect(wrapper.vm.value).toBe('Ada')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toContain('-help')
    expect(wrapper.text()).toContain('Requerido')
  })

  it('exposes async validate and renders a validator error', async () => {
    const wrapper = mount({
      data: () => ({ value: '' }),
      methods: { validateName(value) { return value.length >= 3 || 'Ingrese al menos tres caracteres' } },
      template: '<UiInput ref="field" v-model="value" :validator="validateName" />'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    expect(await wrapper.vm.$refs.field.validate()).toBe(false)
    expect(wrapper.text()).toContain('Ingrese al menos tres caracteres')
    await wrapper.get('input').setValue('Ada')
    expect(await wrapper.vm.$refs.field.validate()).toBe(true)
  })

  it('emits numbers as numbers and keeps native dates as YYYY-MM-DD strings', async () => {
    const wrapper = mount({
      data: () => ({ amount: null, birthDate: '' }),
      template: '<div><UiInput v-model="amount" type="number" /><UiInput v-model="birthDate" type="date" /></div>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    const [amount, birthDate] = wrapper.findAll('input')
    await amount.setValue('42')
    await birthDate.setValue('2000-01-15')

    expect(wrapper.vm.amount).toBe(42)
    expect(wrapper.vm.birthDate).toBe('2000-01-15')
  })

  it('renders input groups with prefix and suffix slots', async () => {
    const wrapper = mount({
      data: () => ({ amount: '' }),
      template: '<UiInputGroup v-model="amount" prefix="$"><template #suffix><UiButton>Aplicar</UiButton></template></UiInputGroup>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    await wrapper.get('input').setValue('25')
    expect(wrapper.vm.amount).toBe('25')
    expect(wrapper.get('.input-group-text').text()).toBe('$')
    expect(wrapper.get('button').text()).toBe('Aplicar')
  })

  it('closes a sidebar from a button in its default slot', async () => {
    const wrapper = mount({
      data: () => ({ open: true }),
      template: `
        <UiSidebar v-model="open">
          <UiButton data-test="close" @click="open = false">Cerrar</UiButton>
        </UiSidebar>
      `
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    await wrapper.get('[data-test="close"]').trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(wrapper.vm.open).toBe(false)
    expect(wrapper.get('aside').classes()).not.toContain('show')
    wrapper.unmount()
  })

  it('uses a responsive Bootstrap offcanvas that participates in desktop layout', async () => {
    const originalMatchMedia = window.matchMedia
    window.matchMedia = () => ({ matches: true })
    const wrapper = mount({
      data: () => ({ open: true }),
      template: '<UiSidebar v-model="open" breakpoint="xl">Navegación</UiSidebar>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    expect(wrapper.get('aside').classes()).toEqual(expect.arrayContaining(['offcanvas-xl', 'd-xl-flex']))
    wrapper.vm.open = false
    await wrapper.vm.$nextTick()
    expect(wrapper.get('aside').classes()).toContain('d-xl-none')
    expect(wrapper.get('.ui-sidebar-body').classes()).toContain('offcanvas-body')
    wrapper.unmount()
    window.matchMedia = originalMatchMedia
  })

  it('renders the prompt dialog with the normalized input API', () => {
    const wrapper = mount({
      template: '<UiDialog :model-value="false" type="prompt" title="Renombrar" label="Nombre" input-value="Vue Skin" />'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    expect(wrapper.get('.modal-title').text()).toBe('Renombrar')
    expect(wrapper.get('input').element.value).toBe('Vue Skin')
    expect(wrapper.text()).toContain('Cancelar')
    wrapper.unmount()
  })

  it('syncs a modal with v-model and disposes it on unmount', async () => {
    const wrapper = mount({
      data: () => ({ open: true }),
      template: '<UiModal v-model="open" title="Ejemplo">Contenido</UiModal>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(wrapper.get('.modal').classes()).toContain('show')
    await wrapper.get('.btn-close').trigger('click')
    expect(wrapper.vm.open).toBe(false)
    wrapper.unmount()
    await new Promise((resolve) => setTimeout(resolve, 350))
    expect(document.querySelector('.modal-backdrop')).toBeNull()
  })

  it('renders Bootstrap utility components through their normalized API', () => {
    const wrapper = mount({
      data: () => ({ open: 'one', toastOpen: false }),
      template: `
        <div>
          <UiButtonGroup size="sm"><UiButton>Uno</UiButton></UiButtonGroup>
          <UiBadge variant="success" pill>Activo</UiBadge>
          <UiAccordion v-model="open" :items="[{ id: 'one', title: 'Uno', content: 'Contenido' }]" />
          <UiToast v-model="toastOpen" title="Estado" message="Correcto" />
        </div>
      `
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    expect(wrapper.get('.btn-group').classes()).toContain('btn-group-sm')
    expect(wrapper.get('.badge').classes()).toEqual(expect.arrayContaining(['text-bg-success', 'rounded-pill']))
    expect(wrapper.get('.accordion-button').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('.toast-body').text()).toBe('Correcto')
    wrapper.unmount()
  })

  it('renders a linked list item with media and trailing content', () => {
    const wrapper = mount({
      template: `
        <UiList title="Songs">
          <UiListItem href="#song" title="Yellow Submarine" subtitle="Beatles" text="Descripción" after="$15" badge="3">
            <template #media><img alt="Portada" src="cover.jpg"></template>
          </UiListItem>
        </UiList>
      `
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    expect(wrapper.get('.list-group-item').attributes('href')).toBe('#song')
    expect(wrapper.get('img').attributes('alt')).toBe('Portada')
    expect(wrapper.text()).toContain('Yellow Submarine')
    expect(wrapper.get('.badge').text()).toBe('3')
    expect(wrapper.text()).not.toContain('$15')
  })

  it('uses a badge in the trailing position instead of after text', () => {
    const wrapper = mount({
      template: '<UiList><UiListItem title="Tarea" after="Editar" badge="Nuevo" badge-variant="success" /></UiList>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    expect(wrapper.get('.badge').text()).toBe('Nuevo')
    expect(wrapper.text()).not.toContain('Editar')
  })

  it('renders a title-only list item with normal text weight', () => {
    const wrapper = mount({
      template: '<UiList><UiListItem title="Texto normal" /><UiListItem title="Título con detalle" subtitle="Detalle" /></UiList>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    expect(wrapper.get('.list-group-item > div > div').classes()).not.toContain('fw-semibold')
    expect(wrapper.findAll('.list-group-item > div > div')[1].classes()).toContain('fw-semibold')
  })

  it('supports list headers, footers, group titles and disabled links', async () => {
    const wrapper = mount({
      data: () => ({ clicks: 0 }),
      template: `
        <div>
          <UiList><UiListItem header="Email" title="john@doe" footer="Home" /><UiListItem group-title title="Grupo" /></UiList>
          <UiLink data-test="link" href="#blocked" disabled @click="clicks++">Bloqueado</UiLink>
        </div>
      `
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    await wrapper.get('[data-test="link"]').trigger('click')

    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.get('[role="heading"]').text()).toBe('Grupo')
    expect(wrapper.vm.clicks).toBe(0)
  })

  it('renders a card list slot without a padded card body', () => {
    const wrapper = mount({
      template: '<UiCard title="Configuración"><template #list><UiList :bordered="false"><UiListItem title="Perfil" /></UiList></template></UiCard>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    expect(wrapper.find('.card-body').exists()).toBe(false)
    expect(wrapper.get('.list-group').classes()).toContain('list-group-flush')
  })

  it('emits the selected dropdown item', async () => {
    const wrapper = mount({
      data: () => ({ selected: null }),
      template: '<UiDropdown :items="[{ label: \'Editar\', value: \'edit\' }]" @select="selected = $event.value" />'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    await wrapper.get('.dropdown-item').trigger('click')

    expect(wrapper.vm.selected).toBe('edit')
  })

  it('binds switch v-model and exposes switch semantics', async () => {
    const wrapper = mount({
      data: () => ({ enabled: false }),
      template: '<UiSwitch v-model="enabled" label="Notificaciones" help="Ayuda" />'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    const input = wrapper.get('input')
    await input.setValue(true)

    expect(wrapper.vm.enabled).toBe(true)
    expect(input.attributes('role')).toBe('switch')
    expect(input.attributes('aria-checked')).toBe('true')
  })

  it('binds radio groups through v-model', async () => {
    const wrapper = mount({
      data: () => ({ plan: 'basic' }),
      template: '<div><UiRadio v-model="plan" name="plan" value="basic" label="Básico" /><UiRadio v-model="plan" name="plan" value="pro" label="Pro" /></div>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    const radios = wrapper.findAll('input[type="radio"]')
    expect(radios[0].element.checked).toBe(true)
    await radios[1].setValue()
    expect(wrapper.vm.plan).toBe('pro')
    expect(radios[1].attributes('name')).toBe('plan')
  })

  it('toggles Bootstrap global light and dark themes', async () => {
    localStorage.setItem('themeMode', 'dark')
    const wrapper = mount({
      data: () => ({ theme: null }),
      template: '<UiThemeSwitcher v-model="theme" />'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    expect(wrapper.vm.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark')
    await wrapper.get('button').trigger('click')
    expect(wrapper.vm.theme).toBe('light')
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light')
    expect(localStorage.getItem('themeMode')).toBe('light')
    expect(wrapper.get('button').attributes('style')).toContain('width: 2rem')
    expect(wrapper.get('button').attributes('style')).toContain('height: 2rem')
    expect(wrapper.get('span').classes()).toContain('icon:mdi:weather-night')
    document.documentElement.setAttribute('data-bs-theme', 'light')
    localStorage.removeItem('themeMode')
  })

  it('binds tabs through v-model and does not select disabled tabs', async () => {
    const wrapper = mount({
      data: () => ({ active: 'details' }),
      template: '<UiTabs v-model="active" :items="[{ id: \'details\', label: \'Detalles\', content: \'Contenido\' }, { id: \'settings\', label: \'Ajustes\', content: \'Opciones\' }, { id: \'locked\', label: \'Bloqueado\', content: \'No disponible\', disabled: true }]"><template #panel="{ item }"><strong>{{ item.content }}</strong></template></UiTabs>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    await wrapper.findAll('button[role="tab"]')[1].trigger('click')
    expect(wrapper.vm.active).toBe('settings')
    expect(wrapper.get('.tab-pane.active').text()).toBe('Opciones')

    await wrapper.findAll('button[role="tab"]')[2].trigger('click')
    expect(wrapper.vm.active).toBe('settings')
  })

  it('renders an accessible icon through UiIcon with semantic and custom sizes', () => {
    const wrapper = mount({
      template: '<div><UiIcon name="mdi:home" label="Inicio" size="lg" /><UiIcon name="mdi:bell" size="24" /></div>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    const [home, bell] = wrapper.findAll('span')
    expect(home.classes()).toContain('icon:mdi:home')
    expect(home.attributes('aria-label')).toBe('Inicio')
    expect(home.attributes('style')).toContain('width: 1.5em')
    expect(bell.attributes('style')).toContain('width: 24px')
  })
})
