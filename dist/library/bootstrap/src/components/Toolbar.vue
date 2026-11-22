<script setup>
import '../styles/base.css'
import '../styles/Tabs.css'
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
  <nav class="bs-toolbar nav nav-pills nav-justified" :class="{ 'bs-toolbar-fixed': fixed }" :data-position="position" :aria-label="label">
    <slot>
      <component :is="component(item)" v-for="item in items" :key="item.id" class="bs-toolbar-link nav-link" :class="{ active: active(item) }" v-bind="attributes(item)" @click="select(item, $event)">
        <span v-if="icons && (item.icon || $slots.icon)" class="bs-toolbar-icon"><slot name="icon" :item="item" :active="active(item)"><UiIcon v-if="item.icon" :name="item.icon" size="24" /></slot></span>
        <span v-if="labels || !icons || (!item.icon && !$slots.icon)" class="bs-toolbar-label"><slot name="item" :item="item" :active="active(item)">{{ item.label }}</slot></span>
      </component>
    </slot>
  </nav>
</template>

<style>
.bs-toolbar { width:100%; min-width:0; background:var(--bs-body-bg); color:var(--bs-body-color); border-block-start:1px solid var(--bs-border-color); }
.bs-toolbar[data-position=top] { border-block-start:0; border-block-end:1px solid var(--bs-border-color); }
.bs-toolbar.bs-toolbar-fixed { position:fixed; inset-inline:0; bottom:0; z-index:1020; padding-bottom:env(safe-area-inset-bottom,0px); }
.bs-toolbar.bs-toolbar-fixed[data-position=top] { bottom:auto; top:0; padding-bottom:0; padding-top:env(safe-area-inset-top,0px); }
.bs-toolbar-link { min-width:0; min-height:3rem; text-decoration:none; font:inherit; cursor:pointer; }
.bs-toolbar-link[aria-disabled=true] { opacity:.45; cursor:not-allowed; }
.bs-toolbar-link:focus-visible { outline:2px solid var(--bs-primary); outline-offset:-3px; }
.bs-toolbar { display:flex; align-items:stretch; overflow-x:auto; }
.bs-toolbar-link { flex:1 0 3.5rem; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.25rem; padding:.5rem .75rem; border:0; background:transparent; color:inherit; text-align:center; }
.bs-toolbar-label { font-size:.8rem; overflow-wrap:anywhere; }
.bs-toolbar-icon { display:inline-flex; }
</style>
