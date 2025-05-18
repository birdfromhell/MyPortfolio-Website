<script setup lang="ts">
import { IconLock, IconMail, IconCode, IconBrain, IconInfoCircle } from '@tabler/icons-vue';

definePageMeta({
  layout: 'default'
});

useHead({
  title: 'Closed Source Projects'
});

const { t } = useI18n();

// Get random quote for closed source
function getRandomClosedSourceQuote(): string {
  const quotes = [
    "Closed source is just code playing hide and seek, but with really good hiding spots.",
    "Some code is like a secret recipe - if I told you, I'd have to debug you.",
    "This code is so exclusive, even most of the bugs haven't seen it.",
    "The first rule of closed source projects: You don't talk about closed source projects.",
    "It's not hidden, it's just in stealth mode for strategic reasons.",
    "This code is like a magic trick - a magician never reveals their secrets.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// For animation trigger - modified for page appearance
onMounted(() => {
  setTimeout(() => {
    document.querySelector('.page-content')?.classList.add('show');
  }, 100);
});
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 sm:py-16">
    <div class="page-content">
      <div class="max-w-3xl mx-auto">
        <!-- Header with lock icon -->
        <div class="flex items-center gap-4 mb-8">
          <div class="rounded-full bg-amber-50 dark:bg-amber-900/40 p-4 inline-flex">
            <IconLock class="text-3xl text-amber-500 animate-pulse-slow" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {{ t('closed_source_title', 'Closed Source Projects') }}
            </h1>
            <p class="text-sm text-amber-600/70 dark:text-amber-400/70">
              {{ t('project_access_restricted', 'Project access restricted') }}
            </p>
          </div>
        </div>
        
        <!-- Main content with shimmer background -->
        <div class="relative overflow-hidden rounded-xl mb-10">
          <!-- Animated shimmer background -->
          <div class="absolute inset-0 bg-gradient-to-r from-amber-50/0 via-amber-100/10 to-amber-50/0 animate-shimmer pointer-events-none"></div>
          
          <div class="p-6 relative z-10 bg-white/80 dark:bg-neutral-900/80 rounded-xl border border-amber-200 dark:border-amber-900">
            <div class="space-y-8">
              <!-- NDA info section -->
              <div class="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-lg border-l-4 border-amber-500">
                <h2 class="text-lg font-semibold mb-2 flex items-center gap-2">
                  <IconInfoCircle class="text-amber-600" /> 
                  {{ t('closed_source_heading', 'Why are some projects closed source?') }}
                </h2>
                
                <p class="mb-3 text-neutral-700 dark:text-neutral-300">
                  {{ t('closed_source_explanation', 'Some projects are closed source due to client requirements, proprietary code, or other restrictions. While I believe in open source software, not all projects can be shared publicly.') }}
                </p>
              </div>
              
              <!-- Motivational section -->
              <div class="flex flex-col items-center text-center p-4">
                <IconBrain class="text-2xl text-primary-500 mb-2" />
                <p class="text-sm text-neutral-600 dark:text-neutral-400 italic">
                  {{ t('skills_explanation', 'Sometimes the most interesting engineering happens behind closed doors. The skills gained from solving complex problems remain, even when the code cannot be shared.') }}
                </p>
              </div>
              
              <!-- Fun quote -->
              <div class="text-center">
                <p class="text-sm text-amber-600 dark:text-amber-400 italic px-6 py-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-md inline-block">
                  "{{ getRandomClosedSourceQuote() }}"
                </p>
              </div>
              
              <!-- Contact info -->
              <div class="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6">
                <h3 class="font-medium text-lg mb-2">{{ t('want_to_know_more', 'Want to know more?') }}</h3>
                <p class="mb-4">
                  {{ t('closed_source_contact', 'If you are interested in learning more about these projects or would like to discuss them further, please contact me through the contact form or via email.') }}
                </p>
                
                <!-- Action buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                  <UButton 
                    to="/#contact" 
                    variant="solid"
                    color="amber"
                    class="w-full sm:w-auto"
                  >
                    <IconMail class="w-4 h-4 mr-1" /> {{ t('contact_me', 'Contact Me') }}
                  </UButton>
                  <UButton 
                    to="/#projects" 
                    variant="outline"
                    color="amber" 
                    class="w-full sm:w-auto"
                  >
                    <IconCode class="w-4 h-4 mr-1" /> {{ t('back_to_projects', 'See Public Projects') }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Examples of closed source projects section -->
        <div class="mt-12">
          <h2 class="text-xl font-bold mb-6 text-center">{{ t('examples_of_closed_source', 'Examples of Closed Source Projects') }}</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Project 1 -->
            <div class="border border-amber-200 dark:border-amber-900/50 rounded-lg p-5 bg-white dark:bg-neutral-900">
              <h3 class="font-bold mb-2">SeleraRasaSunda</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{{ t('client_project', 'Client Project') }} • 2024</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">Laravel</span>
                <span class="text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">PHP</span>
                <span class="text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">MySQL</span>
              </div>
              <p class="text-sm">{{ t('food_catering', 'A clean and responsive landing page for a food catering business with focus on user engagement and conversion.') }}</p>
            </div>
            
            <!-- Project 2 -->
            <div class="border border-amber-200 dark:border-amber-900/50 rounded-lg p-5 bg-white dark:bg-neutral-900">
              <h3 class="font-bold mb-2">Accountant Software</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{{ t('client_project', 'Client Project') }} • 2022</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">Laravel</span>
                <span class="text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">Bootstrap</span>
                <span class="text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">Vue.js</span>
              </div>
              <p class="text-sm">{{ t('accountant_software', 'Proprietary accounting software developed for a client with custom reporting and financial management features.') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-content {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease;
}

.page-content.show {
  opacity: 1;
  transform: translateY(0);
}

/* Shimmer animation for background */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2.5s infinite;
}

/* Pulse animation for lock icon */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>