import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import tailwindcssNesting from 'tailwindcss/nesting';
import tailwindcss from 'tailwindcss';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind';

const redirectToDist = [
  '/assets/splatnet/',
  '/data/',
];

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindcssNesting(),
        tailwindcss(),
        autoprefixer(),
        postcssPresetEnv({
          stage: 3,
          features: {
            'nesting-rules': false,
            'custom-properties': true,
            'cascade-layers': true,
          },
        }),
      ],
    },
  },
  plugins: [
    uni(),
    uniTailwind({
      shouldTransformScript(fileName) {
        return /[\\/]src[\\/](pages|components|layouts|views)[\\/]/.test(fileName);
      },
    }),
    {
      // Quick hack to redirect dynamic assets to the /dist/ directory
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (redirectToDist.some(s => req.url.startsWith(s))) {
            req.url = '/dist' + req.url;
          }

          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
