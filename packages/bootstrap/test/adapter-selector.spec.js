import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import AdapterSelector from '../../../playground/src/AdapterSelector.vue'
import App from '../../../playground/src/App.vue'
import LayoutPreview from '../../../playground/src/LayoutPreview.vue'
import { adapterHref, currentPlaygroundPath, initialSection } from '../../../playground/src/adapters.js'
import { layoutPreviewHref } from '../../../playground/src/layoutPreview.js'
import { verifyAdapterIsolation } from '../../../playground/build/adapterIsolation.js'
import { skin } from '../../../playground/src/skin.js'

const originalUrl = window.location.href
afterEach(() => window.history.replaceState({}, '', originalUrl))
const render = (component, props) => mount(component, { props, global: { plugins: [skin], provide: { playgroundAdapter: 'bootstrap' }, stubs: { UiChart: true } } })

describe('playground adapter selection', () => {
  it('creates same-origin page links preserving layout, section, hash and base path', () => {
    expect(adapterHref('basecoat', 'https://example.com/docs/bootstrap.html?layout=dashboard#table', '/docs/', 'orders'))
      .toBe('/docs/basecoat.html?layout=dashboard&section=orders#table')
    expect(() => adapterHref('https://elsewhere.com', originalUrl)).toThrow('no disponible')
    expect(currentPlaygroundPath('/docs/basecoat.html', '/docs/')).toBe('/docs/basecoat.html')
    expect(currentPlaygroundPath('/unknown', '/docs/')).toBe('/docs/')
    expect(initialSection([['button', 'Button'], { id: 'group', groupTitle: true }], '?section=group', 'button')).toBe('button')
    expect(initialSection([['button', 'Button']], '?section=button', 'other')).toBe('button')
  })

  it('renders native navigation links and marks the active adapter disabled', async () => {
    window.history.replaceState({}, '', '/bootstrap.html?layout=dashboard')
    const wrapper = render(AdapterSelector, { section: 'orders' })
    try {
      expect(wrapper.get('button').text()).toBe('Adapter: Bootstrap')
      expect(wrapper.get('a[aria-disabled="true"]').text()).toContain('Bootstrap')
      expect(wrapper.get('a[href="/basecoat.html?layout=dashboard&section=orders"]').text()).toBe('Basecoat')
      await wrapper.setProps({ section: 'products' })
      expect(wrapper.get('a[href="/basecoat.html?layout=dashboard&section=products"]').exists()).toBe(true)
      expect(layoutPreviewHref('login')).toBe('/bootstrap.html?layout=login')
    } finally { wrapper.unmount() }
  })

  it('restores the component from the URL and places the selector in the navbar', () => {
    window.history.replaceState({}, '', '/bootstrap.html?section=badge')
    const wrapper = render(App)
    try {
      expect(wrapper.get('nav .playground-adapter-selector').text()).toContain('Adapter: Bootstrap')
      expect(wrapper.get('main h2').text()).toContain('Badge')
      expect(wrapper.get('nav a[href="/basecoat.html?section=badge"]').exists()).toBe(true)
    } finally { wrapper.unmount() }
  })

  it.each(['app-layout', 'login', 'dashboard'])('offers selection in the standalone %s layout', layout => {
    window.history.replaceState({}, '', `/bootstrap.html?layout=${layout}&section=orders`)
    const wrapper = render(LayoutPreview, { layout })
    try {
      expect(wrapper.get('.playground-adapter-selector').text()).toContain('Adapter: Bootstrap')
      const link = wrapper.get('.playground-adapter-selector a:not([aria-disabled])')
      expect(link.attributes('href')).toContain(`/basecoat.html?layout=${layout}`)
      if (layout === 'dashboard') expect(wrapper.get('main h1').text()).toBe('Pedidos')
    } finally { wrapper.unmount() }
  })
})

describe('adapter build isolation', () => {
  const chunk = (name, modules, imports = [], isEntry = false) => ({ type: 'chunk', name, fileName: name + '.js', modules: Object.fromEntries(modules.map(id => [id, {}])), imports, isEntry })
  it.each(['bootstrap', 'basecoat'])('rejects a foreign adapter imported by the %s entry', selected => {
    const other = selected === 'bootstrap' ? 'basecoat' : 'bootstrap'
    const bundle = { 'entry.js': chunk(selected, [], ['shared.js'], true), 'shared.js': chunk('shared', [`C:/repo/packages/${other}/src/index.js`]) }
    expect(() => verifyAdapterIsolation(bundle, selected)).toThrow(`módulo de ${other}`)
  })
  it('allows both adapters in separate entry graphs', () => {
    const bundle = Object.fromEntries(['bootstrap', 'basecoat'].map(name => [name + '.js', chunk(name, [`C:/repo/packages/${name}/src/index.js`], [], true)]))
    expect(() => verifyAdapterIsolation(bundle, 'bootstrap')).not.toThrow()
  })
})
