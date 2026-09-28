<script setup>
import { computed, useId } from 'vue'

const props = defineProps({ modelValue: { type: [String, Number], default: null }, items: { type: Array, default: () => [] }, justified: Boolean })
const emit = defineEmits(['update:modelValue', 'change'])
const generatedId = useId()
const active = computed(() => props.modelValue ?? props.items.find((item) => !item.disabled)?.id)
const tabId = (item) => `vue-skin-tab-${generatedId}-${item.id}`
const panelId = (item) => `vue-skin-tab-panel-${generatedId}-${item.id}`
function select(item) { if (!item.disabled && item.id !== active.value) { emit('update:modelValue', item.id); emit('change', item) } }
</script>

<template>
  <div>
    <ul class="nav nav-tabs" :class="{ 'nav-justified': justified }" role="tablist">
      <li v-for="item in items" :key="item.id" class="nav-item" role="presentation">
        <button class="nav-link" :class="{ active: active === item.id, disabled: item.disabled }" type="button" role="tab" :id="tabId(item)" :aria-selected="active === item.id" :aria-controls="panelId(item)" :disabled="item.disabled" @click="select(item)">{{ item.label }}</button>
      </li>
    </ul>
    <div class="tab-content border border-top-0 rounded-bottom p-3">
      <section v-for="item in items" v-show="active === item.id" :key="item.id" class="tab-pane fade" :class="{ 'show active': active === item.id }" role="tabpanel" :id="panelId(item)" :aria-labelledby="tabId(item)"><slot name="panel" :item="item">{{ item.content }}</slot></section>
    </div>
  </div>
</template>
