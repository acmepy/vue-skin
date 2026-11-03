import { defineComponent, h, mergeProps } from 'vue'
import { UiIcon } from '@vue-skin/core'
export const variant = v => v?.startsWith('outline') ? 'outline' : ({ danger: 'destructive', ghost: 'ghost', secondary: 'secondary', link: 'link', primary: 'primary' }[v] ?? 'primary')
export const Button = defineComponent({
  inheritAttrs: false, props: { variant: { default: 'primary' }, size: String, disabled: Boolean, loading: Boolean, type: { default: 'button' } },
  setup: (p, { attrs, slots }) => () => h('button', mergeProps(attrs, { class: 'btn', type: p.type, disabled: p.disabled || p.loading, 'data-variant': variant(p.variant), 'data-tone': p.variant, 'data-size': p.size }), [p.loading ? h('span', { class: 'bc-spinner', 'aria-hidden': 'true' }) : null, slots.icon?.(), slots.default?.()])
})
export const ButtonGroup = defineComponent({ props: { size: String, vertical: Boolean, label: { default: 'Grupo de botones' } }, setup: (p, { slots }) => () => h('div', { class: 'button-group bc-button-group', role: 'group', 'aria-label': p.label, 'data-orientation': p.vertical ? 'vertical' : 'horizontal', 'data-size': p.size }, slots.default?.()) })
export const Badge = defineComponent({ props: { variant: { default: 'primary' }, pill: Boolean }, setup: (p, { slots }) => () => h('span', { class: ['badge', { 'bc-pill': p.pill }], 'data-variant': variant(p.variant), 'data-tone': p.variant }, slots.default?.()) })
export const Spinner = defineComponent({ props: { size: String, label: { default: 'Cargando…' } }, setup: p => () => h('span', { role: 'status', class: 'bc-spinner-status' }, [h('span', { class: ['bc-spinner', { 'bc-spinner-sm': p.size === 'sm' }], 'aria-hidden': 'true' }), h('span', { class: 'bc-sr-only' }, p.label)]) })
export const Card = defineComponent({ props: { title: String }, setup: (p, { slots }) => () => h('section', { class: 'card bc-card' }, [p.title || slots.header ? h('header', {}, slots.header?.() ?? h('h2', {}, p.title)) : null, slots.default ? h('section', {}, slots.default()) : null, slots.list?.(), slots.footer ? h('footer', {}, slots.footer()) : null]) })
export const Link = defineComponent({
  inheritAttrs: false, props: { href: String, target: String, disabled: Boolean }, emits: ['click'],
  setup: (p, { attrs, slots, emit }) => () => h('a', mergeProps(attrs, { class: 'bc-link', href: p.disabled ? undefined : p.href, target: p.target, 'aria-disabled': p.disabled || undefined, tabindex: p.disabled ? -1 : undefined, onClick: e => { if (p.disabled) e.preventDefault(); else emit('click', e) } }), slots.default?.())
})
export const Navbar = defineComponent({ props: { title: String, fixed: Boolean, sticky: Boolean }, setup: (p, { slots }) => () => h('nav', { class: ['bc-navbar', { 'bc-navbar-fixed': p.fixed, 'bc-navbar-sticky': p.sticky }] }, [h('div', { class: 'bc-navbar-start' }, [slots.start?.(), slots.brand?.() ?? h('span', { class: 'bc-navbar-brand' }, p.title)]), h('div', { class: 'bc-navbar-content' }, slots.default?.()), h('div', { class: 'bc-navbar-end' }, slots.end?.())]) })
export const Container = defineComponent({ props: { fluid: Boolean }, setup: (p, { slots }) => () => h('div', { class: ['bc-container', { 'bc-container-fluid': p.fluid }] }, slots.default?.()) })
export const Row = defineComponent({ props: { gap: { default: 'md' } }, setup: (p, { slots }) => () => h('div', { class: 'bc-row', style: { '--bc-gap': ({ none: '0px', xs: '.25rem', sm: '.5rem', md: '1rem', lg: '1.5rem', xl: '3rem' })[p.gap] ?? '1rem' } }, slots.default?.()) })
const span = v => v === 'auto' || /^(?:[1-9]|1[0-2])$/.test(v)
export const Col = defineComponent({ props: { span: [Number, String], sm: [Number, String], md: [Number, String], lg: [Number, String], xl: [Number, String], xxl: [Number, String] }, setup: (p, { slots }) => () => h('div', { class: ['bc-col', ...['span', 'sm', 'md', 'lg', 'xl', 'xxl'].filter(k => span(p[k])).map(k => `bc-col-${k}-${p[k]}`)] }, slots.default?.()) })
export { UiIcon as Icon }
