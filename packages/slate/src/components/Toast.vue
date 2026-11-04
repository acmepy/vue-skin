<script setup>
import { onBeforeUnmount, watch } from 'vue'
const props = defineProps({ modelValue: Boolean, title: String, message: String, variant: String, position: { default: 'top-end' }, autohide: { type: Boolean, default: true }, delay: { type: Number, default: 5000 }, closable: { type: Boolean, default: true } })
const emit = defineEmits(['update:modelValue','show','shown','hide','hidden'])
let timer
function hide() { emit('update:modelValue', false) }
watch(() => [props.modelValue,props.autohide,props.delay], ([visible], old) => { clearTimeout(timer); if ((old && visible !== old[0]) || (!old && visible)) { emit(visible ? 'show' : 'hide'); emit(visible ? 'shown' : 'hidden') }; if (visible && props.autohide) timer = setTimeout(hide, props.delay) }, { immediate: true })
onBeforeUnmount(() => clearTimeout(timer))
</script>
<template>
  <div v-if="modelValue" class="toaster sl-toaster" :data-position="position" :data-align="position.split('-')[1]">
    <div class="toast sl-toast" :data-tone="variant" role="status">
      <div class="toast-content">
        <section><h2 v-if="title">{{ title }}</h2><slot>{{ message }}</slot></section>
        <footer v-if="closable"><button class="sl-button" data-variant="ghost" type="button" aria-label="Cerrar" @click="hide">×</button></footer>
      </div>
    </div>
  </div>
</template>
