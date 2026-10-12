<template>
  <UiContainer fluid>
    <UiCard title="Columnas responsive">
      <p>12 columnas en móvil, 6 desde md y 4 desde lg. Cambia el ancho de la ventana para ver la distribución.</p>
      <UiRow gap="md">
        <UiCol v-for="index in 3" :key="index" :span="12" :md="6" :lg="4">
          <UiCard :title="'Bloque ' + index"><p>span=12 · md=6 · lg=4</p></UiCard>
        </UiCol>
      </UiRow>
    </UiCard>
    <UiCard title="Columnas iguales" class="mt-4">
      <p>Sin span, las columnas comparten el espacio disponible.</p>
      <UiRow gap="sm">
        <UiCol><UiCard title="Primera"><p>UiCol</p></UiCard></UiCol>
        <UiCol><UiCard title="Segunda"><p>UiCol</p></UiCard></UiCol>
      </UiRow>
    </UiCard>
    <UiCard title="Ancho según contenido" class="mt-4">
      <UiRow gap="lg">
        <UiCol span="auto"><UiBadge>Automático</UiBadge></UiCol>
        <UiCol><p>Esta columna ocupa el espacio restante.</p></UiCol>
      </UiRow>
    </UiCard>
    <UiCard title="Sin separación" class="mt-4">
      <UiRow gap="none">
        <UiCol span="6"><UiCard title="Mitad izquierda"><p>6 / 12</p></UiCard></UiCol>
        <UiCol span="6"><UiCard title="Mitad derecha"><p>6 / 12</p></UiCard></UiCol>
      </UiRow>
    </UiCard>
  </UiContainer>
</template>
