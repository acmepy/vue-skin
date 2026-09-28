import { defineComponent, h } from 'vue'

const namedSizes = Object.freeze({ xs: '.75em', sm: '1em', md: '1.25em', lg: '1.5em', xl: '2em' })

function resolveSize(size) {
  if (size === undefined || size === null || size === '') return undefined
  if (typeof size === 'number') return `${size}px`
  return namedSizes[size] ?? (/^\d+(?:\.\d+)?$/.test(size) ? `${size}px` : size)
}

/**
 * Framework-neutral renderer. Vite projects should enable icon-forge so only
 * literal icon names are emitted into a local stylesheet at build time.
 */
export const UiIcon = defineComponent({
  name: 'UiIcon',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    label: String,
    size: [String, Number]
  },
  setup(props, { attrs }) {
    return () => {
      const size = resolveSize(props.size)

      return h('span', {
        ...attrs,
        class: [attrs.class, `icon:${props.name}`],
        style: [attrs.style, size ? { width: size, height: size } : undefined],
        role: props.label ? 'img' : undefined,
        'aria-label': props.label,
        'aria-hidden': props.label ? undefined : 'true'
      })
    }
  }
})
