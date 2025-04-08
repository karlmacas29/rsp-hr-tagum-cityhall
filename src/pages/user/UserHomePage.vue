<template>
    <q-page class="grid justify-start items-start">
        <!-- Full-page background container -->
        <div class="darkened-bg-container row justify-center items-center">
            
            <!-- Centered content -->
            <div class="centered-content text-center row justify-center items-center q-gutter-sm">
                <!-- Logo (replace with your actual logo) -->
                <img 
                    src="logo.png" 
                    alt="Logo"
                    class="logo"
                >
                <!-- Text content -->
                <div class="text-white grid justify-start items-start">
                    <div class="row justify-start items-start">Welcome to</div>
                    <div class="text-weight-bold text-h4">Recruitment, Selection and Placement</div>
                    <div class="row justify-start items-start">City of Human Resources</div>
                </div>
            </div>
        </div>
        <!-- Main content of the page -->
         <div class="grid justify-center items-center q-py-md q-px-xl">
            <div class="row justify-between items-center">
                <div>
                    <h4 class="text-bold">Latest Job Posts</h4>
                </div>
                <div><q-btn color="primary" @click="router.push({name: 'Joblist'})">See All</q-btn></div>
            </div>
            <!-- Job List -->
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
         </div>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Generate mock job data
const jobs = ref(Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  title: `Position ${i + 1}`,
  company: `City Office of ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
  location: ['City Hall', 'Historical'][i % 2],
  type: ['Full-time', 'Part-time', 'Contract', 'Internship'][i % 4],
  salary: (50000 + (i * 10000)).toLocaleString(),
  posted: `${i + 1} day${i > 0 ? 's' : ''} ago`,
  description: ''
})));


const handleJobClick = (jobId) => {
  console.log('Job clicked:', jobId);
  // You would typically navigate to a job detail page here
  router.push(`/jobList/details/${jobId}`)
};
</script>


<style scoped>
.darkened-bg-container {
  position: relative;
  width: 100%;
  height: 480px;
}

.darkened-bg-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('tagum-city-hall.webp');
  background-size: cover;
  background-position: center;
  filter: brightness(0.5); /* Adjust darkness level (0.5 = 50% brightness) */
  z-index: -1;
}

.centered-content {
  
  padding: 2rem;
  border-radius: 10px;
  max-width: 80%;
}

.logo {
  max-width: 150px;
  height: auto;
}

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