import { currentPlaygroundPath } from './adapters.js'

export function getLayoutPreview(search) {
  const layout = new URLSearchParams(search).get('layout')
  return ['app-layout', 'login', 'dashboard'].includes(layout) ? layout : null
}

export function layoutPreviewHref(layout) {
  return `${currentPlaygroundPath(window.location.pathname, import.meta.env.BASE_URL)}?layout=${encodeURIComponent(layout)}`
}
