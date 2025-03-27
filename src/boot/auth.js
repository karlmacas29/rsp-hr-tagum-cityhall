import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/authStore';

export default boot(() => {
  const authStore = useAuthStore();
  authStore.checkAuth(); // Check authentication state on app load
});
