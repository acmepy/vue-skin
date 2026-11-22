import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

describe('GitHub package', () => {
  it('exports independent entries with resolvable internal imports and no workspace dependencies', () => {
    const manifest = JSON.parse(readFileSync('package.json', 'utf8'))
    for (const hook of ['prepare', 'preinstall', 'install', 'postinstall', 'prepack']) expect(manifest.scripts[hook]).toBeUndefined()
    expect(manifest.scripts.build).toContain('node scripts/package-github.js')
    for (const asset of ['bootstrap/src/styles/base.css', 'basecoat/src/styles/vendor/basecoat.css', 'konsta/src/styles/vendor/konsta.css', 'terminal/src/styles/vendor/terminal.css']) {
      expect(existsSync('dist/library/' + asset), asset).toBe(true)
    }
    for (const name of ['core', 'layouts', 'konsta', 'bootstrap', 'basecoat', 'terminal', 'slate']) {
      const entry = manifest.exports['./' + name]
      expect(existsSync(typeof entry === 'string' ? entry : entry.import)).toBe(true)
    }
    const visit = directory => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const file = resolve(directory, entry.name)
        if (entry.isDirectory()) { visit(file); continue }
        if (!/\.(js|vue|ts)$/.test(file)) continue
        const source = readFileSync(file, 'utf8')
        expect(source).not.toMatch(/(?:from\s*|import\s*)['"]@vue-skin\//)
        for (const match of source.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
          expect(existsSync(resolve(dirname(file), match[1])), file + ': ' + match[1]).toBe(true)
        }
      }
    }
    visit('dist/library')
    expect(Object.values(manifest.dependencies).some(value => value.startsWith('file:'))).toBe(false)
  })
})
