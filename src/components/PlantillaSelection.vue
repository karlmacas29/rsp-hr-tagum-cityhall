<template>
        <q-card class="row justify-between items-center q-pa-md q-ma-none" flat bordered>
            <div>
                <div class="text-h4 text-bold">Plantilla</div>
            </div>
            <div>
                <q-select class="rounded-borders q-ml-sm q-mr-sm custom-select" outlined
                    bg-color="light-green-1" color="green-9" v-model="selectedValue"
                    :options="getOptions()" label="Select City Hall Office" use-input hide-selected fill-input clearable
                    input-debounce="300" @filter="filterOptions" @update:model-value="handleSelection"
                    :loading="usePlantilla.loading" :style="{ maxWidth: '100%', width: '800px'}">
                    <template v-slot:no-option>
                        <q-item dense>
                            <q-item-section class="text-grey text-subtitle2">No results</q-item-section>
                        </q-item>
                    </template>
                </q-select>
            </div>
        </q-card>
    <!-- {{ selectedValue}} -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { usePlantillaStore } from 'stores/plantillaStore';

const usePlantilla = usePlantillaStore();
const selectedValue = ref(null);
const filteredOptions = ref([]);
const officeData = ref([]);

const getOptions = () => {
    return filteredOptions.value || [];
};

const getUniqueValues = () => {
    if (!officeData.value.length) return [];
    const values = new Set();

    officeData.value.forEach(office => {
        if (office.office) values.add(office.office);
    });

    return Array.from(values).sort();
};

const filterOptions = (val, update) => {
    if (usePlantilla.loading) return; // Prevent filtering while loading data

    update(() => {
        const needle = val.toLowerCase();
        filteredOptions.value = getUniqueValues().filter(v => v.toLowerCase().includes(needle));
    });
};

const handleSelection = () => {
    // Handle any additional logic when a selection is made
};

// Watch loading state & update options when data is ready
watch(() => usePlantilla.loading, (isLoading) => {
    if (!isLoading) {
        filteredOptions.value = getUniqueValues();
    }
});

onMounted(async () => {
    await usePlantilla.fetchPlantilla();
    officeData.value = Array.isArray(usePlantilla.plantilla) ? usePlantilla.plantilla : [];
    filteredOptions.value = getUniqueValues();
});
</script>

<style scoped>
.custom-select {
    min-width: 150px;
    max-width: 180px;
}
</style>
