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
    expect(wrapper.get('.offcanvas').classes()).not.toContain('show')
    wrapper.unmount()
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

  it('renders an accessible icon through UiIcon', () => {
    const wrapper = mount({
      template: '<UiIcon name="mdi:home" label="Inicio" />'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

    expect(wrapper.get('span').classes()).toContain('icon:mdi:home')
    expect(wrapper.get('span').attributes('aria-label')).toBe('Inicio')
  })
})
