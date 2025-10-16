<template>
  <q-dialog v-model="localShow" maximized>
    <q-card
      class="supporting-docs-modal"
      style="
        border-radius: 8px;
        width: 1500px;
        max-width: 95vw;
        height: 90vh;
        max-height: 95vh;
        display: flex;
        flex-direction: column;
      "
    >
      <!-- Header -->
      <q-card-section class="row items-center justify-between bg-grey-1 q-py-md">
        <div>
          <div class="text-h5 text-bold">Supporting Documents</div>
          <div class="text-subtitle1 text-grey-7">{{ applicantName }}</div>
        </div>
        <q-btn icon="close" flat round dense @click="closeModal" />
      </q-card-section>

      <!-- Main Content -->
      <q-card-section class="q-pa-none" style="flex: 1; overflow: hidden">
        <div class="row no-wrap full-height">
          <!-- Left Sidebar - Categories -->
          <div class="col-3 bg-grey-2 q-pa-md" style="overflow-y: auto">
            <q-list>
              <q-item-label header class="text-weight-bold">Document Categories</q-item-label>

              <q-item
                v-for="category in documentCategories"
                :key="category.key"
                clickable
                v-ripple
                :active="selectedCategory === category.key"
                @click="selectCategory(category.key)"
                class="rounded-borders q-mb-xs"
              >
                <q-item-section avatar>
                  <q-icon :name="category.icon" :color="category.color" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ category.label }}</q-item-label>
                  <q-item-label caption>{{ getImageCount(category.key) }} document(s)</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge :color="category.color" :label="getImageCount(category.key)" rounded />
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Right Content - Images Grid -->
          <div class="col-9 q-pa-md" style="overflow-y: auto">
            <div v-if="currentImages.length === 0" class="flex flex-center full-height">
              <div class="text-center">
                <q-icon name="description" size="4rem" color="grey-5" />
                <div class="text-h6 text-grey-6 q-mt-md">No documents available</div>
                <div class="text-body2 text-grey-5">
                  No supporting documents found for {{ getCurrentCategoryLabel() }}
                </div>
              </div>
            </div>

            <div v-else>
              <div class="row items-center justify-between q-mb-md">
                <div>
                  <div class="text-h6">{{ getCurrentCategoryLabel() }}</div>
                  <div class="text-caption text-grey-7">
                    {{ currentImages.length }} document(s) found
                  </div>
                </div>
                <div class="row q-gutter-sm">
                  <q-btn
                    flat
                    dense
                    :icon="viewMode === 'grid' ? 'view_list' : 'grid_view'"
                    @click="toggleViewMode"
                    :label="viewMode === 'grid' ? 'List View' : 'Grid View'"
                  />
                </div>
              </div>

              <!-- Grid View -->
              <div v-if="viewMode === 'grid'" class="row q-col-gutter-md">
                <div
                  v-for="(image, index) in currentImages"
                  :key="`${selectedCategory}-${index}`"
                  class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <q-card class="image-card cursor-pointer" @click="openInNewTab(image)">
                    <q-img
                      :src="image"
                      :alt="`Document ${index + 1}`"
                      class="image-thumbnail"
                      fit="cover"
                      loading="lazy"
                      :ratio="1"
                    >
                      <template v-slot:loading>
                        <div class="absolute-full flex flex-center">
                          <q-spinner size="2rem" color="primary" />
                        </div>
                      </template>
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3">
                          <div class="text-center">
                            <q-icon name="broken_image" size="2rem" color="grey-6" />
                            <div class="text-caption text-grey-6">Failed to load</div>
                          </div>
                        </div>
                      </template>
                    </q-img>
                    <q-card-section class="q-pa-sm">
                      <div class="text-caption text-weight-bold q-mb-xs">
                        Document {{ index + 1 }}
                      </div>
                      <div class="filename-text text-caption text-grey-6">
                        {{ getFileName(image) }}
                      </div>
                    </q-card-section>
                    <q-card-actions class="q-pa-sm">
                      <q-btn
                        flat
                        dense
                        icon="visibility"
                        size="sm"
                        @click.stop="openInNewTab(image)"
                        aria-label="View document"
                      />
                    </q-card-actions>
                  </q-card>
                </div>
              </div>

              <!-- List View -->
              <div v-else class="q-gutter-sm">
                <q-card
                  v-for="(image, index) in currentImages"
                  :key="`${selectedCategory}-list-${index}`"
                  class="image-list-item cursor-pointer"
                  @click="openInNewTab(image)"
                >
                  <q-card-section class="row items-center q-pa-md">
                    <q-img
                      :src="image"
                      class="image-thumbnail-small"
                      fit="cover"
                      :ratio="1"
                      style="width: 60px; height: 60px"
                    >
                      <template v-slot:loading>
                        <div class="absolute-full flex flex-center">
                          <q-spinner size="1rem" color="primary" />
                        </div>
                      </template>
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3">
                          <q-icon name="broken_image" size="1rem" color="grey-6" />
                        </div>
                      </template>
                    </q-img>
                    <div class="q-ml-md flex-grow">
                      <div class="text-body2 text-weight-bold q-mb-xs">
                        Document {{ index + 1 }}
                      </div>
                      <div class="filename-text-list text-caption text-grey-6">
                        {{ getFileName(image) }}
                      </div>
                    </div>
                    <div class="row q-gutter-sm">
                      <q-btn
                        flat
                        dense
                        icon="visibility"
                        @click.stop="openInNewTab(image)"
                        aria-label="View document"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue';

  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
    applicantName: {
      type: String,
      default: 'Unknown Applicant',
    },
    supportingDocuments: {
      type: Object,
      default: () => ({
        training_images: [],
        education_images: [],
        eligibility_images: [],
        experience_images: [],
      }),
      validator: (value) => {
        return typeof value === 'object' && value !== null;
      },
    },
  });

  const emit = defineEmits(['update:show']);

  // Reactive state
  const localShow = ref(props.show);
  const selectedCategory = ref('education');
  const viewMode = ref('grid');

  // Document categories configuration
  const documentCategories = [
    {
      key: 'education',
      label: 'Education',
      icon: 'school',
      color: 'blue',
    },
    {
      key: 'experience',
      label: 'Experience',
      icon: 'work',
      color: 'green',
    },
    {
      key: 'training',
      label: 'Training',
      icon: 'military_tech',
      color: 'orange',
    },
    {
      key: 'eligibility',
      label: 'Eligibility',
      icon: 'verified',
      color: 'purple',
    },
  ];

  // Computed properties
  const currentImages = computed(() => {
    const key = `${selectedCategory.value}_images`;
    const images = props.supportingDocuments[key];
    return Array.isArray(images) ? images : [];
  });

  // Methods
  const getImageCount = (category) => {
    const key = `${category}_images`;
    const images = props.supportingDocuments[key];
    return Array.isArray(images) ? images.length : 0;
  };

  const getCurrentCategoryLabel = () => {
    const category = documentCategories.find((cat) => cat.key === selectedCategory.value);
    return category ? category.label : 'Documents';
  };

  const getFileName = (url) => {
    if (!url || typeof url !== 'string') return 'Unknown';

    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      return decodeURIComponent(filename);
    } catch (error) {
      console.warn('Error decoding filename:', error);
      const parts = url.split('/');
      return parts[parts.length - 1] || 'Unknown';
    }
  };

  const selectCategory = (categoryKey) => {
    selectedCategory.value = categoryKey;
  };

  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
  };

  const openInNewTab = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.warn('Invalid image URL provided');
      return;
    }

    try {
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening image in new tab:', error);
    }
  };

  const closeModal = () => {
    localShow.value = false;
  };

  // Watchers
  watch(
    () => props.show,
    (newVal) => {
      localShow.value = newVal;
    },
  );

  watch(localShow, (newVal) => {
    emit('update:show', newVal);
  });

  // Reset to first category when modal opens and has no documents in current category
  watch(
    () => [props.show, props.supportingDocuments],
    async ([show, docs]) => {
      if (show && docs) {
        await nextTick();
        const currentCategoryImages = docs[`${selectedCategory.value}_images`];
        if (!Array.isArray(currentCategoryImages) || currentCategoryImages.length === 0) {
          // Find first category with images
          const categoryWithImages = documentCategories.find((cat) => {
            const images = docs[`${cat.key}_images`];
            return Array.isArray(images) && images.length > 0;
          });

          if (categoryWithImages) {
            selectedCategory.value = categoryWithImages.key;
          }
        }
      }
    },
    { deep: true, immediate: true },
  );
</script>

<style scoped>
  .supporting-docs-modal {
    .image-card {
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }

    .image-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .image-thumbnail {
      border-radius: 8px 8px 0 0;
    }

    .image-thumbnail-small {
      border-radius: 8px;
    }

    .image-list-item {
      transition: background-color 0.2s ease;
    }

    .image-list-item:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }

    /* Filename text wrapping styles */
    .filename-text {
      word-wrap: break-word;
      word-break: break-all;
      white-space: normal;
      overflow-wrap: break-word;
      hyphens: auto;
      line-height: 1.3;
      max-height: 2.6em;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .filename-text-list {
      word-wrap: break-word;
      word-break: break-all;
      white-space: normal;
      overflow-wrap: break-word;
      hyphens: auto;
      line-height: 1.3;
    }
  }

  .full-height {
    height: 100%;
  }

  .flex-grow {
    flex-grow: 1;
  }
</style>
