<script setup>
import { ref } from 'vue'

const current = ref('delivery')
const items = [
  { id:'account', label:'Cuenta', description:'Datos personales' },
  { id:'delivery', label:'Entrega', description:'Dirección y contacto' },
  { id:'payment', label:'Pago', description:'Confirmar la compra' }
]
</script>

<template>
  <UiCard title="Etapas horizontales">
    <UiStepper v-model="current" :items="items" />
    <p style="margin-top:1.5rem">Selecciona una etapa. Actual: {{ current }}</p>
  </UiCard>
  <UiCard title="Etapas verticales" style="margin-top:1.5rem">
    <UiStepper v-model="current" :items="items" orientation="vertical" />
  </UiCard>
  <UiCard title="Indicador de solo lectura" style="margin-top:1.5rem">
    <UiStepper model-value="delivery" :items="items" readonly />
  </UiCard>
</template>
