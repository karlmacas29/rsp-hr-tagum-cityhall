<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>User Management</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <template v-slot:separator>
            <q-icon size="1.2em" name="arrow_forward" />
          </template>
          <q-breadcrumbs-el icon="manage_accounts" label="User Management" />
          <!-- <q-breadcrumbs-el icon="rule" label="Criteria" /> -->
        </q-breadcrumbs>
      </div>
    </div>
  </q-page>
</template>
