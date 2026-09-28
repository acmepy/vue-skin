export const componentContracts = Object.freeze({
  Button: Object.freeze({ props: ['variant', 'size', 'disabled', 'loading', 'type'], events: ['click'], slots: ['default', 'icon'] }),
  ButtonGroup: Object.freeze({ props: ['size', 'vertical', 'label'], slots: ['default'] }),
  Input: Object.freeze({ props: ['modelValue', 'label', 'type', 'name', 'placeholder', 'help', 'tooltip', 'error', 'validator', 'disabled', 'readonly', 'required', 'autocomplete'], events: ['update:modelValue', 'input', 'change', 'focus', 'blur'] }),
  Icon: Object.freeze({ props: ['name', 'label', 'size'] }),
  List: Object.freeze({ props: ['title', 'divided', 'bordered'], slots: ['default'] }),
  ListItem: Object.freeze({ props: ['href', 'target', 'header', 'title', 'subtitle', 'text', 'footer', 'after', 'badge', 'badgeVariant', 'active', 'disabled', 'groupTitle', 'tooltip'], events: ['click'], slots: ['media', 'default', 'end'] }),
  Link: Object.freeze({ props: ['href', 'target', 'disabled'], events: ['click'], slots: ['default'] }),
  Select: Object.freeze({ props: ['modelValue', 'label', 'options', 'placeholder', 'help', 'tooltip', 'error', 'disabled', 'required'], events: ['update:modelValue', 'change'] }),
  Checkbox: Object.freeze({ props: ['modelValue', 'label', 'help', 'tooltip', 'error', 'disabled', 'required', 'trueValue', 'falseValue'], events: ['update:modelValue', 'change'] }),
  Radio: Object.freeze({ props: ['modelValue', 'value', 'name', 'label', 'help', 'tooltip', 'error', 'disabled', 'required'], events: ['update:modelValue', 'change'] }),
  Switch: Object.freeze({ props: ['modelValue', 'label', 'help', 'tooltip', 'error', 'disabled', 'required', 'trueValue', 'falseValue'], events: ['update:modelValue', 'change'] }),
  Textarea: Object.freeze({ props: ['modelValue', 'label', 'name', 'placeholder', 'help', 'tooltip', 'error', 'disabled', 'readonly', 'required', 'rows', 'maxlength'], events: ['update:modelValue', 'input', 'change', 'focus', 'blur'] }),
  Navbar: Object.freeze({ props: ['title', 'fixed', 'sticky'], slots: ['brand', 'default', 'start', 'end'] }),
  Sidebar: Object.freeze({ props: ['modelValue', 'position', 'width'], events: ['update:modelValue', 'open', 'close'], slots: ['header', 'default', 'footer'] }),
  Card: Object.freeze({ props: ['title'], slots: ['header', 'default', 'list', 'footer'] }),
  Accordion: Object.freeze({ props: ['modelValue', 'items', 'flush'], events: ['update:modelValue'] }),
  Tabs: Object.freeze({ props: ['modelValue', 'items', 'justified'], events: ['update:modelValue', 'change'], slots: ['panel'] }),
  Modal: Object.freeze({ props: ['modelValue', 'title', 'size', 'centered', 'closable'], events: ['update:modelValue', 'open', 'opened', 'close', 'closed'], slots: ['header', 'default', 'footer'] }),
  Dialog: Object.freeze({ props: ['modelValue', 'type', 'title', 'message', 'label', 'inputValue', 'placeholder', 'acceptText', 'cancelText'], events: ['update:modelValue', 'update:inputValue', 'accept', 'cancel', 'closed'] }),
  Dropdown: Object.freeze({ props: ['label', 'items', 'variant', 'size', 'align', 'disabled'], events: ['select', 'show', 'shown', 'hide', 'hidden'] }),
  Alert: Object.freeze({ props: ['variant', 'dismissible'], events: ['close'], slots: ['default'] }),
  Badge: Object.freeze({ props: ['variant', 'pill'], slots: ['default'] }),
  Toast: Object.freeze({ props: ['modelValue', 'title', 'message', 'variant', 'position', 'autohide', 'delay', 'closable'], events: ['update:modelValue', 'show', 'shown', 'hide', 'hidden'], slots: ['default'] }),
  Spinner: Object.freeze({ props: ['size', 'label'] })
})

export const requiredComponents = Object.freeze(Object.keys(componentContracts))
