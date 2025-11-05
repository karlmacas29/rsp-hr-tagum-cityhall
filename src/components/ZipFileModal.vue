<template>
  <q-dialog
    v-model="showModal"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card
      class="instruction-modal"
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
      <q-card-section class="modal-header bg-orange text-white">
        <div class="row items-center justify-between">
          <div class="row items-center">
            <q-icon name="folder_zip" size="32px" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold">ZIP File Instructions</div>
              <div class="text-subtitle2 opacity-80">How to prepare your supporting documents</div>
            </div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup size="md" class="text-white" />
        </div>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="instruction-content">
        <div class="container">
          <!-- Step 1: Create Folders -->
          <div class="instruction-step">
            <div class="step-header">
              <div class="step-number bg-orange-1 text-orange">1</div>
              <div class="step-title text-h6 text-weight-bold">Create Required Folders</div>
            </div>

            <div class="step-content">
              <div class="text-body1 q-mb-md text-grey-8">
                Create a new folder on your computer and inside it, create these 4 folders with
                exact names:
              </div>

              <div class="folder-grid">
                <div class="folder-item" v-for="folder in folders" :key="folder.name">
                  <div class="folder-icon">
                    <q-icon name="folder" size="48px" :color="folder.color" />
                  </div>
                  <div class="folder-name">{{ folder.name }}</div>
                  <div class="folder-description">{{ folder.description }}</div>
                </div>
              </div>

              <q-banner class="bg-blue-1 text-blue q-mt-md" rounded>
                <template v-slot:avatar>
                  <q-icon name="info" />
                </template>
                <strong>Important:</strong>
                Folder names must be in lowercase letters exactly as shown above.
              </q-banner>
            </div>
          </div>

          <!-- Step 2: Add Documents -->
          <div class="instruction-step">
            <div class="step-header">
              <div class="step-number bg-blue-1 text-blue">2</div>
              <div class="step-title text-h6 text-weight-bold">Add Your Documents</div>
            </div>

            <div class="step-content">
              <div class="text-body1 q-mb-md text-grey-8">
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
                    <q-icon :name="category.icon" :color="category.color" size="20px" />
                    <span class="category-title">{{ category.folder }}</span>
                  </div>
                  <div class="category-items">
                    <q-chip
                      v-for="item in category.examples"
                      :key="item"
                      size="sm"
                      :color="category.color"
                      text-color="white"
                      class="q-ma-xs"
                    >
                      {{ item }}
                    </q-chip>
                  </div>
                </div>
              </div>

              <q-banner class="bg-green-1 text-green q-mt-md" rounded>
                <template v-slot:avatar>
                  <q-icon name="image" />
                </template>
                <strong>Accepted formats:</strong>
                JPG, JPEG, PNG, GIF, BMP, TIFF
              </q-banner>
            </div>
          </div>

          <!-- Step 3: Create ZIP -->
          <div class="instruction-step">
            <div class="step-header">
              <div class="step-number bg-purple-1 text-purple">3</div>
              <div class="step-title text-h6 text-weight-bold">Create ZIP File</div>
            </div>

            <div class="step-content">
              <div class="text-body1 q-mb-md text-grey-8">
                Once all documents are organized in folders, create a ZIP file:
              </div>

              <div class="zip-instructions">
                <div class="zip-step" v-for="(step, index) in zipSteps" :key="index">
                  <div class="zip-step-number">{{ index + 1 }}</div>
                  <div class="zip-step-content">
                    <div class="zip-step-title">{{ step.title }}</div>
                    <div class="zip-step-desc">{{ step.description }}</div>
                  </div>
                  <div class="zip-step-icon">
                    <q-icon :name="step.icon" size="24px" color="grey-6" />
                  </div>
                </div>
              </div>

              <q-banner class="bg-yellow-1 text-orange q-mt-md" rounded>
                <template v-slot:avatar>
                  <q-icon name="warning" />
                </template>
                <strong>Remember:</strong>
                Select all 4 folders first, then create the ZIP file. Don't ZIP the parent folder.
              </q-banner>
            </div>
          </div>

          <!-- Visual Example -->
          <div class="instruction-step">
            <div class="step-header">
              <div class="step-number bg-green-1 text-green">✓</div>
              <div class="step-title text-h6 text-weight-bold">Final Structure Example</div>
            </div>

            <div class="step-content">
              <div class="structure-example bg-grey-1">
                <div class="structure-header">
                  <q-icon name="folder_zip" color="orange" />
                  <span class="q-ml-sm text-weight-bold">document.zip</span>
                </div>
                <div class="structure-content">
                  <div class="structure-folder" v-for="folder in folders" :key="folder.name">
                    <div class="structure-folder-header">
                      <q-icon name="folder" :color="folder.color" size="16px" />
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
            size="lg"
            class="q-px-xl"
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
    // Emit event to parent to handle file picker opening
    emit('instruction-complete');
    // Close the modal
    showModal.value = false;
  }
</script>

<style scoped>
  .instruction-modal {
    height: 100vh;
    overflow: hidden;
  }

  .modal-header {
    padding: 24px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .instruction-content {
    height: calc(100vh - 140px);
    overflow-y: auto;
    padding: 0;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
  }

  .instruction-step {
    margin-bottom: 48px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    background: white;
  }

  .step-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
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
    margin-right: 16px;
    flex-shrink: 0;
  }

  .step-title {
    color: #333;
  }

  .step-content {
    margin-left: 56px;
  }

  /* Folder Grid */
  .folder-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 16px;
    margin: 20px 0;
  }

  .folder-item {
    text-align: center;
    padding: 20px;
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
  }

  .folder-description {
    font-size: 12px;
    color: #666;
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
  }

  .category-title {
    margin-left: 8px;
    text-transform: capitalize;
  }

  .category-items {
    padding: 12px 16px;
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
    margin-right: 16px;
    flex-shrink: 0;
  }

  .zip-step-content {
    flex: 1;
  }

  .zip-step-title {
    font-weight: bold;
    margin-bottom: 4px;
  }

  .zip-step-desc {
    color: #666;
    font-size: 14px;
  }

  .zip-step-icon {
    margin-left: 16px;
  }

  /* Structure Example */
  .structure-example {
    border-radius: 8px;
    padding: 16px;
    font-family: 'Monaco', 'Consolas', monospace;
  }

  .structure-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    color: #333;
  }

  .structure-content {
    margin-left: 24px;
  }

  .structure-folder {
    margin-bottom: 8px;
  }

  .structure-folder-header {
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #333;
  }

  .structure-files {
    margin-left: 24px;
    margin-top: 4px;
  }

  .structure-file {
    display: flex;
    align-items: center;
    color: #666;
    margin-bottom: 2px;
  }

  .modal-footer {
    padding: 24px;
    background-color: #f9f9f9;
    border-top: 1px solid #e0e0e0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .container {
      padding: 16px;
    }

    .instruction-step {
      padding: 16px;
    }

    .step-content {
      margin-left: 0;
      margin-top: 16px;
    }

    .folder-grid {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .zip-step {
      flex-direction: column;
      align-items: flex-start;
    }

    .zip-step-icon {
      margin-left: 0;
      margin-top: 8px;
    }
  }
</style>
