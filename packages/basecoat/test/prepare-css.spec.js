// @vitest-environment node
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { transform } from 'esbuild'
import { describe, expect, it } from 'vitest'
import { normalizeBasecoatCss } from '../scripts/normalize-css.js'

const require = createRequire(import.meta.url)
const upstream = readFileSync(resolve(dirname(require.resolve('basecoat-css/package.json')), 'dist/basecoat.cdn.min.css'), 'utf8')

describe('Basecoat CSS preparation', () => {
  it('removes only the invalid empty tooltip has rule and preserves valid selectors', () => {
    const before = '.button{display:flex}[data-tooltip]:before{display:inline-flex}'
    const invalid = '[data-tooltip]:before:has(){padding-inline-end:calc(var(--spacing) * 1.5)}'
    const after = '[data-tooltip][data-arrow]:after{display:block}.button:has(svg){gap:1rem}'
    expect(normalizeBasecoatCss(before + invalid + after)).toBe(before + after)
    expect(normalizeBasecoatCss(invalid)).toBe('')
    expect(normalizeBasecoatCss(before + after)).toBe(before + after)
  })

  it('makes the installed vendor stylesheet minify without CSS syntax warnings', async () => {
    const normalized = normalizeBasecoatCss(upstream)
    expect(normalized).not.toContain(':has()')
    expect(normalizeBasecoatCss(normalized)).toBe(normalized)
    const result = await transform(normalized, { loader:'css', minify:true })
    expect(result.warnings).toEqual([])
  })
})
