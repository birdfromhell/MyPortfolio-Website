<script setup lang="ts">
import { 
  IconLink, 
  IconBrandGithub, 
  IconCalendar, 
  IconArrowNarrowRight, 
  IconFlame, 
  IconChartBar, 
  IconHistory 
} from "@tabler/icons-vue";

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
const hoverDay = ref<ContributionDay | null>(null);
const showTooltip = ref(false);
const tooltipPos = ref({ x: 0, y: 0 });
const highlightToday = ref(false);
const todayCell = ref<HTMLElement | null>(null);
const viewMode = ref<'year' | 'halfYear' | 'quarter'>('halfYear');
onMounted(() => {
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
  fetchContributions();
  
  // Highlight today's contributions with a subtle pulse effect
  setTimeout(() => {
    highlightToday.value = true;
  }, 1000);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIfMobile);
});

function checkIfMobile() {
  isMobile.value = window.innerWidth < 640;
  
  // Default to halfYear view on mobile
  if (isMobile.value && viewMode.value === 'year') {
    viewMode.value = 'halfYear';
  }
}

const activityColors = {
  0: "bg-neutral-100 dark:bg-neutral-800",
  1: "bg-emerald-200 dark:bg-emerald-900",
  2: "bg-emerald-300 dark:bg-emerald-700",
  3: "bg-emerald-400 dark:bg-emerald-600",
  4: "bg-emerald-500 dark:bg-emerald-500",
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
    
    // Calculate stats after data loads
    calculateStreak();
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

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekdayNamesShort = ["S", "M", "T", "W", "T", "F", "S"];

const visibleMonthLabels = computed(() => {
  const labels = monthLabels.value;
  if (isMobile.value) {
    // Show fewer month labels on mobile
    return labels.filter((_, index) => index % 2 === 0);
  }
  return labels;
});

const monthLabels = computed(() => {
  if (!contributions.value) return [];
  
  const weeks = visibleWeeks.value;
  if (weeks.length === 0) return [];
  
  const startDate = new Date(weeks[0].firstDay);
  const endDate = new Date(weeks[weeks.length - 1].firstDay);
  endDate.setDate(endDate.getDate() + 6); // Last day of the last week
  
  const months: { name: string; position: number }[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const monthIndex = currentDate.getMonth();
    const totalDays = (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000);
    const daysPassed = (currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000);
    const position = (daysPassed / totalDays) * weeks.length;
    
    if (!months.find((m) => m.name === monthNames[monthIndex])) {
      months.push({
        name: monthNames[monthIndex],
        position,
      });
    }
    
    // Move to first day of next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
  }
  
  return months;
});

const visibleWeeks = computed(() => {
  if (!contributions.value) return [];
  
  const allWeeks = [...contributions.value.weeks];
  
  switch (viewMode.value) {
    case 'halfYear':
      return allWeeks.slice(-26);
    case 'quarter':
      return allWeeks.slice(-13);
    case 'year':
    default:
      return allWeeks;
  }
});

// Current streak statistics
const streak = ref({
  current: 0,
  longest: 0,
  today: false
});

function calculateStreak() {
  if (!contributions.value) return;
  
  let currentStreak = 0;
  let longestStreak = 0;
  let todayHasContribution = false;
  
  // Process all days to find streaks
  const allDays: ContributionDay[] = [];
  contributions.value.weeks.forEach(week => {
    week.days.forEach(day => {
      allDays.push(day);
    });
  });
  
  // Sort by date (most recent first)
  allDays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Check if today has contributions
  const today = new Date().toISOString().split('T')[0];
  if (allDays.length > 0 && allDays[0].date === today && allDays[0].count > 0) {
    todayHasContribution = true;
  }
  
  // Calculate current streak
  for (let i = 0; i < allDays.length; i++) {
    if (allDays[i].count > 0) {
      currentStreak++;
      
      // Update longest streak
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      // Break at first day without contributions
      break;
    }
  }
  
  streak.value = {
    current: currentStreak,
    longest: longestStreak,
    today: todayHasContribution
  };
}

// Format date to readable format (e.g., "Monday, January 1, 2023")
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Handle cell hover
function handleCellHover(day: ContributionDay, event: MouseEvent) {
  hoverDay.value = day;
  showTooltip.value = true;
  
  // Position tooltip
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  tooltipPos.value = {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY - 5
  };
}

// Handle cell mouse leave
function handleCellLeave() {
  showTooltip.value = false;
}

// Get today's date in YYYY-MM-DD format
const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

// Compute most active day of the week
const mostActiveDay = computed(() => {
  if (!contributions.value) return { day: '', count: 0 };
  
  const dayCount = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  
  contributions.value.weeks.forEach(week => {
    week.days.forEach((day, index) => {
      dayCount[index] += day.count;
    });
  });
  
  let maxIndex = 0;
  let maxCount = 0;
  
  dayCount.forEach((count, index) => {
    if (count > maxCount) {
      maxCount = count;
      maxIndex = index;
    }
  });
  
  return {
    day: weekdayNames[maxIndex],
    count: maxCount
  };
});

// Track whether to autoscroll
const shouldAutoScroll = ref(false);

// Scroll the graph on component mounted
onMounted(() => {
  nextTick(() => {
    if (shouldAutoScroll.value && isMobile.value) {
      const container = document.querySelector('.contribution-graph');
      if (container) {
        container.scrollLeft = container.scrollWidth;
      }
    }
  });
});

const { t } = useI18n();
</script>

<template>
  <UCard 
    class="p-0 overflow-hidden" 
    :ui="{ 
      base: 'transition-all duration-300', 
      body: { padding: 'p-0' },
      ring: '',
      divide: '',
    }"
  >
    <div class="px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-800">
      <div class="flex flex-row justify-between items-center mb-2">
        <a href="#github-activity" class="flex items-center gap-2 group">
          <IconBrandGithub class="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
          <h2 class="text-lg font-bold group-hover:text-primary-500 transition-colors duration-200">
            {{ $t("github_activity", "GitHub Activity") }}
          </h2>
        </a>
        
        <UButton
          size="xs"
          variant="soft"
          color="gray"
          :to="`https://github.com/${username}`"
          target="_blank"
          class="flex items-center gap-1"
        >
          @{{ username }}
          <IconArrowNarrowRight class="w-3 h-3" />
        </UButton>
      </div>
      
      <div class="flex justify-between items-center flex-wrap gap-2">
        <!-- View toggle buttons -->
        <div class="flex items-center gap-1">
          <UButtonGroup size="xs">
            <UButton 
              :variant="viewMode === 'quarter' ? 'solid' : 'outline'" 
              @click="viewMode = 'quarter'"
              :disabled="isLoading"
            >
              3 {{ $t("months", "months") }}
            </UButton>
            <UButton 
              :variant="viewMode === 'halfYear' ? 'solid' : 'outline'" 
              @click="viewMode = 'halfYear'"
              :disabled="isLoading"
            >
              6 {{ $t("months", "months") }}
            </UButton>
            <UButton 
              :variant="viewMode === 'year' ? 'solid' : 'outline'" 
              @click="viewMode = 'year'"
              class="hidden sm:inline-flex"
              :disabled="isLoading"
            >
              {{ $t("year", "Year") }}
            </UButton>
          </UButtonGroup>
        </div>
        
        <!-- Stats pills -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5 text-xs">
            <IconCalendar class="w-3 h-3 text-emerald-500" />
            <span>{{ contributions?.total || 0 }} {{ $t("contributions", "contributions") }}</span>
          </div>
          
          <div v-if="streak.current > 0" class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5 text-xs">
            <IconFlame class="w-3 h-3 text-orange-500" />
            <span>{{ streak.current }} {{ $t("day_streak", "day streak") }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="p-4">
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="github-spinner">
          <div class="spinner-icon"></div>
          <p class="mt-3 text-sm text-gray-500">{{ $t("loading_data", "Loading GitHub data...") }}</p>
        </div>
      </div>
      
      <div v-else-if="error" class="text-center py-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-3">
          <UIcon name="i-tabler-alert-circle" class="text-xl text-red-500" />
        </div>
        <p class="text-red-500">{{ error }}</p>
        <UButton 
          class="mt-4" 
          size="sm" 
          variant="outline" 
          @click="fetchContributions" 
          icon="i-tabler-refresh"
        >
          {{ $t("try_again", "Try Again") }}
        </UButton>
      </div>
      
      <div v-else-if="contributions" class="contribution-graph">
        <div class="flex flex-col">
          <div class="flex text-xs text-neutral-500 mb-1">
            <div class="w-4"></div>
            <div class="flex-1 flex relative">
              <template
                v-for="(month, index) in visibleMonthLabels"
                :key="index"
              >
                <div
                  class="absolute text-center font-medium"
                  :style="{
                    left: `${(month.position / visibleWeeks.length) * 100}%`,
                    width: '30px',
                    marginLeft: '-15px'
                  }"
                >
                  {{ month.name }}
                </div>
              </template>
            </div>
          </div>
          
          <div class="flex contributions-container">
            <div
              class="flex flex-col mr-1 text-2xs sm:text-xs text-neutral-500 justify-around h-[7rem]"
            >
              <div>{{ isMobile ? weekdayNamesShort[1] : weekdayNames[1] }}</div>
              <div>{{ isMobile ? weekdayNamesShort[3] : weekdayNames[3] }}</div>
              <div>{{ isMobile ? weekdayNamesShort[5] : weekdayNames[5] }}</div>
            </div>
            
            <div class="flex-1 grid gap-x-1 gap-y-1" :class="`grid-cols-${visibleWeeks.length}`">
              <template v-for="(week, weekIndex) in visibleWeeks" :key="week.firstDay">
                <div class="grid grid-rows-7 gap-1">
                  <template v-for="(day, dayIndex) in week.days" :key="day.date">
                    <div
                      :ref="day.date === todayDate ? (el) => { todayCell = el as HTMLElement } : undefined"
                      class="contribution-cell h-2 w-2 sm:h-3 sm:w-3 rounded-sm"
                      :class="[
                        activityColors[day.level as keyof typeof activityColors],
                        { 
                          'contribution-cell-today': day.date === todayDate,
                          'contribution-cell-pulse': day.date === todayDate && highlightToday && day.count > 0
                        }
                      ]"
                      @mouseenter="handleCellHover(day, $event)"
                      @mouseleave="handleCellLeave"
                    ></div>
                  </template>
                </div>
              </template>
            </div>
          </div>
          
          <!-- Legend -->
          <div class="flex justify-end items-center mt-2 text-xs text-neutral-500">
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
          
          <!-- Tooltip -->
          <div
            v-if="showTooltip && hoverDay"
            class="contribution-tooltip"
            :style="{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 70}px`
            }"
          >
            <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 min-w-[200px] z-50">
              <div class="font-medium mb-1 text-sm">{{ formatDate(hoverDay.date) }}</div>
              <div class="text-xs">
                <span class="font-semibold">{{ hoverDay.count }}</span>
                {{ hoverDay.count === 1 ? $t("contribution", "contribution") : $t("contributions", "contributions") }}
              </div>
            </div>
          </div>
          
          <!-- Statistics section -->
          <div class="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h3 class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">{{ $t("activity_insights", "Activity Insights") }}</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- Current Streak -->
              <div class="activity-stat">
                <div class="activity-stat-icon bg-orange-50 dark:bg-orange-900/20">
                  <IconFlame class="w-4 h-4 text-orange-500" />
                </div>
                <div class="activity-stat-content">
                  <div class="activity-stat-label">{{ $t("current_streak", "Current Streak") }}</div>
                  <div class="activity-stat-value">
                    {{ streak.current }}
                    <span class="activity-stat-unit">{{ $t("days", "days") }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Longest Streak -->
              <div class="activity-stat">
                <div class="activity-stat-icon bg-blue-50 dark:bg-blue-900/20">
                  <IconHistory class="w-4 h-4 text-blue-500" />
                </div>
                <div class="activity-stat-content">
                  <div class="activity-stat-label">{{ $t("longest_streak", "Longest Streak") }}</div>
                  <div class="activity-stat-value">
                    {{ streak.longest }}
                    <span class="activity-stat-unit">{{ $t("days", "days") }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Most Active Day -->
              <div class="activity-stat">
                <div class="activity-stat-icon bg-emerald-50 dark:bg-emerald-900/20">
                  <IconChartBar class="w-4 h-4 text-emerald-500" />
                </div>
                <div class="activity-stat-content">
                  <div class="activity-stat-label">{{ $t("most_active", "Most Active Day") }}</div>
                  <div class="activity-stat-value">
                    {{ mostActiveDay.day }}
                    <span class="activity-stat-unit">{{ mostActiveDay.count }} {{ $t("commits", "commits") }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<style scoped>
/* Dynanic grid columns */
.grid-cols-53 {
  grid-template-columns: repeat(53, minmax(0, 1fr));
}
.grid-cols-26 {
  grid-template-columns: repeat(26, minmax(0, 1fr));
}
.grid-cols-13 {
  grid-template-columns: repeat(13, minmax(0, 1fr));
}

/* Contribution graph container */
.contribution-graph {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--color-primary-500), 0.5) transparent;
  padding-bottom: 5px;
}

.contribution-graph::-webkit-scrollbar {
  height: 6px;
}

.contribution-graph::-webkit-scrollbar-track {
  background: transparent;
}

.contribution-graph::-webkit-scrollbar-thumb {
  background-color: rgba(var(--color-primary-500), 0.5);
  border-radius: 3px;
}

/* Contribution cells */
.contribution-cell {
  transition: all 0.2s ease;
}

.contribution-cell:hover {
  transform: scale(1.25);
  box-shadow: 0 0 0 1px rgba(var(--color-primary-500), 0.5);
}

.contribution-cell-today {
  box-shadow: 0 0 0 1px white;
}

.contribution-cell-pulse {
  animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}

/* Tooltip for contributions */
.contribution-tooltip {
  position: fixed;
  z-index: 100;
  pointer-events: none;
  transition: opacity 0.2s ease;
  transform: translateX(-50%);
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
}

.contribution-tooltip::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px 8px 0;
  border-style: solid;
  border-color: theme('colors.white') transparent transparent transparent;
}

