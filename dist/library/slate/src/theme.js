export const colors = Object.freeze([
  { value: 'blue', label: 'Azul', color: '#4263d6' },
  { value: 'indigo', label: 'Índigo', color: '#5856c5' },
  { value: 'purple', label: 'Violeta', color: '#8556bb' },
  { value: 'pink', label: 'Rosa', color: '#b84076' },
  { value: 'red', label: 'Rojo', color: '#bc414a' },
  { value: 'orange', label: 'Naranja', color: '#b55c20' },
  { value: 'teal', label: 'Turquesa', color: '#177d83' },
  { value: 'green', label: 'Verde', color: '#28764f' }
].map(Object.freeze))

const channels = hex => hex.match(/[\da-f]{2}/gi).map(value => parseInt(value, 16))
const mix = (a, b, weight) => '#' + channels(a).map((value, index) => Math.round(value * (1 - weight) + channels(b)[index] * weight).toString(16).padStart(2, '0')).join('')
const luminance = hex => channels(hex).map(value => {
  const channel = value / 255
  return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4
}).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0)
export const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05)
const onColor = color => contrast(color, '#ffffff') >= contrast(color, '#101827') ? '#ffffff' : '#101827'

// Pure tokens keep contrast checks independent of DOM/CSS variable support.
export function slatePalette({ color = 'blue', resolvedMode = 'light', vibrant = false, monochrome = true } = {}) {
  const dark = resolvedMode === 'dark'
  const base = (colors.find(item => item.value === color) ?? colors[0]).color
  const accent = vibrant ? base : mix(base, '#64748b', .18)
  let primary = dark ? mix(accent, '#ffffff', .34) : accent
  // Leave room for contrast on tinted navigation and badge backgrounds as well.
  if (!dark) {
    for (let step = 0; step < 20 && contrast(primary, mix(primary, '#ffffff', .9)) < 4.8; step++) {
      primary = mix(primary, '#101827', .04)
    }
  }
  const tint = value => monochrome ? value : mix(value, primary, dark ? .075 : .035)
  const card = tint(dark ? '#151f30' : '#ffffff')
  const background = tint(dark ? '#0d1422' : '#f3f5f9')
  const chrome = tint(dark ? '#111b2b' : '#edf0f5')
  return {
    background, card, chrome,
    foreground: dark ? '#e7edf7' : '#202b40',
    mutedForeground: dark ? '#a1aec3' : '#59677d',
    border: tint(dark ? '#314059' : '#d5dce7'),
    field: tint(dark ? '#101929' : '#ffffff'),
    primary, onPrimary: onColor(primary),
    accent: mix(primary, card, dark ? .94 : .92),
    success: dark ? '#74d7a5' : '#23764d',
    danger: dark ? '#f2939a' : '#b63746',
    warning: dark ? '#ebc068' : '#96600d',
    info: dark ? '#7dc9ed' : '#216c91',
    scroll: dark ? '#465771' : '#b5c0d1'
  }
}

let nextId = 0
export function createSlateTheme({ target = document.documentElement } = {}) {
  const id = 'slate-' + ++nextId
  const previousId = target.getAttribute('data-ui-slate')
  const wasDark = target.classList.contains('dark')
  const style = document.createElement('style')
  style.dataset.slateThemeStyle = id
  document.head.append(style)
  return {
    apply(state) {
      const p = slatePalette(state)
      const tokens = {
        background: p.background, foreground: p.foreground,
        card: p.card, 'card-foreground': p.foreground,
        popover: p.card, 'popover-foreground': p.foreground,
        primary: p.primary, 'primary-foreground': p.onPrimary, ring: p.primary,
        muted: p.chrome, 'muted-foreground': p.mutedForeground,
        secondary: p.chrome, 'secondary-foreground': p.foreground,
        accent: p.accent, 'accent-foreground': p.foreground,
        border: p.border, input: p.border, destructive: p.danger,
        sidebar: p.chrome, 'sidebar-foreground': p.foreground,
        'ui-layout-surface': p.chrome, 'ui-sidebar-scroll-thumb': p.scroll,
        'sl-field-bg': p.field, 'sl-chrome': p.chrome, 'sl-scroll': p.scroll,
        'sl-background': p.background, radius: '.75rem',
        'sl-success': p.success, 'sl-success-foreground': onColor(p.success),
        'sl-danger': p.danger, 'sl-danger-foreground': onColor(p.danger),
        'sl-warning': p.warning, 'sl-warning-foreground': onColor(p.warning),
        'sl-info': p.info, 'sl-info-foreground': onColor(p.info)
      }
      target.dataset.uiSlate = id
      target.classList.toggle('dark', state.resolvedMode === 'dark')
      style.textContent = `[data-ui-slate="${id}"] { color-scheme:${state.resolvedMode}; ${Object.entries(tokens).map(([name,value]) => `--${name}:${value};`).join(' ')} }`
    },
    dispose() {
      style.remove()
      if (target.dataset.uiSlate !== id) return
      if (previousId === null) target.removeAttribute('data-ui-slate')
      else target.setAttribute('data-ui-slate', previousId)
      target.classList.toggle('dark', wasDark)
    }
  }
}
