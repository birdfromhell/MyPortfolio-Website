<script setup lang="ts">
import { IconArrowBigDownLine, IconLink, IconFilter } from "@tabler/icons-vue";
import type { ProjectType } from "~/data/types";
import { getProjectTypeLabel, projectTypes } from "~/data/types";
interface ContentProject {
  _id?: string;
  _path?: string;
  name: string;
  link: string;
  repo_link: string;
  date: string;
  technos: string[];
  type: string[];
  image?: string;
  imageExt?: string;
  content?: {
    en?: string;
    id?: string;
    fr?: string;
    [key: string]: string | undefined;
  };
}
const currentFilter = ref<ProjectType>("featured");
const defaultNumberOfProjects = 4;
const currentNumberOfProjects = ref(0);
const techFilterModalOpen = ref(false);
const selectedTechFilters = ref<string[]>([]);
const { data: allProjects } = await useAsyncData<ContentProject[]>(
  "projects",
  async () => {
    const items = await queryContent("/projects").sort({ date: -1 }).find();
    return items as unknown as ContentProject[];
  }
);
const availableTechnologies = computed(() => {
  if (!allProjects.value) return [];
  const techSet = new Set<string>();
  allProjects.value.forEach((project) => {
    if (project.technos && Array.isArray(project.technos)) {
      project.technos.forEach((tech) => techSet.add(tech));
    }
  });
  return Array.from(techSet).sort();
});
const projectsList = computed(() => {
  if (!allProjects.value) return [];
  return allProjects.value.filter((project) => {
    const typeMatch =
      project.type &&
      Array.isArray(project.type) &&
      project.type.includes(currentFilter.value);
    if (selectedTechFilters.value.length === 0) {
      return typeMatch;
    }
    const techMatch =
      project.technos &&
      Array.isArray(project.technos) &&
      selectedTechFilters.value.every((tech) => project.technos.includes(tech));
    return typeMatch && techMatch;
  });
});
function toggleTechFilter(tech: string) {
  if (selectedTechFilters.value.includes(tech)) {
    selectedTechFilters.value = selectedTechFilters.value.filter(
      (t) => t !== tech
    );
  } else {
    selectedTechFilters.value.push(tech);
  }
}
function clearTechFilters() {
  selectedTechFilters.value = [];
}
watchEffect(() => {
  currentNumberOfProjects.value =
    projectsList.value.length > defaultNumberOfProjects
      ? defaultNumberOfProjects
      : projectsList.value.length;
});
watch([currentFilter, selectedTechFilters], () => {
  currentNumberOfProjects.value =
    projectsList.value.length > defaultNumberOfProjects
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
          {{ $t("projects") }}
        </h2>
      </div>
    </a>
    <div class="flex flex-row justify-between items-center flex-wrap gap-2">
      <div class="flex flex-wrap gap-1">
        <UButton
          v-for="(type, index) in projectTypes"
          :key="index"
          @click="currentFilter = type"
          class="hover:bg-stone-600 hover:dark:bg-primary-300 hover:text-white"
          :class="{
            'bg-stone-600 dark:bg-primary-300 text-white':
              type === currentFilter,
          }"
        >
          {{ getProjectTypeLabel(type) }}
        </UButton>
      </div>
      <UButton
        @click="techFilterModalOpen = true"
        :class="{
          'border-2 border-primary-500': selectedTechFilters.length > 0,
        }"
      >
        <IconFilter class="w-4 h-4 mr-1" />
        {{ $t("filterByTech", "Filter by Tech") }}
        <span v-if="selectedTechFilters.length > 0" class="ml-1">
          ({{ selectedTechFilters.length }})
        </span>
      </UButton>
    </div>
    <div
      v-if="selectedTechFilters.length > 0"
      class="flex flex-wrap gap-1 mb-2"
    >
      <UBadge
        v-for="tech in selectedTechFilters"
        :key="tech"
        class="flex items-center gap-1 px-2 py-1"
        color="primary"
      >
        {{ tech }}
        <UButton
          size="xs"
          color="white"
          variant="ghost"
          icon="i-tabler-x"
          @click="toggleTechFilter(tech)"
        />
      </UBadge>
      <UButton size="xs" variant="ghost" @click="clearTechFilters">
        {{ $t("clearFilters", "Clear filters") }}
      </UButton>
    </div>
    <div class="flex flex-col gap-3 items-center">
      <Project
        v-for="(project, index) in projectsList.slice(
          0,
          currentNumberOfProjects
        )"
        :key="project._id || index"
        :project="project"
      />
      <div v-if="projectsList.length === 0" class="py-8 text-center w-full">
        <p class="text-neutral-500">
          {{ $t("noProjectsFound", "No projects match your current filters.") }}
        </p>
      </div>
      <div class="flex flex-row items-center justify-center w-full mt-3">
        <UButton
          v-if="
            currentNumberOfProjects != projectsList.length &&
            projectsList.length > 0
          "
          @click="currentNumberOfProjects = projectsList.length"
        >
          <IconArrowBigDownLine class="w-5 h-5" />
          {{ $t("showAll") }}
        </UButton>
        <UButton
          v-else-if="projectsList.length > defaultNumberOfProjects"
          @click="currentNumberOfProjects = defaultNumberOfProjects"
        >
          <IconArrowBigDownLine class="w-5 h-5 rotate-180" />
          {{ $t("showLess") }}
        </UButton>
      </div>
    </div>
    <UModal v-model="techFilterModalOpen" :ui="{ width: 'sm:max-w-lg' }">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold">
              {{ $t("filterByTech", "Filter by Tech Stack") }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-tabler-x"
              @click="techFilterModalOpen = false"
            />
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
              {{ $t("clearAll", "Clear All") }}
            </UButton>
            <UButton @click="techFilterModalOpen = false">
              {{ $t("apply", "Apply") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </section>
</template>
