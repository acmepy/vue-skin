import { computed, inject, reactive, readonly, ref, watch } from 'vue'

export const themeKey = Symbol('vue-skin-theme')
const defaults = { mode: 'system', color: 'blue', vibrant: false, monochrome: true }
const validMode = value => ['light', 'dark', 'system'].includes(value)

export function createThemeService(adapter, options = {}) {
  const state = reactive({ ...defaults })
  const systemDark = ref(false)
  const colors = Object.freeze((adapter.theme?.colors ?? []).map(color => Object.freeze({ ...color })))
  const persist = options.persist !== false
  const storageKey = options.storageKey ?? 'vue-skin:theme'
  const resolvedMode = computed(() => state.mode === 'system' ? (systemDark.value ? 'dark' : 'light') : state.mode)
  let owners = 0
  let cleanup

  function assign(patch) {
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return
    if (validMode(patch.mode)) state.mode = patch.mode
    if (colors.some(color => color.value === patch.color)) state.color = patch.color
    if (typeof patch.vibrant === 'boolean') state.vibrant = patch.vibrant
    if (typeof patch.monochrome === 'boolean') state.monochrome = patch.monochrome
  }
  assign(options)

  function setTheme(patch, remember = true) {
    assign(patch)
    if (remember && persist && typeof window !== 'undefined') {
      try { window.localStorage.setItem(storageKey, JSON.stringify(state)) } catch { /* Storage can be unavailable. */ }
    }
  }

  function start() {
    owners++
    if (owners > 1 || typeof window === 'undefined') return
    if (persist) {
      try {
        const saved = window.localStorage.getItem(storageKey)
        if (saved) assign(JSON.parse(saved))
        else {
          const legacy = window.localStorage.getItem('themeMode')
          if (validMode(legacy)) assign({ mode: legacy })
        }
      } catch { /* Ignore invalid JSON or blocked storage. */ }
    }
    assign(options)
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    systemDark.value = media?.matches ?? false
    const systemChanged = event => { systemDark.value = event.matches }
    media?.addEventListener?.('change', systemChanged)
    const target = adapter.theme?.create?.({ target: options.target })
    const stop = watch(() => ({ ...state, resolvedMode: resolvedMode.value }), value => target?.apply(value), { immediate: true, flush: 'sync' })
    cleanup = () => {
      stop()
      media?.removeEventListener?.('change', systemChanged)
      target?.dispose()
    }
  }
  function stop() {
    owners = Math.max(0, owners - 1)
    if (!owners) { cleanup?.(); cleanup = undefined }
  }

  return {
    state: readonly(state), resolvedMode, colors, persist, storageKey, setTheme,
    setMode: (mode, remember) => setTheme({ mode }, remember),
    setColor: color => setTheme({ color }),
    setVibrant: vibrant => setTheme({ vibrant }),
    setMonochrome: monochrome => setTheme({ monochrome }),
    reset: () => setTheme(defaults),
    start, stop
  }
}

export function useTheme() {
  const theme = inject(themeKey, null)
  if (!theme) throw new Error('[VueSkin] useTheme requires createVueSkin to be installed in this application.')
  return theme
}
