import { afterEach, describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')
const app = read('../../../playground/src/App.vue')
const bodyRule = app.match(/:global\(body\)\s*\{([^}]+)\}/)[1]
let style, target
afterEach(() => { style?.remove(); target?.remove() })

describe('Adapter typography in the shared playground', () => {
  it('leaves the font to the selected adapter', () => {
    expect(bodyRule).not.toMatch(/font(?:-family)?\s*:/)
  })

  it.each([
    ['basecoat', 'var(--font-sans)'],
    ['konsta', 'var(--font-material)'],
    ['terminal', 'var(--tc-font-family)'],
    ['slate', '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif']
  ])('applies the %s font to local theme targets', (adapter, font) => {
    style = document.createElement('style')
    style.textContent = read(`../../${adapter}/src/styles/integration.css`) + `\nbody {${bodyRule}}`
    document.head.append(style)
    target = document.createElement('section')
    target.setAttribute(`data-ui-${adapter}`, 'typography-test')
    document.body.append(target)
    expect(getComputedStyle(target).fontFamily).toBe(font)
  })

  it('retains the official Bootstrap body stack when playground CSS loads last', () => {
    style = document.createElement('style')
    style.textContent = read('../../bootstrap/src/styles/base.css') + `\nbody {${bodyRule}}`
    document.head.append(style)
    expect(getComputedStyle(document.body).fontFamily).toBe('var(--bs-body-font-family)')
    expect(getComputedStyle(document.documentElement).getPropertyValue('--bs-font-sans-serif')).toContain('system-ui')
  })
})
