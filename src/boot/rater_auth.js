import { useRaterAuthStore } from 'stores/authStore_raters';
import { boot } from 'quasar/wrappers';

export default boot(() => {
  const raterAuthStore = useRaterAuthStore();
  raterAuthStore.checkAuth_rater(); // Check authentication state on app load

});
