import { mount, flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createVueSkin } from '@vue-skin/core'
import Bootstrap from '../../bootstrap/src/index.js'
import { UiWizard } from '../src/index.js'

let wrapper, target
const items = [{id:'a',label:'Datos'},{id:'b',label:'Entrega'},{id:'c',label:'Confirmar'}]
function render(props={}) {
  target = document.createElement('div'); document.body.append(target)
  wrapper = mount(UiWizard, {props:{items,...props},slots:{panel:'<input aria-label="Campo" />'},attachTo:target,global:{plugins:[createVueSkin({adapter:Bootstrap,theme:{persist:false,target}})]}})
  return wrapper
}
afterEach(()=>{wrapper?.unmount();target?.remove()})

describe('UiWizard',()=>{
  it('groups navigation buttons and keeps cancel separate', async()=>{
    render()
    const group = wrapper.get('[role="group"][aria-label="Navegación entre etapas"]')
    expect(group.findAll('button').map(button => button.text())).toEqual(['Anterior', 'Siguiente'])
    expect(group.get('button').element.disabled).toBe(true)
    await group.findAll('button')[1].trigger('click')
    await flushPromises()
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['b'])
    expect(group.get('button').element.disabled).toBe(false)
    expect(wrapper.get('.ui-wizard-actions > button').text()).toBe('Cancelar')
  })
  it('validates before moving, reports errors and prevents jumping forward in linear mode',async()=>{
    const beforeChange=vi.fn(()=> 'Complete los datos')
    render({beforeChange})
    expect(await wrapper.vm.next()).toBe(false)
    expect(wrapper.get('[role="alert"]').text()).toBe('Complete los datos')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(await wrapper.vm.goTo('c')).toBe(false)
    expect(beforeChange).toHaveBeenCalledTimes(1)
    beforeChange.mockReturnValue(true)
    expect(await wrapper.vm.next()).toBe(true)
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['b'])
    expect(document.activeElement).toBe(wrapper.get('.ui-wizard-content').element)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(await wrapper.vm.back()).toBe(true)
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['a'])
  })
  it('waits for async guards, blocks duplicate requests and ignores an outdated result after reset',async()=>{
    let resolve
    const beforeChange=vi.fn(()=>new Promise(done=>{resolve=done}))
    render({beforeChange})
    const pending=wrapper.vm.next()
    await flushPromises()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(await wrapper.vm.next()).toBe(false)
    expect(beforeChange).toHaveBeenCalledTimes(1)
    wrapper.vm.reset()
    resolve(true)
    expect(await pending).toBe(false)
    expect(wrapper.get('[aria-current="step"]').text()).toContain('Datos')
  })
  it('skips disabled stages, finishes once, exposes reset and emits cancel',async()=>{
    render({items:[items[0],{...items[1],disabled:true},items[2]]})
    await wrapper.get('.ui-wizard-actions > button').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    await wrapper.vm.next()
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['c'])
    await wrapper.vm.next()
    expect(wrapper.emitted('finish')).toHaveLength(1)
    expect(await wrapper.vm.finish()).toBe(false)
    wrapper.vm.reset()
    await flushPromises()
    expect(wrapper.find('.ui-wizard-actions').exists()).toBe(true)
    expect(wrapper.get('[aria-current="step"]').text()).toContain('Datos')
  })
  it('supports controlled changes, non-linear navigation and thrown guard messages',async()=>{
    render({modelValue:'b',linear:false,beforeChange:()=>{throw new Error('No disponible')}})
    expect(await wrapper.vm.goTo('c')).toBe(false)
    expect(wrapper.get('[role="alert"]').text()).toBe('No disponible')
    await wrapper.setProps({modelValue:'a',beforeChange:()=>true})
    expect(await wrapper.vm.goTo('c')).toBe(true)
    expect(wrapper.emitted('change').at(-1)[0].direction).toBe('step')
  })
  it('renders empty and disabled wizards safely',async()=>{
    render({items:[]})
    expect(await wrapper.vm.next()).toBe(false)
    expect(await wrapper.vm.finish()).toBe(false)
    await wrapper.setProps({items,disabled:true})
    expect(await wrapper.vm.next()).toBe(false)
  })
})
