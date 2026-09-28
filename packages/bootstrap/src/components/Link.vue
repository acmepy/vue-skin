<script setup>
defineOptions({ inheritAttrs: false })
const props = defineProps({ href: { type: String, default: '#' }, target: String, disabled: Boolean })
const emit = defineEmits(['click'])
function click(event) {
  if (props.disabled) { event.preventDefault(); return }
  emit('click', event)
}
</script>

<template>
  <a v-bind="$attrs" :href="disabled ? undefined : href" :target="target" :class="{ disabled }" :aria-disabled="disabled ? 'true' : undefined" :tabindex="disabled ? -1 : undefined" @click="click"><slot /></a>
</template>
