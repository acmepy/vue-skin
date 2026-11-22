import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { execFileSync } from 'node:child_process'

describe('GitHub package', () => {
  it('exports independent entries with resolvable internal imports and no workspace dependencies', () => {
    execFileSync(process.execPath, ['scripts/package-github.js'])
    const manifest = JSON.parse(readFileSync('package.json', 'utf8'))
    expect(manifest.scripts.prepare).toBe('npm run build:library')
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
