import { boot } from 'quasar/wrappers'
import { createToastInterface } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Create a toast instance
const toast = createToastInterface({
  position: 'bottom-center',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
})

export default boot(({ app }) => {
  app.config.globalProperties.$toast = toast // Attach globally
})

export { toast } // Export instance for use in stores
