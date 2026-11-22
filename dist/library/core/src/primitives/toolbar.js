import { getCurrentInstance, ref, watch } from 'vue'

// Shared navigation state only; each adapter owns its elements and presentation.
export function useToolbar(props, emit) {
  const app = getCurrentInstance().appContext
  const router = app.config.globalProperties.$router
  const hasRouterLink = Boolean(app.components.RouterLink)
  const selected = ref(props.modelValue)
  watch(() => props.modelValue, value => { selected.value = value })
  function active(item) {
    if (props.modelValue != null) return props.modelValue === item.id
    if (item.to != null && router) return router.resolve(item.to).fullPath === router.currentRoute.value.fullPath
    return selected.value === item.id
  }
  function component(item) {
    if (item.disabled) return 'span'
    if (item.to != null && hasRouterLink) return 'RouterLink'
    return item.href || typeof item.to === 'string' ? 'a' : 'button'
  }
  function attributes(item) {
    const tag = component(item)
    return {
      ...(tag === 'RouterLink' ? { to:item.to } : tag === 'a' ? { href:item.href ?? item.to } : tag === 'button' ? { type:'button' } : {}),
      target: item.target,
      rel: item.target === '_blank' ? 'noopener noreferrer' : undefined,
      role: tag === 'button' ? 'button' : 'link',
      tabindex: item.disabled ? -1 : undefined,
      'aria-disabled': item.disabled || undefined,
      'aria-current': active(item) ? 'page' : undefined,
      'aria-label': item.label,
      title: !props.labels ? item.label : undefined
    }
  }
  function select(item, event) {
    if (item.disabled) { event.preventDefault(); return }
    if (event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (item.target && item.target !== '_self')) return
    selected.value = item.id
    emit('update:modelValue', item.id)
    emit('select', item, event)
  }
  return { active, component, attributes, select }
}
