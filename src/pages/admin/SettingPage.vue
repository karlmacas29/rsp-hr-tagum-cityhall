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
            {{ authStore.user?.username || currentUserLogin }}
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
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input outlined v-model="form.username" label="Username" disable />
              </div>

              <div class="col-12 col-md-6">
                <q-input outlined v-model="form.position" label="Position" disable />
              </div>

              <!-- Password Change Section -->
              <div class="col-12">
                <q-separator class="q-my-md" />
                <div class="text-subtitle1 q-mb-md">Change Password (Optional)</div>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  v-model="form.new_password"
                  label="New Password"
                  type="password"
                  :rules="[
                    (val) => !val || val.length >= 8 || 'Password must be at least 8 characters',
                  ]"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  v-model="form.confirm_password"
                  label="Confirm New Password"
                  type="password"
                  :rules="[
                    (val) =>
                      !form.new_password || val === form.new_password || 'Passwords do not match',
                  ]"
                />
              </div>

              <!-- Permissions Section -->
              <div class="col-12">
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
                  </div>

                  <div class="col-12 col-md-6">
                    <q-card bordered flat class="bg-grey-1">
                      <q-card-section>
                        <div class="row items-center">
                          <div class="col">
                            <q-checkbox
                              v-model="form.permissions.isUserM"
                              label="User Manager"
                              :disable="!canEditPermissions"
                              true-value="1"
                              false-value="0"
                            />
                          </div>
                          <div class="col-auto">
                            <q-icon name="manage_accounts" />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-card bordered flat class="bg-grey-1">
                      <q-card-section>
                        <div class="row items-center">
                          <div class="col">
                            <q-checkbox
                              v-model="form.permissions.isRaterM"
                              label="Rater Manager"
                              :disable="!canEditPermissions"
                              true-value="1"
                              false-value="0"
                            />
                          </div>
                          <div class="col-auto">
                            <q-icon name="rate_review" />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-card bordered flat class="bg-grey-1">
                      <q-card-section>
                        <div class="row items-center">
                          <div class="col">
                            <q-checkbox
                              v-model="form.permissions.isCriteria"
                              label="Criteria Manager"
                              :disable="!canEditPermissions"
                              true-value="1"
                              false-value="0"
                            />
                          </div>
                          <div class="col-auto">
                            <q-icon name="checklist" />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-card bordered flat class="bg-grey-1">
                      <q-card-section>
                        <div class="row items-center">
                          <div class="col">
                            <q-checkbox
                              v-model="form.permissions.isDashboardStat"
                              label="Dashboard Statistics"
                              :disable="!canEditPermissions"
                              true-value="1"
                              false-value="0"
                            />
                          </div>
                          <div class="col-auto">
                            <q-icon name="dashboard" />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>
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
                :disable="authStore.loading"
              />
              <q-btn
                label="Save Changes"
                type="submit"
                color="primary"
                :loading="authStore.loading"
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
                  <q-item-label>{{ authStore.user?.username || currentUserLogin }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Role</q-item-label>
                  <q-item-label>{{ getRoleName() }}</q-item-label>
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
                  <q-item-label>{{ authStore.user?.position || 'Not specified' }}</q-item-label>
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
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import { useAuthStore } from 'stores/authStore';
  import { useLogsStore } from 'stores/logsStore';
  import { toast } from 'src/boot/toast';

  export default defineComponent({
    name: 'EditAccountPage',

    setup() {
      const authStore = useAuthStore();
      const logsStore = useLogsStore();
      const accountForm = ref(null);
      const validationErrors = ref(null);

      // Current date/time and user login
      const currentDateTime = ref('2025-05-08 03:27:49');
      const currentUserLogin = ref('karlmacas29');

      const form = ref({
        name: '',
        username: '',
        position: '',
        active: true, // Add this field
        new_password: '',
        confirm_password: '',
        permissions: {
          isFunded: false,
          isUserM: false,
          isRaterM: false,
          isCriteria: false,
          isDashboardStat: false,
        },
      });

      // Computed property to determine if user can edit permissions
      const canEditPermissions = computed(() => {
        return authStore.user?.position === 'admin';
      });

      // Initialize form with user data
      onMounted(() => {
        if (authStore.user) {
          form.value = {
            name: authStore.user.name || '',
            username: authStore.user.username || '',
            position: authStore.user.position || '',
            active: authStore.user.active ?? true, // Initialize with current active status or default to true
            new_password: '',
            confirm_password: '',
            permissions: {
              isFunded: authStore.user.permissions?.isFunded || false,
              isUserM: authStore.user.permissions?.isUserM || false,
              isRaterM: authStore.user.permissions?.isRaterM || false,
              isCriteria: authStore.user.permissions?.isCriteria || false,
              isDashboardStat: authStore.user.permissions?.isDashboardStat || false,
            },
          };

          // Update current date/time
          currentDateTime.value = '2025-05-08 04:37:59';
          currentUserLogin.value = '';
        } else {
          // If not authenticated, redirect to login
          if (!authStore.isAuthenticated) {
            authStore.router.push({ name: 'Admin Login' });
          }
        }
      });

      // Get role name based on user permissions
      const getRoleName = () => {
        const user = authStore.user;
        if (!user) return 'Unknown';

        if (user.position === 'admin') return 'Administrator';

        if (user.permissions) {
          const permissions = user.permissions;
          if (permissions.isFunded) return 'Fund Manager';
          if (permissions.isUserM) return 'User Manager';
          if (permissions.isRaterM) return 'Rater Manager';
          if (permissions.isCriteria) return 'Criteria Manager';
        }

        return 'Standard User';
      };

      // Reset validation errors
      const resetValidationErrors = () => {
        validationErrors.value = null;
      };

      // Reset form to original values
      const resetForm = () => {
        if (authStore.user) {
          form.value.name = authStore.user.name || '';
          form.value.new_password = '';
          form.value.confirm_password = '';

          // Reset permissions
          if (authStore.user.permissions) {
            form.value.permissions = {
              isFunded: authStore.user.permissions.isFunded || false,
              isUserM: authStore.user.permissions.isUserM || false,
              isRaterM: authStore.user.permissions.isRaterM || false,
              isCriteria: authStore.user.permissions.isCriteria || false,
              isDashboardStat: authStore.user.permissions.isDashboardStat || false,
            };
          }
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

          // Prepare user data with all required fields
          const userData = {
            name: form.value.name.trim(),
            username: form.value.username, // Include username
            position: form.value.position, // Include position
            active: true, // Include active status
            permissions: form.value.permissions, // Always include permissions
          };

          // Only include password fields if new password is provided
          if (form.value.new_password) {
            if (form.value.new_password !== form.value.confirm_password) {
              toast.error('Passwords do not match');
              return;
            }
            userData.password = form.value.new_password;
            userData.password_confirmation = form.value.confirm_password;
          }

          console.log('Sending update with data:', userData); // Debug log

          const result = await authStore.updateUser(authStore.user.id, userData);

          if (result) {
            await logsStore.logAction('Updated Account Information');

            // Reset password fields
            form.value.new_password = '';
            form.value.confirm_password = '';
          }
        } catch (error) {
          console.error('Error updating account:', error);

          if (error.response?.status === 422) {
            validationErrors.value = error.response.data.errors;
            // Show all validation errors in toast
            const errorMessages = [];
            for (const field in error.response.data.errors) {
              errorMessages.push(...error.response.data.errors[field]);
            }
            toast.error(errorMessages.join('\n'));
          } else if (error.response?.status === 403) {
            toast.error('You do not have permission to perform this action');
          } else if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error('An error occurred while updating your account');
          }
        }
      };

      return {
        authStore,
        form,
        accountForm,
        saveChanges,
        getRoleName,
        resetForm,
        canEditPermissions,
        validationErrors,
        currentDateTime,
        currentUserLogin,
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
