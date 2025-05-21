<script setup lang="ts">
import { IconLink, IconCode } from "@tabler/icons-vue";
import type { TechnoType } from "~/data/types";
import { getTechnoTypeLabel, technoTypes } from "~/data/types";
interface ContentSkill {
  _id?: string;
  _path?: string;
  title: string;
  type: string;
  url: string;
  icon: string;
}
const currentFilter = ref<TechnoType>("language");
const showAllSkills = ref(false);
const initialMobileSkillCount = 4;
const isMobile = ref(false);
onMounted(() => {
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIfMobile);
});
function checkIfMobile() {
  isMobile.value = window.innerWidth < 640;
}
const { data: allSkills } = await useAsyncData<ContentSkill[]>(
  "skills",
  async () => {
    const items = await queryContent("/skills").find();
    return items as unknown as ContentSkill[];
  }
);
const filteredSkills = computed(() => {
  if (!allSkills.value) return [];
  return allSkills.value.filter((skill) => skill.type === currentFilter.value);
});
const visibleSkills = computed(() => {
  if (!isMobile.value || showAllSkills.value) {
    return filteredSkills.value;
  }
  return filteredSkills.value.slice(0, initialMobileSkillCount);
});
const showLoadMoreButton = computed(() => {
  return (
    isMobile.value &&
    !showAllSkills.value &&
    filteredSkills.value.length > initialMobileSkillCount
  );
});
function filterSkills(type: TechnoType) {
  currentFilter.value = type;
  showAllSkills.value = false;
}
function loadMoreSkills() {
  showAllSkills.value = true;
}
const colorMode = useColorMode();
const { t } = useI18n();
</script>
<template>
  <section class="flex flex-col gap-3">
    <a href="#technologies">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2
          class="text-xl font-bold hover:cursor-pointer flex items-center gap-2"
        >
          <IconCode class="w-5 h-5 text-primary-500" />
          Skills
        </h2>
      </div>
    </a>
    <div class="flex flex-wrap gap-1 mb-4">
      <UButton
        v-for="(type, index) in technoTypes"
        :key="index"
        @click="filterSkills(type)"
        class="hover:bg-primary-600 hover:dark:bg-primary-400 hover:text-white transition-colors duration-200"
        :class="{
          'bg-primary-600 dark:bg-primary-400 text-white':
            type === currentFilter,
          'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200':
            type !== currentFilter,
        }"
        size="sm"
      >
        {{ getTechnoTypeLabel(type) }}
      </UButton>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="skill in visibleSkills"
        :key="skill.title"
        class="skill-item flex flex-col items-center gap-2 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-primary-900/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
        :title="skill.title"
      >
        <a
          :href="skill.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center w-full"
        >
          <div class="flex justify-center items-center h-12 mb-2">
            <UIcon :name="skill.icon" class="text-3xl" />
          </div>
          <p class="text-xs font-medium text-center">{{ skill.title }}</p>
        </a>
      </div>
    </div>
    <UButton
      v-if="showLoadMoreButton"
      @click="loadMoreSkills"
      class="mt-4 mx-auto"
      variant="soft"
      color="primary"
    >
      {{ t("showMore", "Load more") }}
    </UButton>
    <div
      v-if="filteredSkills.length === 0"
      class="text-center py-8 text-neutral-500"
    >
      <p>{{ t("loading_skills", "No skills found for this category") }}</p>
    </div>
  </section>
</template>
<style scoped>
.skill-item a {
  text-decoration: none;
  color: inherit;
}
.skill-item:hover UIcon {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}
.skill-item {
  position: relative;
  overflow: hidden;
}
.skill-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    to top,
    rgb(var(--color-primary-500) / 1),
    rgb(var(--color-primary-300) / 1)
  );
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.skill-item:hover::before {
  transform: scaleX(1);
}
</style>
