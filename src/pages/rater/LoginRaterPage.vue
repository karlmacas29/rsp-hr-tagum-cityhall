<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <q-page class="row">
        <div class="col-6 self-center" style="height: 100vh">
          <q-img src="/img/background/tagumbg.jpg" style="height: 100%">
            <div class="absolute-full text-subtitle2 flex flex-center">
              <div class="column items-start justify-start">
                <img src="/logo.png" alt="Tagum City Logo" class="q-mb-md" width="90" height="80" />
                <div
                  class="text-h2 text-weight-bolder"
                  style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
                >
                  Recruitment,
                  <br />
                  Selection and
                  <br />
                  Placement System
                </div>
                <div class="text-h6" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)">
                  City of Tagum Human Resource Management Office
                </div>
              </div>
            </div>
          </q-img>
        </div>
        <div class="col-6 grid self-center justify-center q-pa-sm">
          <div class="q-mx-auto" style="width: 350px">
            <div class="row justify-start items-center q-ma-none" style="width: 380px">
              <div>
                <q-icon left size="6em" name="star" />
              </div>
              <div>
                <div class="text-h4 text-bold q-ma-none">Login</div>
                <div class="text-h6 q-ma-none">Hello Rater</div>
              </div>
            </div>
            <div>
              <form @submit.prevent="login">
                <div class="login-form-inputs" style="width: 400px">
                              <q-select
                      outlined
                      v-model="username"
                      :options="filteredOptions"
                      label="Select Rater"
                      use-input
                      input-debounce="0"
                      @filter="filterFn"
                      :error="formSubmitted && !username"
                      error-message="Please select a rater"
                      popup-content-class="custom-dropdown"
                      menu-anchor="bottom left"
                      menu-self="top left"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">No matching raters found</q-item-section>
                        </q-item>
                      </template>
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps" :class="{ 'bg-grey-2': scope.selected }">
                          <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                            <q-item-label caption>{{ scope.opt.office }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>

                  <q-input
                    v-if="username"
                    outlined
                    v-model="password"
                    label="Password"
                    type="password"
                    :error="formSubmitted && !password"
                    error-message="Password is required"
                  />
                </div>
                <div class="row justify-center items-center q-mt-md">
                  <q-btn
                    type="submit"
                    label="Login"
                    color="primary"
                    size="md"
                    style="width: 200px"
                    rounded
                    :loading="loading"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useRaterAuthStore } from 'stores/authStore_raters';

const $q = useQuasar();
const router = useRouter();
const authRaterStore = useRaterAuthStore();

// Refs
const username = ref(null);
const password = ref('');
const loading = ref(false);
const formSubmitted = ref(false);
const raters = ref([]);
const filter = ref('');

// Computed property for filtered options
const filteredOptions = computed(() => {
  if (!filter.value) return raters.value;
  return raters.value.filter(rater =>
    rater.name.toLowerCase().includes(filter.value.toLowerCase()) ||
    (rater.office && rater.office.toLowerCase().includes(filter.value.toLowerCase()))
  );
});

// Fetch raters when component mounts
onMounted(async () => {
  try {
    loading.value = true;
    const fetchedRaters = await authRaterStore.get_rater_usernames();
    // Transform the raters data for the dropdown
    raters.value = fetchedRaters.map(rater => ({
      label: rater.username,
      value: rater.username || rater.name.toLowerCase().replace(/\s+/g, ''),
      office: rater.office
    }));

  } catch (error) {
    console.error('Failed to fetch raters:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch raters. Please try again later.'
    });
  } finally {
    loading.value = false;
  }
});

function filterFn(val, update) {
  // Update the filter value
  filter.value = val;
  update(() => {
    // The computed property will handle the filtering
  });
}

const login = async () => {
  formSubmitted.value = true;
  if (!username.value || !password.value) return;

  try {
    loading.value = true;
    // Use the value property which contains the username
    await authRaterStore.login(username.value.value, password.value);

    if (authRaterStore.isAuthenticated) {
      router.push({ name: 'Raters Homepage' });
    }
  } catch (error) {
    console.error('Login error:', error);
    $q.notify({
      type: 'negative',
      message: error.message || 'Login failed. Please try again.'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-form-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.q-field {
  min-height: 56px !important;
}

.q-field--with-bottom {
  padding-bottom: 12px !important;
}

.q-field:not(.q-field--with-bottom) {
  padding-bottom: 0 !important;
}

.custom-dropdown {
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
}
</style>

<!-- 👇 This MUST be outside the scoped block -->
