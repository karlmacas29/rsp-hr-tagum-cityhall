import { defineStore } from 'pinia';
import { adminApi } from 'boot/axios_admin'; // ← Use the same admin API instance

export const useEmailStore = defineStore('email', {
  state: () => ({
    email: '',
    isOtpSent: false,
    isAuthenticated: false,
    loading: false,
    verifying: false,
    resending: false,
    resendTimer: 0,
    resendInterval: null,
  }),

  getters: {
    canResend: (state) => state.resendTimer <= 0,
    isEmailValid: (state) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(state.email);
    },
    getEmail: (state) => state.email,
    getIsAuthenticated: (state) => state.isAuthenticated,
  },

  actions: {
    /**
     * Send OTP to email
     * @param {string} email - User email
     * @param {string} recaptchaResponse - reCAPTCHA token
     * @returns {Promise<Object>} Response data
     */
    async sendOtp(email, recaptchaResponse) {
      this.loading = true;
      try {
        const response = await adminApi.post('/send-verification', {
          email,
          recaptchaResponse,
        });

        console.log('Send OTP response:', response);

        if (response?.data?.success) {
          this.email = email;
          this.isOtpSent = true;
          this.startResendTimer();

          return {
            success: true,
            data: response.data,
            message: response.data.message || 'Verification code sent successfully!',
          };
        } else {
          throw {
            success: false,
            message: response?.data?.message || 'Failed to send verification code.',
          };
        }
      } catch (error) {
        console.error('Send OTP error:', error);
        throw {
          success: false,
          message:
            error.response?.data?.message || error.message || 'Failed to send verification code.',
          error,
        };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Resend OTP to email
     * @param {string} recaptchaResponse - reCAPTCHA token
     * @returns {Promise<Object>} Response data
     */
    async resendOtp(recaptchaResponse) {
      if (!this.canResend) {
        throw {
          success: false,
          message: `Please wait ${this.resendTimer} seconds before resending.`,
        };
      }

      this.resending = true;
      try {
        const response = await adminApi.post('/send-verification', {
          email: this.email,
          recaptchaResponse,
        });

        console.log('Resend OTP response:', response);

        if (response?.data?.success) {
          this.startResendTimer();

          return {
            success: true,
            data: response.data,
            message: response.data.message || 'New verification code sent successfully!',
          };
        } else {
          throw {
            success: false,
            message: response?.data?.message || 'Failed to resend verification code.',
          };
        }
      } catch (error) {
        console.error('Resend OTP error:', error);
        throw {
          success: false,
          message:
            error.response?.data?.message || error.message || 'Failed to resend verification code.',
          error,
        };
      } finally {
        this.resending = false;
      }
    },

    /**
     * Verify OTP
     * @param {string} code - OTP code
     * @param {string} recaptchaResponse - reCAPTCHA token
     * @returns {Promise<Object>} Response data with token
     */
    async verifyOtp(code, recaptchaResponse) {
      this.verifying = true;
      try {
        const response = await adminApi.post('/verify-code', {
          email: this.email,
          code,
          recaptchaResponse,
        });

        console.log('Verify OTP response:', response);

        if (response?.data?.success) {
          // Set authentication status
          this.isAuthenticated = true;

          // Store authentication data in localStorage
          if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
          }
          localStorage.setItem('userEmail', this.email);
          localStorage.setItem('userAuthenticated', 'true');
          localStorage.setItem('userAuthTimestamp', Date.now().toString());

          return {
            success: true,
            data: response.data,
            message: response.data.message || 'Email verified successfully!',
          };
        } else {
          throw {
            success: false,
            message: response?.data?.message || 'Invalid verification code.',
          };
        }
      } catch (error) {
        console.error('Verify OTP error:', error);
        throw {
          success: false,
          message: error.response?.data?.message || error.message || 'Invalid verification code.',
          error,
        };
      } finally {
        this.verifying = false;
      }
    },

    /**
     * Check authentication status from localStorage
     * @returns {boolean} Whether user is authenticated
     */
    checkAuthStatus() {
      const storedEmail = localStorage.getItem('userEmail');
      const isAuth = localStorage.getItem('userAuthenticated');
      const timestamp = localStorage.getItem('userAuthTimestamp');

      if (storedEmail && isAuth === 'true' && timestamp) {
        const authAge = Date.now() - parseInt(timestamp);
        const maxAge = 15 * 60 * 1000; // 30 minutes in milliseconds

        if (authAge < maxAge) {
          this.email = storedEmail;
          this.isAuthenticated = true;

          console.log('User authentication restored from localStorage');
          return true;
        } else {
          // Authentication expired
          console.log('User authentication expired');
          this.logout();
          return false;
        }
      }

      console.log('No valid authentication found');
      return false;
    },

    /**
     * Logout user and clear all authentication data
     */
    logout() {
      this.email = '';
      this.isAuthenticated = false;
      this.isOtpSent = false;
      this.resendTimer = 0;

      // Clear localStorage
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userAuthenticated');
      localStorage.removeItem('userAuthTimestamp');
      localStorage.removeItem('authToken');

      // Clear interval
      if (this.resendInterval) {
        clearInterval(this.resendInterval);
        this.resendInterval = null;
      }

      console.log('User logged out successfully');
    },

    /**
     * Start resend timer countdown
     */
    startResendTimer() {
      this.resendTimer = 60;

      if (this.resendInterval) {
        clearInterval(this.resendInterval);
      }

      this.resendInterval = setInterval(() => {
        this.resendTimer--;
        if (this.resendTimer <= 0) {
          clearInterval(this.resendInterval);
          this.resendInterval = null;
        }
      }, 1000);
    },

    /**
     * Reset the OTP form state (not authentication)
     */
    resetState() {
      this.isOtpSent = false;
      this.loading = false;
      this.verifying = false;
      this.resending = false;
      this.resendTimer = 0;

      if (this.resendInterval) {
        clearInterval(this.resendInterval);
        this.resendInterval = null;
      }

      // Note: Don't reset email and isAuthenticated here
      // as they should persist until logout
    },

    /**
     * Cleanup intervals on store disposal
     */
    $dispose() {
      if (this.resendInterval) {
        clearInterval(this.resendInterval);
      }
    },
  },
});
