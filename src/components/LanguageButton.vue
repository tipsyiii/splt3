<template>
  <picker
    class="bg-transparent text-zinc-300 cursor-pointer"
    mode="selector"
    :range="localeLabels"
    :value="currentIndex"
    @change="onChange"
  >
    <view class="bg-transparent text-zinc-300 cursor-pointer">
      {{ currentLabel }}
    </view>
  </picker>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { locales, setPreferredLocale } from '@/common/i18n';

const i18n = useI18n();

const currentLanguage = computed({
  get() { return i18n.locale.value; },
  set(value) { setPreferredLocale(value); },
});

const localeLabels = computed(() => locales.map(locale => `${locale.flag} ${locale.name}`));

const currentIndex = computed(() => {
  const idx = locales.findIndex(locale => locale.code === currentLanguage.value);
  return idx >= 0 ? idx : 0;
});

const currentLabel = computed(() => localeLabels.value[currentIndex.value] || localeLabels.value[0] || '');

function onChange(e) {
  const idx = Number(e?.detail?.value);
  const code = locales[idx]?.code;
  if (code) currentLanguage.value = code;
}
</script>
