import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import Inspector from 'vite-plugin-vue-inspector'
import Unocss from 'unocss/vite'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
      imports: ['vue', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/utils/common/'],
      vueTemplate: true,
    }),
    Unocss(),
    Components({
      resolvers: [ArcoResolver()],
      dts: 'src/components.d.ts',
    }),
    Inspector({
      toggleButtonVisibility: 'never',
    }),
  ],
  build: {
    // 使用esbuild压缩
    target: 'esnext',
    minify: 'esbuild',
  },
})
