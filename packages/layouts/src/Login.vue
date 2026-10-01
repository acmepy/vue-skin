<script setup>
defineOptions({ inheritAttrs: false })

const props = defineProps({
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  remember: Boolean,
  title: { type: String, default: 'Iniciar sesión' },
  emailLabel: { type: String, default: 'Correo electrónico' },
  emailPlaceholder: { type: String, default: 'nombre@ejemplo.com' },
  passwordLabel: { type: String, default: 'Contraseña' },
  rememberLabel: { type: String, default: 'Recordarme' },
  submitLabel: { type: String, default: 'Ingresar' },
  loading: Boolean,
  disabled: Boolean,
  fullHeight: { type: Boolean, default: true }
})
const emit = defineEmits(['update:email', 'update:password', 'update:remember', 'submit'])

function submit() {
  if (!props.disabled && !props.loading) {
    emit('submit', { email: props.email, password: props.password, remember: props.remember })
  }
}
</script>

<template>
  <main class="ui-login" :class="{ 'ui-login-full-height': fullHeight }">
    <form v-bind="$attrs" class="ui-login-form" @submit.prevent="submit">
      <div class="ui-login-brand">
        <slot name="brand"><UiIcon name="lucide:lock-keyhole" size="xl" /></slot>
      </div>
      <h1 class="ui-login-title">{{ title }}</h1>
      <slot name="before-fields" />
      <UiInput :model-value="email" type="email" :label="emailLabel" :placeholder="emailPlaceholder" autocomplete="email" required :disabled="disabled || loading" @update:model-value="emit('update:email', $event)" />
      <UiInput :model-value="password" type="password" :label="passwordLabel" autocomplete="current-password" required :disabled="disabled || loading" @update:model-value="emit('update:password', $event)" />
      <UiCheckbox :model-value="remember" :label="rememberLabel" :disabled="disabled || loading" @update:model-value="emit('update:remember', $event)" />
      <UiButton class="ui-login-submit w-100" type="submit" :loading="loading" :disabled="disabled">{{ submitLabel }}</UiButton>
      <slot name="footer" />
    </form>
  </main>
</template>

<style>
.ui-login { display: grid; place-items: center; padding: 1.5rem; }
.ui-login-full-height { min-height: 100vh; }
.ui-login-form { width: min(100%, 22rem); }
.ui-login-brand { display: flex; justify-content: center; margin-bottom: 1rem; }
.ui-login-title { margin: 0 0 1.5rem; font-size: 1.5rem; font-weight: 600; text-align: center; }
.ui-login-submit { margin-top: .5rem; }
</style>
