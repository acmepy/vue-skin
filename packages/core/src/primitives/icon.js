import { defineComponent, h } from 'vue'

/**
 * Framework-neutral renderer. Vite projects should enable icon-forge so only
 * literal icon names are emitted into a local stylesheet at build time.
 */
export const UiIcon = defineComponent({
  name: 'UiIcon',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    label: String
  },
  setup(props, { attrs }) {
    return () => h('span', {
      ...attrs,
      class: [attrs.class, `icon:${props.name}`],
      role: props.label ? 'img' : undefined,
      'aria-label': props.label,
      'aria-hidden': props.label ? undefined : 'true'
    })
  }
})
