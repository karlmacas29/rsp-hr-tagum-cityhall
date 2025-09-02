<template>
  <div class="q-pa-md">
    <div class="q-mb-lg">
      <div class="text-h6 text-bold">NON-ACADEMIC DISTINCTIONS / RECOGNITION</div>
    </div>
    <div v-if="distinctionsData.length > 0" class="row q-col-gutter-md">
      <div
        v-for="(distinction, index) in distinctionsData"
        :key="distinction.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card class="distinction-card" flat bordered>
          <q-card-section>
            <div
              class="text-subtitle1 text-wrap"
              style="
                word-break: break-word;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                line-clamp: 7;
                -webkit-box-orient: vertical;
              "
            >
              <q-badge rounded>{{ index + 1 }}</q-badge>
              {{ distinction.non_academic || distinction.skill }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else class="text-center q-pa-md">
      <q-banner class="text-grey-7">No non-academic distinctions available</q-banner>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    distinctions: {
      type: Array,
      required: false,
      default: () => [],
    },
  });

  // Transform and filter distinctions data
  const distinctionsData = computed(() => {
    if (!Array.isArray(props.distinctions)) {
      return [];
    }

    // Filter only items that have non_academic data or mark them as non-academic distinctions
    return props.distinctions.filter((item) => {
      // If there's a specific field to identify non-academic entries, use it
      return item.non_academic || (item.skill && item.organization);
    });
  });
</script>

<style scoped>
  .distinction-card {
    transition: all 0.3s ease;
    border-radius: 8px;
  }

  .distinction-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--q-primary);
  }

  .text-primary {
    color: var(--q-primary);
  }
</style>
