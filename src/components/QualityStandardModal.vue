<template>
  <q-dialog v-model="localShow" persistent>
    <q-card class="qualification-modal" style="width: 1200px; max-width: 95vw">
      <!-- Header Section -->
      <q-card-section class="row justify-between header text-black q-pa-md">
        <div>
          <div class="text-h5 text-bold">Qualification Standard</div>
          <div class="text-subtitle1">Application Information</div>
        </div>
        <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
      </q-card-section>

      <!-- Main Content - Two Cards Layout -->
      <div class="row q-pa-md no-wrap" style="min-height: 550px">
        <!-- Left Card (Smaller) -->
        <q-card class="col-3 q-mr-md">
          <q-card-section class="column items-center q-pa-md">
            <img
              src="/img/examplePr.png"
              style="border-radius: 100px"
              alt=""
              width="150"
              height="150"
            />

            <div class="text-h6 text-center q-mb-sm">{{ employeeName }}</div>
            <q-badge color="positive" class="q-mb-md">Active</q-badge>

            <div class="full-width">
              <!-- Current Position -->
              <div class="text-center q-mb-sm">
                <div class="text-caption text-grey-7">Current Position</div>
                <div class="text-weight-medium">Computer Programmer II</div>
              </div>

              <q-separator class="q-my-md" />

              <!-- Employment Type -->
              <div class="text-center q-mb-sm">
                <div class="text-caption text-grey-7">Employment Type</div>
                <div class="text-weight-medium">
                  <q-icon name="check" color="positive" size="sm" />
                  Casual
                </div>
              </div>

              <q-separator class="q-my-md" />

              <!-- Application Status -->
              <div class="text-center">
                <div class="text-caption text-grey-7">Application Status</div>
                <div class="text-weight-medium text-positive">Qualified</div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Right Card (Larger) -->
        <q-card class="col">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey-8"
            active-color="primary"
            indicator-color="primary"
            align="left"
          >
            <q-tab name="education" label="Education" />
            <q-tab name="experience" label="Experience" />
            <q-tab name="training" label="Training" />
            <q-tab name="eligibility" label="Eligibility" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" class="q-pa-none">
            <!-- Education Tab -->
            <q-tab-panel name="education">
              <div class="text-h6 q-mb-md">Employee Education</div>
              <q-markup-table flat bordered class="qualification-table">
                <thead>
                  <tr>
                    <th class="text-left">Degree</th>
                    <th class="text-left">Institution</th>
                    <th class="text-left">Year Graduated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bachelor's Degree</td>
                    <td>University of Example</td>
                    <td>2018</td>
                  </tr>
                </tbody>
              </q-markup-table>

              <div class="text-h6 q-mt-md q-mb-md">Position Qualification Standard</div>
              <q-markup-table flat bordered class="qualification-table">
                <thead>
                  <tr>
                    <th class="text-left">Required Degree</th>
                    <th class="text-left">Preferred Qualification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bachelor's Degree</td>
                    <td>Master's Degree preferred</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-tab-panel>

            <!-- Experience Tab -->
            <q-tab-panel name="experience">
              <div class="text-h6 q-mb-md">Employee Experience</div>
              <q-markup-table flat bordered class="qualification-table">
                <thead>
                  <tr>
                    <th class="text-left">Position</th>
                    <th class="text-left">Organization</th>
                    <th class="text-left">Years</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Software Developer</td>
                    <td>Tech Solutions Inc.</td>
                    <td>3</td>
                  </tr>
                </tbody>
              </q-markup-table>

              <div class="text-h6 q-mt-md q-mb-md">Position Qualification Standard</div>
              <q-markup-table flat bordered class="qualification-table">
                <thead>
                  <tr>
                    <th class="text-left">Required Experience</th>
                    <th class="text-left">Preferred Experience</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>5 years in programming</td>
                    <td>Team leadership experience</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-tab-panel>

            <!-- Training Tab -->
            <q-tab-panel name="training">
              <div class="text-h6 q-mb-md">Employee Training</div>
              <q-markup-table flat bordered class="qualification-table">
                <thead>
                  <tr>
                    <th class="text-left">Training Program</th>
                    <th class="text-left">Provider</th>
                    <th class="text-left">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Advanced Programming</td>
                    <td>Tech Academy</td>
                    <td>40</td>
                  </tr>
                </tbody>
              </q-markup-table>

              <div class="text-h6 q-mt-md q-mb-md">Position Qualification Standard</div>
              <q-markup-table flat bordered class="qualification-table">
                <thead>
                  <tr>
                    <th class="text-left">Required Training</th>
                    <th class="text-left">Preferred Training</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Technical certification</td>
                    <td>Leadership training</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-tab-panel>

            <!-- Eligibility Tab -->
            <q-tab-panel name="eligibility">
              <div class="text-h6 q-mb-md">Employee Eligibility</div>
              <q-markup-table flat bordered class="qualification-table">
                <thead>
                  <tr>
                    <th class="text-left">Certification</th>
                    <th class="text-left">Issuing Authority</th>
                    <th class="text-left">Year Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Professional License</td>
                    <td>State Board</td>
                    <td>2020</td>
                  </tr>
                </tbody>
              </q-markup-table>

              <div class="text-h6 q-mt-md q-mb-md">Position Qualification Standard</div>
              <q-markup-table flat bordered class="qualification-table">
                <thead>
                  <tr>
                    <th class="text-left">Required Eligibility</th>
                    <th class="text-left">Preferred Certification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Professional License</td>
                    <td>Advanced certification</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>

      <!-- Footer Actions -->
      <q-card-actions align="right" class="q-px-md q-py-md">
        <q-btn label="UPDATE" color="primary" @click="onUpdate" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'QualityStandardModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    employeeName: {
      type: String,
      default: 'Mahusay, Jograd M.',
    },
  },
  emits: ['update:show', 'update'],
  setup(props, { emit }) {
    const localShow = ref(props.show)
    const tab = ref('education')

    watch(
      () => props.show,
      (newVal) => {
        localShow.value = newVal
      },
    )

    watch(localShow, (newVal) => {
      if (!newVal) {
        emit('update:show', false)
      }
    })

    const onUpdate = () => {
      emit('update')
    }

    return {
      localShow,
      tab,
      onUpdate,
    }
  },
})
</script>

<style scoped>
.qualification-modal {
  border-radius: 8px;
  overflow: hidden;
}

.header {
  position: relative;
}

.close-btn {
  margin: 8px;
}

.text-center {
  text-align: center;
}

.full-width {
  width: 100%;
}

.text-positive {
  color: var(--q-positive);
}

.qualification-table {
  width: 100%;
}

.qualification-table th {
  font-weight: bold;
  background-color: #f0f0f0;
}

.qualification-table td,
.qualification-table th {
  padding: 12px 16px;
}
</style>
