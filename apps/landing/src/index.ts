import { createApp } from 'vue'

import App from './App.vue'

import 'virtual:uno.css'
import './style.css'

const app = createApp(App)

app.config.globalProperties.$touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
app.mount('#app')
