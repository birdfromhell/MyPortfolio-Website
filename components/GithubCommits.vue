<script setup lang="ts">
import { IconLink, IconBrandGithub, IconCalendar } from "@tabler/icons-vue";
interface ContributionDay {
  date: string;
  count: number;
  level: number;
}
interface ContributionWeek {
  firstDay: string;
  days: ContributionDay[];
}
interface GithubContributions {
  weeks: ContributionWeek[];
  total: number;
  startDate: string;
  endDate: string;
}
const contributions = ref<GithubContributions | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const username = ref("birdfromhell");
const isMobile = ref(false);
onMounted(() => {
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
  fetchContributions();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIfMobile);
});
function checkIfMobile() {
  isMobile.value = window.innerWidth < 640;
}
const activityColors = {
  0: "bg-neutral-100 dark:bg-neutral-800",
  1: "bg-primary-200 dark:bg-primary-900",
  2: "bg-primary-300 dark:bg-primary-700",
  3: "bg-primary-400 dark:bg-primary-600",
  4: "bg-primary-500 dark:bg-primary-500",
};
const fetchContributions = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await fetch(
      `/api/github-contributions?username=${username.value}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch GitHub data");
    }
    const data = await response.json();
    contributions.value = data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unknown error";
    console.error("Error fetching GitHub contributions:", err);
  } finally {
    isLoading.value = false;
  }
};
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const filteredMonthLabels = computed(() => {
  if (isMobile.value && monthLabels.value.length > 0) {
    return monthLabels.value.filter((_, index) => index % 3 === 0);
  }
  return monthLabels.value;
});
const monthLabels = computed(() => {
  if (!contributions.value) return [];
  const startDate = new Date(contributions.value.startDate);
  const endDate = new Date(contributions.value.endDate);
  const months: { name: string; position: number }[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const monthIndex = currentDate.getMonth();
    const position = Math.floor(
      ((currentDate.getTime() - startDate.getTime()) /
        (endDate.getTime() - startDate.getTime())) *
        53
    );
    if (!months.find((m) => m.name === monthNames[monthIndex])) {
      months.push({
        name: monthNames[monthIndex],
        position,
      });
    }
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
  }
  return months;
});
const showCompressedView = computed(() => isMobile.value);
const visibleWeeks = computed(() => {
  if (!contributions.value) return [];
  if (showCompressedView.value) {
    const weeks = [...contributions.value.weeks];
    return weeks.slice(-26);
  }
  return contributions.value.weeks;
});
const { t } = useI18n();
</script>
<template>
  <section class="flex flex-col gap-3">
    <a href="#github-activity">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2
          class="text-xl font-bold hover:cursor-pointer flex items-center gap-2"
        >
          <IconBrandGithub class="w-5 h-5 text-primary-500" />
          {{ $t("github_activity", "GitHub Activity") }}
        </h2>
      </div>
    </a>
    <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
      {{ $t("github_activity_desc", "My coding activity over the past year") }}
      <span v-if="showCompressedView" class="text-xs text-neutral-500">
        ({{ $t("showing_recent", "showing recent 6 months") }})
      </span>
    </p>
    <div v-if="isLoading" class="flex justify-center py-8">
      <UIcon
        name="i-tabler-loader-2"
        class="text-3xl animate-spin text-primary-500"
      />
    </div>
    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="contributions" class="contribution-graph">
      <div class="flex flex-col">
        <div class="flex text-xs text-neutral-500 mb-1">
          <div class="w-4"></div>
          <div class="flex-1 flex relative">
            <template
              v-for="(month, index) in filteredMonthLabels"
              :key="index"
            >
              <div
                class="absolute text-center"
                :style="{
                  left: showCompressedView
                    ? `${
                        ((month.position - (contributions.weeks.length - 26)) /
                          26) *
                        100
                      }%`
                    : `${(month.position / 53) * 100}%`,
                  width: '30px',
                  marginLeft: '-15px',
                  display:
                    showCompressedView &&
                    month.position < contributions.weeks.length - 26
                      ? 'none'
                      : 'block',
                }"
              >
                {{ month.name }}
              </div>
            </template>
          </div>
        </div>
        <div class="flex">
          <div
            class="flex flex-col mr-1 text-xs text-neutral-500 justify-around h-[7rem]"
          >
            <div>{{ isMobile ? "M" : "Mon" }}</div>
            <div>{{ isMobile ? "W" : "Wed" }}</div>
            <div>{{ isMobile ? "F" : "Fri" }}</div>
          </div>
          <div
            :class="[
              'flex-1 grid gap-x-1 gap-y-1',
              showCompressedView ? 'grid-cols-26' : 'grid-cols-53',
            ]"
          >
            <template v-for="week in visibleWeeks" :key="week.firstDay">
              <div class="grid grid-rows-7 gap-1">
                <template v-for="(day, index) in week.days" :key="day.date">
                  <div
                    class="contribution-cell h-2 w-2 sm:h-3 sm:w-3 rounded-sm"
                    :class="activityColors[day.level as keyof typeof activityColors]"
                    :title="`${day.date}: ${day.count} contributions`"
                  ></div>
                </template>
              </div>
            </template>
          </div>
        </div>
        <div
          class="flex justify-end items-center mt-2 text-xs text-neutral-500"
        >
          <span class="mr-2">{{ $t("less_activity", "Less") }}</span>
          <div class="flex gap-1">
            <div
              v-for="level in 5"
              :key="level - 1"
              class="h-3 w-3 rounded-sm"
              :class="activityColors[(level-1) as keyof typeof activityColors]"
            ></div>
          </div>
          <span class="ml-2">{{ $t("more_activity", "More") }}</span>
        </div>
        <div class="mt-4 text-sm flex flex-wrap items-center justify-between">
          <div class="flex items-center mb-2 sm:mb-0">
            <IconCalendar class="w-4 h-4 mr-1 text-primary-500" />
            <span class="text-neutral-600 dark:text-neutral-400"
              >{{ contributions.total }}
              {{ $t("contributions", "contributions") }}</span
            >
          </div>
          <UButton
            size="sm"
            variant="soft"
            color="primary"
            :to="`https://github.com/${username}`"
            target="_blank"
          >
            {{ $t("view_on_github", "View on GitHub") }}
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.grid-cols-53 {
  grid-template-columns: repeat(53, minmax(0, 1fr));
}
.grid-cols-26 {
  grid-template-columns: repeat(26, minmax(0, 1fr));
}
.contribution-graph {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: theme("colors.primary.500") transparent;
}
.contribution-graph::-webkit-scrollbar {
  height: 6px;
}
.contribution-graph::-webkit-scrollbar-track {
  background: transparent;
}
.contribution-graph::-webkit-scrollbar-thumb {
  background-color: theme("colors.primary.500");
  border-radius: 3px;
}
.contribution-cell {
  transition: transform 0.2s ease;
}
.contribution-cell:hover {
  transform: scale(1.2);
}
@media (max-width: 640px) {
  .contribution-graph {
    margin: 0 -1rem;
    padding: 0 1rem;
  }
}
</style>
