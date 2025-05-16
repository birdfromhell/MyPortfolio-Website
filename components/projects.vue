<script setup lang="ts">
import { IconArrowBigDownLine, IconLink, IconFilter } from '@tabler/icons-vue';
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
const techFilterModalOpen = ref(false);
const selectedTechFilters = ref<string[]>([]);

// Fetch projects from Nuxt Content with proper type casting
const { data: allProjects } = await useAsyncData<ContentProject[]>('projects', async () => {
  const items = await queryContent('/projects')
    .sort({ date: -1 }) // Sort by most recent first
    .find();
  
  // Explicitly cast the result to ensure proper type checking
  return (items as unknown) as ContentProject[];
});

// Get all unique technologies across all projects
const availableTechnologies = computed(() => {
  if (!allProjects.value) return [];
  
  // Create a Set to store unique technologies
  const techSet = new Set<string>();
  
  // Iterate through all projects to collect unique technologies
  allProjects.value.forEach(project => {
    if (project.technos && Array.isArray(project.technos)) {
      project.technos.forEach(tech => techSet.add(tech));
    }
  });
  
  // Convert Set to Array and sort alphabetically
  return Array.from(techSet).sort();
});

// Filtered projects with better null checking
const projectsList = computed(() => {
  if (!allProjects.value) return [];
  
  return allProjects.value.filter(project => {
    // Filter by project type
    const typeMatch = project.type && Array.isArray(project.type) && project.type.includes(currentFilter.value);
    
    // If no tech filters are selected, just filter by type
    if (selectedTechFilters.value.length === 0) {
      return typeMatch;
    }
    
    // Filter by both type and technologies
    const techMatch = project.technos && Array.isArray(project.technos) && 
      selectedTechFilters.value.every(tech => project.technos.includes(tech));
    
    return typeMatch && techMatch;
  });
});

// Toggle a technology filter
function toggleTechFilter(tech: string) {
  if (selectedTechFilters.value.includes(tech)) {
    selectedTechFilters.value = selectedTechFilters.value.filter(t => t !== tech);
  } else {
    selectedTechFilters.value.push(tech);
  }
}

// Clear all technology filters
function clearTechFilters() {
  selectedTechFilters.value = [];
}

// Set initial number of projects to display
watchEffect(() => {
  currentNumberOfProjects.value = projectsList.value.length > defaultNumberOfProjects
    ? defaultNumberOfProjects
    : projectsList.value.length;
});

// Update when filter changes
watch([currentFilter, selectedTechFilters], () => {
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
    
    <!-- Filter controls with project type and tech filter button -->
    <div class="flex flex-row justify-between items-center flex-wrap gap-2">
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
      
      <UButton 
        @click="techFilterModalOpen = true" 
        :class="{'border-2 border-primary-500': selectedTechFilters.length > 0}"
      >
        <IconFilter class="w-4 h-4 mr-1" /> 
        {{ $t('filterByTech', 'Filter by Tech') }}
        <span v-if="selectedTechFilters.length > 0" class="ml-1">
          ({{ selectedTechFilters.length }})
        </span>
      </UButton>
    </div>
    
    <!-- Active tech filters display -->
    <div v-if="selectedTechFilters.length > 0" class="flex flex-wrap gap-1 mb-2">
      <UBadge 
        v-for="tech in selectedTechFilters" 
        :key="tech"
        class="flex items-center gap-1 px-2 py-1"
        color="primary"
      >
        {{ tech }}
        <UButton size="xs" color="white" variant="ghost" icon="i-tabler-x" @click="toggleTechFilter(tech)" />
      </UBadge>
      <UButton size="xs" variant="ghost" @click="clearTechFilters">
        {{ $t('clearFilters', 'Clear filters') }}
      </UButton>
    </div>
    
    <!-- Projects grid -->
    <div class="flex flex-col gap-3 items-center">
      <Project
        v-for="(project, index) in projectsList.slice(0, currentNumberOfProjects)"
        :key="project._id || index"
        :project="project"
      />
      
      <div v-if="projectsList.length === 0" class="py-8 text-center w-full">
        <p class="text-neutral-500">{{ $t('noProjectsFound', 'No projects match your current filters.') }}</p>
      </div>
      
      <div class="flex flex-row items-center justify-center w-full mt-3">
        <UButton
          v-if="currentNumberOfProjects != projectsList.length && projectsList.length > 0"
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
    
    <!-- Tech Stack Filter Modal -->
    <UModal v-model="techFilterModalOpen" :ui="{ width: 'sm:max-w-lg' }">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold">
              {{ $t('filterByTech', 'Filter by Tech Stack') }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-tabler-x" @click="techFilterModalOpen = false" />
          </div>
        </template>
        
        <div class="max-h-[60vh] overflow-y-auto p-2">
          <div class="flex flex-wrap gap-2">
            <UCheckbox
              v-for="tech in availableTechnologies"
              :key="tech"
              v-model="selectedTechFilters"
              :name="tech"
              :label="tech"
              :value="tech"
              class="p-2 hover:bg-neutral-100 dark:hover:bg-primary-900 rounded-md"
            />
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-between">
            <UButton 
              variant="ghost" 
              @click="clearTechFilters"
              :disabled="selectedTechFilters.length === 0"
            >
              {{ $t('clearAll', 'Clear All') }}
            </UButton>
            <UButton @click="techFilterModalOpen = false">
              {{ $t('apply', 'Apply') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </section>
</template>