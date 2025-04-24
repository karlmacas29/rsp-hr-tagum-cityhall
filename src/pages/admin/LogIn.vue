<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <q-page class="row">

      <div class="col-6 self-center q-pa-sm" style="height: 100vh;">
          <q-img src="/img/background/tagumbg.jpg" style="height: 100%; border-radius: 10px;">
            <div class="absolute-full text-subtitle2 flex flex-center">
              <div class="column items-center justify-center">
                <img src="/logo.png" alt="Tagum City Logo" class="logo" width="240px" />
                <div class="text-h5 text-weight-bolder">Recruitment, Selection and Placement</div>
                <div class="text-h6">Human Resources</div>
              </div>
            </div>
          </q-img>
      </div>
      <div class="col-6 grid self-center justify-center q-pa-sm">
          <div class="q-mx-auto" style="width: 380px">
            <div class="row justify-start items-center q-ma-none" style="width: 380px">
            <div>
              <q-icon left size="6em" name="admin_panel_settings" />
            </div>
            <div>
              <div class="text-h4 text-bold q-ma-none">Login</div>
              <div class="text-h6 q-ma-none">Hello Admin</div>
            </div>
          </div>
          <div>
            <form @submit.prevent="login" class="grid justify-center items-center q-px-md">

                <q-input outlined class="q-mb-sm" v-model="username" label="Username" type="text" :error="!!errorMessage.username" :error-message="errorMessage.username?.[0]" />
                <q-input outlined v-model="password" label="Password" :type="showPass ? 'text' : 'password'" :error="!!errorMessage.password" :error-message="errorMessage.password?.[0]">
                  <template v-slot:append>
                    <q-btn @click="passwordVisible" round flat color="white" class="text-black"
                      :icon="showPass ? 'visibility' : 'visibility_off'" />
                  </template>
                </q-input>

              <div class="row justify-center items-center q-mt-md">
                <q-btn type="submit" :disabled="authStore.loading" :loading="authStore.loading" label="Login" color="primary" size="md"
                  style="width: 200px" rounded />
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
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/authStore';


const username = ref('');
const password = ref('');
//
const showPass = ref(false);
//
const errorMessage = ref([]);

const authStore = useAuthStore();

const login = async () => {
await authStore.login(username.value, password.value);
errorMessage.value = authStore.errors
};

const passwordVisible = () => {
showPass.value = !showPass.value;
};
</script>
