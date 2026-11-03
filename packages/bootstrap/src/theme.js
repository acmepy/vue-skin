export const colors = [
  { value: 'blue', label: 'Azul', color: '#0d6efd' },
  { value: 'indigo', label: 'Índigo', color: '#6610f2' },
  { value: 'purple', label: 'Violeta', color: '#8b3fc7' },
  { value: 'pink', label: 'Rosa', color: '#d63384' },
  { value: 'red', label: 'Rojo', color: '#dc3545' },
  { value: 'orange', label: 'Naranja', color: '#e87912' },
  { value: 'teal', label: 'Turquesa', color: '#087f8c' },
  { value: 'green', label: 'Verde', color: '#198754' }
]
const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16))
const hex = values => '#' + values.map(value => Math.round(value).toString(16).padStart(2, '0')).join('')
const mix = (a, b, weight) => hex(rgb(a).map((value, index) => value * (1 - weight) + rgb(b)[index] * weight))
const luminance = color => rgb(color).map(value => {
  const channel = value / 255
  return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4
}).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0)
export const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05)
const foreground = background => contrast(background, '#ffffff') >= contrast(background, '#000000') ? '#ffffff' : '#000000'
function readable(color, background) {
  const target = foreground(background)
  for (let step = 0; step <= 25; step++) {
    const result = mix(color, target, step / 25)
    if (contrast(result, background) >= 4.5) return result
  }
  return target
}

export function themePalette({ color = 'blue', vibrant = false, monochrome = true, resolvedMode = 'light' }) {
  const base = (colors.find(item => item.value === color) ?? colors[0]).color
  const accent = vibrant ? mix(base, '#ffffff', .06) : mix(base, '#6c757d', .24)
  const dark = resolvedMode === 'dark'
  const tint = value => monochrome ? value : mix(value, accent, dark ? .12 : .045)
  const body = tint(dark ? '#212529' : '#ffffff')
  return {
    accent, foreground: foreground(accent), hover: mix(accent, '#000000', .12), active: mix(accent, '#000000', .2),
    body, secondary: tint(dark ? '#343a40' : '#e9ecef'), tertiary: tint(dark ? '#2b3035' : '#f8f9fa'),
    border: tint(dark ? '#495057' : '#dee2e6'), link: readable(accent, body),
    subtle: mix(dark ? '#000000' : '#ffffff', accent, dark ? .28 : .15),
    subtleBorder: mix(dark ? '#000000' : '#ffffff', accent, dark ? .55 : .4),
    check: readable(accent, '#ffffff')
  }
}

