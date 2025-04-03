<template>
    <div class="">
        <q-breadcrumbs separator=">" class="text-grey">
            <q-breadcrumbs-el class="breadcrumb-item">
                <q-select class="rounded-borders q-ml-sm q-mr-sm custom-select" rounded outlined
                    bg-color="light-green-1" color="green-9" v-model="selectedValues[0]"
                    :options="getOptionsForLevel(0)" :label="levels[0]" use-input hide-selected fill-input clearable
                    input-debounce="300" @filter="(val, update) => filterOptions(val, update, 0)"
                    @update:model-value="handleSelection(0)" @clear="clearSelection(0)" :loading="usePlantilla.loading"
                    :style="{ minWidth: '150px', maxWidth: '180px' }">
                    <template v-slot:no-option>
                        <q-item dense>
                            <q-item-section class="text-grey text-subtitle2">No results</q-item-section>
                        </q-item>
                    </template>
                </q-select>
            </q-breadcrumbs-el>

            <template v-for="(level, index) in levels.slice(1)" :key="index + 1">
                <q-breadcrumbs-el v-if="shouldShowLevel(index + 1)" class="breadcrumb-item">
                    <q-select class="rounded-borders q-ml-sm q-mr-sm custom-select" rounded outlined
                        bg-color="light-green-1" color="green-9" v-model="selectedValues[index + 1]"
                        :options="getOptionsForLevel(index + 1)" :label="level" use-input hide-selected fill-input
                        clearable input-debounce="300" @filter="(val, update) => filterOptions(val, update, index + 1)"
                        @update:model-value="handleSelection(index + 1)" @clear="clearSelection(index + 1)"
                        :loading="usePlantilla.loading" :style="{ minWidth: '150px', maxWidth: '180px' }">
                        <template v-slot:no-option>
                            <q-item dense>
                                <q-item-section class="text-grey text-subtitle2">No results</q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                </q-breadcrumbs-el>
            </template>
        </q-breadcrumbs>

        <div class="q-mt-lg">
            <h4 class="text-h3 q-ma-none"><b>Plantilla</b></h4>
            <p class="text-bold row items-center" v-html="getSelectedPath" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { usePlantillaStore } from 'stores/plantillaStore';

const usePlantilla = usePlantillaStore();
const levels = ['office', 'office2', 'group', 'division', 'section', 'unit', 'position'];

const selectedValues = ref(new Array(levels.length).fill(null));
const filteredOptions = ref(new Array(levels.length).fill([]));
const officeData = ref([]);

const getUniqueValues = (level) => {
    const fieldName = levels[level];
    if (!officeData.value.length) return [];

    const values = new Set();
    let filteredData = [...officeData.value];

    for (let i = 0; i < level; i++) {
        if (selectedValues.value[i] !== null) {
            const prevField = levels[i];
            filteredData = filteredData.filter(office => office[prevField] === selectedValues.value[i]);
        }
    }

    filteredData.forEach(office => {
        if (office[fieldName]) values.add(office[fieldName]);
    });

    return Array.from(values).sort();
};

const shouldShowLevel = (index) => {
    if (index > 0 && !selectedValues.value[0]) return false;

    const options = getUniqueValues(index);
    filteredOptions.value[index] = options;
    return options.length > 0;
};

// Lazy load options
const filterOptions = (val, update, index) => {
    if (usePlantilla.loading) return; // Prevent filtering while loading data

    update(() => {
        const needle = val.toLowerCase();
        filteredOptions.value[index] = getUniqueValues(index).filter(v => v.toLowerCase().includes(needle));
    });
};

const handleSelection = (index) => {
    for (let i = index + 1; i < levels.length; i++) {
        selectedValues.value[i] = null;
        filteredOptions.value[i] = getUniqueValues(i);
    }
};

const clearSelection = (index) => {
    selectedValues.value[index] = null;
    for (let i = index + 1; i < levels.length; i++) {
        selectedValues.value[i] = null;
        filteredOptions.value[i] = [];
    }
};

const getOptionsForLevel = (index) => {
    return filteredOptions.value[index] || [];
};

const getSelectedPath = computed(() => {
    return selectedValues.value.filter(val => val !== null).join('<p class="text-green q-py-none q-ma-none q-px-md"> > </p>');
});

// Watch loading state & update options when data is ready
watch(() => usePlantilla.loading, (isLoading) => {
    if (!isLoading) {
        filteredOptions.value[0] = getUniqueValues(0);
    }
});

onMounted(async () => {
    await usePlantilla.fetchPlantilla();
    officeData.value = Array.isArray(usePlantilla.plantilla) ? usePlantilla.plantilla : [];
    filteredOptions.value[0] = getUniqueValues(0);
});
</script>

<style scoped>
.custom-select {
    min-width: 150px;
    max-width: 180px;
}
</style>
