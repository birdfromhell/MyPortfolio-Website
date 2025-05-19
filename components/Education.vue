<script setup lang="ts">
import { IconLink } from "@tabler/icons-vue";
type LocaleType = "en" | "id";
interface ContentEducation {
  _id?: string;
  _path?: string;
  institution?: string;
  website?: string;
  degree?: string;
  period?: {
    start?: string;
    end?: string;
  };
  location?: string;
  content?: {
    en?: string;
    id?: string;
    [key: string]: string | undefined;
  };
}
const { locale } = useI18n();
const currentLocale = computed<LocaleType>(() => {
  return locale.value === "en" || locale.value === "id" ? locale.value : "en";
});
const { data: education } = await useAsyncData<ContentEducation[]>(
  "education",
  () => queryContent("/education").sort({ "period.start": -1 }).find()
);
const getLocalizedContent = (edu: ContentEducation): string => {
  if (edu.content && edu.content[currentLocale.value]) {
    return edu.content[currentLocale.value] || "";
  }
  return "";
};
</script>
<template>
  <section class="flex flex-col gap-y-3">
    <a href="#education">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2 class="text-xl font-bold hover:cursor-pointer">
          {{ $t("education") }}
        </h2>
      </div>
    </a>
    <div
      v-for="(edu, index) in education"
      :key="index"
      class="flex flex-col gap-2 mb-4"
    >
      <div class="flex flex-col">
        <div class="flex flex-row items-start justify-between w-full">
          <div class="flex flex-col items-start flex-grow">
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <a
                class="text-lg sm:text-xl font-semibold hover:underline"
                :href="edu.website"
                target="_blank"
                rel="noopener noreferrer"
                >{{ edu.institution }}</a
              >
              <p
                class="sm:hidden text-sm"
                v-if="edu.period?.start && edu.period?.end"
              >
                • {{ edu.period.start }} - {{ edu.period.end }}
              </p>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ edu.degree }}
            </p>
            <div
              v-if="getLocalizedContent(edu)"
              class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 text-pretty mt-2"
              v-html="getLocalizedContent(edu)"
            ></div>
          </div>
          <div class="flex-shrink-0 text-right">
            <p
              class="hidden sm:block text-sm text-neutral-600 dark:text-neutral-400"
              v-if="edu.period?.start && edu.period?.end"
            >
              {{ edu.period.start }} - {{ edu.period.end }}
            </p>
            <p
              v-if="edu.location"
              class="hidden sm:block text-sm text-neutral-600 dark:text-neutral-400"
            >
              {{ edu.location }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
