<script setup lang="ts">
import { IconLink } from '@tabler/icons-vue';
import type { TechnoType } from '~/data/types';
import { getTechnoTypeLabel, technoTypes } from '~/data/types';

// Interface untuk data skill dari Nuxt Content
interface ContentSkill {
  _id?: string;
  _path?: string;
  title: string;
  type: string;
  url: string;
  icon: string;
}

const currentFilter = ref<TechnoType>('language');

// Fetch skills from Nuxt Content
const { data: allSkills } = await useAsyncData<ContentSkill[]>('skills', async () => {
  const items = await queryContent('/skills')
    .find();
  
  // Explicitly cast the result to ensure proper type checking
  return (items as unknown) as ContentSkill[];
});

// Filtered skills
const skills = computed(() => {
  if (!allSkills.value) return [];
  return allSkills.value.filter(skill => 
    skill.type === currentFilter.value
  );
});

// Update filter
function filterSkills(type: TechnoType) {
  currentFilter.value = type;
}

const colorMode = useColorMode();
</script>

<template>
  <section class="flex flex-col gap-3">
    <a href="#technologies">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2 class="text-xl font-bold hover:cursor-pointer">
          Technologies
        </h2>
      </div>
    </a>
    <div class="flex flex-wrap gap-1">
      <UButton
        v-for="(type, index) in technoTypes"
        :key="index"
        @click="filterSkills(type)"
        class="hover:bg-stone-600 hover:dark:bg-primary-300 hover:text-white"
        :class="{
          'bg-stone-600 dark:bg-primary-300 text-white': type === currentFilter
        }"
      >
        {{ getTechnoTypeLabel(type) }}
      </UButton>
    </div>
    <div class="flex flex-wrap gap-1.5">
      <UButton
        v-for="skill in skills"
        :key="skill.title"
        class="relative border border-stone-200 dark:border-stone-600 p-0.5 rounded-md w-24 h-24 sm:w-28 sm:h-28"
        square
        variant="soft"
        :to="skill.url"
        target="_blank"
      >
        <div class="flex flex-col items-center justify-evenly text-xs text-center w-full h-full">
          <p class="text-xs font-bold text-stone-800 dark:text-neutral-400">
            {{ skill.title }}
          </p>
          <UIcon
            :name="skill.icon"
            class="w-6 h-6 mx-auto"
          />
        </div>
      </UButton>
    </div>
  </section>
</template>