let nextId = 0
export function createBootstrapTheme({ target = document.documentElement } = {}) {
  const id = `vue-skin-${++nextId}`
  const previousId = target.getAttribute('data-ui-theme')
  const previousMode = target.getAttribute('data-bs-theme')
  const style = document.createElement('style')
  style.setAttribute('data-ui-theme-style', id)
  document.head.append(style)
  const scope = `[data-ui-theme="${id}"]`
  function apply(state) {
    const p = themePalette(state)
    const accentRgb = rgb(p.accent).join(', ')
    const hoverText = foreground(p.hover)
    const activeText = foreground(p.active)
    const emphasis = readable(p.accent, p.subtle)
    target.setAttribute('data-ui-theme', id)
    target.setAttribute('data-bs-theme', state.resolvedMode)
    style.textContent = `
${scope} {
  --bs-primary: ${p.accent}; --bs-primary-rgb: ${accentRgb};
  --bs-primary-text-emphasis: ${emphasis}; --bs-primary-bg-subtle: ${p.subtle}; --bs-primary-border-subtle: ${p.subtleBorder};
  --bs-body-bg: ${p.body}; --bs-body-bg-rgb: ${rgb(p.body).join(', ')};
  --bs-secondary-bg: ${p.secondary}; --bs-secondary-bg-rgb: ${rgb(p.secondary).join(', ')};
  --bs-tertiary-bg: ${p.tertiary}; --bs-tertiary-bg-rgb: ${rgb(p.tertiary).join(', ')};
  --bs-border-color: ${p.border}; --bs-link-color: ${p.link}; --bs-link-color-rgb: ${rgb(p.link).join(', ')};
  --bs-link-hover-color: ${p.link}; --bs-link-hover-color-rgb: ${rgb(p.link).join(', ')};
}
${scope} .btn-primary {
  --bs-btn-color: ${p.foreground}; --bs-btn-bg: ${p.accent}; --bs-btn-border-color: ${p.accent};
  --bs-btn-hover-color: ${hoverText}; --bs-btn-hover-bg: ${p.hover}; --bs-btn-hover-border-color: ${p.hover};
  --bs-btn-active-color: ${activeText}; --bs-btn-active-bg: ${p.active}; --bs-btn-active-border-color: ${p.active};
  --bs-btn-disabled-color: ${p.foreground}; --bs-btn-disabled-bg: ${p.accent}; --bs-btn-disabled-border-color: ${p.accent};
  --bs-btn-focus-shadow-rgb: ${accentRgb};
}
${scope} .btn-outline-primary {
  --bs-btn-color: ${p.link}; --bs-btn-border-color: ${p.link};
  --bs-btn-hover-color: ${p.foreground}; --bs-btn-hover-bg: ${p.accent}; --bs-btn-hover-border-color: ${p.accent};
  --bs-btn-active-color: ${activeText}; --bs-btn-active-bg: ${p.active}; --bs-btn-active-border-color: ${p.active};
  --bs-btn-disabled-color: ${p.link}; --bs-btn-disabled-border-color: ${p.link}; --bs-btn-focus-shadow-rgb: ${accentRgb};
}
${scope} .text-primary, ${scope} .link-primary { color: ${p.link} !important; }
${scope} .text-bg-primary { color: ${p.foreground} !important; }
${scope} .form-control:not(.is-invalid):not(.is-valid):focus, ${scope} .form-select:not(.is-invalid):not(.is-valid):focus, ${scope} .form-check-input:not(.is-invalid):not(.is-valid):focus {
  border-color: ${p.accent}; box-shadow: 0 0 0 .25rem rgba(${accentRgb}, .25);
}
${scope} .form-control.is-invalid:focus, ${scope} .form-select.is-invalid:focus { border-color: var(--bs-form-invalid-border-color); box-shadow: 0 0 0 .25rem rgba(var(--bs-danger-rgb), .25); }
${scope} .form-check-input:not(.is-invalid):not(.is-valid):checked { background-color: ${p.check}; border-color: ${p.check}; }
${scope} .list-group { --bs-list-group-active-bg: ${p.accent}; --bs-list-group-active-border-color: ${p.accent}; --bs-list-group-active-color: ${p.foreground}; }
${scope} .nav-pills { --bs-nav-pills-link-active-bg: ${p.accent}; --bs-nav-pills-link-active-color: ${p.foreground}; }
${scope} .dropdown-menu { --bs-dropdown-link-active-bg: ${p.accent}; --bs-dropdown-link-active-color: ${p.foreground}; }
${scope} .pagination { --bs-pagination-active-bg: ${p.accent}; --bs-pagination-active-border-color: ${p.accent}; --bs-pagination-active-color: ${p.foreground}; --bs-pagination-focus-box-shadow: 0 0 0 .25rem rgba(${accentRgb}, .25); }
${scope} .accordion { --bs-accordion-active-bg: ${p.subtle}; --bs-accordion-active-color: ${emphasis}; --bs-accordion-btn-focus-box-shadow: 0 0 0 .25rem rgba(${accentRgb}, .25); }
${scope} .alert-primary { --bs-alert-color: ${emphasis}; --bs-alert-bg: ${p.subtle}; --bs-alert-border-color: ${p.subtleBorder}; --bs-alert-link-color: ${emphasis}; }
${scope} .progress { --bs-progress-bar-bg: ${p.accent}; }
`
  }
  function dispose() {
    style.remove()
    if (target.getAttribute('data-ui-theme') !== id) return
    for (const [name, value] of [['data-ui-theme', previousId], ['data-bs-theme', previousMode]]) {
      if (value == null) target.removeAttribute(name)
      else target.setAttribute(name, value)
    }
  }
  return { apply, dispose }
}
