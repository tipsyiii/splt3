import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';

import { initializeI18n } from './common/i18n';

import App from './App.vue';
import RouterLinkCompat from './components/RouterLinkCompat.vue';

export function createApp() {
  const i18n = initializeI18n();
  const app = createSSRApp(App);

  app.use(i18n);
  app.use(createPinia());
  app.component('router-link', RouterLinkCompat);

  return {
    app,
  };
}
