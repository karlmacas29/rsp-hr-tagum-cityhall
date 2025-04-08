<template>
  <q-header reveal elevated>
    <q-toolbar class="header row items-center justify-between text-black" elevated>
      <div class="row items-center justify-between q-gutter-x-sm">
        <div>
          <img src="logo.png" alt="City Hall Logo" style="width: 50px; height: 50px;" />
        </div>
        <div>
          <h4 class="text-bold">City Hall of Tagum</h4>
        </div>
      </div>
      <div class="row items-center justify-between q-gutter-x-xl">
        <div>
          <q-tabs active-color="primary" v-model="routeTab" class="bg-white" align="justify" narrow-indicator>
            <q-tab name="Homepage" label="Home" @click="router.push({name: 'Homepage'})"/>
            <q-tab name="Joblist" label="Job Lists" @click="router.push({name: 'Joblist'})" />
          </q-tabs>
        </div>
        <div>
          <q-btn color="primary">Apply now</q-btn>
        </div>
      </div>
      
    </q-toolbar>
  </q-header>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router';
import {ref} from 'vue';


const route = useRoute();
const router = useRouter();
let routeTab = ref(route.name);

</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #eee;
  height: 70px;
}
</style>