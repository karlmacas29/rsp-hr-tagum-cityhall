<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <q-page class="row">
        <!-- Background Image Section -->
        <div
          class="col-12 col-md-6 self-center"
          :style="$q.screen.lt.md ? 'height: 40vh' : 'height: 100vh'"
        >
          <q-img src="/img/background/tagumbg.jpg" style="height: 100%">
            <div class="absolute-full text-subtitle2 flex flex-center">
              <div class="column items-start justify-start q-pa-md">
                <img
                  src="/logo.png"
                  alt="Tagum City Logo"
                  class="q-mb-md"
                  :width="$q.screen.lt.sm ? '60' : '90'"
                  :height="$q.screen.lt.sm ? '53' : '80'"
                />
                <div
                  :class="$q.screen.lt.sm ? 'text-h5' : $q.screen.lt.md ? 'text-h4' : 'text-h2'"
                  class="text-weight-bolder"
                  style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
                >
                  Recruitment,
                  <br />
                  Selection and
                  <br />
                  Placement System
                </div>
                <div
                  :class="
                    $q.screen.lt.sm ? 'text-caption' : $q.screen.lt.md ? 'text-body2' : 'text-h6'
                  "
                  style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
                >
                  City of Tagum Human Resource Management Office
                </div>
              </div>
            </div>
          </q-img>
        </div>

        <!-- Login Form Section -->
        <div
          class="col-12 col-md-6 flex column justify-center items-center relative-position"
          :style="$q.screen.lt.md ? 'min-height: 60vh' : 'height: 100vh'"
        >
          <div
            class="q-mx-auto q-px-md"
            :style="$q.screen.lt.sm ? 'width: 100%; max-width: 350px' : 'width: 350px'"
          >
            <div
              class="row justify-start items-center q-ma-none q-mb-md"
              :style="$q.screen.lt.sm ? 'width: 100%' : 'width: 370px'"
            >
              <div>
                <q-icon left :size="$q.screen.lt.sm ? '4em' : '6em'" name="admin_panel_settings" />
              </div>
              <div>
                <div :class="$q.screen.lt.sm ? 'text-h5' : 'text-h4'" class="text-bold q-ma-none">
                  Login
                </div>
                <div :class="$q.screen.lt.sm ? 'text-body1' : 'text-h6'" class="q-ma-none">
                  Hello Admin
                </div>
              </div>
            </div>

            <div>
              <form @submit.prevent="login" class="grid justify-center items-center q-px-md">
                <q-input
                  outlined
                  dense
                  class="q-mb-sm full-width"
                  v-model="username"
                  label="Username"
                  type="text"
                  :error="!!errorMessage.username"
                  :error-message="errorMessage.username?.[0]"
                />
                <q-input
                  outlined
                  dense
                  class="full-width"
                  v-model="password"
                  label="Password"
                  :type="showPass ? 'text' : 'password'"
                  :error="!!errorMessage.password"
                  :error-message="errorMessage.password?.[0]"
                >
                  <template v-slot:append>
                    <q-btn
                      @click="passwordVisible"
                      round
                      flat
                      color="white"
                      class="text-black"
                      :icon="showPass ? 'visibility' : 'visibility_off'"
                    />
                  </template>
                </q-input>

                <div class="row justify-center items-center q-mt-md full-width">
                  <q-btn
                    type="submit"
                    :disabled="authStore.loading"
                    :loading="authStore.loading"
                    label="Login"
                    color="primary"
                    :size="$q.screen.lt.sm ? 'sm' : 'md'"
                    :style="$q.screen.lt.sm ? 'width: 100%; max-width: 200px' : 'width: 200px'"
                    rounded
                  />
                </div>
              </form>
            </div>
          </div>

          <!-- Version Info - Bottom Right Corner -->
          <div
            class="absolute"
            :style="
              $q.screen.lt.sm
                ? 'bottom: 10px; right: 10px; display: flex; align-items: center; gap: 4px'
                : 'bottom: 20px; right: 20px; display: flex; align-items: center; gap: 8px'
            "
          >
            <q-icon name="info" :size="$q.screen.lt.sm ? 'xs' : 'sm'" color="grey-7" />
            <span :class="$q.screen.lt.sm ? 'text-caption' : 'text-caption'" class="text-grey-7">
              v 1.0.0.1
            </span>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import { ref } from 'vue';
  import { useAuthStore } from 'src/stores/authStore';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  const username = ref('');
  const password = ref('');
  const showPass = ref(false);
  const errorMessage = ref([]);

  const authStore = useAuthStore();

  const login = async () => {
    await authStore.login(username.value, password.value);
    errorMessage.value = authStore.errors;
  };

  const passwordVisible = () => {
    showPass.value = !showPass.value;
  };
</script>

<style scoped>
  /* Ensure full-width on mobile */
  @media (max-width: 599px) {
    .q-page {
      display: flex;
      flex-direction: column;
    }
  }
</style>
