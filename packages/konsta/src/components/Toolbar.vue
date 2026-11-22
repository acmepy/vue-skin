<script setup>
import { UiIcon, useToolbar } from '@vue-skin/core'
import { Tabbar as KTabbar, TabbarLink as KTabbarLink } from 'konsta/vue'
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
  <KTabbar component="nav" class="ks-toolbar" inner-class="ks-toolbar-inner" :class="{ 'ks-toolbar-fixed': fixed }" :data-position="position" :aria-label="label" :top="position === 'top'" :icons="icons" :labels="labels">
      <slot>
        <KTabbarLink v-for="item in items" :key="item.id" class="ks-toolbar-link" v-bind="attributes(item)" :component="component(item)" :link-props="attributes(item)" :active="active(item)" @click="select(item, $event)">
          <template v-if="icons && (item.icon || $slots.icon)" #icon><slot name="icon" :item="item" :active="active(item)"><UiIcon v-if="item.icon" :name="item.icon" size="24" /></slot></template>
          <template v-if="labels || !icons || (!item.icon && !$slots.icon)" #label><slot name="item" :item="item" :active="active(item)">{{ item.label }}</slot></template>
        </KTabbarLink>
      </slot>
  </KTabbar>
</template>

<style>
.ks-toolbar { width:100%; min-width:0; background:var(--background); color:var(--foreground); border-block-start:1px solid var(--border); }
.ks-toolbar[data-position=top] { border-block-start:0; border-block-end:1px solid var(--border); }
.ks-toolbar.ks-toolbar-fixed { position:fixed; inset-inline:0; bottom:0; z-index:1020; padding-bottom:env(safe-area-inset-bottom,0px); }
.ks-toolbar.ks-toolbar-fixed[data-position=top] { bottom:auto; top:0; padding-bottom:0; padding-top:env(safe-area-inset-top,0px); }
.ks-toolbar-link { min-width:0; min-height:3rem; text-decoration:none; font:inherit; cursor:pointer; }
.ks-toolbar-link[aria-disabled=true] { opacity:.45; cursor:not-allowed; }
.ks-toolbar-link:focus-visible { outline:2px solid var(--primary); outline-offset:-3px; }
.ks-toolbar .ks-toolbar-inner { height:auto; min-height:3.5rem; align-items:stretch; overflow-x:auto; }
.ks-toolbar .ks-toolbar-link { flex:1 0 5rem; width:auto; max-width:none; height:auto; padding:.5rem; white-space:normal; text-align:center; overflow-wrap:anywhere; }
.ks-toolbar-link > span { width:100%; height:auto; min-height:100%; }
.ks-toolbar [aria-disabled=true] { pointer-events:none; }
</style>
