```vue
<template>
  <q-page>
    <div class="q-pa-md">
      <div class="column items-start justify-center q-mb-md">
        <h5 class="text-h4 q-ma-none"><b>User Management</b></h5>
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs class="q-ma-none">
            <template v-slot:separator>
              <q-icon size="1.2em" name="arrow_forward" />
            </template>
            <q-breadcrumbs-el icon="manage_accounts" label="User Management" />
            <!-- <q-breadcrumbs-el icon="rule" label="Criteria" /> -->
          </q-breadcrumbs>
        </div>
      </div>

      <!-- User List -->
      <div>
        <!-- Add User Button -->
        <div class="q-mb-md">
          <q-btn color="primary" label="Add New User" icon="person_add" @click="openAddDialog()" />
        </div>

        <q-table
          :rows="authStore.users"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :v-bind="pagination"
          :loading="authStore.loadUser"
        >
          <!-- Top section with search -->
          <template v-slot:top-right>
            <q-input dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <!-- Active status -->
          <template v-slot:body-cell-active="props">
            <q-td :props="props">
              <q-badge :color="props.row.active ? 'positive' : 'negative'">
                {{ props.row.active ? 'Active' : 'Inactive' }}
              </q-badge>
            </q-td>
          </template>

          <!-- Permissions column -->
          <template v-slot:body-cell-permissions="props">
            <q-td :props="props">
              <div class="row q-gutter-x-xs">
                <q-badge v-if="props.row.rsp_control.isFunded == '1'" color="primary">
                  <q-icon name="paid" size="xs" />
                  <q-tooltip>Funding Access</q-tooltip>
                </q-badge>

                <q-badge v-if="props.row.rsp_control.isUserM == '1'" color="primary">
                  <q-icon name="manage_accounts" size="xs" />
                  <q-tooltip>User Management</q-tooltip>
                </q-badge>

                <q-badge v-if="props.row.rsp_control.isRaterM == '1'" color="primary">
                  <q-icon name="rate_review" size="xs" />
                  <q-tooltip>Rater Management</q-tooltip>
                </q-badge>

                <q-badge v-if="props.row.rsp_control.isCriteria == '1'" color="primary">
                  <q-icon name="rule" size="xs" />
                  <q-tooltip>Criteria Access</q-tooltip>
                </q-badge>
              </div>
            </q-td>
          </template>

          <!-- Actions column -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-group flat>
                <q-btn flat round color="primary" icon="edit" @click="openEditDialog(props.row.id)">
                  <q-tooltip>Edit User</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.id !== authStore.user.id"
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="confirmDelete(props.row.id, props.row.name)"
                >
                  <q-tooltip>Delete User</q-tooltip>
                </q-btn>
              </q-btn-group>
            </q-td>
          </template>
          <!-- Loading -->
          <template v-slot:loading>
            <q-inner-loading showing color="primary">
              <q-linear-progress indeterminate color="primary" class="q-mt-sm" />
            </q-inner-loading>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Add/Edit User Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 800px">
        <q-card-section :class="isEditing ? 'bg-blue text-white' : 'bg-green text-white'">
          <div class="text-h5 text-bold">{{ isEditing ? 'Edit User' : 'Add New User' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitForm">
            <div class="row q-col-gutter-md">
              <!-- Left Column - User Information -->
              <div class="col-12 col-md-6">
                <div class="text-subtitle1 q-mb-sm">User Information</div>

                <!-- Name -->
                <q-input
                  v-model="form.name"
                  label="Name *"
                  :error="!!authStore.errors?.name"
                  :error-message="authStore.errors?.name?.[0]"
                  outlined
                  class="q-mb-md"
                />

                <!-- Username -->
                <q-input
                  v-model="form.username"
                  label="Username *"
                  :error="!!authStore.errors?.username"
                  :error-message="authStore.errors?.username?.[0]"
                  outlined
                  class="q-mb-md"
                />

                <!-- Position -->
                <q-input
                  v-model="form.position"
                  label="Position *"
                  :error="!!authStore.errors?.position"
                  :error-message="authStore.errors?.position?.[0]"
                  outlined
                  class="q-mb-md"
                />

                <!-- Password -->
                <q-input
                  v-model="form.password"
                  type="password"
                  label="Password"
                  :hint="
                    isEditing ? 'Leave empty to keep current password' : 'Required for new users'
                  "
                  :error="!!authStore.errors?.password"
                  :error-message="authStore.errors?.password?.[0]"
                  outlined
                  class="q-mb-md"
                />

                <!-- Active Status -->
                <q-toggle
                  v-model="form.active"
                  label="Active"
                  :error="!!authStore.errors?.active"
                  :error-message="authStore.errors?.active?.[0]"
                  class="q-mb-md"
                />
              </div>

              <!-- Right Column - Permissions -->
              <div class="col-12 col-md-6">
                <div class="text-subtitle1 q-mb-sm">User Permissions</div>
                <q-card flat bordered class="q-pa-md">
                  <div class="q-gutter-y-md">
                    <q-toggle
                      true-value="1"
                      false-value="0"
                      v-model="form.permissions.isFunded"
                      label="Allow Funding Access"
                      :error="!!authStore.errors?.['permissions.isFunded']"
                      :error-message="authStore.errors?.['permissions.isFunded']?.[0]"
                      icon="paid"
                    />

                    <q-toggle
                      true-value="1"
                      false-value="0"
                      v-model="form.permissions.isUserM"
                      label="Allow User Management"
                      :error="!!authStore.errors?.['permissions.isUserM']"
                      :error-message="authStore.errors?.['permissions.isUserM']?.[0]"
                      icon="manage_accounts"
                    />

                    <q-toggle
                      true-value="1"
                      false-value="0"
                      v-model="form.permissions.isRaterM"
                      label="Allow Rater Management"
                      :error="!!authStore.errors?.['permissions.isRaterM']"
                      :error-message="authStore.errors?.['permissions.isRaterM']?.[0]"
                      icon="rate_review"
                    />

                    <q-toggle
                      true-value="1"
                      false-value="0"
                      v-model="form.permissions.isCriteria"
                      label="Allow Modify Criteria"
                      :error="!!authStore.errors?.['permissions.isCriteria']"
                      :error-message="authStore.errors?.['permissions.isCriteria']?.[0]"
                      icon="rule"
                    />
                  </div>
                </q-card>
              </div>
            </div>

            <!-- Form Buttons - Full Width -->
            <div class="row justify-end q-mt-lg">
              <q-btn label="Cancel" color="negative" flat v-close-popup />
              <q-btn
                :label="isEditing ? 'Update' : 'Create'"
                type="submit"
                color="primary"
                :loading="authStore.loading"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">
            Are you sure you want to delete user:
            <strong>{{ userToDelete.name }}</strong>
            ?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="deleteUser"
            :loading="authStore.loading"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useAuthStore } from 'stores/authStore';

  export default defineComponent({
    name: 'UserManagement',

    setup() {
      const authStore = useAuthStore();

      // Table related
      const filter = ref('');
      const pagination = ref({
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
      });

      const columns = [
        { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
        { name: 'username', align: 'left', label: 'Username', field: 'username', sortable: true },
        { name: 'position', align: 'left', label: 'Position', field: 'position', sortable: true },
        { name: 'active', align: 'left', label: 'Status', field: 'active', sortable: true },
        {
          name: 'permissions',
          align: 'left',
          label: 'Permissions',
          field: (row) => row.rsp_control,
          sortable: false,
        },
        {
          name: 'created_at',
          align: 'left',
          label: 'Created At',
          field: 'created_at',
          sortable: true,
        },
        { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false },
      ];

      // Form related
      const dialog = ref(false);
      const isEditing = ref(false);
      const form = ref({
        name: '',
        username: '',
        position: '',
        password: '',
        active: true,
        permissions: {
          isFunded: false,
          isUserM: false,
          isRaterM: false,
          isCriteria: false,
        },
      });

      // Delete related
      const deleteDialog = ref(false);
      const userToDelete = ref({
        id: null,
        name: '',
      });

      // Methods
      const resetForm = () => {
        form.value = {
          name: '',
          username: '',
          position: '',
          password: '',
          active: true,
          permissions: {
            isFunded: false,
            isUserM: false,
            isRaterM: false,
            isCriteria: false,
          },
        };
        authStore.errors = {};
      };

      const openAddDialog = () => {
        resetForm();
        isEditing.value = false;
        dialog.value = true;
      };

      const openEditDialog = async (userId) => {
        resetForm();
        isEditing.value = true;
        dialog.value = true;

        // Get user details
        const user = await authStore.getUserById(userId);
        if (user) {
          form.value = {
            id: user.id,
            name: user.name,
            username: user.username,
            position: user.position,
            password: '', // Empty for edit form
            active: user.active,
            permissions: {
              isFunded: user.rsp_control?.isFunded || false,
              isUserM: user.rsp_control?.isUserM || false,
              isRaterM: user.rsp_control?.isRaterM || false,
              isCriteria: user.rsp_control?.isCriteria || false,
            },
          };
        }
      };

      const submitForm = async () => {
        const userData = {
          ...form.value,
          permissions: {
            ...form.value.permissions,
          },
        };

        if (isEditing.value) {
          // Update existing user
          const result = await authStore.updateUser(form.value.id, userData);
          if (result) {
            dialog.value = false;
          }
        } else {
          // Create new user
          const result = await authStore.registerUser(userData);
          if (result) {
            dialog.value = false;
          }
        }
      };

      const confirmDelete = (userId, userName) => {
        userToDelete.value = {
          id: userId,
          name: userName,
        };
        deleteDialog.value = true;
      };

      const deleteUser = async () => {
        await authStore.deleteUser(userToDelete.value.id);
      };

      // Load users when component mounts
      onMounted(async () => {
        await authStore.getAllUsers();
      });

      return {
        authStore,
        filter,
        pagination,
        columns,
        dialog,
        isEditing,
        form,
        deleteDialog,
        userToDelete,
        openAddDialog,
        openEditDialog,
        submitForm,
        confirmDelete,
        deleteUser,
      };
    },
  });
</script>
