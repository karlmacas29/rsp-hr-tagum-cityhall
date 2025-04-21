<template>
  <!-- PDS Modal -->
  <q-dialog v-model="localShowModal" persistent class="pds-dialog">
    <q-card class="pds-container">
      <q-card-section class="row justify-between text-black q-mb-sm">
        <div class="text-h4 text-bold items-center flex">Personal Data Sheet (PDS)</div>
        <q-btn
          icon="close"
          flat
          round
          dense
          class="close-btn"
          @click="closeModal"
        />
      </q-card-section>

      <q-card-section class="q-pa-none flex column" style="flex: 1; overflow: hidden;">
        <!-- Main Content Area -->
        <div class="row q-pa-sm q-gutter-x-sm" style="flex: 1; overflow: hidden;">
          <!-- Left Side - Tabs Navigation -->
          <q-card class="col-3 bg-white q-pa-sm" style="overflow: hidden;">
            <q-scroll-area style="height: 100%;">
              <q-list>
                <q-item
                  v-for="tab in tabs"
                  :key="tab.name"
                  clickable
                  :active="currentTab === tab.name"
                  @click="currentTab = tab.name"
                  active-class="active-tab"
                  class="tab-item q-py-sm"
                >
                  <q-item-section avatar>
                    <q-icon name="check_circle" color="green" v-if="isTabCompleted(tab.name)" />
                    <q-icon name="circle" color="grey" v-else />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ tab.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </q-card>

          <!-- Right Side - Content Area -->
          <q-card class="col" style="overflow: hidden;">
            <q-scroll-area style="height: 100%;">
              <!-- Personal Information -->
              <div v-if="currentTab === 'personal'" class="q-pa-md">
                <div class="row">
                  <div class="col-3 flex justify-center items-center">
                    <q-img
                      :src="applicant?.photo || 'https://placehold.co/140'"
                      class="bg-grey-4"
                      style="width: 140px; height: 140px; border-radius: 10px;"
                      alt="Applicant Photo"
                    />
                  </div>
                  <div class="col">
                    <div class="form-title-container">
                      <div class="text-h5 text-bold">Employee's Name</div>
                    </div>
                    
                    <div class="row q-col-gutter-md q-mb-lg">
                      <div class="col-3">
                        <div class="field-label">First Name</div>
                        <div class="field-value">King</div>
                      </div>
                      <div class="col-3">
                        <div class="field-label">Last Name</div>
                        <div class="field-value">Fatpel</div>
                      </div>
                      <div class="col-3">
                        <div class="field-label">Middle Name</div>
                        <div class="field-value">Boss</div>
                      </div>
                      <div class="col-3">
                        <div class="field-label">Name Extension</div>
                        <div class="field-value">N/A</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="form-title-container">
                  <div class="text-h5 text-bold">Additional Information</div>
                </div>
                
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <div class="row q-col-gutter-md">
                      <div class="col-12">
                        <div class="field-label">Date of Birth:</div>
                        <div class="field-value">January 01, 2003</div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Place of Birth:</div>
                        <div class="field-value">Tagum City</div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Sex:</div>
                        <div class="field-value">Male</div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Civil Status:</div>
                        <div class="field-value">Single</div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Gender Preference:</div>
                        <div class="field-value">Man</div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Height:</div>
                        <div class="field-value">6'0"</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-6">
                    <div class="row q-col-gutter-md">
                      <div class="col-12">
                        <div class="field-label">Weight:</div>
                        <div class="field-value">60kg</div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Blood Type:</div>
                        <div class="field-value">O</div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Telephone Number:</div>
                        <div class="field-value">(074)4936904</div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Cellphone Number:</div>
                        <div class="field-value">09876543098</div>
                      </div>
                      <!-- Note that duplicate fields were removed from the right side -->
                    </div>
                  </div>
                </div>
              </div>

              <!-- Placeholder for other tabs -->
              <div v-else class="q-pa-md">
                <div class="text-h6 q-mb-md">{{ tabs.find(t => t.name === currentTab)?.label }}</div>
                <p>Content for {{ currentTab }} will be displayed here</p>
              </div>
            </q-scroll-area>
          </q-card>
        </div>
        
        <!-- Footer with buttons -->
        <q-card-actions class="justify-end q-pa-md">
          <q-btn unelevated label="Close" color="grey-7" @click="closeModal" class="q-mx-sm" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
    applicant: {
      type: Object,
      default: () => ({
        name: '',
        photo: '',
        position: '',
        status: 'Pending',
        personalInfo: {
          dateOfBirth: '',
          placeOfBirth: '',
          sex: '',
          civilStatus: '',
          genderPreference: '',
          height: '',
          weight: '',
          bloodType: '',
          telephone: '',
          mobile: ''
        },
        education: [],
        experience: [],
        training: [],
        eligibility: []
      })
    }
  },
  data() {
    return {
      localShowModal: this.modelValue,
      currentTab: 'personal',
      tabs: [
        { name: 'personal', label: 'Personal Information' },
        { name: 'family', label: 'Family Background' },
        { name: 'education', label: 'Educational Background' },
        { name: 'civilService', label: 'Civil Service Eligibility' },
        { name: 'work', label: 'Work Experience' },
        { name: 'voluntary', label: 'Voluntary Work' },
        { name: 'training', label: 'L&D Interventions' },
        { name: 'skills', label: 'Special Skills & Hobbies' },
        { name: 'nonAcademic', label: 'Non-Academic' },
        { name: 'membership', label: 'Membership Association' },
        { name: 'other', label: 'Other Information' },
        { name: 'references', label: 'References' }
      ]
    };
  },
  watch: {
    localShowModal(val) {
      this.$emit('update:modelValue', val);
    },
    modelValue(val) {
      this.localShowModal = val;
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
    isTabCompleted(tabName) {
      // This is a placeholder method - implement your logic to determine if a tab is completed
      // For now, let's just mark the first 4 tabs as completed for demonstration
      const completedTabs = ['personal', 'family', 'education', 'civilService'];
      return completedTabs.includes(tabName);
    }
  }
};
</script>

<style scoped>
.pds-dialog {
  height: 100%;
}

.pds-container {
  width: 1000px;
  max-width: 95vw;
  height: 90vh;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.tab-container {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tab-item {
  border-left: 3px solid transparent;
  border-radius: 0;
  margin-bottom: 4px;
}

.active-tab {
  background-color: #f0f8ff;
  border-left: 3px solid #21ba45;
  font-weight: 500;
}

.form-title-container {
  padding: 8px 0;
  margin-bottom: 10px;
}

.field-label {
  color: #666;
  font-size: 12px;
  margin-bottom: 4px;
}

.field-value {
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.q-scroll-area {
  background-color: white;
}

/* Media queries for responsiveness */
@media (max-height: 800px) {
  .pds-container {
    height: 95vh;
    max-height: 95vh;
  }
  
  .field-value {
    margin-bottom: 8px;
  }
}

@media (max-height: 600px) {
  .pds-container {
    height: 98vh;
    max-height: 98vh;
  }
  
  .form-title-container {
    margin-bottom: 5px;
  }
  
  .field-value {
    margin-bottom: 4px;
  }
}
</style>