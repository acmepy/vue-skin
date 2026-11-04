<script setup>
import { ref } from 'vue'
const props = defineProps({ variant: { default: 'info' }, dismissible: Boolean })
const emit = defineEmits(['close'])
const visible = ref(true)
</script>
<template><div v-if="visible" class="alert ks-alert" :data-tone="variant" role="alert"><section><slot /></section><button v-if="dismissible" type="button" class="ks-icon-button" aria-label="Cerrar" @click="visible = false; emit('close')">×</button></div></template>
