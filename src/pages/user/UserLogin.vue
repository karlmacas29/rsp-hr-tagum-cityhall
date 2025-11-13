<template>
  <div class="login-page">
    <!-- Main Login Section -->
    <div class="login-section">
      <div class="login-overlay"></div>
      <div class="login-content">
        <div class="login-card">
          <!-- Logo and Header -->
          <div class="login-header">
            <img src="/logo.png" alt="Logo" class="login-logo" />
            <h1 class="main-title">Recruitment Selection & Placement</h1>
            <h2 class="login-title">
              {{
                emailStore.isOtpSent
                  ? 'Verify Your Email'
                  : 'Join Our Team - Explore Available Positions'
              }}
            </h2>
            <p class="login-subtitle">
              {{
                emailStore.isOtpSent
                  ? 'Enter the verification code sent to your email'
                  : 'Please sign in to continue'
              }}
            </p>
          </div>

          <!-- Email Input Form -->
          <div v-if="!emailStore.isOtpSent" class="form-container">
            <div class="input-group">
              <label class="input-label">Email Address</label>
              <q-input
                v-model="emailInput"
                placeholder="Enter your email address"
                type="email"
                filled
                dense
                :rules="emailRules"
                @keyup.enter="handleSendOtp"
                class="custom-input"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="primary" />
                </template>
              </q-input>
            </div>

            <!-- CAPTCHA at Email Stage -->
            <div class="recaptcha-section">
              <RecaptchaComponent
                ref="emailCaptchaRef"
                :sitekey="recaptchaSiteKey"
                @verify="onEmailCaptchaVerified"
                @expired="onEmailCaptchaExpired"
                @error="onCaptchaError"
                theme="light"
                :size="captchaSize"
              />
            </div>

            <q-btn
              label="Send Verification Code"
              color="primary"
              @click="handleSendOtp"
              :loading="emailStore.loading"
              :disable="!canSendOtp"
              unelevated
              rounded
              :size="buttonSize"
              class="submit-btn"
            >
              <q-icon name="arrow_forward" :size="iconSize" right />
            </q-btn>

            <div class="info-box">
              <q-icon name="info_outline" :size="infoIconSize" color="primary" />
              <span class="info-text">We'll send a one-time verification code to your email</span>
            </div>
          </div>

          <!-- OTP Verification -->
          <div v-else class="form-container">
            <!-- Email Display -->
            <div class="email-display-card">
              <div class="email-info">
                <q-icon name="mark_email_read" :size="emailIconSize" color="primary" />
                <div class="email-text">
                  <span class="label">Verification code sent to:</span>
                  <span class="email-value">{{ emailStore.email }}</span>
                </div>
              </div>
              <q-btn
                flat
                dense
                round
                icon="edit"
                :size="editButtonSize"
                color="primary"
                @click="handleResetForm"
                class="edit-btn"
              >
                <q-tooltip>Change Email</q-tooltip>
              </q-btn>
            </div>

            <!-- OTP Input -->
            <div class="input-group">
              <label class="input-label">Verification Code</label>
              <q-input
                v-model="otpInput"
                placeholder="Enter 6-digit code"
                type="text"
                filled
                dense
                maxlength="6"
                class="custom-input otp-input"
                :rules="otpRules"
                @keyup.enter="handleVerifyOtp"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="primary" />
                </template>
              </q-input>
            </div>

            <q-btn
              label="Verify & Continue"
              color="primary"
              @click="handleVerifyOtp"
              :loading="emailStore.verifying"
              :disable="!canVerifyOtp"
              unelevated
              rounded
              :size="buttonSize"
              class="submit-btn"
            >
              <q-icon name="check_circle" :size="iconSize" right />
            </q-btn>

            <!-- Resend Section -->
            <div class="resend-section">
              <span class="resend-text">Didn't receive the code?</span>
              <q-btn
                :label="resendLabel"
                color="primary"
                flat
                @click="handleResendOtp"
                :loading="emailStore.resending"
                :disable="!emailStore.canResend"
                :size="resendButtonSize"
                class="resend-btn"
              />
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="footer-info">
          <div class="help-text">
            <q-icon name="help_outline" :size="footerIconSize" />
            <span class="help-content">
              Need assistance? Contact us at
              <a href="mailto:support@tagumcity.gov.ph" class="help-link">
                <span class="gt-xs">support@tagumcity.gov.ph</span>
                <span class="lt-sm">Email Support</span>
              </a>
            </span>
          </div>
          <div class="copyright">© 2025 Tagum City Hall. All rights reserved.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useEmailStore } from 'src/stores/emailStore';
  import RecaptchaComponent from 'src/pages/user/RecaptchaComponent.vue';

  // Router and utilities
  const router = useRouter();
  const $q = useQuasar();
  const emailStore = useEmailStore();

  // Form inputs
  const emailInput = ref('');
  const otpInput = ref('');

  // Refs for CAPTCHA components
  const emailCaptchaRef = ref(null);

  // CAPTCHA responses
  const emailCaptchaResponse = ref('');

  // Constants
  const recaptchaSiteKey =
    process.env.RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  // Responsive computed properties
  const captchaSize = computed(() => {
    return 'normal';
  });

  const buttonSize = computed(() => {
    if ($q.screen.xs) return 'md';
    return 'lg';
  });

  const iconSize = computed(() => {
    if ($q.screen.xs) return 'xs';
    return 'sm';
  });

  const infoIconSize = computed(() => {
    if ($q.screen.xs) return '1rem';
    return '1.2rem';
  });

  const emailIconSize = computed(() => {
    if ($q.screen.xs) return '1.5rem';
    if ($q.screen.sm) return '1.75rem';
    return '2rem';
  });

  const editButtonSize = computed(() => {
    if ($q.screen.xs) return 'xs';
    return 'sm';
  });

  const resendButtonSize = computed(() => {
    if ($q.screen.xs) return 'sm';
    return 'md';
  });

  const footerIconSize = computed(() => {
    if ($q.screen.xs) return '1rem';
    return '1.2rem';
  });

  const resendLabel = computed(() => {
    if (emailStore.resendTimer > 0) {
      return `Resend in ${emailStore.resendTimer}s`;
    }
    return 'Resend Code';
  });

  // Validation rules
  const emailRules = [
    (val) => !!val || 'Email is required',
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email',
  ];

  const otpRules = [
    (val) => !!val || 'Verification code is required',
    (val) => val.length === 6 || 'Code must be 6 digits',
    (val) => /^\d+$/.test(val) || 'Code must contain only numbers',
  ];

  // Computed properties
  const canSendOtp = computed(() => {
    return (
      emailInput.value &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value) &&
      emailCaptchaResponse.value &&
      !emailStore.loading
    );
  });

  const canVerifyOtp = computed(() => {
    return (
      otpInput.value &&
      otpInput.value.length === 6 &&
      /^\d+$/.test(otpInput.value) &&
      !emailStore.verifying
    );
  });

  // CAPTCHA handlers
  const onEmailCaptchaVerified = (response) => {
    console.log('✅ reCAPTCHA verified:', response);
    emailCaptchaResponse.value = response;
  };

  const onEmailCaptchaExpired = () => {
    console.warn('⚠️ reCAPTCHA expired');
    emailCaptchaResponse.value = '';
    $q.notify({
      type: 'warning',
      message: 'CAPTCHA expired. Please verify again.',
      position: 'top',
    });
  };

  const onCaptchaError = (error) => {
    console.error('❌ reCAPTCHA error:', error);
    emailCaptchaResponse.value = '';
    $q.notify({
      type: 'negative',
      message: 'Error loading CAPTCHA. Please refresh the page.',
      position: 'top',
    });
  };

  // Action handlers
  const handleSendOtp = async () => {
    if (!canSendOtp.value) {
      if (!emailInput.value) {
        $q.notify({
          type: 'negative',
          message: 'Please enter your email address.',
          position: 'top',
        });
      } else if (!emailCaptchaResponse.value) {
        $q.notify({
          type: 'negative',
          message: 'Please complete the CAPTCHA verification.',
          position: 'top',
        });
      }
      return;
    }

    try {
      await emailStore.sendOtp(emailInput.value, emailCaptchaResponse.value);

      $q.notify({
        type: 'positive',
        message: 'Verification code sent successfully!',
        position: 'top',
        timeout: 4000,
        icon: 'check_circle',
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.message || 'Failed to send verification code.',
        position: 'top',
        timeout: 4000,
      });

      resetEmailCaptcha();
    }
  };

  const handleResendOtp = async () => {
    if (!emailStore.canResend) {
      return;
    }

    if (!emailCaptchaResponse.value) {
      $q.notify({
        type: 'negative',
        message: 'Please complete the CAPTCHA verification before resending.',
        position: 'top',
      });
      return;
    }

    try {
      await emailStore.resendOtp(emailCaptchaResponse.value);

      otpInput.value = '';

      $q.notify({
        type: 'positive',
        message: 'New verification code sent to your email.',
        position: 'top',
        icon: 'check_circle',
      });

      resetEmailCaptcha();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.message || 'Failed to resend verification code.',
        position: 'top',
      });

      resetEmailCaptcha();
    }
  };

  const handleVerifyOtp = async () => {
    if (!canVerifyOtp.value) {
      if (!otpInput.value || otpInput.value.length !== 6) {
        $q.notify({
          type: 'negative',
          message: 'Please enter a valid 6-digit verification code.',
          position: 'top',
        });
      }
      return;
    }

    try {
      await emailStore.verifyOtp(otpInput.value);

      $q.notify({
        type: 'positive',
        message: 'Verification successful! Redirecting...',
        position: 'top',
        timeout: 2000,
        icon: 'check_circle',
      });

      setTimeout(() => {
        router.push('/page');
      }, 2000);
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.message || 'Invalid verification code.',
        position: 'top',
        timeout: 4000,
      });
    }
  };

  const handleResetForm = () => {
    emailStore.resetState();
    emailInput.value = '';
    otpInput.value = '';
    resetEmailCaptcha();
  };

  // Helper functions
  const resetEmailCaptcha = () => {
    if (emailCaptchaRef.value) {
      emailCaptchaRef.value.reset();
    }
    emailCaptchaResponse.value = '';
  };

  // Cleanup on component unmount
  onUnmounted(() => {
    emailStore.resetState();
  });
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  .login-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-section {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .login-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/tagum-city-hall.webp');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }

  .login-overlay::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(55, 126, 81, 0.85) 0%, rgba(72, 71, 73, 0.85) 100%);
    z-index: 1;
  }

  .login-content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }

  .login-card {
    background: white;
    border-radius: 20px;
    padding: 3rem 2.5rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.6s ease-out;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .login-logo {
    max-width: 100px;
    height: auto;
    margin-bottom: 1.5rem;
    animation: fadeIn 0.8s ease-out;
  }

  .main-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a7e44;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }

  .login-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #28933c;
    margin: 0 0 0.75rem 0;
    line-height: 1.3;
  }

  .login-subtitle {
    font-size: 1rem;
    color: #666;
    margin: 0;
    line-height: 1.5;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-label {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
  }

  .custom-input :deep(.q-field__control) {
    border-radius: 12px;
    min-height: 48px;
  }

  .custom-input :deep(.q-field__native) {
    font-size: 1rem;
  }

  .custom-input :deep(.q-field__prepend) {
    padding-left: 12px;
  }

  .otp-input :deep(input) {
    letter-spacing: 0.8rem;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  .recaptcha-section {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 90px; /* Increased to accommodate the full widget */
    overflow: visible; /* Changed from hidden */
    padding: 0.5rem 0; /* Add some padding */
  }

  .submit-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    font-weight: 600;
    font-size: 1rem;
    text-transform: none;
    letter-spacing: 0.5px;
    min-height: 48px;
  }

  .info-box {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background: #e3f2fd;
    border-radius: 12px;
    line-height: 1.5;
  }

  .info-text {
    font-size: 0.875rem;
    color: #1565c0;
    flex: 1;
  }

  .email-display-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
    border-radius: 12px;
    border: 2px solid #e0e0e0;
    gap: 1rem;
  }

  .email-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    min-width: 0;
  }

  .email-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    flex: 1;
  }

  .email-text .label {
    font-size: 0.75rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .email-text .email-value {
    font-size: 1rem;
    font-weight: 600;
    color: #1a237e;
    word-break: break-all;
    line-height: 1.3;
  }

  .edit-btn {
    flex-shrink: 0;
  }

  .resend-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #e0e0e0;
  }

  .resend-text {
    font-size: 0.875rem;
    color: #666;
    text-align: center;
  }

  .resend-btn {
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: none;
  }

  .footer-info {
    margin-top: 2rem;
    text-align: center;
    color: white;
  }

  .help-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
    line-height: 1.6;
  }

  .help-content {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .help-link {
    color: white;
    text-decoration: underline;
    font-weight: 600;
    transition: opacity 0.3s ease;
  }

  .help-link:hover {
    opacity: 0.8;
  }

  .copyright {
    font-size: 0.75rem;
    opacity: 0.9;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 599px) {
    .recaptcha-section {
      min-height: 160px;
    }
  }

  /* Tablet (600px - 1023px) */
  @media (max-width: 1023px) and (min-width: 600px) {
    .login-section {
      padding: 1.5rem 1rem;
    }

    .login-card {
      padding: 2.5rem 2rem;
    }

    .main-title {
      font-size: 1.5rem;
    }

    .login-title {
      font-size: 1.15rem;
    }

    .login-subtitle {
      font-size: 0.95rem;
    }

    .form-container {
      gap: 1.5rem;
    }
  }

  /* Mobile (<600px) */
  @media (max-width: 599px) {
    .login-section {
      padding: 1rem 0.75rem;
      background-attachment: scroll;
    }

    .login-overlay {
      background-attachment: scroll;
    }

    .login-card {
      padding: 2rem 1.5rem;
      border-radius: 16px;
    }

    .login-header {
      margin-bottom: 2rem;
    }

    .login-logo {
      max-width: 80px;
      margin-bottom: 1.25rem;
    }

    .main-title {
      font-size: 1.25rem;
    }

    .login-title {
      font-size: 1rem;
    }

    .login-subtitle {
      font-size: 0.875rem;
    }

    .form-container {
      gap: 1.5rem;
    }

    .input-label {
      font-size: 0.95rem;
    }

    .custom-input :deep(.q-field__control) {
      min-height: 44px;
    }

    .custom-input :deep(.q-field__native) {
      font-size: 0.95rem;
    }

    .submit-btn {
      font-size: 0.95rem;
      min-height: 44px;
      padding: 0.625rem 1rem;
    }

    .info-text {
      font-size: 0.8rem;
    }

    .email-display-card {
      padding: 1rem;
      flex-wrap: wrap;
    }

    .email-info {
      flex-wrap: wrap;
    }

    .email-text .email-value {
      font-size: 0.9rem;
    }

    .edit-btn {
      margin-left: auto;
    }

    .otp-input :deep(input) {
      letter-spacing: 0.5rem;
      font-size: 1.25rem;
    }

    .resend-text {
      font-size: 0.8rem;
    }

    .help-text {
      font-size: 0.8rem;
    }

    .copyright {
      font-size: 0.7rem;
    }

    .footer-info {
      margin-top: 1.5rem;
    }
  }

  /* Extra Small (<360px) */
  @media (max-width: 359px) {
    .login-section {
      padding: 0.75rem 0.5rem;
    }

    .login-card {
      padding: 1.5rem 1rem;
      border-radius: 12px;
    }

    .login-logo {
      max-width: 70px;
      margin-bottom: 1rem;
    }

    .main-title {
      font-size: 1.1rem;
    }

    .login-title {
      font-size: 0.95rem;
    }

    .login-subtitle {
      font-size: 0.8rem;
    }

    .form-container {
      gap: 1.25rem;
    }

    .input-label {
      font-size: 0.875rem;
    }

    .custom-input :deep(.q-field__control) {
      min-height: 40px;
    }

    .custom-input :deep(.q-field__native) {
      font-size: 0.875rem;
    }

    .submit-btn {
      font-size: 0.875rem;
      min-height: 40px;
      padding: 0.5rem 0.75rem;
    }

    .info-box {
      padding: 0.75rem;
    }

    .info-text {
      font-size: 0.75rem;
    }

    .email-display-card {
      padding: 0.875rem;
    }

    .email-text .label {
      font-size: 0.7rem;
    }

    .email-text .email-value {
      font-size: 0.85rem;
    }

    .otp-input :deep(input) {
      letter-spacing: 0.4rem;
      font-size: 1.1rem;
    }

    .resend-text {
      font-size: 0.75rem;
    }

    .help-text {
      font-size: 0.75rem;
    }

    .copyright {
      font-size: 0.65rem;
    }
  }

  /* Large Desktop (>1440px) */
  @media (min-width: 1440px) {
    .login-content {
      max-width: 550px;
    }

    .login-card {
      padding: 3.5rem 3rem;
    }

    .main-title {
      font-size: 2rem;
    }

    .login-title {
      font-size: 1.35rem;
    }

    .login-subtitle {
      font-size: 1.1rem;
    }
  }
</style>
