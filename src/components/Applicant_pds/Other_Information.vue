<template>
  <q-page>
    <div>
      <q-card flat bordered class="q-mb-lg">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Personal Background Questionnaire</div>
          <div class="text-subtitle2">View Only</div>
        </q-card-section>

        <div class="q-gutter-md q-pa-md">
          <!-- Questions 34 -->
          <q-separator class="q-mb-md" />

          <div class="q-mb-md">
            <div class="text-bold">34.</div>
            Are you related by consanguinity or affinity to the appointing or recommending
            authority, to the chief of bureau or office or to the person who has immediate
            supervision over you in the Office, Bureau or Department where you will be appointed,
          </div>

          <div class="q-pl-md q-mb-md">
            <q-item tag="label">
              <q-item-section>
                <q-item-label>
                  <div class="text-bold">a.</div>
                  within the third degree?
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-radio v-model="formData.relationThirdDegree" val="Yes" label="Yes" disable />
                <q-radio v-model="formData.relationThirdDegree" val="No" label="No" disable />
              </q-item-section>
            </q-item>

            <q-item tag="label">
              <q-item-section>
                <q-item-label>
                  <div class="text-bold">b.</div>
                  within the fourth degree (for Local Government Unit - Career Employees)?
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-radio v-model="formData.relationFourthDegree" val="Yes" label="Yes" disable />
                <q-radio v-model="formData.relationFourthDegree" val="No" label="No" disable />
              </q-item-section>
            </q-item>
          </div>

          <!-- Questions 35 -->
          <q-separator class="q-mb-md" />
          <div class="q-mb-md text-bold">35.</div>
          <div class="q-pl-md q-mb-md">
            <q-item tag="label">
              <q-item-section>
                <q-item-label>
                  <div class="text-bold">a.</div>
                  Have you ever been found guilty of any administrative offense?
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-radio v-model="formData.administrativeOffense" val="Yes" label="Yes" disable />
                <q-radio v-model="formData.administrativeOffense" val="No" label="No" disable />
              </q-item-section>
            </q-item>

            <q-item tag="label">
              <q-item-section>
                <q-item-label>
                  <div class="text-bold">b.</div>
                  Have you been criminally charged before any court?
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-radio v-model="formData.criminallyCharged" val="Yes" label="Yes" disable />
                <q-radio v-model="formData.criminallyCharged" val="No" label="No" disable />
              </q-item-section>
            </q-item>
          </div>
          <q-separator class="q-mb-md" />
          <!-- Question 36 -->
          <q-item tag="label">
            <q-item-section>
              <q-item-label>
                <div class="text-bold">36.</div>
                Have you ever been convicted of any crime or violation of any law, decree, ordinance
                or regulation by any court or tribunal?
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-radio v-model="formData.convicted" val="Yes" label="Yes" disable />
              <q-radio v-model="formData.convicted" val="No" label="No" disable />
            </q-item-section>
          </q-item>
          <q-separator class="q-mb-md" />
          <!-- Question 37 -->
          <q-item tag="label">
            <q-item-section>
              <q-item-label>
                <div class="text-bold">37.</div>
                Have you ever been separated from the service in any of the following modes:
                resignation, retirement, dropped from the rolls, dismissal, termination, end of
                term, finished contract or phased out (abolition) in the public or private sector?
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-radio v-model="formData.separatedFromService" val="Yes" label="Yes" disable />
              <q-radio v-model="formData.separatedFromService" val="No" label="No" disable />
            </q-item-section>
          </q-item>
          <q-separator class="q-mb-md" />
          <!-- Question 38 -->
          <div class="text-bold q-mb-md">38.</div>
          <q-item tag="label">
            <q-item-section>
              <q-item-label>
                <div class="text-bold">a.</div>
                Have you ever been a candidate in a national or local election held within the last
                year (except Barangay election)?
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-radio v-model="formData.electionCandidate" val="Yes" label="Yes" disable />
              <q-radio v-model="formData.electionCandidate" val="No" label="No" disable />
            </q-item-section>
          </q-item>

          <q-item tag="label" class="q-pl-md">
            <q-item-section>
              <q-item-label>
                <div class="text-bold">b.</div>
                Have you resigned from the government service during the three (3)-month period
                before the last election to promote/actively campaign for a national or local
                candidate?
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-radio v-model="formData.resignedForCampaign" val="Yes" label="Yes" disable />
              <q-radio v-model="formData.resignedForCampaign" val="No" label="No" disable />
            </q-item-section>
          </q-item>
          <q-separator class="q-mb-md" />
          <!-- Question 39 -->
          <q-item tag="label">
            <q-item-section>
              <q-item-label>
                <div class="text-bold">39.</div>
                Have you acquired the status of an immigrant or permanent resident of another
                country?
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-radio v-model="formData.immigrant" val="Yes" label="Yes" disable />
              <q-radio v-model="formData.immigrant" val="No" label="No" disable />
            </q-item-section>
          </q-item>

          <!-- Question 40 -->
          <q-separator class="q-mb-md" />

          <div class="q-mb-md">
            <div class="text-bold">40.</div>
            Pursuant to: (a) Indigenous People's Act (RA 8371); (b) Magna Carta for Disabled Persons
            (RA 7277); and (c) Solo Parents Welfare Act of 2000 (RA 8972), please answer the
            following items:
          </div>

          <div class="q-pl-md q-mb-md">
            <q-item tag="label">
              <q-item-section>
                <q-item-label>
                  <div class="text-bold">a.</div>
                  Are you a member of any indigenous group?
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-radio v-model="formData.indigenous" val="Yes" label="Yes" disable />
                <q-radio v-model="formData.indigenous" val="No" label="No" disable />
              </q-item-section>
            </q-item>

            <q-item tag="label">
              <q-item-section>
                <q-item-label>
                  <div class="text-bold">b.</div>
                  Are you a person with disability?
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-radio v-model="formData.pwd" val="Yes" label="Yes" disable />
                <q-radio v-model="formData.pwd" val="No" label="No" disable />
              </q-item-section>
            </q-item>

            <q-item tag="label">
              <q-item-section>
                <q-item-label>
                  <div class="text-bold">c.</div>
                  Are you a solo parent?
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-radio v-model="formData.soloParent" val="Yes" label="Yes" disable />
                <q-radio v-model="formData.soloParent" val="No" label="No" disable />
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  // Form data setup with example data
  const formData = ref({
    relationThirdDegree: 'No',
    relationFourthDegree: 'No',
    administrativeOffense: 'No',
    criminallyCharged: 'No',
    convicted: 'No',
    separatedFromService: 'Yes', // Example of a "Yes" answer
    electionCandidate: 'No',
    resignedForCampaign: 'No',
    immigrant: 'No',
    indigenous: 'Yes', // Example of a "Yes" answer
    pwd: 'No',
    soloParent: 'No',
  });

  // Simulating data fetching from an API
  onMounted(async () => {
    try {
      $q.loading.show({ message: 'Loading application data...' });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In a real application, you would fetch data from your API here
      // const response = await fetch('/api/application/12345');
      // const data = await response.json();
      // formData.value = data;

      // For demo purposes, we're using the pre-filled example data

      $q.loading.hide();
    } catch (error) {
      $q.loading.hide();
      $q.notify({
        color: 'negative',
        message: 'Failed to load application data',
        icon: 'error',
      });
      console.error('Data loading error:', error);
    }
  });

  // Print function
</script>

<style>
  /* Print styles */
  @media print {
    .q-footer,
    .q-header {
      display: none !important;
    }

    .q-btn {
      display: none !important;
    }
  }

  /* Additional custom styles */
  .q-radio {
    margin-right: 12px;
  }
</style>
