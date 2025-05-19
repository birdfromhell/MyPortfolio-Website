<script setup lang="ts">
import {
  IconLink,
  IconCode,
  IconClock,
  IconBrandGithub,
  IconCalendarStats,
} from "@tabler/icons-vue";
import axios from "axios";
interface WakaTimeStats {
  data: {
    categories: Category[];
    languages: Language[];
    editors: Editor[];
    operating_systems: OS[];
    total_seconds: number;
    human_readable_total: string;
    daily_average_seconds: number;
    human_readable_daily_average: string;
    days_including_holidays: number;
    days_minus_holidays: number;
    percent_calculated: number;
    best_day: {
      date: string;
      text: string;
      seconds: number;
    };
  };
}
interface Category {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
}
interface Language {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
}
interface Editor {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
}
interface OS {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
}
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");
const stats = ref<WakaTimeStats | null>(null);
const weeklyTime = computed(() => {
  if (!stats.value) return null;
  const weeklySeconds = stats.value.data.daily_average_seconds * 7;
  const hours = Math.floor(weeklySeconds / 3600);
  const minutes = Math.floor((weeklySeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
});
const formattedBestDay = computed(() => {
  if (!stats.value || !stats.value.data.best_day) return null;
  const date = new Date(stats.value.data.best_day.date);
  return date.toLocaleDateString();
});
const fetchWakaTimeStats = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    const response = await $fetch("/api/wakatime");
    stats.value = response;
  } catch (error) {
    console.error("Error fetching WakaTime stats:", error);
    hasError.value = true;
    errorMessage.value =
      "Failed to load coding statistics. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};
const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    JavaScript: "bg-yellow-500",
    TypeScript: "bg-blue-600",
    Python: "bg-blue-500",
    PHP: "bg-purple-500",
    Vue: "bg-green-500",
    HTML: "bg-orange-600",
    CSS: "bg-blue-400",
    Java: "bg-red-600",
    Markdown: "bg-gray-600",
    JSON: "bg-gray-500",
    "C#": "bg-green-600",
    "C++": "bg-pink-600",
    Go: "bg-cyan-500",
    Ruby: "bg-red-500",
    Rust: "bg-orange-700",
    Kotlin: "bg-orange-500",
    Swift: "bg-orange-600",
    Dart: "bg-blue-400",
  };
  return colors[language] || "bg-gray-500";
};
onMounted(() => {
  fetchWakaTimeStats();
});
const { t } = useI18n();
</script>
<template>
  <section class="flex flex-col gap-3">
    <a href="#coding-stats">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2 class="text-xl font-bold hover:cursor-pointer">
          {{ $t("coding_stats", "Coding Statistics") }}
        </h2>
      </div>
    </a>
    <UCard class="w-full">
      <template v-if="isLoading">
        <div class="flex justify-center items-center py-8">
          <UIcon name="i-tabler-loader-2" class="animate-spin text-4xl" />
        </div>
      </template>
      <template v-else-if="hasError">
        <div class="flex flex-col items-center justify-center py-8 gap-4">
          <UIcon name="i-tabler-alert-circle" class="text-4xl text-red-500" />
          <p class="text-center text-neutral-600 dark:text-neutral-400">
            {{ errorMessage }}
          </p>
          <UButton @click="fetchWakaTimeStats" variant="soft">
            {{ $t("try_again", "Try Again") }}
          </UButton>
        </div>
      </template>
      <template v-else-if="stats">
        <div class="flex flex-col gap-6">
          <div class="grid gap-4">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                class="flex flex-col items-center p-3 sm:p-4 bg-neutral-100 dark:bg-primary-900 rounded-lg"
              >
                <IconClock class="text-2xl sm:text-3xl mb-2 text-primary-500" />
                <span
                  class="text-xs sm:text-sm text-center text-neutral-600 dark:text-neutral-400"
                  >{{ $t("total_coding_time", "Last 30 Days") }}</span
                >
                <span class="text-base sm:text-lg font-bold">{{
                  stats.data.human_readable_total
                }}</span>
              </div>
              <div
                class="flex flex-col items-center p-3 sm:p-4 bg-neutral-100 dark:bg-primary-900 rounded-lg"
              >
                <IconCode class="text-2xl sm:text-3xl mb-2 text-primary-500" />
                <span
                  class="text-xs sm:text-sm text-center text-neutral-600 dark:text-neutral-400"
                  >{{ $t("daily_average", "Daily Average") }}</span
                >
                <span class="text-base sm:text-lg font-bold">{{
                  stats.data.human_readable_daily_average
                }}</span>
              </div>
              <div
                class="col-span-2 md:col-span-1 flex flex-col items-center p-3 sm:p-4 bg-neutral-100 dark:bg-primary-900 rounded-lg"
              >
                <IconBrandGithub
                  class="text-2xl sm:text-3xl mb-2 text-primary-500"
                />
                <span
                  class="text-xs sm:text-sm text-center text-neutral-600 dark:text-neutral-400"
                  >{{ $t("active_days", "Active Days") }}</span
                >
                <span class="text-base sm:text-lg font-bold"
                  >{{ stats.data.days_including_holidays }}
                  {{ $t("days", "days") }}</span
                >
              </div>
            </div>
            <div
              class="md:w-1/3 md:mx-auto flex flex-col items-center p-3 sm:p-4 bg-neutral-100 dark:bg-primary-900 rounded-lg"
            >
              <IconCalendarStats
                class="text-2xl sm:text-3xl mb-2 text-primary-500"
              />
              <span
                class="text-xs sm:text-sm text-center text-neutral-600 dark:text-neutral-400"
                >{{ $t("best_day", "Best Day") }}</span
              >
              <span class="text-base sm:text-lg font-bold whitespace-nowrap">{{
                formattedBestDay
              }}</span>
              <span
                class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400"
                >({{ stats.data.best_day.text }})</span
              >
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg font-semibold">
              {{ $t("languages", "Languages") }}
            </h3>
            <div class="flex flex-col gap-2">
              <template
                v-for="(language, index) in stats.data.languages.slice(0, 5)"
                :key="index"
              >
                <div class="flex flex-col gap-1">
                  <div class="flex justify-between text-xs sm:text-sm">
                    <span class="truncate max-w-[50%]">{{
                      language.name
                    }}</span>
                    <span class="whitespace-nowrap"
                      >{{ language.percent.toFixed(1) }}% ({{
                        formatTime(language.total_seconds)
                      }})</span
                    >
                  </div>
                  <div
                    class="w-full bg-neutral-200 dark:bg-primary-800 rounded-full h-2.5"
                  >
                    <div
                      class="h-2.5 rounded-full"
                      :class="getLanguageColor(language.name)"
                      :style="`width: ${language.percent}%`"
                    ></div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="text-center text-xs text-neutral-500 mt-2">
            {{ $t("last_updated", "Last updated") }}:
            {{ new Date().toLocaleDateString() }}
          </div>
        </div>
      </template>
    </UCard>
  </section>
</template>
