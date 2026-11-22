import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVueSkin } from '@vue-skin/core'
import Konsta from '../src/index.js'

it('lets Android toolbar labels and button text wrap without fixed heights', () => {
  const require = createRequire(import.meta.url)
  const style = document.createElement('style')
  style.textContent = readFileSync(require.resolve('../src/styles/integration.css'),'utf8') + readFileSync(require.resolve('../src/components/Toolbar.vue'),'utf8').match(/<style>([\s\S]+)<\/style>/)[1]
  document.head.append(style)
  const wrapper = mount({ template:'<div><UiButton>Una acción con un nombre muy largo</UiButton><UiToolbar :items="[{id:1,label:\'Configuración de la aplicación\',icon:\'mdi:cog\'}]" /></div>' }, { attachTo:document.body, global:{plugins:[createVueSkin({adapter:Konsta,theme:{persist:false}})]} })
  try {
    const button = getComputedStyle(wrapper.get('.ks-button').element)
    expect(button.height).toBe('auto')
    expect(button.whiteSpace).toBe('normal')
    const link = getComputedStyle(wrapper.get('.ks-toolbar-link').element)
    expect(link.height).toBe('auto')
    expect(link.whiteSpace).toBe('normal')
    expect(getComputedStyle(wrapper.get('.ks-toolbar-inner').element).height).toBe('auto')
    expect(wrapper.get('.ks-toolbar-link').classes()).not.toContain('truncate')
  } finally { wrapper.unmount(); style.remove() }
})
