// @vitest-environment node
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { bundles, componentStyles } from '../scripts/styles.js'

const require = createRequire(import.meta.url)
const css = name => readFileSync(require.resolve('../src/styles/' + name + '.css'), 'utf8')

describe('Bootstrap component styles', () => {
  it('ships compiled CSS for every dependency without copying base styles into components', () => {
    for (const name of Object.keys(bundles)) {
      expect(css(name)).not.toContain('@import')
      if (name !== 'base') expect(css(name)).not.toContain('--bs-body-font-family:')
    }
    for (const styles of Object.values(componentStyles)) for (const name of styles) expect(bundles[name]).toBeDefined()
    expect(css('Input')).toContain('.form-control')
    expect(css('FormField')).toContain('.invalid-feedback')
    expect(css('Checkbox')).toContain('.form-switch')
    expect(css('Modal')).toContain('.modal-backdrop')
  })

  it('builds Button independently with its loading style and a single base, without other component CSS', async () => {
    const result = await build({
      configFile:false, plugins:[vue()], logLevel:'silent',
      build:{ write:false, minify:false, lib:{entry:require.resolve('../src/components/Button.vue'), formats:['es'], fileName:'button'}, rollupOptions:{external:['vue']} }
    })
    const output = (Array.isArray(result) ? result : [result]).flatMap(item => item.output)
    const stylesheet = output.filter(item => item.type === 'asset' && item.fileName.endsWith('.css')).map(item=>String(item.source)).join('\n')
    expect(stylesheet).toContain('.btn')
    expect(stylesheet).toContain('.spinner-border')
    expect(stylesheet.match(/--bs-body-font-family:/g)).toHaveLength(1)
    for (const unrelated of ['.modal{','.offcanvas{','.accordion{','.form-control{','.table{']) expect(stylesheet).not.toContain(unrelated)
    expect(stylesheet.length).toBeLessThan(readFileSync(require.resolve('bootstrap/dist/css/bootstrap.min.css'),'utf8').length)
  })
})
