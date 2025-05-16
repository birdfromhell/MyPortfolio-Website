<script setup lang="ts">
definePageMeta({
});

useHead({
  title: 'Resume',
  meta: [
    { name: 'description', content: 'View and download my professional resume' }
  ]
});

const { t } = useI18n();
const resumeFile = '/Ababil-2025-CV.pdf';
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">{{ t('resume', 'Resume') }}</h1>
      
      <UButton
        :to="resumeFile"
        download="Ababil-CV.pdf"
        target="_blank"
        color="primary"
        variant="solid"
        class="mt-4 md:mt-0"
      >
        <i class="i-tabler-file-download mr-2"></i>
        {{ t('download_resume', 'Download Resume') }}
      </UButton>
    </div>

    <UCard class="w-full">
      <embed
        :src="resumeFile"
        type="application/pdf"
        class="w-full min-h-[80vh]"
      />
    </UCard>
  </div>
</template>
