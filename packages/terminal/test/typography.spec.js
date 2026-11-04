import { afterEach, describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const integration = readFileSync(require.resolve('../src/styles/integration.css'), 'utf8')
const vendor = readFileSync(require.resolve('../src/styles/vendor/terminal.css'), 'utf8')
const app = readFileSync(require.resolve('../../../playground/src/App.vue'), 'utf8')
const originalTheme = document.documentElement.getAttribute('data-ui-terminal')
let stylesheet
let container
afterEach(() => {
  stylesheet?.remove()
  container?.remove()
  if (originalTheme === null) document.documentElement.removeAttribute('data-ui-terminal')
  else document.documentElement.setAttribute('data-ui-terminal', originalTheme)
})

describe('Terminal typography', () => {
  it('keeps the terminal font when the playground body rule loads afterwards', () => {
    stylesheet = document.createElement('style')
    const bodyRule = app.match(/:global\(body\)\s*\{([^}]+)\}/)[1]
    stylesheet.textContent = vendor + integration + '\nbody {' + bodyRule + '}'
    document.head.append(stylesheet)
    document.documentElement.setAttribute('data-ui-terminal', 'test')
    // jsdom preserves var expressions; browsers resolve both through the mono stack.
    expect(getComputedStyle(document.body).fontFamily).toBe('var(--ui-font-family, system-ui, sans-serif)')
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-font-family')).toBe('var(--tc-font-family)')
    expect(getComputedStyle(document.documentElement).fontFamily).toBe('var(--tc-font-family)')
    const stack = getComputedStyle(document.documentElement).getPropertyValue('--tc-font-family')
    expect(stack).toContain('Consolas')
    expect(stack).toContain('Cascadia Mono')
    expect(stack).toContain('monospace')
  })

  it('scopes the font to a local theme target and lets controls inherit it', () => {
    stylesheet = document.createElement('style')
    stylesheet.textContent = integration
    document.head.append(stylesheet)
    container = document.createElement('section')
    container.dataset.uiTerminal = 'local'
    container.innerHTML = '<button>Acción</button><input><select><option>Opción</option></select><textarea></textarea>'
    document.body.append(container)
    expect(getComputedStyle(container).fontFamily).toBe('var(--tc-font-family)')
    for (const control of container.children) expect(getComputedStyle(control).fontFamily).toBe('inherit')
    expect(vendor).not.toMatch(/@import\s+url/)
  })
})
