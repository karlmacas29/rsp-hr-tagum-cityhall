<template>
  <q-drawer show-if-above v-model="drawer" side="left" :width="270" bordered>
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="/logo.png" alt="Tagum City Logo" class="logo" />
    </div>

    <!-- Header Section -->
    <div class="header-container"></div>

    <q-list>
      <q-item class="q-mx-sm q-my-sm" style="border-radius: 10px" v-for="(item, index) in menuItems" :key="index"
        clickable v-ripple :to="item.route" :active-class="'active-menu'">
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
      <!-- rater -->
      <q-expansion-item style="border-radius: 30px" class="q-mx-sm q-my-sm" icon="assignment_ind"
        label="Rater Management">

        <q-card class="q-py-none content-container">

          <q-item class="q-mx-sm q-my-sm" style="border-radius: 10px" v-for="(item, index) in ratersManage" :key="index"
            clickable v-ripple :to="item.route" :active-class="'active-menu'">
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </q-card>

      </q-expansion-item>
    </q-list>
    <!-- footer -->
  </q-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      menuItems: [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
        { label: 'Plantilla', route: '/plantilla', icon: 'list' },
        { label: 'Job Posts', route: '/job-post', icon: 'post_add' },

        { label: 'Activity Log', route: '/activity-log', icon: 'history' },
      ],
      ratersManage: [
        { label: 'Raters', route: '/raters', icon: 'groups' },
        { label: 'Reports', route: '/reports', icon: 'assessment' },
        { label: 'Criteria', route: '/criteria', icon: 'rule' },
      ],
    }
  },
}
</script>

<style scoped>
.content-container {
  border-left: 2px solid black;
  /* Change color as needed */
  padding-left: 5px;
  margin-left: 25px;
}

/* Logo Section */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
  /* Reduce padding */
  margin-bottom: 2px;
  /* Reduce space below logo */
  margin-top: 40px;
}

.logo {
  width: 140px;
  /* Slightly smaller logo */
  height: auto;
}

/* Header Section */
.header-container {
  text-align: center;
  margin-bottom: 2px !important;
  /* Further reduce space */
  padding-bottom: 0 !important;
}

.company-title {
  font-size: 16px;
  /* Reduce font size slightly */
  font-weight: bold;
  margin-bottom: 0 !important;
  /* Remove extra space below title */
}

/* Active menu styling */
.active-menu {
  background-color: #00B034 !important;
  color: white !important;
  font-weight: bold;
}
</style>
