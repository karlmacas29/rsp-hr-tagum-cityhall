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
          <form action="">
            <div class="q-gutter-md" style="width: 400px">
              <q-input outlined v-model="email" label="Email" type="text" />
              <q-input outlined v-model="password" label="Password" :type="showPass ? 'text' : 'password'">
                <template v-slot:append>
                  <q-btn @click="passwordVisible" round flat color="white" class="text-grey"
                    :icon="showPass ? 'visibility' : 'visibility_off'" />
                </template>
              </q-input>
            </div>
          </form>
        </div>
        <div>
          <q-btn @click="login" label="Login" color="primary" size="md" style="width: 200px" rounded />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from 'src/stores/authStore';

export default {
  name: 'LogIn',
  data() {
    return {
      email: '',
      password: '',
      showPass: false,
    };
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  methods: {
    async login() {
      try {
        const success = await this.authStore.login(this.email, this.password);

        if (success) {
          // Redirect to the dashboard
          this.$router.push('/dashboard');
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.message,
        });
      }
    },
    passwordVisible() {
      this.showPass = !this.showPass;
    },
  },
};
</script>
