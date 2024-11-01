import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from "@/utils/language"

import VConsole from 'vconsole'
if (process.env.NODE_ENV === 'development') {
   const Vsconsole = new VConsole()
}

createApp(App)
.use(store)
.use(i18n)
.use(router).mount('#app')
