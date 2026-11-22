<script setup>
import { ref } from 'vue'
import { UiWizard } from '@vue-skin/layouts'

const orientations = ['horizontal','vertical']
const steps = [
  { id:'account', label:'Datos personales', description:'Nombre y correo' },
  { id:'delivery', label:'Entrega', description:'Dirección' },
  { id:'review', label:'Confirmación', description:'Revisar los datos' }
]
const forms = ref(Object.fromEntries(orientations.map(value=>[value,{ name:'', email:'', address:'' }])))
const active = ref({ horizontal:'account', vertical:'account' })
const result = ref({ horizontal:'', vertical:'' })
function validate(orientation, { from, direction }) {
  if (direction === 'back' || direction === 'step') return true
  const data = forms.value[orientation]
  if (from.id === 'account' && !data.name.trim()) return 'Ingrese su nombre para continuar.'
  if (from.id === 'account' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Ingrese un correo válido.'
  if (from.id === 'delivery' && !data.address.trim()) return 'Ingrese una dirección de entrega.'
  return true
}
</script>

<template>
  <UiCard v-for="orientation in orientations" :key="orientation" :title="orientation === 'horizontal' ? 'Wizard horizontal' : 'Wizard vertical'" style="margin-bottom:1.5rem">
    <UiWizard v-model="active[orientation]" :items="steps" :orientation="orientation" :before-change="context => validate(orientation,context)" @cancel="result[orientation] = 'Cancelado por el usuario'" @finish="result[orientation] = 'Solicitud confirmada'">
      <template #panel="{ item }">
        <template v-if="item.id === 'account'">
          <UiInput v-model="forms[orientation].name" label="Nombre" autocomplete="name" />
          <UiInput v-model="forms[orientation].email" type="email" label="Correo" autocomplete="email" />
        </template>
        <UiInput v-else-if="item.id === 'delivery'" v-model="forms[orientation].address" label="Dirección de entrega" autocomplete="street-address" />
        <div v-else>
          <h3 style="font-size:1rem">Revisa tu solicitud</h3>
          <p>{{ forms[orientation].name }} · {{ forms[orientation].email }}</p>
          <p>{{ forms[orientation].address }}</p>
        </div>
      </template>
      <template #complete="{ reset }">
        <UiAlert variant="success">{{ result[orientation] }}</UiAlert>
        <UiButton variant="outline-secondary" style="margin-top:1rem" @click="reset">Comenzar de nuevo</UiButton>
      </template>
    </UiWizard>
    <p v-if="result[orientation]" role="status" style="margin:1rem 0 0">{{ result[orientation] }}</p>
  </UiCard>
</template>
