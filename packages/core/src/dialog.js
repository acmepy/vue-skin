import { defineComponent, h, ref, toRaw } from 'vue'

export function createDialogService(adapter) {
  const active = ref(null)
  const pending = []

  function show(request) {
    request.open = true
    if (!active.value) {
      active.value = request
      return active.value
    }

    pending.push(request)
    return request
  }

  function finish(request, value) {
    if (active.value === request) {
      active.value = pending.shift() || null
    } else {
      const index = pending.indexOf(request)
      if (index !== -1) pending.splice(index, 1)
    }
    request.resolve?.(value)
  }

  function request(type, options) {
    return new Promise((resolve) => show({ type, ...options, resolve }))
  }

  function dismiss(request, value) {
    const current = active.value && (active.value === request || toRaw(active.value) === request)

    if (current) {
      if (!active.value.open) return
      active.value.result = value
      active.value.open = false
      return
    }

    const index = pending.indexOf(request)
    if (index !== -1) {
      pending.splice(index, 1)
      request.resolve?.(value)
    }
  }

  const service = {
    alert(message, title, options = {}) {
      return request('alert', { ...options, message, title })
    },
    confirm(message, title, options = {}) {
      return request('confirm', { ...options, message, title })
    },
    prompt(message, title, options = {}) {
      return request('prompt', { ...options, message, title, inputValue: options.initialValue ?? '' })
    },
    preloader(title, options = {}) {
      const dialog = { type: 'preloader', ...options, title }
      const request = show(dialog)
      return { close: () => dismiss(request) }
    }
  }

  const Host = defineComponent({
    name: 'UiDialogHost',
    setup() {
      function close(request, value) { finish(request, value) }

      return () => {
        const request = active.value
        if (!request) return null

        return h(adapter.components.Dialog, {
          modelValue: request.open,
          type: request.type,
          title: request.title,
          message: request.message,
          label: request.label,
          inputValue: request.inputValue,
          placeholder: request.placeholder,
          acceptText: request.acceptText,
          cancelText: request.cancelText,
          'onUpdate:inputValue': (value) => { request.inputValue = value },
          'onUpdate:modelValue': (visible) => {
            if (!visible && request.type !== 'preloader') dismiss(request, request.type === 'confirm' ? false : null)
          },
          onAccept: (value) => dismiss(request, request.type === 'confirm' ? true : value),
          onCancel: () => dismiss(request, request.type === 'confirm' ? false : null),
          onClosed: () => close(request, request.result)
        })
      }
    }
  })

  return { ...service, Host }
}
