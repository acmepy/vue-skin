import { availableAdapters } from '../src/adapters.js'

export function verifyAdapterIsolation(bundle, defaultAdapter) {
  const names = availableAdapters.map(item => item.value)
  const expected = { index: defaultAdapter, ...Object.fromEntries(names.map(name => [name, name])) }
  for (const entry of Object.values(bundle)) {
    if (entry.type !== 'chunk' || !entry.isEntry || !expected[entry.name]) continue
    const selected = expected[entry.name]
    const forbidden = names.filter(name => name !== selected)
    const visited = new Set()
    function visit(chunk) {
      if (!chunk || chunk.type !== 'chunk' || visited.has(chunk.fileName)) return
      visited.add(chunk.fileName)
      for (const id of Object.keys(chunk.modules)) {
        const normalized = id.replaceAll('\\', '/')
        const foreign = forbidden.find(name => normalized.includes(`/packages/${name}/`) || normalized.includes(`/node_modules/${name === 'basecoat' ? 'basecoat-css' : name}/`))
        if (foreign) {
          throw new Error(`La página ${entry.name} (${selected}) incluye un módulo de ${foreign}: ${id}`)
        }
      }
      for (const imported of chunk.imports) visit(bundle[imported])
    }
    visit(entry)
  }
}
