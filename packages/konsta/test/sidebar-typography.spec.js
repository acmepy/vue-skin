import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVueSkin } from '@vue-skin/core'
import Konsta from '../src/index.js'

describe('Konsta sidebar list typography', () => {
  it('uses body-sized titles in sidebar navigation and keeps native titles in other lists', () => {
    const wrapper = mount({ template: `
      <div>
        <UiSidebar :model-value="true"><UiList :filter="false"><UiListItem title="Componentes" href="#components" /></UiList></UiSidebar>
        <main><UiList :filter="false"><UiListItem title="Canciones" href="#songs" /></UiList></main>
      </div>` }, { global: { plugins: [createVueSkin({ adapter: Konsta, theme: { persist: false } })] } })
    try {
      const sidebarTitle = wrapper.get('aside .ks-list-item .text-base')
      expect(sidebarTitle.text()).toBe('Componentes')
      expect(wrapper.get('aside a').attributes('href')).toBe('#components')
      expect(wrapper.get('main .ks-list-item').findAll('[class]').some(node => node.classes().includes('text-[16px]'))).toBe(true)
    } finally { wrapper.unmount() }
  })
})
