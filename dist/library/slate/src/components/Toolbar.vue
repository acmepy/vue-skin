<script setup>
import { UiIcon, useToolbar } from '../../../core/src/index.js'
const props = defineProps({
  modelValue: [String, Number],
  items: { type:Array, default:() => [] },
  position: { type:String, default:'bottom' },
  fixed: Boolean,
  icons: { type:Boolean, default:true },
  labels: { type:Boolean, default:true },
  label: { type:String, default:'Barra de navegación' }
})
const emit = defineEmits(['update:modelValue', 'select'])
const { active, component, attributes, select } = useToolbar(props, emit)
</script>
<template>
  <nav class="sl-toolbar" :class="{ 'sl-toolbar-fixed': fixed }" :data-position="position" :aria-label="label">
    <slot>
      <component :is="component(item)" v-for="item in items" :key="item.id" class="sl-toolbar-link" :class="{ active: active(item) }" v-bind="attributes(item)" @click="select(item, $event)">
        <span v-if="icons && (item.icon || $slots.icon)" class="sl-toolbar-icon"><slot name="icon" :item="item" :active="active(item)"><UiIcon v-if="item.icon" :name="item.icon" size="24" /></slot></span>
        <span v-if="labels || !icons || (!item.icon && !$slots.icon)" class="sl-toolbar-label"><slot name="item" :item="item" :active="active(item)">{{ item.label }}</slot></span>
      </component>
    </slot>
  </nav>
</template>

<style>
.sl-toolbar { width:100%; min-width:0; background:var(--background); color:var(--foreground); border-block-start:1px solid var(--border); }
.sl-toolbar[data-position=top] { border-block-start:0; border-block-end:1px solid var(--border); }
.sl-toolbar.sl-toolbar-fixed { position:fixed; inset-inline:0; bottom:0; z-index:1020; padding-bottom:env(safe-area-inset-bottom,0px); }
.sl-toolbar.sl-toolbar-fixed[data-position=top] { bottom:auto; top:0; padding-bottom:0; padding-top:env(safe-area-inset-top,0px); }
.sl-toolbar-link { min-width:0; min-height:3rem; text-decoration:none; font:inherit; cursor:pointer; }
.sl-toolbar-link[aria-disabled=true] { opacity:.45; cursor:not-allowed; }
.sl-toolbar-link:focus-visible { outline:2px solid var(--primary); outline-offset:-3px; }
.sl-toolbar { display:flex; align-items:stretch; overflow-x:auto; }
.sl-toolbar-link { flex:1 0 3.5rem; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.25rem; padding:.5rem .75rem; border:0; background:transparent; color:inherit; text-align:center; }
.sl-toolbar-label { font-size:.8rem; overflow-wrap:anywhere; }
.sl-toolbar-icon { display:inline-flex; }
.sl-toolbar-link.active { color:var(--primary); background:var(--accent,var(--muted)); }
.sl-toolbar-link:hover:not([aria-disabled=true]) { background:var(--accent,var(--muted)); }
</style>
