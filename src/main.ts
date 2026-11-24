import 'primeicons/primeicons.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'
import { TemaLibras } from './theme'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  // Chave da licença PrimeUI (Community é gratuita para estudantes): https://primeui.dev/licenses/community
  license: import.meta.env.VITE_PRIMEUI_LICENSE || undefined,
  theme: {
    preset: TemaLibras,
    // O modo escuro é ligado pela classe .app-dark no <html> (ver composables/useTema.ts)
    options: { darkModeSelector: '.app-dark' },
  },
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
