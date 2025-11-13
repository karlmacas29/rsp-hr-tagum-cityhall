import { boot } from 'quasar/wrappers';
import VueRecaptcha from 'vue3-recaptcha2';

export default boot(async ({ app }) => {
  // Register VueRecaptcha component globally
  app.component('VueRecaptcha', VueRecaptcha);

  console.log('✅ VueRecaptcha component registered globally');
});
