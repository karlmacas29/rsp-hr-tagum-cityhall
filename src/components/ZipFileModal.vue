<template>
  <q-dialog
    v-model="showModal"
    persistent
    :maximized="$q.screen.lt.sm"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="instruction-modal">
      <!-- Header -->
      <q-card-section class="modal-header bg-orange text-white">
        <div class="row items-center justify-between">
          <div class="row items-center header-title-section">
            <q-icon name="folder_zip" :size="headerIconSize" class="q-mr-sm q-mr-md-md" />
            <div>
              <div class="header-title text-weight-bold">ZIP File Instructions</div>
              <div class="header-subtitle opacity-80 gt-xs">
                How to prepare your supporting documents
              </div>
            </div>
          </div>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            :size="closeButtonSize"
            class="text-white"
          />
        </div>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="instruction-content">
        <div class="container">
          <!-- Step 1: Create Folders -->
          <div class="instruction-step">
            <div class="step-header">
              <div class="step-number bg-orange-1 text-orange">1</div>
              <div class="step-title text-weight-bold">Create Required Folders</div>
            </div>

            <div class="step-content">
              <div class="step-description text-grey-8 q-mb-md">
                Create a new folder on your computer and inside it, create these 4 folders with
                exact names:
              </div>

              <div class="folder-grid">
                <div class="folder-item" v-for="folder in folders" :key="folder.name">
                  <div class="folder-icon">
                    <q-icon name="folder" :size="folderIconSize" :color="folder.color" />
                  </div>
                  <div class="folder-name">{{ folder.name }}</div>
                  <div class="folder-description">{{ folder.description }}</div>
                </div>
              </div>

              <q-banner class="info-banner bg-blue-1 text-blue q-mt-md" rounded dense>
                <template v-slot:avatar>
                  <q-icon name="info" />
                </template>
                <span class="banner-text">
                  <strong>Important:</strong>
                  Folder names must be in lowercase letters exactly as shown above.
                </span>
              </q-banner>
            </div>
          </div>

          <!-- Step 2: Add Documents -->
          <div class="instruction-step">
            <div class="step-header">
              <div class="step-number bg-blue-1 text-blue">2</div>
              <div class="step-title text-weight-bold">Add Your Documents</div>
            </div>

            <div class="step-content">
              <div class="step-description text-grey-8 q-mb-md">
                Place your supporting documents in the appropriate folders. Only image formats are
                accepted:
              </div>

              <div class="document-examples">
                <div
                  class="example-category"
                  v-for="category in documentExamples"
                  :key="category.folder"
                >
                  <div class="category-header">
                    <q-icon
                      :name="category.icon"
                      :color="category.color"
                      :size="categoryIconSize"
                    />
                    <span class="category-title">{{ category.folder }}</span>
                  </div>
                  <div class="category-items">
                    <q-chip
                      v-for="item in category.examples"
                      :key="item"
                      :size="chipSize"
                      :color="category.color"
                      text-color="white"
                      class="q-ma-xs"
                    >
                      {{ item }}
                    </q-chip>
                  </div>
                </div>
              </div>

              <q-banner class="info-banner bg-green-1 text-green q-mt-md" rounded dense>
                <template v-slot:avatar>
                  <q-icon name="image" />
                </template>
                <span class="banner-text">
                  <strong>Accepted formats:</strong>
                  JPG, JPEG, PNG, GIF, BMP, TIFF
                </span>
              </q-banner>
            </div>
          </div>

          <!-- Step 3: Create ZIP -->
          <div class="instruction-step">
            <div class="step-header">
              <div class="step-number bg-purple-1 text-purple">3</div>
              <div class="step-title text-weight-bold">Create ZIP File</div>
            </div>

            <div class="step-content">
              <div class="step-description text-grey-8 q-mb-md">
                Once all documents are organized in folders, create a ZIP file:
              </div>

              <div class="zip-instructions">
                <div class="zip-step" v-for="(step, index) in zipSteps" :key="index">
                  <div class="zip-step-number">{{ index + 1 }}</div>
                  <div class="zip-step-content">
                    <div class="zip-step-title">{{ step.title }}</div>
                    <div class="zip-step-desc">{{ step.description }}</div>
                  </div>
                  <div class="zip-step-icon gt-xs">
                    <q-icon :name="step.icon" size="24px" color="grey-6" />
                  </div>
                </div>
              </div>

              <q-banner class="info-banner bg-yellow-1 text-orange q-mt-md" rounded dense>
                <template v-slot:avatar>
                  <q-icon name="warning" />
                </template>
                <span class="banner-text">
                  <strong>Remember:</strong>
                  Select all 4 folders first, then create the ZIP file. Don't ZIP the parent folder.
                </span>
              </q-banner>
            </div>
          </div>

          <!-- Visual Example -->
          <div class="instruction-step">
            <div class="step-header">
              <div class="step-number bg-green-1 text-green">✓</div>
              <div class="step-title text-weight-bold">Final Structure Example</div>
            </div>

            <div class="step-content">
              <div class="structure-example bg-grey-1">
                <div class="structure-header">
                  <q-icon name="folder_zip" color="orange" :size="structureIconSize" />
                  <span class="q-ml-sm text-weight-bold structure-filename">document.zip</span>
                </div>
                <div class="structure-content">
                  <div class="structure-folder" v-for="folder in folders" :key="folder.name">
                    <div class="structure-folder-header">
                      <q-icon name="folder" :color="folder.color" :size="structureIconSize" />
                      <span class="q-ml-sm">{{ folder.name }}</span>
                    </div>
                    <div class="structure-files">
                      <div class="structure-file" v-for="i in 2" :key="i">
                        <q-icon name="image" color="grey-6" size="14px" />
                        <span class="q-ml-xs text-caption">document{{ i }}.jpg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Footer -->
      <q-card-section class="modal-footer">
        <div class="row justify-center">
          <q-btn
            label="Got it!"
            color="orange"
            :size="buttonSize"
            class="got-it-btn"
            @click="handleGotIt"
            unelevated
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  // Props
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  });

  // Emits
  const emit = defineEmits(['update:modelValue', 'instruction-complete']);

  // Computed for v-model
  const showModal = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });

  // Responsive computed properties
  const headerIconSize = computed(() => {
    if ($q.screen.xs) return '24px';
    if ($q.screen.sm) return '28px';
    return '32px';
  });

  const closeButtonSize = computed(() => {
    if ($q.screen.xs) return 'sm';
    return 'md';
  });

  const folderIconSize = computed(() => {
    if ($q.screen.xs) return '36px';
    if ($q.screen.sm) return '42px';
    return '48px';
  });

  const categoryIconSize = computed(() => {
    if ($q.screen.xs) return '16px';
    return '20px';
  });

  const chipSize = computed(() => {
    if ($q.screen.xs) return 'sm';
    return 'md';
  });

  const structureIconSize = computed(() => {
    if ($q.screen.xs) return '14px';
    return '16px';
  });

  const buttonSize = computed(() => {
    if ($q.screen.xs) return 'md';
    if ($q.screen.sm) return 'lg';
    return 'lg';
  });

  // Data
  const folders = ref([
    {
      name: 'education',
      description: 'Diplomas, certificates, transcripts',
      color: 'blue',
    },
    {
      name: 'experience',
      description: 'Work certificates, job records',
      color: 'green',
    },
    {
      name: 'training',
      description: 'Training certificates, seminars',
      color: 'purple',
    },
    {
      name: 'eligibility',
      description: 'Civil service, board exams',
      color: 'orange',
    },
  ]);

  const documentExamples = ref([
    {
      folder: 'education',
      icon: 'school',
      color: 'blue',
      examples: [
        'Diploma',
        'Transcript of Records',
        'Certificate of Graduation',
        'Academic Records',
      ],
    },
    {
      folder: 'experience',
      icon: 'work',
      color: 'green',
      examples: [
        'Certificate of Employment',
        'Job Description',
        'Performance Evaluation',
        'Work Portfolio',
      ],
    },
    {
      folder: 'training',
      icon: 'psychology',
      color: 'purple',
      examples: [
        'Training Certificate',
        'Seminar Attendance',
        'Workshop Completion',
        'Skill Certification',
      ],
    },
    {
      folder: 'eligibility',
      icon: 'verified',
      color: 'orange',
      examples: [
        'Civil Service Eligibility',
        'Board Exam Results',
        'Professional License',
        'PRC ID',
      ],
    },
  ]);

  const zipSteps = ref([
    {
      title: 'Select all folders',
      description: 'Highlight the 4 folders (education, experience, training, eligibility)',
      icon: 'select_all',
    },
    {
      title: 'Right-click',
      description: 'Right-click on the selected folders',
      icon: 'mouse',
    },
    {
      title: 'Choose "Send to"',
      description: 'Select "Send to" > "Compressed folder" or "Add to ZIP"',
      icon: 'compress',
    },
    {
      title: 'Name your ZIP',
      description: 'Give it a meaningful name like "supporting_documents.zip"',
      icon: 'edit',
    },
  ]);

  // Handle "Got it!" button click
  function handleGotIt() {
    emit('instruction-complete');
    showModal.value = false;
  }
