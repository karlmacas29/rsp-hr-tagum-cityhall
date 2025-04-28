<template>
    <div class="q-pa-md">
        <div class="q-mb-lg">
            <div class="text-h5 text-bold">MEMBERSHIP IN ASSOCIATION/ORGANIZATION</div>
        </div>
        <div v-if="memberships.length > 0" class="row q-col-gutter-md">
            <div v-for="(membership, index) in memberships" :key="index" class="col-12 col-sm-6 col-md-4">
                <q-card class="membership-card" flat bordered>
                    <q-card-section>
                        <div class="text-subtitle1 text-wrap" style="word-break: break-word; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                            <q-badge rounded>{{ index + 1 }}</q-badge> {{ membership.name }}
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <div v-else class="text-center q-pa-md">
            <q-banner class="text-grey-7">
                No memberships available
            </q-banner>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const memberships = ref([
    { name: 'Professional Teachers Organization' },
    { name: 'Local Government Employees Association' },
    { name: 'Public Servants Network' },
    { name: 'Civil Service Organization' },
])
</script>

<style scoped>
.membership-card {
    transition: all 0.3s ease;
    border-radius: 8px;
}

.membership-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--q-primary);
}

.text-primary {
    color: var(--q-primary);
}
</style>
