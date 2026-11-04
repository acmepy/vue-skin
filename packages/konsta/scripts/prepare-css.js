import { createRequire } from 'node:module'
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

// Ship the compiled framework CSS. Consumers do not need Tailwind or a build plugin.
const require = createRequire(import.meta.url)
const cli = resolve(dirname(require.resolve('@tailwindcss/cli/package.json')), 'dist/index.mjs')
const root = fileURLToPath(new URL('../', import.meta.url))
const output = resolve(root, 'src/styles/vendor')
mkdirSync(output, { recursive: true })
const result = spawnSync(process.execPath, [cli, '-i', resolve(root, 'src/styles/konsta.input.css'), '-o', resolve(output, 'konsta.css'), '--minify'], { stdio: 'inherit', cwd: root })
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
copyFileSync(resolve(dirname(require.resolve('tailwindcss/package.json')), 'LICENSE'), resolve(output, 'LICENSE.tailwindcss.txt'))
