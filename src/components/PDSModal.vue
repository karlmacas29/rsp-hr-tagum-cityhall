<template>
  <!-- PDS Modal -->
  <q-dialog v-model="localShowModal" persistent>
    <q-card class="pds-container">
      <q-card-section class="bg-primary text-white">
        <div class="text-h5 text-center">Personal Data Sheet (PDS)</div>
      </q-card-section>

      <div class="row no-wrap" style="height: 600px;">
        <!-- Left Side - Tabs Navigation -->
        <div class="col-3 bg-grey-2 q-pa-sm" style="border-right: 1px solid #e0e0e0;">
          <q-list bordered separator>
            <q-item
              v-for="tab in tabs"
              :key="tab.name"
              clickable
              :active="currentTab === tab.name"
              @click="currentTab = tab.name"
              active-class="active-tab"
              class="q-py-sm"
            >
              <q-item-section>
                <q-item-label>{{ tab.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Right Side - Content Area -->
        <div class="col-9">
          <q-scroll-area style="height: 100%;">
            <!-- Personal Information -->
            <div v-if="currentTab === 'personal'" class="q-pa-md">
              <div class="row">
                <div class="col-4">
                  <q-img
                    :src="applicant.photo || '/img/default-avatar.png'"
                    style="width: 100%; max-height: 150px; object-fit: cover"
                  />
                </div>
                <div class="col-8">
                  <div class="text-h6 q-mb-md">{{ applicant.name }}</div>
                </div>
              </div>

              <div class="text-h6 q-mt-md q-mb-md">Personal Information</div>
              <div class="row">
                <div class="col-6">
                  <div class="info-pair">
                    <span class="info-label">Date of Birth:</span>
                    <span class="info-value">{{ applicant?.personalInfo?.dateOfBirth }}</span>
                  </div>
                  <div class="info-pair">
                    <span class="info-label">Place of Birth:</span>
                    <span class="info-value">{{ applicant?.personalInfo?.placeOfBirth }}</span>
                  </div>
                  <div class="info-pair">
                    <span class="info-label">Sex:</span>
                    <span class="info-value">{{ applicant?.personalInfo?.sex }}</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="info-pair">
                    <span class="info-label">Civil Status:</span>
                    <span class="info-value">{{ applicant?.personalInfo?.civilStatus }}</span>
                  </div>
                  <div class="info-pair">
                    <span class="info-label">Gender Preference:</span>
                    <span class="info-value">{{ applicant?.personalInfo?.genderPreference }}</span>
                  </div>
                </div>
              </div>

              <div class="text-h6 q-mt-lg q-mb-md">Additional Information</div>
              <div class="row">
                <div class="col-6">
                  <div class="info-pair">
                    <span class="info-label">Height:</span>
                    <span class="info-value">{{ applicant?.personalInfo?.height }}</span>
                  </div>
                  <div class="info-pair">
                    <span class="info-label">Weight:</span>
                    <span class="info-value">{{ applicant?.personalInfo?.weight }}</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="info-pair">
                    <span class="info-label">Blood Type:</span>
                    <span class="info-value">{{ applicant?.personalInfo?.bloodType }}</span>
                  </div>
                  <div class="info-pair">
                    <span class="info-label">Telephone Number:</span>
                    <span class="info-value">{{ applicant?.personalInfo?.telephone }}</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="info-pair">
                    <span class="info-label">Cellphone Number:</span>
                    <span class="info-value">{{ applicant?.personalInfo?.mobile }}</span>
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
        </div>
      </div>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Close" color="primary" @click="closeModal" />
      </q-card-actions>
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
    }
  }
};
</script>

<style scoped>
.pds-container {
  width: 1000px;
  max-width: 95vw;
}

.info-pair {
  display: flex;
  margin-bottom: 12px;
}

.info-label {
  font-weight: bold;
  min-width: 160px;
  display: inline-block;
}

.info-value {
  flex-grow: 1;
}

.active-tab {
  background-color: #e0e0e0;
  font-weight: 500;
}

.q-item {
  border-radius: 4px;
  margin-bottom: 2px;
}

.q-item:hover {
  background-color: #f5f5f5;
}

.q-scroll-area {
  border-left: 1px solid #e0e0e0;
}
</style>
