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
                          <q-item-label caption>{{ scope.opt.role }}</q-item-label>
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

<script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';

  export default {
    setup() {
      const router = useRouter();
      const $q = useQuasar();
      const username = ref('');
      const password = ref('');
      const loading = ref(false);
      const formSubmitted = ref(false);
      const options = ref([
        { label: 'User A. User', role: 'HR Manager', value: 'opt1' },
        { label: 'John Doe', role: 'HR Manager', value: 'opt2' },
        { label: 'Jane Smith', role: 'HR Officer', value: 'opt3' },
        { label: 'Robert Johnson', role: 'HR Specialist', value: 'opt4' },
        { label: 'Emily Davis', role: 'HR Manager', value: 'opt5' },
      ]);

      const filteredOptions = ref([...options.value]);

      function filterFn(val, update) {
        if (val === '') {
          update(() => {
            filteredOptions.value = options.value;
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          filteredOptions.value = options.value.filter(
            (v) =>
              v.label.toLowerCase().indexOf(needle) > -1 ||
              v.role.toLowerCase().indexOf(needle) > -1,
          );
        });
      }

      const login = () => {
        formSubmitted.value = true;

        if (!username.value || !password.value) {
          return;
        }

        loading.value = true;

        setTimeout(() => {
          loading.value = false;

          if (password.value === 'password') {
            $q.notify({
              type: 'positive',
              message: 'Login successful',
            });
            router.push('/uRater');
          } else {
            $q.notify({
              type: 'negative',
              message: 'Invalid credentials',
            });
            password.value = '';
          }
        }, 1000);
      };

      return {
        username,
        password,
        loading,
        formSubmitted,
        options,
        filteredOptions,
        filterFn,
        login,
      };
    },
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
</style>
