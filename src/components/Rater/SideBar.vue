<template>
  <q-drawer
    v-model="drawerModel"
    show-if-above
    side="left"
    :width="230"
    :mini="miniState"
    :breakpoint="1024"
    bordered
    class="sidebar-drawer"
  >
    <!-- Logo Section -->
    <div class="logo-container">
      <q-img
        src="/logo.png"
        alt="Tagum City Logo"
        class="logo"
        :class="{ 'logo-mini': miniState }"
      />
    </div>

    <!-- Menu Items -->
    <q-list dense class="menu-list">
      <q-item
        v-for="(item, index) in menuItems"
        :key="index"
        dense
        clickable
        v-ripple
        :to="item.route"
        class="menu-item q-mx-xs q-my-xs"
        :active-class="'active-menu'"
        :active="route.path === item.route"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" size="sm" />
        </q-item-section>
        <q-item-section v-if="!miniState">
          {{ item.label }}
        </q-item-section>
        <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 10]">
          {{ item.label }}
        </q-tooltip>
      </q-item>
    </q-list>

    <!-- Mini Toggle Button (Desktop only) -->
    <div v-if="$q.screen.gt.sm" class="absolute-bottom q-pb-md row justify-center items-center">
      <q-btn
        dense
        flat
        round
        :icon="miniState ? 'chevron_right' : 'chevron_left'"
        @click="miniState = !miniState"
        class="mini-toggle-btn"
      >
        <q-tooltip>{{ miniState ? 'Expand' : 'Collapse' }}</q-tooltip>
      </q-btn>
    </div>
  </q-drawer>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useQuasar } from 'quasar';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const drawerModel = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });

  const $q = useQuasar();
  const route = useRoute();
  const miniState = ref(false);

  const menuItems = ref([
    { label: 'Dashboard', route: '/uRater', icon: 'dashboard' },
    { label: 'Criteria', route: '/uCriteria', icon: 'list' },
  ]);

  onMounted(() => {
    // Auto-collapse sidebar on small screens
    if ($q.screen.lt.md) {
      miniState.value = false;
    }
  });
</script>

<style scoped>
  .sidebar-drawer {
    background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  }

  /* Logo Section */
  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    margin-bottom: 10px;
    transition: all 0.3s ease;
  }

  .logo {
    width: 130px;
    height: auto;
    transition: all 0.3s ease;
  }

  .logo-mini {
    width: 50px;
  }

  /* Header Section */
  .header-container {
    text-align: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }

  .company-title {
    font-size: 11px;
    line-height: 1.3;
    color: #666;
  }

  /* Menu List */
  .menu-list {
    padding: 0 8px;
  }

  .menu-item {
    border-radius: 12px;
    padding: 10px 12px;
    margin: 4px 0;
    transition: all 0.2s ease;
  }

  .menu-item:hover {
    background-color: rgba(0, 176, 52, 0.1);
  }

  /* Active menu styling */
  .active-menu {
    background-color: #00b034 !important;
    color: white !important;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 176, 52, 0.3);
  }

  .active-menu .q-icon {
    color: white !important;
  }

  /* Mini toggle button */
  .mini-toggle-btn {
    color: #666;
  }

  /* Responsive adjustments */
  @media (max-width: 1023px) {
    .logo-container {
      padding: 15px 0;
    }

    .logo {
      width: 100px;
    }
  }

  @media (max-width: 599px) {
    .logo-container {
      padding: 10px 0;
      margin-bottom: 5px;
    }

    .logo {
      width: 80px;
    }

    .header-container {
      margin-bottom: 10px;
    }
  }
</style>