</script>

<style scoped>
  /* Base Modal Styles */
  .instruction-modal {
    border-radius: 8px;
    width: 1500px;
    max-width: 95vw;
    height: 90vh;
    max-height: 95vh;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    padding: 24px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .header-title-section {
    flex: 1;
    min-width: 0;
  }

  .header-title {
    font-size: 1.5rem;
    line-height: 1.2;
  }

  .header-subtitle {
    font-size: 0.875rem;
    margin-top: 4px;
  }

  .instruction-content {
    flex: 1;
    overflow-y: auto;
    padding: 0;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
  }

  /* Step Styles */
  .instruction-step {
    margin-bottom: 32px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    background: white;
  }

  .step-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 12px;
  }

  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    flex-shrink: 0;
  }

  .step-title {
    color: #333;
    font-size: 1.25rem;
    flex: 1;
  }

  .step-content {
    margin-left: 52px;
  }

  .step-description {
    font-size: 1rem;
    line-height: 1.6;
  }

  /* Folder Grid */
  .folder-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin: 20px 0;
  }

  .folder-item {
    text-align: center;
    padding: 20px 12px;
    border: 2px dashed #ddd;
    border-radius: 8px;
    transition: all 0.3s;
  }

  .folder-item:hover {
    border-color: #ff9800;
    background-color: #fff3e0;
  }

  .folder-icon {
    margin-bottom: 8px;
  }

  .folder-name {
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
    font-size: 0.95rem;
  }

  .folder-description {
    font-size: 0.8rem;
    color: #666;
    line-height: 1.3;
  }

  /* Document Examples */
  .document-examples {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  .example-category {
    border-bottom: 1px solid #e0e0e0;
  }

  .example-category:last-child {
    border-bottom: none;
  }

  .category-header {
    background-color: #f5f5f5;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    font-weight: bold;
    gap: 8px;
  }

  .category-title {
    text-transform: capitalize;
    font-size: 0.95rem;
  }

  .category-items {
    padding: 12px 8px;
    display: flex;
    flex-wrap: wrap;
  }

  /* ZIP Instructions */
  .zip-instructions {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  .zip-step {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
    gap: 16px;
  }

  .zip-step:last-child {
    border-bottom: none;
  }

  .zip-step-number {
    width: 32px;
    height: 32px;
    background-color: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
  }

  .zip-step-content {
    flex: 1;
    min-width: 0;
  }

  .zip-step-title {
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 0.95rem;
  }

  .zip-step-desc {
    color: #666;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .zip-step-icon {
    flex-shrink: 0;
  }

  /* Structure Example */
  .structure-example {
    border-radius: 8px;
    padding: 16px;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.875rem;
  }

  .structure-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    color: #333;
  }

  .structure-filename {
    word-break: break-all;
  }

  .structure-content {
    margin-left: 16px;
  }

  .structure-folder {
    margin-bottom: 8px;
  }

  .structure-folder-header {
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #333;
    gap: 4px;
  }

  .structure-files {
    margin-left: 20px;
    margin-top: 4px;
  }

  .structure-file {
    display: flex;
    align-items: center;
    color: #666;
    margin-bottom: 2px;
  }

  /* Info Banners */
  .info-banner {
    border-radius: 8px;
  }

  .banner-text {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  /* Footer */
  .modal-footer {
    padding: 20px 24px;
    background-color: #f9f9f9;
    border-top: 1px solid #e0e0e0;
  }

  .got-it-btn {
    min-width: 200px;
    padding: 0 48px;
  }

  /* Tablet (600px - 1023px) */
  @media (max-width: 1023px) and (min-width: 600px) {
    .instruction-modal {
      height: 95vh;
    }

    .modal-header {
      padding: 20px;
    }

    .header-title {
      font-size: 1.3rem;
    }

    .header-subtitle {
      font-size: 0.8rem;
    }

    .container {
      padding: 20px;
    }

    .instruction-step {
      padding: 20px;
      margin-bottom: 24px;
    }

    .step-title {
      font-size: 1.15rem;
    }

    .step-content {
      margin-left: 0;
      margin-top: 16px;
    }

    .folder-grid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }

    .folder-item {
      padding: 16px 10px;
    }

    .folder-name {
      font-size: 0.9rem;
    }

    .folder-description {
      font-size: 0.75rem;
    }

    .got-it-btn {
      min-width: 180px;
      padding: 0 36px;
    }
  }

  /* Mobile (<600px) */
  @media (max-width: 599px) {
    .instruction-modal {
      border-radius: 0;
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
    }

    .modal-header {
      padding: 16px;
    }

    .header-title {
      font-size: 1.1rem;
    }

    .container {
      padding: 16px;
    }

    .instruction-step {
      padding: 16px;
      margin-bottom: 20px;
      border-radius: 8px;
    }

    .step-header {
      flex-wrap: wrap;
      gap: 8px;
    }

    .step-number {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }

    .step-title {
      font-size: 1.05rem;
      flex: 1;
      min-width: 0;
    }

    .step-content {
      margin-left: 0;
      margin-top: 12px;
    }

    .step-description {
      font-size: 0.9rem;
    }

    .folder-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .folder-item {
      padding: 16px 8px;
    }

    .folder-name {
      font-size: 0.85rem;
    }

    .folder-description {
      font-size: 0.7rem;
    }

    .category-header {
      padding: 10px 12px;
    }

    .category-title {
      font-size: 0.875rem;
    }

    .category-items {
      padding: 10px 8px;
    }

    .zip-step {
      padding: 12px;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .zip-step-number {
      width: 28px;
      height: 28px;
      font-size: 14px;
    }

    .zip-step-title {
      font-size: 0.9rem;
    }

    .zip-step-desc {
      font-size: 0.8rem;
    }

    .structure-example {
      padding: 12px;
      font-size: 0.8rem;
    }

    .structure-content {
      margin-left: 12px;
    }

    .structure-files {
      margin-left: 16px;
    }

    .banner-text {
      font-size: 0.8rem;
    }

    .modal-footer {
      padding: 16px;
    }

    .got-it-btn {
      width: 100%;
      min-width: 0;
      padding: 0 24px;
    }
  }

  /* Extra Small (<360px) */
  @media (max-width: 359px) {
    .modal-header {
      padding: 12px;
    }

    .header-title {
      font-size: 1rem;
    }

    .container {
      padding: 12px;
    }

    .instruction-step {
      padding: 12px;
      margin-bottom: 16px;
    }

    .step-title {
      font-size: 0.95rem;
    }

    .step-description {
      font-size: 0.85rem;
    }

    .folder-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .folder-name {
      font-size: 0.8rem;
    }

    .folder-description {
      font-size: 0.65rem;
    }

    .category-title {
      font-size: 0.8rem;
    }

    .zip-step {
      padding: 10px;
    }

    .zip-step-title {
      font-size: 0.85rem;
    }

    .zip-step-desc {
      font-size: 0.75rem;
    }

    .structure-example {
      font-size: 0.75rem;
    }

    .banner-text {
      font-size: 0.75rem;
    }
  }

  /* Large Desktop (>1440px) */
  @media (min-width: 1440px) {
    .container {
      max-width: 1000px;
    }

    .header-title {
      font-size: 1.75rem;
    }

    .step-title {
      font-size: 1.35rem;
    }

    .folder-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  }
</style>
