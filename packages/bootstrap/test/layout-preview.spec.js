import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import App from '../../../playground/src/App.vue'
import LayoutPreview from '../../../playground/src/LayoutPreview.vue'
import layoutSource from '../../layouts/src/AppLayout.vue?raw'
import listSource from '../src/components/List.vue?raw'
import sidebarSource from '../src/components/Sidebar.vue?raw'
import { getLayoutPreview, layoutPreviewHref } from '../../../playground/src/layoutPreview.js'
import { skin } from '../../../playground/src/skin.js'

const render = (component, props) => mount(component, { props, global: { plugins: [skin], stubs: { UiChart: true } } })

describe('standalone layout previews', () => {
  it('keeps content directly below the sidebar header both in AppLayout and standalone', () => {
    const stylesheet = document.createElement('style')
    const bootstrapCss = readFileSync(createRequire(import.meta.url).resolve('bootstrap/dist/css/bootstrap.css'), 'utf8')
    stylesheet.textContent = bootstrapCss + sidebarSource.match(/<style>([\s\S]*?)<\/style>/)[1] + layoutSource.match(/<style>([\s\S]*?)<\/style>/)[1] + listSource.match(/<style>([\s\S]*?)<\/style>/)[1]
    document.head.append(stylesheet)
    const wrapper = mount(LayoutPreview, { props: { layout: 'app-layout' }, attachTo: document.body, global: { plugins: [skin] } })
    const standalone = mount({ template: '<UiSidebar><template #header>Header</template>Content</UiSidebar>' }, { attachTo: document.body, global: { plugins: [skin] } })
    try {
      const body = wrapper.get('.ui-sidebar-body')
      expect(body.element.previousElementSibling.classList.contains('offcanvas-header')).toBe(true)
      expect(getComputedStyle(body.element).paddingTop).toBe('0px')
      expect(getComputedStyle(body.element).paddingLeft).not.toBe('0px')
      expect(getComputedStyle(body.element).overflowY).toBe('auto')
      expect(body.element.firstElementChild.classList.contains('ui-list')).toBe(true)
      expect(getComputedStyle(wrapper.get('.ui-list-filter').element).position).toBe('sticky')
      const standaloneBody = standalone.get('.ui-sidebar-body').element
      expect(getComputedStyle(standaloneBody).paddingTop).toBe('0px')
      expect(getComputedStyle(standaloneBody).paddingLeft).not.toBe('0px')
      expect(getComputedStyle(standaloneBody).overflowY).toBe('auto')
    } finally {
      wrapper.unmount()
      standalone.unmount()
      stylesheet.remove()
    }
  })

  it('recognizes only the supported preview URLs', () => {
    expect(getLayoutPreview('?layout=login')).toBe('login')
    expect(getLayoutPreview('?layout=app-layout')).toBe('app-layout')
    expect(getLayoutPreview('?layout=dashboard')).toBe('dashboard')
    expect(getLayoutPreview('?layout=unknown')).toBeNull()
    expect(getLayoutPreview('')).toBeNull()
  })

  it('offers isolated previews in new tabs from the documentation', async () => {
    const wrapper = render(App)
    try {
      for (const layout of ['app-layout', 'login', 'dashboard']) {
        await wrapper.get(`a[href="#${layout}"]`).trigger('click')
        const link = wrapper.get('main a[target="_blank"]')
        expect(link.attributes('href')).toBe(layoutPreviewHref(layout))
        expect(link.attributes('rel')).toBe('noopener noreferrer')
      }
    } finally {
      wrapper.unmount()
    }
  })

  it('renders one full application layout and allows navigation', async () => {
    const wrapper = render(LayoutPreview, { layout: 'app-layout' })
    try {
      expect(wrapper.findAll('.ui-app-layout')).toHaveLength(1)
      expect(wrapper.findAll('aside')).toHaveLength(1)
      expect(wrapper.findAll('nav')).toHaveLength(1)
      expect(wrapper.find('.documentation-main').exists()).toBe(false)
      expect(wrapper.find('[role="tablist"]').exists()).toBe(false)
      await wrapper.get('a[href="#report-24"]').trigger('click')
      expect(wrapper.get('main h1').text()).toBe('Reporte 24')
      expect(wrapper.findAll('main .card')).toHaveLength(8)
    } finally {
      wrapper.unmount()
    }
  })

  it('renders a full-height login without a surrounding sidebar and submits only a local demo', async () => {
    const wrapper = render(LayoutPreview, { layout: 'login' })
    try {
      expect(wrapper.get('.ui-login').classes()).toContain('ui-login-full-height')
      expect(wrapper.find('aside').exists()).toBe(false)
      expect(wrapper.find('.card').exists()).toBe(false)
      await wrapper.get('input[type="email"]').setValue('ana@example.com')
      await wrapper.get('input[type="password"]').setValue('demo-password')
      await wrapper.get('form').trigger('submit')
      expect(wrapper.get('[role="status"]').text()).toContain('ana@example.com')
      expect(wrapper.get('[role="status"]').text()).not.toContain('demo-password')
      expect(wrapper.get('[role="status"]').text()).toContain('No se realiza autenticación')
    } finally {
      wrapper.unmount()
    }
  })

  it('renders the dashboard independently and navigates to its tables', async () => {
    const wrapper = render(LayoutPreview, { layout: 'dashboard' })
    try {
      expect(wrapper.findAll('.ui-app-layout')).toHaveLength(1)
      expect(wrapper.findAll('.ui-dashboard')).toHaveLength(1)
      expect(wrapper.findAll('.ui-dashboard-summary-card')).toHaveLength(4)
      expect(wrapper.findAll('.ui-dashboard-chart-card')).toHaveLength(3)
      expect(wrapper.findAll('.ui-dashboard-table-card')).toHaveLength(2)
      await wrapper.get('a[href="#orders"]').trigger('click')
      expect(wrapper.get('main h1').text()).toBe('Pedidos')
      expect(wrapper.findAll('.ui-dashboard-table-card')).toHaveLength(1)
      expect(wrapper.find('.ui-dashboard-summary').exists()).toBe(false)
      await wrapper.get('a[href="#products"]').trigger('click')
      expect(wrapper.get('main h1').text()).toBe('Productos')
      expect(wrapper.get('.ui-dashboard-table-card').text()).toContain('Plan profesional')
    } finally { wrapper.unmount() }
  })
})
