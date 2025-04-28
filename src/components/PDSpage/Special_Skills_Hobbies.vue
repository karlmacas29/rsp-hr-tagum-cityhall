<template>
    <div class="q-pa-md">
        <div class="q-mb-lg">
            <div class="text-h5 text-bold">SPECIAL SKILLS AND HOBBIES</div>
        </div>
        <div v-if="skills.length > 0" class="row q-col-gutter-md">
            <div v-for="(skill, index) in skills" :key="index" class="col-12 col-sm-6 col-md-4">
                <q-card class="skill-card" flat bordered>
                    <q-card-section>
                        <div class="text-subtitle1 text-wrap" style="word-break: break-word; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                            <q-badge rounded>{{ index + 1 }}</q-badge> {{ skill.name }}
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <div v-else class="text-center q-pa-md">
            <q-banner class="text-grey-7">
                No skills or hobbies available
            </q-banner>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const skills = ref([
    { name: 'Programming' },
    { name: 'Web Development' },
    { name: 'Reading' },
    { name: 'Photography' },
])
</script>

<style scoped>
.skill-card {
    transition: all 0.3s ease;
    border-radius: 8px;
}

.skill-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--q-primary);
}

.text-primary {
    color: var(--q-primary);
}
</style>
