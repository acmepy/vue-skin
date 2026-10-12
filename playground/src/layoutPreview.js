export function getLayoutPreview(search) {
  const layout = new URLSearchParams(search).get('layout')
  return ['app-layout', 'login', 'dashboard'].includes(layout) ? layout : null
}

export function layoutPreviewHref(layout) {
  return `${import.meta.env.BASE_URL}?layout=${encodeURIComponent(layout)}`
}
