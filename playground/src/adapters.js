export const availableAdapters = Object.freeze([
  Object.freeze({ value: 'bootstrap', label: 'Bootstrap', page: 'bootstrap.html' }),
  Object.freeze({ value: 'basecoat', label: 'Basecoat', page: 'basecoat.html' }),
  Object.freeze({ value: 'terminal', label: 'Terminal', page: 'terminal.html' }),
  Object.freeze({ value: 'konsta', label: 'Konsta UI', page: 'konsta.html' }),
  Object.freeze({ value: 'slate', label: 'Slate', page: 'slate.html' })
])

export function adapterHref(value, currentHref, baseUrl = '/', section) {
  const adapter = availableAdapters.find(item => item.value === value)
  if (!adapter) throw new Error('Adapter no disponible: ' + value)
  const current = new URL(currentHref)
  const target = new URL(adapter.page, new URL(baseUrl, current.origin))
  target.search = current.search
  target.hash = current.hash
  if (section) target.searchParams.set('section', section)
  return target.pathname + target.search + target.hash
}

export function currentPlaygroundPath(pathname, baseUrl = '/') {
  return availableAdapters.some(item => pathname === baseUrl + item.page) ? pathname : baseUrl
}

export function initialSection(sections, search, fallback) {
  const selected = new URLSearchParams(search).get('section')
  return sections.some(item => Array.isArray(item) ? item[0] === selected : !item.groupTitle && item.id === selected) ? selected : fallback
}
