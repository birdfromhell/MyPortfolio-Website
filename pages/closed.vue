<script setup lang="ts">
definePageMeta({
});

useHead({
  title: 'Closed Source Projects'
});

const { t } = useI18n();
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">{{ t('closed_source_title', 'Closed Source Projects') }}</h1>

    <UCard class="p-6 mb-8">
      <div class="flex flex-col md:flex-row items-start gap-6">
        <div class="text-center md:text-left flex-shrink-0">
          <div class="inline-flex items-center justify-center p-4 bg-primary-50 dark:bg-primary-900 rounded-full">
            <i class="material-symbols-light:lock-outline-sharp text-4xl text-primary-500"></i>
          </div>
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-4">{{ t('closed_source_heading', 'Why is this project closed source?') }}</h2>
          
          <p class="mb-4">{{ t('closed_source_explanation', 'Some projects are closed source due to client requirements, proprietary code, or other restrictions. While I believe in open source software, not all projects can be shared publicly.') }}</p>
          
          <p class="mb-6">{{ t('closed_source_contact', 'If you are interested in learning more about this project or would like to discuss it further, please contact me through the contact form or via email.') }}</p>
          
          <div class="flex flex-wrap gap-4">
            <UButton to="/contact" variant="solid">
              {{ t('contact_me', 'Contact Me') }}
            </UButton>
            <UButton to="/" variant="outline">
              {{ t('back_to_projects', 'Back to Projects') }}
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
