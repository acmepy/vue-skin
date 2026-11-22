import { createRequire } from 'node:module'
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileString } from 'sass'
import { bundles } from './styles.js'

const dependency = dirname(createRequire(import.meta.url).resolve('bootstrap/package.json'))
const output = fileURLToPath(new URL('../src/styles/', import.meta.url))
const configuration = ['functions', 'variables', 'variables-dark', 'maps', 'mixins', 'utilities']
mkdirSync(output, { recursive: true })
for (const [name, partials] of Object.entries(bundles)) {
  const source = [...configuration, ...partials].map(part => `@import "${part}";`).join('\n')
  const result = compileString(source, {
    loadPaths: [resolve(dependency, 'scss')], style:'compressed', charset:false,
    // Bootstrap 5 still uses Sass @import internally. Only vendor deprecations
    // are quieted; compilation errors and ordinary warnings remain visible.
    quietDeps:true, silenceDeprecations:['import']
  })
  writeFileSync(resolve(output, name + '.css'), `/*! Bootstrap — MIT, The Bootstrap Authors; module ${name}. */\n` + result.css + '\n', 'utf8')
}
copyFileSync(resolve(dependency, 'LICENSE'), resolve(output, 'LICENSE.bootstrap.txt'))
