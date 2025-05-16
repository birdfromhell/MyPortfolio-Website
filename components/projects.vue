<script setup lang="ts">
import { IconArrowBigDownLine, IconLink } from '@tabler/icons-vue';
import type { ProjectType } from '~/data/types';
import { getProjectTypeLabel, projectTypes } from '~/data/types';

// Interface untuk tipe data project dari Nuxt Content
interface ContentProject {
  _id?: string;
  _path?: string;
  name: string;
  link: string;
  repo_link: string;
  date: string;
  technos: string[];
  type: string[];
  image?: string; // Custom image filename
  imageExt?: string; // Custom image extension
  content?: {
    en?: string;
    id?: string;
    fr?: string;
    [key: string]: string | undefined;
  };
}

const currentFilter = ref<ProjectType>('featured');
const defaultNumberOfProjects = 4;
const currentNumberOfProjects = ref(0);

// Fetch projects from Nuxt Content with proper type casting
const { data: allProjects } = await useAsyncData<ContentProject[]>('projects', async () => {
  const items = await queryContent('/projects')
    .sort({ date: -1 }) // Sort by most recent first
    .find();
  
  // Explicitly cast the result to ensure proper type checking
  return (items as unknown) as ContentProject[];
});

// Filtered projects with better null checking
const projectsList = computed(() => {
  if (!allProjects.value) return [];
  return allProjects.value.filter(project => 
    project.type && Array.isArray(project.type) && project.type.includes(currentFilter.value)
  );
});

// Set initial number of projects to display
watchEffect(() => {
  currentNumberOfProjects.value = projectsList.value.length > defaultNumberOfProjects
    ? defaultNumberOfProjects
    : projectsList.value.length;
});

// Update when filter changes
watch(currentFilter, () => {
  currentNumberOfProjects.value = projectsList.value.length > defaultNumberOfProjects
    ? defaultNumberOfProjects
    : projectsList.value.length;
});
</script>

<template>
  <section class="flex flex-col gap-3">
    <a href="#projects">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2 class="text-xl font-bold hover:cursor-pointer">
          {{ $t('projects') }}
        </h2>
      </div>
    </a>
    <div class="flex flex-wrap gap-1">
      <UButton
        v-for="(type, index) in projectTypes"
        :key="index"
        @click="currentFilter = type"
        class="hover:bg-stone-600 hover:dark:bg-primary-300 hover:text-white"
        :class="{
          'bg-stone-600 dark:bg-primary-300 text-white': type === currentFilter
        }"
      >
        {{ getProjectTypeLabel(type) }}
      </UButton>
    </div>
    <div class="flex flex-col gap-3 items-center">
      <Project
        v-for="(project, index) in projectsList.slice(0, currentNumberOfProjects)"
        :key="project._id || index"
        :project="project"
      />
      
      <div class="flex flex-row items-center justify-center w-full mt-3">
        <UButton
          v-if="currentNumberOfProjects != projectsList.length"
          @click="currentNumberOfProjects = projectsList.length"
        >
          <IconArrowBigDownLine class="w-5 h-5" />
          {{ $t('showAll') }}
        </UButton>
        <UButton
          v-else-if="projectsList.length > defaultNumberOfProjects"
          @click="currentNumberOfProjects = defaultNumberOfProjects"
        >
          <IconArrowBigDownLine class="w-5 h-5 rotate-180" />
          {{ $t('showLess') }}
        </UButton>
      </div>
    </div>
  </section>
</template>