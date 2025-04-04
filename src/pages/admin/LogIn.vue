<template>
  <div class="row" style="height: 100vh">
    <div class="col-6">
      <div class="">
        <q-img height="100vh" src="/img/background/tagumbg.jpg">
          <div class="absolute-full text-subtitle2 flex flex-center">
            <div class="column items-center justify-center">
              <img src="/logo.png" alt="Tagum City Logo" class="logo" width="240px" />
              <div class="text-h5 text-weight-bolder">Recruitment, Selection and Placement</div>
              <div class="text-h6">Human Resources</div>
            </div>
          </div>
        </q-img>
      </div>
    </div>
    <div class="col-6">
      <div class="column items-center justify-center q-gutter-md" style="height: 100vh">
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
          <form @submit.prevent="login" class=" grid justify-center items-center">
            <div class="q-gutter-x-sm q-mb-sm" style="width: 340px">
              <q-input outlined v-model="username" label="Username" type="text" :error="!!errorMessage.username" :error-message="errorMessage.username?.[0]" />
              <q-input outlined v-model="password" label="Password" :type="showPass ? 'text' : 'password'" :error="!!errorMessage.password" :error-message="errorMessage.password?.[0]">
                <template v-slot:append>
                  <q-btn @click="passwordVisible" round flat color="white" class="text-grey"
                    :icon="showPass ? 'visibility' : 'visibility_off'" />
                </template>
              </q-input>
            </div>
            <div class="row justify-center items-center">
              <q-btn type="submit" :disabled="authStore.loading" :loading="authStore.loading" label="Login" color="primary" size="md"
                style="width: 200px" rounded />
            </div>
          </form>
        </div>
        
      </div>
    </div>
  </div>
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
