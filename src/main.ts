import { createApp } from 'vue'
import '@unocss/reset/tailwind.css'
import App from './App.vue'
import 'virtual:uno.css'
import '@/styles/index.scss'
import '@arco-design/web-vue/es/message/style/css.js'

createApp(App).mount('#app')
