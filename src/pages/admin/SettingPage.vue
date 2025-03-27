<template>
    <q-page padding>
        <div class="column items-start justify-center q-mb-md">
            <h5 class="text-h4 q-ma-none"><b>Settings</b></h5>
            <div class="q-pa-md q-gutter-sm">
                <q-breadcrumbs class="q-ma-none">
                    <q-breadcrumbs-el class="text-bold" label="Account" />
                    <!-- <q-breadcrumbs-el label="Breadcrumbs" /> -->
                </q-breadcrumbs>
            </div>
        </div>
        <div>
            <q-card>
                <q-card-section>
                    <div class="text-h6">Account Settings</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <q-form @submit.prevent="save" class="q-gutter-md">
                        <q-input v-model="name" label="Name" />
                        <q-input v-model="email" label="Email" />
                        <q-input v-model="password" label="Password" type="password" />
                        <q-input v-model="confirmPassword" label="Confirm Password" type="password" />
                        <q-btn type="submit" label="Save" color="primary" />
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const save = () => {
    console.log(name.value, email.value, password.value, confirmPassword.value)
}

</script>