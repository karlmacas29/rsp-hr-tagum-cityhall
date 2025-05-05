<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="text-h4 q-mb-md">Edit Account</div>

      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="text-subtitle1 q-mb-md">Personal Information</div>

          <q-form @submit.prevent="saveChanges" ref="accountForm">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="form.name"
                  label="Full Name"
                  :rules="[(val) => !!val || 'Name is required']"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="form.username"
                  label="Username"
                  :rules="[(val) => !!val || 'Username is required']"
                  readonly
                  disable
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input filled v-model="form.position" label="Position" readonly disable />
              </div>

              <div class="col-12">
                <q-separator class="q-my-md" />
                <div class="text-subtitle1 q-mb-md">Change Password (Optional)</div>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  filled
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
                  filled
                  v-model="form.confirm_password"
                  label="Confirm New Password"
                  type="password"
                  :rules="[
                    (val) =>
                      !form.new_password || val === form.new_password || 'Passwords do not match',
                  ]"
                />
              </div>

              <div class="col-12">
                <q-separator class="q-my-md" />
                <div class="text-subtitle1 q-mb-md">Current Password</div>
                <div class="text-caption q-mb-sm">
                  Please enter your current password to confirm changes
                </div>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="form.current_password"
                  label="Current Password"
                  type="password"
                  :rules="[(val) => !!val || 'Current password is required']"
                />
              </div>
            </div>

            <div class="row q-mt-lg">
              <q-space />
              <q-btn label="Cancel" flat color="negative" class="q-mr-sm" @click="resetForm" />
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
                  <q-item-label>{{ authStore.user?.username }}</q-item-label>
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
                  <q-item-label caption>Name</q-item-label>
                  <q-item-label>{{ authStore.user?.name }}</q-item-label>
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
  import { defineComponent, ref, onMounted } from 'vue';
  import { useAuthStore } from 'stores/authStore';
  import { useQuasar } from 'quasar';
  import { useLogsStore } from 'stores/logsStore';

  export default defineComponent({
    name: 'EditAccountPage',

    setup() {
      const authStore = useAuthStore();
      const logsStore = useLogsStore();
      const $q = useQuasar();
      const accountForm = ref(null);

      const form = ref({
        name: '',
        username: '',
        position: '',
        new_password: '',
        confirm_password: '',
        current_password: '',
      });

      // Initialize form with user data
      onMounted(() => {
        if (authStore.user) {
          form.value.name = authStore.user.name || '';
          form.value.username = authStore.user.username || '';
          form.value.position = authStore.user.position || '';
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

      // Save changes to user account
      const saveChanges = async () => {
        // Check if the form is valid
        const isValid = await accountForm.value.validate();
        if (!isValid) return;

        // Only include password fields if new password is provided
        const userData = {
          name: form.value.name,
        };

        if (form.value.new_password) {
          userData.password = form.value.new_password;
          userData.password_confirmation = form.value.confirm_password;
          userData.current_password = form.value.current_password;
        } else if (form.value.current_password) {
          userData.current_password = form.value.current_password;
        }

        try {
          // Use the updateUser method from authStore
          const result = await authStore.updateUser(authStore.user.id, userData);

          if (result) {
            $q.notify({
              type: 'positive',
              message: 'Account updated successfully',
            });

            // Log the action
            await logsStore.logAction('Updated Account Information');

            // Reset password fields
            form.value.new_password = '';
            form.value.confirm_password = '';
            form.value.current_password = '';
          }
        } catch (error) {
          console.error('Error updating account:', error);
        }
      };

      // Reset the form to original values
      const resetForm = () => {
        if (authStore.user) {
          form.value.name = authStore.user.name || '';
          form.value.username = authStore.user.username || '';
          form.value.position = authStore.user.position || '';
        }
        form.value.new_password = '';
        form.value.confirm_password = '';
        form.value.current_password = '';
      };

      return {
        authStore,
        form,
        accountForm,
        saveChanges,
        resetForm,
        getRoleName,
      };
    },
  });
</script>

<style scoped>
  /* You can add custom styles here */
</style>
