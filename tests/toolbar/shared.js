import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createVueSkin } from '@vue-skin/core'

export function toolbarSuite(adapter) {
  let wrapper, target
  const items = [
    { id:0, label:'Inicio', icon:'mdi:home' },
    { id:'inbox', label:'Mensajes', icon:'mdi:email-outline' },
    { id:'external', label:'Documentación', href:'https://example.com/docs', target:'_blank' },
    { id:'disabled', label:'Privado', href:'/private', disabled:true }
  ]
  function render(props = {}, options = {}) {
    target = document.createElement('section'); document.body.append(target)
    wrapper = mount(adapter.components.Toolbar, {
      props:{ items, ...props }, attachTo:target, ...options,
      global:{ plugins:[createVueSkin({adapter,theme:{target,persist:false}})], ...options.global }
    })
    return wrapper
  }
  afterEach(() => { wrapper?.unmount(); target?.remove() })
  describe(adapter.name + ' Toolbar', () => {
    it('selects actions with numeric ids and exposes accessible navigation and icon labels', async () => {
      render({ modelValue:'inbox' })
      expect(wrapper.attributes('aria-label')).toBe('Barra de navegación')
      expect(wrapper.get('[aria-current="page"]').text()).toBe('Mensajes')
      expect(wrapper.findAll('[role="tab"]')).toHaveLength(0)
      const first = wrapper.get('[aria-label="Inicio"]')
      expect(first.element.tagName).toBe('BUTTON')
      expect(first.attributes('type')).toBe('button')
      await first.trigger('click')
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([0])
      expect(wrapper.emitted('select').at(-1)[0]).toEqual(items[0])
      await wrapper.setProps({modelValue:0})
      expect(first.attributes('aria-current')).toBe('page')
    })
    it('keeps external link behavior, blocks disabled links and ignores modified clicks for selection', async () => {
      render()
      const link = wrapper.get('[aria-label="Documentación"]')
      expect(link.attributes('href')).toBe('https://example.com/docs')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
      expect(link.attributes('target')).toBe('_blank')
      await link.trigger('click', {ctrlKey:true})
      expect(wrapper.emitted('select')).toBeUndefined()
      const disabled = wrapper.get('[aria-label="Privado"]')
      expect(disabled.attributes('href')).toBeUndefined()
      expect(disabled.attributes('tabindex')).toBe('-1')
      await disabled.trigger('click')
      expect(wrapper.emitted('select')).toBeUndefined()
      await wrapper.get('[aria-label="Inicio"]').trigger('click',{ctrlKey:true})
      expect(wrapper.emitted('select')).toBeUndefined()
    })
    it('supports placement, icon-only/text-only modes and local selection', async () => {
      render({ fixed:true, position:'top', labels:false })
      expect(wrapper.attributes('data-position')).toBe('top')
      expect(wrapper.classes().some(name => name.endsWith('toolbar-fixed'))).toBe(true)
      expect(wrapper.get('[aria-label="Inicio"]').attributes('title')).toBe('Inicio')
      expect(wrapper.get('[aria-label="Inicio"]').text()).toBe('')
      expect(wrapper.get('[aria-label="Documentación"]').text()).toBe('Documentación')
      expect(wrapper.findAll('[aria-hidden="true"]').length).toBeGreaterThan(0)
      await wrapper.get('[aria-label="Mensajes"]').trigger('click')
      expect(wrapper.get('[aria-label="Mensajes"]').attributes('aria-current')).toBe('page')
      await wrapper.setProps({position:'bottom',icons:false,labels:true,fixed:false})
      expect(wrapper.attributes('data-position')).toBe('bottom')
      expect(wrapper.get('[aria-label="Inicio"]').text()).toBe('Inicio')
      expect(wrapper.findAll('[class*="icon:mdi"]')).toHaveLength(0)
    })
    it('uses registered RouterLink for SPA destinations and derives active state from the current route', async () => {
      const route = ref({fullPath:'/home'})
      const resolve = to => ({fullPath:typeof to === 'string' ? to : '/' + to.name})
      const push = vi.fn(to => { route.value = resolve(to) })
      const RouterLink = { props:['to'], setup: (props,{slots}) => () => h('a', {href:'/app'+resolve(props.to).fullPath, onClick:event=>{if(!event.ctrlKey&&!event.metaKey){event.preventDefault();push(props.to)}}}, slots.default?.()) }
      render({items:[{id:'home',label:'Inicio',to:'/home'},{id:'profile',label:'Perfil',to:{name:'profile'}}]}, {
        global:{plugins:[createVueSkin({adapter,theme:{persist:false}})],components:{RouterLink},config:{globalProperties:{$router:{resolve,push,currentRoute:route}}}}
      })
      const profile = wrapper.get('[aria-label="Perfil"]')
      expect(profile.attributes('href')).toBe('/app/profile')
      expect(wrapper.get('[aria-current="page"]').text()).toBe('Inicio')
      await profile.trigger('click')
      expect(push).toHaveBeenCalledWith({name:'profile'})
      expect(profile.attributes('aria-current')).toBe('page')
    })
    it('accepts custom content and handles an empty list', () => {
      render({items:[]},{slots:{default:'<button type="button">Acción propia</button>'}})
      expect(wrapper.text()).toBe('Acción propia')
    })
  })
}
