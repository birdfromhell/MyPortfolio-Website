<script setup lang="ts">
import {
  IconLink,
  IconCode,
  IconClock,
  IconBrandGithub,
  IconCalendarStats,
  IconTrendingUp,
  IconCalendarTime,
  IconChartBar,
} from "@tabler/icons-vue";
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
const hoveredLanguage = ref<string | null>(null);
const refreshing = ref(false);
const formattedBestDay = computed(() => {
  if (
    !stats.value ||
    !stats.value.data.best_day ||
    !stats.value.data.best_day.date
  ) {
    return "N/A";
  }
  try {
    const date = new Date(stats.value.data.best_day.date);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error formatting best day date:", e);
    return "N/A";
  }
});
const formatTime = (seconds: number) => {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
    return "0h 0m";
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};
const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    JavaScript: "bg-yellow-500/90 dark:bg-yellow-500/80",
    TypeScript: "bg-blue-600/90 dark:bg-blue-500/80",
    Python: "bg-blue-500/90 dark:bg-blue-400/80",
    PHP: "bg-purple-500/90 dark:bg-purple-400/80",
    Vue: "bg-green-500/90 dark:bg-green-400/80",
    HTML: "bg-orange-600/90 dark:bg-orange-500/80",
    CSS: "bg-blue-400/90 dark:bg-blue-300/80",
    Java: "bg-red-600/90 dark:bg-red-500/80",
    Markdown: "bg-gray-600/90 dark:bg-gray-500/80",
    JSON: "bg-gray-500/90 dark:bg-gray-400/80",
    "C#": "bg-green-600/90 dark:bg-green-500/80",
    "C++": "bg-pink-600/90 dark:bg-pink-500/80",
    Go: "bg-cyan-500/90 dark:bg-cyan-400/80",
    Ruby: "bg-red-500/90 dark:bg-red-400/80",
    Rust: "bg-orange-700/90 dark:bg-orange-600/80",
    Kotlin: "bg-orange-500/90 dark:bg-orange-400/80",
    Swift: "bg-orange-600/90 dark:bg-orange-500/80",
    Dart: "bg-blue-400/90 dark:bg-blue-300/80",
  };
  return colors[language] || "bg-gray-500/90 dark:bg-gray-400/80";
};
const fetchWakaTimeStats = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    const response = await $fetch("/api/wakatime");
    stats.value = response;
    console.log("WakaTime stats loaded:", stats.value);
  } catch (error) {
    console.error("Error fetching WakaTime stats:", error);
    hasError.value = true;
    errorMessage.value =
      "Failed to load coding statistics. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};
const refreshData = async () => {
  if (refreshing.value) return;
  refreshing.value = true;
  await fetchWakaTimeStats();
  setTimeout(() => {
    refreshing.value = false;
  }, 1000);
};
onMounted(() => {
  fetchWakaTimeStats();
});
const { t } = useI18n();
</script>
<template>
  <section class="flex flex-col gap-3">
    <div class="flex justify-between items-center">
      <a href="#coding-stats" class="group relative">
        <div class="flex items-center gap-1">
          <IconLink
            class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
          />
          <h2 class="text-xl font-bold hover:cursor-pointer flex items-center">
            <IconCode class="w-5 h-5 mr-2 text-primary-500" />
            {{ $t("coding_stats", "Coding Statistics") }}
          </h2>
        </div>
      </a>
      <UButton
        size="xs"
        color="gray"
        variant="ghost"
        :loading="refreshing"
        :disabled="isLoading || refreshing"
        @click="refreshData"
        class="opacity-60 hover:opacity-100 transition-opacity"
        :ui="{ loading: { icon: { color: 'text-primary-500' } } }"
      >
        <template #icon>
          <i class="i-tabler-refresh"></i>
        </template>
        <span class="text-xs">{{ $t("refresh", "Refresh") }}</span>
      </UButton>
    </div>
    <UCard
      class="w-full overflow-hidden"
      :ui="{ body: { padding: 'sm:p-5 p-4' } }"
    >
      <template v-if="isLoading">
        <div class="flex flex-col justify-center items-center py-12 gap-4">
          <div class="coding-spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
          </div>
          <p class="text-sm text-neutral-500">
            {{ $t("loading_stats", "Loading your coding stats...") }}
          </p>
        </div>
      </template>
      <template v-else-if="hasError">
        <div
          class="flex flex-col items-center justify-center py-8 gap-4 bg-red-50/50 dark:bg-red-900/20 rounded-lg p-6"
        >
          <div
            class="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30"
          >
            <UIcon name="i-tabler-alert-circle" class="text-3xl text-red-500" />
          </div>
          <p class="text-center text-neutral-600 dark:text-neutral-400">
            {{ errorMessage }}
          </p>
          <UButton @click="fetchWakaTimeStats" variant="soft" color="red">
            <i class="i-tabler-refresh mr-1"></i>
            {{ $t("try_again", "Try Again") }}
          </UButton>
        </div>
      </template>
      <template v-else-if="stats">
        <div class="flex flex-col gap-6">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
            <div class="stat-card">
              <div class="stat-icon">
                <IconClock class="w-5 h-5" />
              </div>
              <div class="stat-content">
                <h3 class="stat-label">
                  {{ $t("total_coding_time", "Last 30 Days") }}
                </h3>
                <p class="stat-value">
                  {{ stats.data.human_readable_total || "0h 0m" }}
                </p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <IconCalendarTime class="w-5 h-5" />
              </div>
              <div class="stat-content">
                <h3 class="stat-label">
                  {{ $t("daily_average", "Daily Average") }}
                </h3>
                <p class="stat-value">
                  {{ stats.data.human_readable_daily_average || "0h 0m" }}
                </p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <IconBrandGithub class="w-5 h-5" />
              </div>
              <div class="stat-content">
                <h3 class="stat-label">
                  {{ $t("active_days", "Active Days") }}
                </h3>
                <p class="stat-value">
                  {{ stats.data.days_including_holidays || 0 }}
                  <span class="text-xs text-neutral-500">/30</span>
                </p>
              </div>
            </div>
          </div>
          <div class="best-day-card">
            <div class="flex items-center gap-3">
              <div class="trophy-badge">
                <IconTrendingUp class="w-5 h-5" />
              </div>
              <div>
                <h3
                  class="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >
                  {{ $t("best_day", "Most Productive Day") }}
                </h3>
                <div class="flex items-center gap-2">
                  <p class="text-lg font-bold">{{ formattedBestDay }}</p>
                  <span
                    v-if="stats.data.best_day && stats.data.best_day.text"
                    class="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-800/50 text-primary-700 dark:text-primary-300 rounded-full"
                  >
                    {{ stats.data.best_day.text }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <div
              class="flex border-b border-neutral-200 dark:border-neutral-800 mb-4"
            >
              <h3
                class="px-4 py-2 text-sm font-medium flex items-center border-b-2 border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-300"
              >
                <IconCode class="w-4 h-4 mr-1" />
                {{ $t("languages", "Languages") }}
              </h3>
            </div>
            <div class="tab-content">
              <div class="flex flex-col gap-3">
                <template
                  v-for="(language, index) in stats.data.languages
                    ? stats.data.languages.slice(0, 5)
                    : []"
                  :key="index"
                >
                  <div
                    class="flex flex-col gap-1.5 language-item"
                    @mouseenter="hoveredLanguage = language.name"
                    @mouseleave="hoveredLanguage = null"
                  >
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-3 h-3 rounded-full"
                          :class="getLanguageColor(language.name)"
                        ></div>
                        <span class="font-medium text-sm">{{
                          language.name
                        }}</span>
                      </div>
                      <span class="text-sm whitespace-nowrap">
                        {{
                          language.text || formatTime(language.total_seconds)
                        }}
                        <span class="text-xs text-neutral-500"
                          >({{
                            typeof language.percent === "number"
                              ? language.percent.toFixed(1)
                              : 0
                          }}%)</span
                        >
                      </span>
                    </div>
                    <div
                      class="w-full bg-neutral-200/50 dark:bg-primary-800/50 rounded-full h-2 overflow-hidden"
                    >
                      <div
                        class="h-full rounded-full transition-all duration-300 ease-out progress-bar-shine"
                        :class="[
                          getLanguageColor(language.name),
                          {
                            'progress-bar-animated':
                              hoveredLanguage === language.name,
                          },
                        ]"
                        :style="`width: ${language.percent || 0}%`"
                      ></div>
                    </div>
                  </div>
                </template>
                <div
                  v-if="
                    !stats.data.languages || stats.data.languages.length === 0
                  "
                  class="text-center py-6 text-neutral-500"
                >
                  {{ $t("no_language_data", "No language data available") }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="text-center text-xs text-neutral-500 mt-2 pt-3 border-t border-neutral-100 dark:border-primary-800"
          >
            {{ $t("data_source", "Data from WakaTime") }} •
            {{ $t("last_updated", "Last updated") }}:
            {{
              new Date().toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            }}
          </div>
        </div>
      </template>
    </UCard>
  </section>
</template>
<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: #fafafa;
  border-radius: 0.5rem;
  border: 1px solid #f3f4f6;
  transition: all 0.3s;
}
.dark .stat-card {
  background-color: rgba(30, 41, 59, 0.3);
  border-color: #1e293b;
}
@media (min-width: 640px) {
  .stat-card {
    padding: 1rem;
  }
}
.stat-card:hover {
  background-color: #f3f4f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
}
.dark .stat-card:hover {
  background-color: rgba(30, 41, 59, 0.4);
}
.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: #f1f5f9;
  color: #2563eb;
}
.dark .stat-icon {
  background-color: rgba(30, 41, 59, 0.7);
  color: #93c5fd;
}
.stat-content {
  flex: 1;
}
.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.125rem;
}
.dark .stat-label {
  color: #9ca3af;
}
.stat-value {
  font-size: 1rem;
  font-weight: bold;
}
.best-day-card {
  padding: 1rem;
  background-color: #fafafa;
  border-radius: 0.5rem;
  border: 1px solid #f3f4f6;
  transition: all 0.3s;
}
.dark .best-day-card {
  background-color: rgba(30, 41, 59, 0.3);
  border-color: #1e293b;
}
.best-day-card:hover {
  background-color: #f3f4f6;
}
.dark .best-day-card:hover {
  background-color: rgba(30, 41, 59, 0.4);
}
.trophy-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background-color: #fef9c3;
  color: #ca8a04;
}
.dark .trophy-badge {
  background-color: rgba(202, 138, 4, 0.3);
  color: #fde68a;
}
.language-item {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}
.language-item:hover {
  background-color: #fafafa;
}
.dark .language-item:hover {
  background-color: rgba(30, 41, 59, 0.2);
}
.progress-bar-shine {
  position: relative;
  overflow: hidden;
}
.progress-bar-shine::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
}
.progress-bar-animated::after {
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  100% {
    left: 100%;
  }
}
.coding-spinner {
  width: 60px;
  height: 60px;
  position: relative;
}
.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgb(var(--color-primary-500) / 1);
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: bounce 2s infinite ease-in-out;
}
.double-bounce2 {
  animation-delay: -1s;
}
@keyframes bounce {
  0%,
  100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
}
</style>
