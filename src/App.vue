<template>
  <view :class="rootClass">
    <slot />
  </view>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDataStore } from './stores/data';
import { useTimeStore } from './stores/time.mjs';

const time = useTimeStore();
onMounted(() => time.startUpdatingNow());
onUnmounted(() => time.stopUpdatingNow());

const data = useDataStore();
onMounted(() => data.startUpdating());
onUnmounted(() => data.stopUpdating());

const isMobile = ref(false);

const { locale } = useI18n();

function normalizeLocaleClass(code) {
  return `lang-${String(code || 'en-US').replace('_', '-').toLowerCase()}`;
}

const rootClass = computed(() => ({
  'is-mobile': isMobile.value,
  [normalizeLocaleClass(locale.value)]: true,
}));

function detectMobile() {
  try {
    if (typeof uni !== 'undefined' && typeof uni.getSystemInfoSync === 'function') {
      const info = uni.getSystemInfoSync();
      const platform = String(info.platform || '').toLowerCase();
      isMobile.value = platform === 'ios' || platform === 'android';
      return;
    }
  } catch (e) {
    //
  }

  try {
    isMobile.value = !!navigator.userAgent.match(/iPhone|iPad|Android/i);
  } catch (e) {
    //
  }
}

onMounted(() => detectMobile());
</script>

<style>
@import '@/assets/css/base.css';
</style>
