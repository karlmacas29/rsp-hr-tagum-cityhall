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
                <div class="q-gutter-md" style="width: 400px">
                  <q-select outlined v-model="username" :options="options" label="Select Raters">
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps" :class="{ 'bg-grey-2': scope.selected }">
                        <q-item-section>
                          <q-item-label>{{ scope.opt.label }}</q-item-label>
                          <q-item-label caption>{{ scope.opt.role }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="row justify-center items-center q-mt-md">
                  <q-btn
                    type="submit"
                    label="Login"
                    color="primary"
                    size="md"
                    style="width: 200px"
                    rounded
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const username = ref('');
  const options = ref([
    { label: 'User A. User', role: 'HR Manager', value: 'opt1' },
    { label: 'User A. User', role: 'HR Manager', value: 'opt2' },
    { label: 'User A. User', role: 'HR Manager', value: 'opt3' },
    { label: 'User A. User', role: 'HR Manager', value: 'opt4' },
    { label: 'User A. User', role: 'HR Manager', value: 'opt5' },
  ]);

  const login = () => {
    router.push('/uRater');
  };
</script>
