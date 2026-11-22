import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createVueSkin } from '@vue-skin/core'
import { UiWizard } from '../../packages/layouts/src/index.js'

export function stepperSuite(adapter) {
  let wrapper, target
  const items = [{id:0,label:'Cuenta',description:'Datos personales'},{id:'delivery',label:'Entrega'},{id:'pay',label:'Pago'}]
  function render(component, props, slots) {
    target = document.createElement('div'); document.body.append(target)
    wrapper = mount(component, { props, slots, attachTo:target, global:{plugins:[createVueSkin({adapter,theme:{persist:false,target}})]} })
    return wrapper
  }
  afterEach(() => { wrapper?.unmount(); target?.remove() })

  describe(adapter.name + ' Stepper', () => {
    it('shows ordered stages, completion, description and the current accessible stage', () => {
      render(adapter.components.Stepper, {items,modelValue:'delivery'})
      expect(wrapper.findAll('li')).toHaveLength(3)
      expect(wrapper.get('li.is-complete').text()).toContain('✓')
      expect(wrapper.get('[aria-current="step"]').text()).toContain('Entrega')
      expect(wrapper.text()).toContain('Datos personales')
      expect(wrapper.attributes('data-orientation')).toBe('horizontal')
    })
    it('supports vertical keyboard navigation, selection and numeric ids', async () => {
      render(adapter.components.Stepper, {items,modelValue:0,orientation:'vertical'})
      await wrapper.findAll('button')[0].trigger('keydown',{key:'ArrowDown'})
      expect(document.activeElement).toBe(wrapper.findAll('button')[1].element)
      await wrapper.findAll('button')[1].trigger('click')
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['delivery'])
      expect(wrapper.emitted('change').at(-1)).toEqual([items[1]])
    })
    it('blocks future linear stages and respects readonly and disabled items', async () => {
      render(adapter.components.Stepper, {items:[items[0],{...items[1],disabled:true},items[2]],modelValue:0,linear:true})
      expect(wrapper.findAll('button')[1].element.disabled).toBe(true)
      expect(wrapper.findAll('button')[2].element.disabled).toBe(true)
      await wrapper.setProps({linear:false,readonly:true})
      expect(wrapper.findAll('button').every(button=>button.element.disabled)).toBe(true)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
    it('handles an empty list and renders custom stage content', async () => {
      render(adapter.components.Stepper, {items:[]})
      expect(wrapper.findAll('button')).toHaveLength(0)
      await wrapper.setProps({items})
      expect(wrapper.get('[aria-current="step"]').text()).toContain('Cuenta')
    })
    it('integrates with the shared vertical Wizard and completes its stages', async () => {
      render(UiWizard, {items,orientation:'vertical'}, {panel:'<p>Formulario</p>'})
      expect(wrapper.get('[data-orientation="vertical"]').exists()).toBe(true)
      const stepper = wrapper.findComponent(adapter.components.Stepper)
      expect(stepper.props('orientation')).toBe('vertical')
      expect(await wrapper.vm.next()).toBe(true)
      expect(wrapper.get('[aria-current="step"]').text()).toContain('Entrega')
      expect(await wrapper.vm.next()).toBe(true)
      expect(await wrapper.vm.finish()).toBe(true)
      expect(wrapper.emitted('finish')).toHaveLength(1)
      expect(wrapper.get('[role="status"]').text()).toContain('completado')
    })
  })
}
