<template>
  <f7-block-title>Apariencia</f7-block-title>
  <f7-block>
    <div class="grid grid-cols-2 grid-gap">
      <div class="bg-color-white demo-theme-picker theme-mode-picker" :class="{ 'theme-mode-picker-active': mode === 'light' }" @click="onSetMode('light')">
        <label class="checkbox" v-if="mode === 'light'"><input type="checkbox" checked disabled /><i class="icon-checkbox"></i></label>
        <span class="theme-mode-label">Claro</span>
      </div>

      <div class="bg-color-black demo-theme-picker theme-mode-picker" :class="{ 'theme-mode-picker-active': mode === 'dark' }" @click="onSetMode('dark')">
        <label class="checkbox" v-if="mode === 'dark'"><input type="checkbox" checked disabled /><i class="icon-checkbox"></i></label>
        <span class="theme-mode-label theme-mode-label-dark">Oscuro</span>
      </div>
    </div>
  </f7-block>

  <f7-block-title>Colores</f7-block-title>
  <f7-block>
    <p>Reparto viene con {{ getColors().length }} colores.</p>
    <div class="grid grid-cols-3 medium-grid-cols-4 large-grid-cols-5 grid-gap">
      <div v-for="item in getColors()" :key="item">
        <f7-button fill class="demo-color-picker-button" :color="item" @click="onSetColorTheme(item)" style="font-size: 75%;">{{ capitalize(item) }}</f7-button>
      </div>
    </div>
  </f7-block>

  <f7-block-title>Material Design</f7-block-title>
  <f7-block>
    <f7-list inset strong>
      <f7-list-item title="Vibrant">
        <template #after>
          <f7-toggle
            :checked="vibrant"
            @change="onSetVibrant(!vibrant)" />
        </template>
      </f7-list-item>

      <f7-list-item title="Monochrome">
        <template #after>
          <f7-toggle
            :checked="monochrome"
            @change="onSetMonochrome(!monochrome)" />
        </template>
      </f7-list-item>
    </f7-list>
  </f7-block>
</template>

<style scoped>
.theme-mode-picker {
  position: relative;
  min-height: 72px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.theme-mode-picker-active {
  box-shadow: 0 0 0 2px var(--f7-theme-color);
}

.theme-mode-picker .checkbox {
  position: absolute;
  top: 8px;
  right: 8px;
}

.theme-mode-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

.theme-mode-label-dark {
  color: #ffffff;
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { f7 } from 'framework7-vue';
import { setMode, getMode, getColors, setColorTheme, setMdColorScheme, getVibrant, getMonochrome } from '@/utils/theme';

const mode = ref(getMode());
const color = ref('');
const vibrant = ref(getVibrant());
const monochrome = ref(getMonochrome());

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function onSetMode(newMode) {
  setMode(newMode);
}

function onSetColorTheme(newColor) {
  setColorTheme(newColor);
}

function onSetVibrant(value) {
  setMdColorScheme(value, monochrome.value);
}

function onSetMonochrome(value) {
  setMdColorScheme(vibrant.value, value);
}

function syncState(data = {}) {
  mode.value = data.newMode ?? getMode();
  color.value = data.newColor ?? color.value;
  vibrant.value = getVibrant();
  monochrome.value = getMonochrome();
}

let offThemeChange = null;

onMounted(() => {
  syncState();

  //const handler = (data) => syncState(data);
  //f7.on('theme:change', handler);
  //offThemeChange = () => f7.off('theme:change', handler
  f7.on('theme:change', syncState);
  offThemeChange = () => f7.off('theme:change', syncState);
});

onBeforeUnmount(() => {
  if (offThemeChange) offThemeChange();
});
</script>
