export function verifyAdapterIsolation(bundle, defaultAdapter) {
  const expected = { index: defaultAdapter, bootstrap: 'bootstrap', basecoat: 'basecoat' }
  for (const entry of Object.values(bundle)) {
    if (entry.type !== 'chunk' || !entry.isEntry || !expected[entry.name]) continue
    const selected = expected[entry.name]
    const forbidden = selected === 'basecoat' ? 'bootstrap' : 'basecoat'
    const visited = new Set()
    function visit(chunk) {
      if (!chunk || chunk.type !== 'chunk' || visited.has(chunk.fileName)) return
      visited.add(chunk.fileName)
      for (const id of Object.keys(chunk.modules)) {
        const normalized = id.replaceAll('\\', '/')
        if (normalized.includes(`/packages/${forbidden}/`) || normalized.includes(`/node_modules/${forbidden === 'basecoat' ? 'basecoat-css' : 'bootstrap'}/`)) {
          throw new Error(`La página ${entry.name} (${selected}) incluye un módulo de ${forbidden}: ${id}`)
        }
      }
      for (const imported of chunk.imports) visit(bundle[imported])
    }
    visit(entry)
  }
}
