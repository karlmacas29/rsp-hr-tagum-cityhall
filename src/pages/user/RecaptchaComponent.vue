<template>
  <div class="recaptcha-component">
    <div v-if="loading" class="loading-message">
      <q-spinner color="primary" size="sm" />
      <span class="loading-text">Loading reCAPTCHA...</span>
    </div>
    <div v-if="errorMessage" class="error-message">
      <q-icon name="warning" size="xs" />
      <span class="error-text">{{ errorMessage }}</span>
    </div>
    <!-- Added id fallback so you can reference by id if ref isn't ready yet -->
    <div
      id="recaptcha-container"
      ref="recaptchaContainer"
      class="recaptcha-wrapper"
      :class="wrapperClass"
    ></div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';

  const props = defineProps({
    sitekey: { type: String, required: true },
    theme: { type: String, default: 'light' },
    size: { type: String, default: 'normal' },
  });

  const emit = defineEmits(['verify', 'expired', 'error']);

  const recaptchaContainer = ref(null);
  const loading = ref(true);
  const errorMessage = ref('');
  let widgetId = null;

  const wrapperClass = computed(() => `recaptcha-${props.size}`);

  const getApi = () => {
    if (!window.grecaptcha) return null;
    return window.grecaptcha.enterprise ? window.grecaptcha.enterprise : window.grecaptcha;
  };

  const loadRecaptchaScript = () => {
    return new Promise((resolve, reject) => {
      const existingApi = getApi();
      if (existingApi && typeof existingApi.render === 'function') {
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="recaptcha/enterprise.js"], script[src*="recaptcha/api.js"]',
      );

      if (existingScript) {
        if (getApi() && typeof getApi().render === 'function') {
          resolve();
        } else {
          const onLoad = () => {
            cleanup();
            resolve();
          };
          const onError = () => {
            cleanup();
            const err = new Error('Failed to load reCAPTCHA script.');
            errorMessage.value = err.message;
            reject(err);
          };
          const cleanup = () => {
            existingScript.removeEventListener('load', onLoad);
            existingScript.removeEventListener('error', onError);
          };
          existingScript.addEventListener('load', onLoad);
          existingScript.addEventListener('error', onError);
        }
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/enterprise.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        const err = new Error('Failed to load reCAPTCHA script.');
        errorMessage.value = err.message;
        reject(err);
      };
      document.head.appendChild(script);
    });
  };

  const waitForRecaptcha = () => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 200;
      const interval = setInterval(() => {
        attempts++;
        const api = getApi();
        if (api) {
          if (typeof api.ready === 'function') {
            clearInterval(interval);
            try {
              api.ready(() => resolve());
            } catch (err) {
              if (typeof api.render === 'function') resolve();
              else reject(err);
            }
            return;
          }
          if (typeof api.render === 'function') {
            clearInterval(interval);
            resolve();
            return;
          }
        }
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          const errMsg = 'reCAPTCHA API not ready.';
          errorMessage.value = errMsg;
          reject(new Error(errMsg));
        }
      }, 100);
    });
  };

  const renderRecaptcha = () => {
    if (!recaptchaContainer.value) {
      const err = 'reCAPTCHA container not found';
      console.error(err);
      errorMessage.value = err;
      loading.value = false;
      return;
    }

    try {
      const api = getApi();
      if (!api || typeof api.render !== 'function') {
        throw new Error('reCAPTCHA render function is not available on the API.');
      }

      widgetId = api.render(recaptchaContainer.value, {
        sitekey: props.sitekey,
        theme: props.theme,
        size: props.size,
        callback: (response) => {
          errorMessage.value = '';
          emit('verify', response);
        },
        'expired-callback': () => {
          errorMessage.value = 'reCAPTCHA expired.';
          emit('expired');
        },
        'error-callback': (error) => {
          errorMessage.value = 'reCAPTCHA error occurred.';
          emit('error', error || 'Unknown reCAPTCHA error');
        },
      });

      loading.value = false;
    } catch (error) {
      console.error('reCAPTCHA render error:', error);
      errorMessage.value = `Failed to render reCAPTCHA: ${error.message || error}`;
      emit('error', error);
      loading.value = false;
    }
  };

  const reset = () => {
    try {
      const api = getApi();
      if (api && widgetId !== null && typeof api.reset === 'function') {
        api.reset(widgetId);
        errorMessage.value = '';
      }
    } catch (error) {
      console.error('Error resetting reCAPTCHA:', error);
    }
  };

  const getResponse = () => {
    try {
      const api = getApi();
      if (api && widgetId !== null && typeof api.getResponse === 'function') {
        return api.getResponse(widgetId);
      }
    } catch (error) {
      console.error('Error getting reCAPTCHA response:', error);
    }
    return '';
  };

  onMounted(async () => {
    try {
      // If running under SSR, bail early (onMounted won't run on server, but guard anyway)
      if (typeof window === 'undefined') return;

      await loadRecaptchaScript();
      await waitForRecaptcha();

      // Ensure Vue finished mounting the template and the ref is populated.
      await nextTick();

      // Small retry loop in case the ref populates slightly later (e.g. parent v-if race)
      let tries = 0;
      while (!recaptchaContainer.value && tries < 5) {
        await new Promise((r) => setTimeout(r, 100));
        tries++;
      }

      // Fallback to DOM id if ref still missing
      if (!recaptchaContainer.value) {
        const fallback = document.getElementById('recaptcha-container');
        if (fallback) recaptchaContainer.value = fallback;
      }

      if (!recaptchaContainer.value) {
        throw new Error(
          'reCAPTCHA container not found. Ensure the container div is present and not conditionally removed with v-if.',
        );
      }

      // Small extra delay to avoid race with grecaptcha internals
      setTimeout(() => renderRecaptcha(), 150);
    } catch (error) {
      console.error('reCAPTCHA setup error:', error);
      loading.value = false;
      errorMessage.value = error?.message || String(error);
      emit('error', error);
    }
  });

  onBeforeUnmount(() => {
    try {
      const api = getApi();
      if (api && widgetId !== null && typeof api.reset === 'function') {
        api.reset(widgetId);
      }
    } catch (error) {
      console.error('reCAPTCHA cleanup error:', error);
    }
  });

  defineExpose({ reset, getResponse });
</script>

<style scoped>
  /* (styles unchanged) */
  .recaptcha-component {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .loading-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    font-size: 0.875rem;
    padding: 0.5rem;
  }
  .loading-text {
    font-size: 0.875rem;
  }
  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ff5252;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
    background: #ffebee;
    border-radius: 4px;
    max-width: 100%;
    text-align: center;
    line-height: 1.4;
  }
  .error-text {
    font-size: 0.8rem;
  }
  .recaptcha-wrapper {
    display: inline-block;
    position: relative;
    overflow: visible;
  }
  .recaptcha-normal {
    width: 304px;
    height: 78px;
  }
  .recaptcha-compact {
    width: 164px;
    height: 144px;
  }
  .recaptcha-wrapper :deep(iframe) {
    max-width: 100%;
    border: none;
  }
  @media (max-width: 599px) {
    .loading-message,
    .loading-text {
      font-size: 0.8rem;
    }
    .error-message,
    .error-text {
      font-size: 0.75rem;
      padding: 0.375rem 0.625rem;
    }
  }
  @media (max-width: 359px) {
    .loading-message,
    .loading-text {
      font-size: 0.75rem;
    }
    .error-message,
    .error-text {
      font-size: 0.7rem;
      padding: 0.25rem 0.5rem;
    }
  }
</style>
