<template>
    <q-page class="q-px-xl q-py-md">
        <div class="row justify-between items-center">
            <div>
                <h4 class="text-bold">Available Job Posts</h4>
            </div>
            <div>
                <div class="row items-center q-gutter-md">
                    <q-input
                        outlined
                        dense
                        v-model="search"
                        placeholder="Search jobs..."
                        class="col-grow"
                    >
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                    <q-btn
                        @click="openFilter"
                        color="primary"
                        icon="filter_list"
                        label="Filter"
                    />
                </div>
            </div>
        </div>
        <div>
            <div class="row justify-between items-center q-col-gutter-md">
                <div 
                    v-for="job in jobs" 
                    :key="job.id" 
                    class="col-xs-12 col-sm-6 col-md-4"
                >
                <q-card class="job-card"   @click="handleJobClick(job.id)">
                    <q-card-section class="bg-grey-2">
                        <div class="row items-center no-wrap">
                            <div class="col">
                            <div class="text-h5 text-bold">{{ job.title }}</div>
                            <div class="text-subtitle1">{{ job.company }}</div>
                            </div>
                                
                            <div class="col-auto">
                            <q-avatar color="primary" text-color="white" size="48px">
                                {{ job.title.charAt(0) }}
                            </q-avatar>
                            </div>
                        </div>
                        </q-card-section>

                        <q-separator />

                        <q-card-section>
                        <div class="text-caption text-grey q-mb-sm">
                            <q-icon name="event" size="xs" /> Posted on February 17, 2025
                        </div>
                        <div>
                            <div class="text-weight-bold q-mt-sm">BRIEF QUALIFICATIONS:</div>
                            <div class="text-body2">
                                <ol>
                                <li>Must be graduated from 4-yr job relevance.</li>
                                <li>Preferably MALE with relevant experience.</li>
                                <li>Analytical, innovative and creative.</li>
                                </ol>
                            </div>
                            </div>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions class="justify-between">
                        <q-badge color="green" :label="job.type" />
                            
                        </q-card-actions>
                    </q-card>
                </div>
            </div>
        </div>

        <q-dialog v-model="filterDialog">
                <q-card style="min-width: 450px">
                    <q-card-section class="row items-center">
                        <div class="text-h6">Filters</div>
                        <q-space />
                        <q-btn icon="close" flat round dense v-close-popup />
                    </q-card-section>
        
                    <q-card-section>
                        <q-input
                            v-model="filters.position"
                            label="Position"
                            outlined
                            dense
                            class="q-mb-md"
                        />
                        <q-input
                            v-model="filters.office"
                            label="Office"
                            outlined
                            dense
                            class="q-mb-md"
                        />
                        <q-select
                            v-model="filters.type"
                            :options="['Full-time', 'Part-time', 'Contract', 'Internship']"
                            label="Type"
                            outlined
                            dense
                            class="q-mb-md"
                        />
                    </q-card-section>
        
                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Clear All" />
                        <q-btn flat label="Done" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const filterDialog = ref(false)
const openFilter = () => {
    filterDialog.value = true
}

const filters = reactive({
    position: '',
    office: '',
    type: ''
})

const search = ref('')
// Generate mock job data
const jobs = ref(Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Position ${i + 1}`,
  company: `City Office of ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
  location: ['City Hall', 'Historical'][i % 2],
  type: ['Full-time', 'Part-time', 'Contract', 'Internship'][i % 4],
  salary: (50000 + (i * 10000)).toLocaleString(),
  posted: `${i + 1} day${i > 0 ? 's' : ''} ago`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
})));


const handleJobClick = (jobId) => {
  console.log('Job clicked:', jobId);
  // You would typically navigate to a job detail page here
  router.push(`/jobList/details/${jobId}`)
};
</script>


<style scoped>


.job-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>