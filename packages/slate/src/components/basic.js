import { defineComponent, h, mergeProps } from 'vue'
import { UiIcon } from '@vue-skin/core'
export const variant = v => v?.startsWith('outline') ? 'outline' : (v || 'primary')
export const Button = defineComponent({
  inheritAttrs: false, props: { variant: { default: 'primary' }, size: String, disabled: Boolean, loading: Boolean, type: { default: 'button' } },
  setup: (p, { attrs, slots }) => () => h('button', mergeProps(attrs, { class: 'sl-button', type: p.type, disabled: p.disabled || p.loading, 'data-variant': variant(p.variant), 'data-tone': p.variant, 'data-size': p.size }), [p.loading ? h('span', { class: 'sl-spinner', 'aria-hidden': 'true' }) : null, slots.icon?.(), slots.default?.()])
})
export const ButtonGroup = defineComponent({ props: { size: String, vertical: Boolean, label: { default: 'Grupo de botones' } }, setup: (p, { slots }) => () => h('div', { class: 'sl-button-group', role: 'group', 'aria-label': p.label, 'data-orientation': p.vertical ? 'vertical' : 'horizontal', 'data-size': p.size }, slots.default?.()) })
export const Badge = defineComponent({ props: { variant: { default: 'primary' }, pill: Boolean }, setup: (p, { slots }) => () => h('span', { class: ['sl-badge', { 'sl-pill': p.pill }], 'data-variant': variant(p.variant), 'data-tone': p.variant }, slots.default?.()) })
export const Spinner = defineComponent({ props: { size: String, label: { default: 'Cargando…' } }, setup: p => () => h('span', { role: 'status', class: 'sl-spinner-status' }, [h('span', { class: ['sl-spinner', { 'sl-spinner-sm': p.size === 'sm' }], 'aria-hidden': 'true' }), h('span', { class: 'sl-sr-only' }, p.label)]) })
export const Card = defineComponent({ props: { title: String }, setup: (p, { slots }) => () => h('section', { class: 'sl-card' }, [p.title || slots.header ? h('header', { class: 'sl-card-header' }, slots.header?.() ?? h('h2', { class: 'sl-card-title' }, p.title)) : null, slots.default ? h('section', { class: 'sl-card-content' }, slots.default()) : null, slots.list?.(), slots.footer ? h('footer', { class: 'sl-card-footer' }, slots.footer()) : null]) })
export const Link = defineComponent({
  inheritAttrs: false, props: { href: String, target: String, disabled: Boolean }, emits: ['click'],
  setup: (p, { attrs, slots, emit }) => () => h('a', mergeProps(attrs, { class: 'sl-link', href: p.disabled ? undefined : p.href, target: p.target, 'aria-disabled': p.disabled || undefined, tabindex: p.disabled ? -1 : undefined, onClick: e => { if (p.disabled) e.preventDefault(); else emit('click', e) } }), slots.default?.())
})
export const Navbar = defineComponent({ props: { title: String, fixed: Boolean, sticky: Boolean }, setup: (p, { slots }) => () => h('nav', { class: ['sl-navbar', { 'sl-navbar-fixed': p.fixed, 'sl-navbar-sticky': p.sticky }] }, [h('div', { class: 'sl-navbar-start' }, [slots.start?.(), slots.brand?.() ?? h('span', { class: 'sl-navbar-brand' }, p.title)]), h('div', { class: 'sl-navbar-content' }, slots.default?.()), h('div', { class: 'sl-navbar-end' }, slots.end?.())]) })
export const Container = defineComponent({ props: { fluid: Boolean }, setup: (p, { slots }) => () => h('div', { class: ['sl-container', { 'sl-container-fluid': p.fluid }] }, slots.default?.()) })
export const Row = defineComponent({ props: { gap: { default: 'md' } }, setup: (p, { slots }) => () => h('div', { class: 'sl-row', style: { '--sl-gap': ({ none: '0px', xs: '.25rem', sm: '.5rem', md: '1rem', lg: '1.5rem', xl: '3rem' })[p.gap] ?? '1rem' } }, slots.default?.()) })
const span = v => v === 'auto' || /^(?:[1-9]|1[0-2])$/.test(v)
export const Col = defineComponent({ props: { span: [Number, String], sm: [Number, String], md: [Number, String], lg: [Number, String], xl: [Number, String], xxl: [Number, String] }, setup: (p, { slots }) => () => h('div', { class: ['sl-col', ...['span', 'sm', 'md', 'lg', 'xl', 'xxl'].filter(k => span(p[k])).map(k => `sl-col-${k}-${p[k]}`)] }, slots.default?.()) })
export { UiIcon as Icon }
