import { defineComponent, h, mergeProps } from 'vue'
import { UiIcon } from '@vue-skin/core'
import { Button as KButton, Badge as KBadge, Card as KCard, Preloader as KPreloader } from 'konsta/vue'
export const variant = v => v?.startsWith('outline') ? 'outline' : ({ danger: 'destructive', ghost: 'ghost', secondary: 'secondary', link: 'link', primary: 'primary' }[v] ?? 'primary')
export const Button = defineComponent({
  inheritAttrs: false, props: { variant: { default: 'primary' }, size: String, disabled: Boolean, loading: Boolean, type: { default: 'button' } },
  setup: (p, { attrs, slots }) => () => h(KButton, mergeProps(attrs, { class: 'ks-button', type: p.type, disabled: p.disabled || p.loading, outline: p.variant?.startsWith('outline'), clear: ['link', 'ghost'].includes(p.variant), tonal: p.variant === 'secondary', small: p.size === 'sm', large: p.size === 'lg', 'data-variant': variant(p.variant), 'data-tone': p.variant, 'data-size': p.size }), { default: () => [p.loading ? h(KPreloader, { class: 'ks-loading', 'aria-hidden': 'true' }) : null, slots.icon?.(), slots.default?.()] })
})
export const ButtonGroup = defineComponent({ props: { size: String, vertical: Boolean, label: { default: 'Grupo de botones' } }, setup: (p, { slots }) => () => h('div', { class: 'button-group ks-button-group', role: 'group', 'aria-label': p.label, 'data-orientation': p.vertical ? 'vertical' : 'horizontal', 'data-size': p.size }, slots.default?.()) })
export const Badge = defineComponent({ props: { variant: { default: 'primary' }, pill: Boolean }, setup: (p, { slots }) => () => h(KBadge, { class: ['ks-badge', { 'ks-pill': p.pill }], 'data-tone': p.variant }, { default: slots.default }) })
export const Spinner = defineComponent({ props: { size: String, label: { default: 'Cargando…' } }, setup: p => () => h('span', { role: 'status', class: 'ks-spinner-status' }, [h(KPreloader, { class: p.size === 'sm' ? 'ks-loading' : '', 'aria-hidden': 'true' }), h('span', { class: 'ks-sr-only' }, p.label)]) })
export const Card = defineComponent({ props: { title: String }, setup: (p, { slots }) => () => h(KCard, { component: 'section', class: 'ks-card', contentWrap: false, headerDivider: true, footerDivider: true }, { ...(p.title || slots.header ? { header: () => slots.header?.() ?? h('h2', {}, p.title) } : {}), default: () => [slots.default ? h('section', { class: 'ks-card-body' }, slots.default()) : null, slots.list?.()], ...(slots.footer ? { footer: slots.footer } : {}) }) })
export const Link = defineComponent({
  inheritAttrs: false, props: { href: String, target: String, disabled: Boolean }, emits: ['click'],
  setup: (p, { attrs, slots, emit }) => () => h('a', mergeProps(attrs, { class: 'ks-link', href: p.disabled ? undefined : p.href, target: p.target, 'aria-disabled': p.disabled || undefined, tabindex: p.disabled ? -1 : undefined, onClick: e => { if (p.disabled) e.preventDefault(); else emit('click', e) } }), slots.default?.())
})
export const Navbar = defineComponent({ props: { title: String, fixed: Boolean, sticky: Boolean }, setup: (p, { slots }) => () => h('nav', { class: ['ks-navbar', { 'ks-navbar-fixed': p.fixed, 'ks-navbar-sticky': p.sticky }] }, [h('div', { class: 'ks-navbar-start' }, [slots.start?.(), slots.brand?.() ?? h('span', { class: 'ks-navbar-brand' }, p.title)]), h('div', { class: 'ks-navbar-content' }, slots.default?.()), h('div', { class: 'ks-navbar-end' }, slots.end?.())]) })
export const Container = defineComponent({ props: { fluid: Boolean }, setup: (p, { slots }) => () => h('div', { class: ['ks-container', { 'ks-container-fluid': p.fluid }] }, slots.default?.()) })
export const Row = defineComponent({ props: { gap: { default: 'md' } }, setup: (p, { slots }) => () => h('div', { class: 'ks-row', style: { '--ks-gap': ({ none: '0px', xs: '.25rem', sm: '.5rem', md: '1rem', lg: '1.5rem', xl: '3rem' })[p.gap] ?? '1rem' } }, slots.default?.()) })
const span = v => v === 'auto' || /^(?:[1-9]|1[0-2])$/.test(v)
export const Col = defineComponent({ props: { span: [Number, String], sm: [Number, String], md: [Number, String], lg: [Number, String], xl: [Number, String], xxl: [Number, String] }, setup: (p, { slots }) => () => h('div', { class: ['ks-col', ...['span', 'sm', 'md', 'lg', 'xl', 'xxl'].filter(k => span(p[k])).map(k => `ks-col-${k}-${p[k]}`)] }, slots.default?.()) })
export { UiIcon as Icon }