.dark .contribution-tooltip::after {
  border-color: theme('colors.gray.800') transparent transparent transparent;
}

/* Loading spinner */
.github-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner-icon {
  width: 30px;
  height: 30px;
  border: 3px solid transparent;
  border-top-color: rgb(var(--color-emerald-500));
  border-radius: 50%;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--color-emerald-500), 0.7);
  }
  70% {
    box-shadow: 0 0 0 4px rgba(var(--color-emerald-500), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--color-emerald-500), 0);
  }
}

/* Activity stats section */
.activity-stat {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: rgba(var(--color-gray-100), 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dark .activity-stat {
  background-color: rgba(var(--color-gray-800), 0.5);
}

.activity-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.activity-stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  margin-right: 0.75rem;
}

.activity-stat-content {
  flex: 1;
}

.activity-stat-label {
  font-size: 0.75rem;
  color: rgba(var(--color-gray-500), 1);
  margin-bottom: 0.125rem;
}

.activity-stat-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.activity-stat-unit {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.7;
  margin-left: 0.25rem;
}

/* Font size for super small screens */
.text-2xs {
  font-size: 0.625rem;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .contribution-graph {
    margin: 0 -1rem;
    padding: 0 1rem;
  }
  
  .contributions-container {
    padding-bottom: 0.5rem;
  }
}
</style>