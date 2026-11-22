import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = resolve(root, 'dist/library')
const names = ['core', 'bootstrap', 'basecoat', 'terminal', 'konsta', 'slate', 'layouts']
for (const name of names) {
  const destination = join(output, name)
  mkdirSync(destination, { recursive: true })
  cpSync(join(root, 'packages', name, 'src'), join(destination, 'src'), { recursive: true })
  try { cpSync(join(root, 'packages', name, 'index.d.ts'), join(destination, 'index.d.ts')) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
}
function rewrite(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) { rewrite(file); continue }
    if (!/\.(js|vue|ts)$/.test(file)) continue
    const source = readFileSync(file, 'utf8').replace(/(['"])@vue-skin\/(core|layouts|bootstrap|basecoat|terminal|konsta|slate)\1/g, (_, quote, name) => {
      const target = join(output, name, file.endsWith('.d.ts') ? 'index.d.ts' : 'src/index.js')
      let path = relative(dirname(file), target).replaceAll('\\', '/')
      if (!path.startsWith('.')) path = './' + path
      return quote + path + quote
    })
    writeFileSync(file, source, 'utf8')
  }
}
rewrite(output)
