<template>
  <div class="q-pa-md">
    <div class="q-mb-lg">
      <div class="text-h5 text-bold">NON-ACADEMIC DISTINCTIONS / RECOGNITION</div>
    </div>
    <div v-if="distinctions.length > 0" class="row q-col-gutter-md">
      <div
        v-for="(distinction, index) in props.distinctions"
        :key="distinction.ID"
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
              {{ distinction.NonAcademic }}
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
  const props = defineProps({
    distinctions: {
      type: Array,
      default: () => [],
    },
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
