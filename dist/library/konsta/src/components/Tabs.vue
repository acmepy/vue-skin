<script setup>
import { computed, useId } from 'vue'
const props = defineProps({ modelValue: { type: [String, Number], default: null }, items: { type: Array, default: () => [] }, justified: Boolean })
const emit = defineEmits(['update:modelValue', 'change'])
const id = useId()
const active = computed(() => props.modelValue ?? props.items.find(item => !item.disabled)?.id)
function select(item) { if (!item.disabled && item.id !== active.value) { emit('update:modelValue', item.id); emit('change', item) } }
function move(event, item) {
  const options = props.items.filter(item => !item.disabled)
  let next
  const index = options.indexOf(item)
  if (event.key === 'ArrowRight') next = options[(index + 1) % options.length]
  if (event.key === 'ArrowLeft') next = options[(index - 1 + options.length) % options.length]
  if (event.key === 'Home') next = options[0]
  if (event.key === 'End') next = options.at(-1)
  if (next) { event.preventDefault(); select(next); document.getElementById(id + '-tab-' + next.id)?.focus() }
}
</script>
<template>
  <div class="tabs ks-tabs"><nav role="tablist" :class="{ 'ks-tabs-justified': justified }"><button v-for="item in items" :key="item.id" type="button" role="tab" :id="id + '-tab-' + item.id" :aria-controls="id + '-panel-' + item.id" :aria-selected="active === item.id" :disabled="item.disabled" :tabindex="active === item.id ? 0 : -1" @click="select(item)" @keydown="move($event,item)">{{ item.label }}</button></nav>
    <section v-for="item in items" :key="item.id" :hidden="active !== item.id" role="tabpanel" :id="id + '-panel-' + item.id" :aria-labelledby="id + '-tab-' + item.id"><slot name="panel" :item="item">{{ item.content }}</slot></section>
  </div>
</template>
