<script setup>
import { useTheme } from '@vue-skin/core'
const theme = useTheme()
</script>

<template>
  <UiCard title="Apariencia de la aplicación">
    <UiThemeSelector />
    <p class="small text-body-secondary mt-3 mb-0">Abre el modal con el botón de paleta. También está disponible en el navbar. Los cambios se guardan automáticamente.</p>
  </UiCard>
  <UiCard title="Vista previa" class="mt-4">
    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
      <UiButton>Primario</UiButton>
      <UiButton variant="outline-primary">Contorno</UiButton>
      <UiButton variant="success">Éxito</UiButton>
      <UiButton variant="warning">Advertencia</UiButton>
      <UiButton variant="danger">Error</UiButton>
      <UiBadge>Nuevo</UiBadge>
      <UiLink href="#theme-selector">Enlace de ejemplo</UiLink>
    </div>
    <UiInput label="Campo de ejemplo" placeholder="Enfoca para ver el color de acento" />
    <UiList :filter="false">
      <UiListItem title="Elemento seleccionado" active />
      <UiListItem title="Elemento normal" />
    </UiList>
    <UiAlert variant="primary" class="mt-3">El acento cambia, pero los estados semánticos mantienen sus colores.</UiAlert>
    <p class="mb-0">Modo: {{ theme.state.mode }} · Modo efectivo: {{ theme.resolvedMode.value }} · Color: {{ theme.state.color }}</p>
  </UiCard>
</template>
