<template>
  <navigator :url="url" :open-type="openType" :class="className">
    <slot />
  </navigator>
</template>

<script setup>
import { computed, useAttrs } from 'vue';

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  replace: Boolean,
});

const attrs = useAttrs();

function normalizeTo(to) {
  if (typeof to === 'string') {
    return to;
  }

  if (to && typeof to === 'object' && typeof to.path === 'string') {
    return to.path;
  }

  return '';
}

const routeMap = {
  '/': '/pages/index/index',
  '/salmonrun': '/pages/salmonrun/index',
  '/challenges': '/pages/challenges/index',
  '/gear': '/pages/gear/index',
  '/splatfests': '/pages/splatfests/index',
  '/about': '/pages/about/index',
  '/socials': '/pages/socials/index',
  '/faq': '/pages/about/index',
};

const url = computed(() => {
  const raw = normalizeTo(props.to);
  const mapped = routeMap[raw] || raw;
  if (!mapped) {
    return '/pages/index/index';
  }
  return mapped.startsWith('/') ? mapped : `/${mapped}`;
});

const openType = computed(() => (props.replace ? 'redirect' : 'navigate'));

const isActive = computed(() => {
  try {
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    if (!current || !current.route) {
      return false;
    }
    const currentRoute = String(current.route);
    const targetRoute = url.value.replace(/^\//, '');
    return currentRoute === targetRoute;
  } catch (e) {
    return false;
  }
});

const className = computed(() => {
  const base = attrs.class;
  return isActive.value ? [base, 'router-link-active'] : base;
});
</script>
