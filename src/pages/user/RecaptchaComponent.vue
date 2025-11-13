<template>
  <div v-if="loading" class="loading-message">
    <q-spinner color="primary" size="sm" />
    <span class="loading-text">Loading reCAPTCHA...</span>
  </div>
  <div v-if="errorMessage" class="error-message">
    <q-icon name="warning" size="xs" />
    <span class="error-text">{{ errorMessage }}</span>
  </div>
  <div class="recaptcha-component">
    <div ref="recaptchaContainer" class="recaptcha-wrapper" :class="wrapperClass"></div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

  const props = defineProps({
    sitekey: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: 'light',
    },
    size: {
      type: String,
      default: 'normal', // 'normal' or 'compact'
    },
  });

  const emit = defineEmits(['verify', 'expired', 'error']);

  const recaptchaContainer = ref(null);
  const loading = ref(true);
  const errorMessage = ref('');
  let widgetId = null;

  // Computed class for wrapper based on size
  const wrapperClass = computed(() => {
    return `recaptcha-${props.size}`;
  });

  // Load reCAPTCHA script dynamically
  const loadRecaptchaScript = () => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.grecaptcha && window.grecaptcha.render) {
        resolve();
        return;
      }

      // Check if script already exists in DOM
      const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
      if (existingScript) {
        if (window.grecaptcha && window.grecaptcha.render) {
          resolve();
        } else {
          existingScript.addEventListener('load', resolve);
          existingScript.addEventListener('error', reject);
        }
        return;
      }

      // Create and append new script
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;

      script.onload = resolve;

      script.onerror = () => {
        const error = new Error('Failed to load reCAPTCHA script.');
        errorMessage.value = error.message;
        reject(error);
      };

      document.head.appendChild(script);
    });
  };

  const waitForRecaptcha = () => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds timeout

      const checkRecaptcha = setInterval(() => {
        attempts++;

        if (window.grecaptcha && window.grecaptcha.render) {
          clearInterval(checkRecaptcha);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkRecaptcha);
          const error = 'reCAPTCHA API not ready.';
          errorMessage.value = error;
          reject(new Error(error));
        }
      }, 100);
    });
  };

  const renderRecaptcha = () => {
    if (!recaptchaContainer.value) {
      const error = 'reCAPTCHA container not found';
      console.error(error);
      errorMessage.value = error;
      loading.value = false;
      return;
    }

    try {
      widgetId = window.grecaptcha.render(recaptchaContainer.value, {
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
      errorMessage.value = `Failed to render reCAPTCHA`;
      emit('error', error);
      loading.value = false;
    }
  };

  const reset = () => {
    try {
      if (window.grecaptcha && widgetId !== null) {
        window.grecaptcha.reset(widgetId);
        errorMessage.value = '';
      }
    } catch (error) {
      console.error('Error resetting reCAPTCHA:', error);
    }
  };

  const getResponse = () => {
    try {
      if (window.grecaptcha && widgetId !== null) {
        return window.grecaptcha.getResponse(widgetId);
      }
    } catch (error) {
      console.error('Error getting reCAPTCHA response:', error);
    }
    return '';
  };

  onMounted(async () => {
    try {
      await loadRecaptchaScript();
      await waitForRecaptcha();
      setTimeout(() => {
        renderRecaptcha();
      }, 200);
    } catch (error) {
      console.error('reCAPTCHA setup error:', error);
      loading.value = false;
      emit('error', error);
    }
  });

  onBeforeUnmount(() => {
    if (window.grecaptcha && widgetId !== null) {
      try {
        window.grecaptcha.reset(widgetId);
      } catch (error) {
        console.error('reCAPTCHA cleanup error:', error);
      }
    }
  });

  defineExpose({
    reset,
    getResponse,
  });
</script>

<style scoped>
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
    background-color: #ffebee;
    border-radius: 4px;
    max-width: 100%;
    text-align: center;
    line-height: 1.4;
  }

  .error-text {
    font-size: 0.8rem;
  }

  .recaptcha-wrapper {
    display: inline-block; /* Changed from inline-flex */
    position: relative;
    overflow: visible; /* Changed from default */
  }

  /* Normal size */
  .recaptcha-normal {
    width: 304px;
    height: 78px; /* Set explicit height instead of min-height */
  }

  /* Compact size */
  .recaptcha-compact {
    width: 164px;
    height: 144px; /* Set explicit height instead of min-height */
  }

  /* Ensure iframe doesn't overflow */
  .recaptcha-wrapper :deep(iframe) {
    max-width: 100%;
    border: none;
  }

  /* Responsive text only */
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

/* For compact size */ @media (max-width: 599px) { .recaptcha-section { min-height: 160px; /*
Increased for compact reCAPTCHA */ } }
