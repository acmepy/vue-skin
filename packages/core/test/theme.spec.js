import { createApp, defineComponent, h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createThemeService } from '../src/theme.js'
import { createVueSkin, requiredComponents, useTheme } from '../src/index.js'

const instances = []
const create = (options = {}, adapter = {}) => {
  const service = createThemeService({ theme: { colors: [{ value: 'blue' }, { value: 'purple' }], ...adapter } }, options)
  instances.push(service)
  return service
}
afterEach(() => {
  instances.splice(0).forEach(service => service.stop())
  localStorage.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('application theme service', () => {
  it('defaults to system, muted blue accents and neutral backgrounds', () => {
    const service = create()
    expect(service.state).toEqual({ mode: 'system', color: 'blue', vibrant: false, monochrome: true })
  })

  it('loads persisted preferences, validates fields and lets explicit options take precedence', () => {
    localStorage.setItem('vue-skin:theme', JSON.stringify({ mode: 'dark', color: 'purple', vibrant: true, monochrome: false }))
    const service = create({ mode: 'light' })
    service.start()
    expect(service.state).toEqual({ mode: 'light', color: 'purple', vibrant: true, monochrome: false })
    service.setTheme({ mode: 'invalid', color: 'url(evil)', vibrant: 'true', monochrome: 0 })
    expect(service.state).toEqual({ mode: 'light', color: 'purple', vibrant: true, monochrome: false })
  })

  it('migrates legacy mode, saves complete preferences and resets them', () => {
    localStorage.setItem('themeMode', 'dark')
    const service = create()
    service.start()
    expect(service.resolvedMode.value).toBe('dark')
    service.setColor('purple')
    service.setVibrant(true)
    service.setMonochrome(false)
    expect(JSON.parse(localStorage.getItem('vue-skin:theme'))).toEqual({ mode: 'dark', color: 'purple', vibrant: true, monochrome: false })
    service.reset()
    expect(JSON.parse(localStorage.getItem('vue-skin:theme'))).toEqual({ mode: 'system', color: 'blue', vibrant: false, monochrome: true })
  })

  it('ignores corrupted or unavailable storage and honors persist false', () => {
    localStorage.setItem('vue-skin:theme', 'invalid json')
    const service = create()
    expect(() => service.start()).not.toThrow()
    const privateService = create({ persist: false })
    privateService.start()
    privateService.setMode('dark')
    expect(localStorage.getItem('vue-skin:theme')).toBe('invalid json')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    expect(() => service.setColor('purple')).not.toThrow()
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    const blocked = create()
    expect(() => blocked.start()).not.toThrow()
  })

  it('follows system changes only in system mode and cleans listeners and adapter resources', () => {
    const listeners = new Set()
    const remove = vi.fn((event, fn) => listeners.delete(fn))
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: (event, fn) => listeners.add(fn), removeEventListener: remove }))
    const apply = vi.fn()
    const dispose = vi.fn()
    const service = create({}, { create: () => ({ apply, dispose }) })
    service.start()
    expect(service.resolvedMode.value).toBe('dark')
    listeners.forEach(fn => fn({ matches: false }))
    expect(service.resolvedMode.value).toBe('light')
    service.setMode('dark')
    listeners.forEach(fn => fn({ matches: false }))
    expect(service.resolvedMode.value).toBe('dark')
    expect(apply.mock.calls.at(-1)[0]).toMatchObject({ mode: 'dark', resolvedMode: 'dark' })
    service.stop()
    expect(dispose).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledTimes(1)
    expect(listeners.size).toBe(0)
  })

  it('keeps state isolated between service instances', () => {
    const first = create({ persist: false })
    const second = create({ persist: false })
    first.setTheme({ color: 'purple', vibrant: true })
    expect(second.state.color).toBe('blue')
    expect(second.state.vibrant).toBe(false)
  })

  it('provides useTheme per app and releases the adapter on application unmount', () => {
    const dispose = vi.fn()
    let injected
    const adapter = { name: 'test', components: Object.fromEntries(requiredComponents.map(name => [name, {}])), theme: { colors: [{ value: 'blue' }], create: () => ({ apply() {}, dispose }) } }
    const app = createApp(defineComponent({ setup() { injected = useTheme(); return () => h('div') } }))
    const skin = createVueSkin({ adapter, theme: { persist: false } })
    const container = document.createElement('div')
    app.use(skin).mount(container)
    expect(injected).toBe(skin.theme)
    app.unmount()
    expect(dispose).toHaveBeenCalledTimes(1)
  })
})
