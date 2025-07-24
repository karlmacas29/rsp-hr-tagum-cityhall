<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Header Section -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h4">Account Settings</div>
          <div class="text-caption text-grey">Last login: {{ currentDateTime }} UTC</div>
        </div>
        <div class="col-auto">
          <q-chip color="primary" text-color="white">
            <q-avatar>
              <q-icon name="person" />
            </q-avatar>
            {{ useRaterStore.user?.username || currentUserLogin }}
          </q-chip>
        </div>
      </div>

      <!-- Personal Information Card -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="text-subtitle1 q-mb-md">Personal Information</div>

          <q-form @submit.prevent="saveChanges" ref="accountForm">
            <div class="row q-col-gutter-md">
              <!-- Basic Information -->
              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  v-model="form.name"
                  label="Full Name"
                  :rules="[(val) => !!val || 'Name is required']"
                  disable
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input outlined v-model="form.username" label="Username" disable />
              </div>

              <div class="col-12 col-md-6">
                <q-input outlined v-model="form.position" label="Position" disable />
              </div>

              <!-- Password Change Section -->
            <!-- Password Change Section -->
  <div class="col-12">
    <q-separator class="q-my-md" />
    <div class="text-subtitle1 q-mb-md">Change Password (Optional)</div>
  </div>

  <div class="col-12 col-md-4">
    <q-input
      outlined
      v-model="form.old_password"
      label="Current Password"
      :type="showOldPassword ? 'text' : 'password'"
      :rules="[
        val => !form.new_password || !!val || 'Current password is required'
      ]"
    >
      <template v-slot:append>
        <q-btn
          @click="showOldPassword = !showOldPassword"
          round
          flat
          color="white"
          class="text-black"
          :icon="showOldPassword ? 'visibility' : 'visibility_off'"
        />
      </template>
    </q-input>
  </div>

  <div class="col-12 col-md-4">
    <q-input
      outlined
      v-model="form.new_password"
      label="New Password"
      :type="showNewPassword ? 'text' : 'password'"
      :rules="[
        val => !val || val.length >= 8 || 'Minimum 8 characters'
      ]"
    >
      <template v-slot:append>
        <q-btn
          @click="showNewPassword = !showNewPassword"
          round
          flat
          color="white"
          class="text-black"
          :icon="showNewPassword ? 'visibility' : 'visibility_off'"
        />
      </template>
    </q-input>
  </div>

  <div class="col-12 col-md-4">
    <q-input
      outlined
      v-model="form.new_password_confirmation"
      label="Confirm New Password"
      :type="showConfirmPassword ? 'text' : 'password'"
      :rules="[
        val => !form.new_password || val === form.new_password || 'Passwords must match'
      ]"
    >
      <template v-slot:append>
        <q-btn
          @click="showConfirmPassword = !showConfirmPassword"
          round
          flat
          color="white"
          class="text-black"
          :icon="showConfirmPassword ? 'visibility' : 'visibility_off'"
        />
      </template>
    </q-input>
  </div>

              <!-- Permissions Section -->
              <!-- <div class="col-12">
                <q-separator class="q-my-md" />
                <div class="text-subtitle1 q-mb-md">Permissions</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-card bordered flat class="bg-grey-1">
                      <q-card-section>
                        <div class="row items-center">
                          <div class="col">
                            <q-checkbox
                              v-model="form.permissions.isFunded"
                              label="Fund Manager"
                              :disable="!canEditPermissions"
                              true-value="1"
                              false-value="0"
                            />
                          </div>
                          <div class="col-auto">
                            <q-icon name="account_balance" />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div> -->
            </div>

            <!-- Error Display -->
            <div v-if="validationErrors" class="q-mt-md">
              <q-banner class="bg-negative text-white">
                <template v-slot:avatar>
                  <q-icon name="error" color="white" />
                </template>
                <div v-for="(errors, field) in validationErrors" :key="field">
                  <div v-for="error in errors" :key="error">
                    {{ error }}
                  </div>
                </div>
              </q-banner>
            </div>

            <!-- Action Buttons -->
            <div class="row q-mt-lg justify-end">
              <q-btn
                label="Reset Changes"
                flat
                color="grey"
                class="q-mr-sm"
                @click="resetForm"
                :disable="useRaterStore.loading"
              />
              <q-btn
                label="Save Changes"
                type="submit"
                color="primary"
                :loading="useRaterStore.loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Account Information Display Card -->
      <q-card>
        <q-card-section>
          <div class="text-subtitle1 q-mb-md">Account Information</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Username</q-item-label>
                  <q-item-label>
                    {{ useRaterStore.user?.username || currentUserLogin }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Role</q-item-label>
                  <q-item-label>{{ useRaterStore.user.role?.role_name }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Last Login</q-item-label>
                  <q-item-label>{{ currentDateTime }} UTC</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Position</q-item-label>
                  <q-item-label>{{ useRaterStore.user?.position || 'Not specified' }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';

  
  import { toast } from 'src/boot/toast';
  import { useRaterAuthStore } from 'stores/authStore_raters';

  export default defineComponent({
    name: 'EditAccountPage_rater',

    setup() {
      const useRaterStore = useRaterAuthStore();
      const loading = ref(false);

      const accountForm = ref(null);
      const validationErrors = ref(null);

      // Current date/time and user login
      const currentDateTime = ref('2025-05-08 03:27:49');
      const currentUserLogin = ref('karlmacas29');
      const showOldPassword = ref(false);
      const showNewPassword = ref(false);
      const showConfirmPassword = ref(false);

      const form = ref({
        name: '',
        username: '',
        position: '',
        active: true, // Add this field
        old_password: '', // <-- ADD THIS
        new_password: '',
        new_password_confirmation: '', // <-- FIXED (was `confirm_password`)
      });

      // Computed property to determine if user can edit permissions

      // Initialize form with user data
      onMounted(() => {
        if (useRaterStore.user) {
          form.value = {
            name: useRaterStore.user.name || '',
            username: useRaterStore.user.username || '',
            position: useRaterStore.user.position || '',
            active: useRaterStore.user.active ?? true, // Initialize with current active status or default to true

            confirm_password: '',
            old_password: '', // <-- ADD THIS
            new_password: '',
            new_password_confirmation: '', // <-- FIX THIS TOO
          };

          // Update current date/time
          currentDateTime.value = '2025-05-08 04:37:59';
          currentUserLogin.value = '';
        } else {
          // If not authenticated, redirect to login
          if (!useRaterStore.isAuthenticated) {
            useRaterStore.router.push({ name: 'Rater Login' });
          }
        }
      });

      // Get role name based on user permissions

      // Reset validation errors
      const resetValidationErrors = () => {
        validationErrors.value = null;
      };

      // Reset form to original values
      const resetForm = () => {
        if (useRaterStore.user) {
          form.value.name = useRaterStore.user.name || '';
          form.value.new_password = '';
          form.value.confirm_password = '';

          // Reset permissions
        }
        resetValidationErrors();
        toast.info('Form has been reset');
      };

      // Save changes to user account
      // Update the saveChanges function:

const saveChanges = async () => {
  try {
    resetValidationErrors();
    const isValid = await accountForm.value.validate();
    if (!isValid) return;
    loading.value = true;



    if (form.value.new_password) {
      const passwordChanged = await useRaterStore.changePassword({
        old_password: form.value.old_password,
        new_password: form.value.new_password,
        new_password_confirmation: form.value.new_password_confirmation,
      });

      if (!passwordChanged) {
        loading.value = false;
        return;
      }
    }


  } catch (error) {
    console.error('Error updating account:', error);
    if (error.response?.data?.errors?.old_password) {
      toast.error('Current password is incorrect');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Failed to update account. Please try again.');
    }
  } finally {
    loading.value = false;
  }
};


      return {
        useRaterStore,
        form,
        accountForm,
        saveChanges,
        resetForm,
        validationErrors,
        currentDateTime,
        currentUserLogin,
        showOldPassword,
        showNewPassword,
        showConfirmPassword,
      };
    },
  });
</script>

<style scoped>
  .bg-grey-1 {
    background-color: #f5f5f5;
  }

  .q-card {
    transition: all 0.3s ease;
  }

  .q-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
</style>
