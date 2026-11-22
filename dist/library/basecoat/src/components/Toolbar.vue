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
  <nav class="bc-toolbar" :class="{ 'bc-toolbar-fixed': fixed }" :data-position="position" :aria-label="label">
    <slot>
      <component :is="component(item)" v-for="item in items" :key="item.id" class="bc-toolbar-link" :class="{ active: active(item) }" v-bind="attributes(item)" @click="select(item, $event)">
        <span v-if="icons && (item.icon || $slots.icon)" class="bc-toolbar-icon"><slot name="icon" :item="item" :active="active(item)"><UiIcon v-if="item.icon" :name="item.icon" size="24" /></slot></span>
        <span v-if="labels || !icons || (!item.icon && !$slots.icon)" class="bc-toolbar-label"><slot name="item" :item="item" :active="active(item)">{{ item.label }}</slot></span>
      </component>
    </slot>
  </nav>
</template>

<style>
.bc-toolbar { width:100%; min-width:0; background:var(--background); color:var(--foreground); border-block-start:1px solid var(--border); }
.bc-toolbar[data-position=top] { border-block-start:0; border-block-end:1px solid var(--border); }
.bc-toolbar.bc-toolbar-fixed { position:fixed; inset-inline:0; bottom:0; z-index:1020; padding-bottom:env(safe-area-inset-bottom,0px); }
.bc-toolbar.bc-toolbar-fixed[data-position=top] { bottom:auto; top:0; padding-bottom:0; padding-top:env(safe-area-inset-top,0px); }
.bc-toolbar-link { min-width:0; min-height:3rem; text-decoration:none; font:inherit; cursor:pointer; }
.bc-toolbar-link[aria-disabled=true] { opacity:.45; cursor:not-allowed; }
.bc-toolbar-link:focus-visible { outline:2px solid var(--primary); outline-offset:-3px; }
.bc-toolbar { display:flex; align-items:stretch; overflow-x:auto; }
.bc-toolbar-link { flex:1 0 3.5rem; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.25rem; padding:.5rem .75rem; border:0; background:transparent; color:inherit; text-align:center; }
.bc-toolbar-label { font-size:.8rem; overflow-wrap:anywhere; }
.bc-toolbar-icon { display:inline-flex; }
.bc-toolbar-link.active { color:var(--primary); background:var(--accent,var(--muted)); }
.bc-toolbar-link:hover:not([aria-disabled=true]) { background:var(--accent,var(--muted)); }
</style>
