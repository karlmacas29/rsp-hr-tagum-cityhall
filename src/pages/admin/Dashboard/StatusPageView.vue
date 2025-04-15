<template>
    <q-page padding>
        <q-btn color="primary" round icon="arrow_back" @click="onClick" />
        <h1>View {{ route.params.name }}</h1>
    </q-page>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()

const onClick = () => {
    router.back()
}
</script>
