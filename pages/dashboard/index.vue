<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

// Explicitly import useAuth
import useAuth from "~/composables/auth/useAuth";
import type { DashboardStats, Course, Topic } from "~/types/learning";

const auth = useAuth();
const { user } = auth;

// State
const dashboardStats = ref<DashboardStats | null>(null);
const currentCourses = ref<Course[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Fetch dashboard stats
const fetchDashboardStats = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const result = await $fetch<DashboardStats>("/api/learning/stats");
    dashboardStats.value = result;
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    error.value = "Failed to load learning statistics";
  } finally {
    isLoading.value = false;
  }
};

// Fetch in-progress courses
const fetchCurrentCourses = async () => {
  try {
    // Fetch courses that are in progress
    const result = await $fetch<Course[]>("/api/learning/courses/all", {
      params: { status: "in_progress" },
    });
    currentCourses.value = result.slice(0, 3); // Get top 3 courses
  } catch (err) {
    console.error("Error fetching courses:", err);
  }
};

// Initialize auth and fetch data
onMounted(() => {
  auth.initAuth();
  Promise.all([fetchDashboardStats(), fetchCurrentCourses()]);
});

// Dynamic stats based on API data
const stats = computed(() => {
  if (!dashboardStats.value) return [];

  return [
    {
      label: "Courses",
      value: dashboardStats.value.courses.total.toString(),
      icon: "i-tabler-book",
      color: "blue",
      change: `${dashboardStats.value.courses.inProgress} in progress`,
    },
    {
      label: "Topics",
      value: `${dashboardStats.value.topics.done}/${dashboardStats.value.topics.total}`,
      icon: "i-tabler-check",
      color: "green",
      change: `${dashboardStats.value.overallProgress}% completed`,
    },
    {
      label: "Categories",
      value: dashboardStats.value.categoriesCount.toString(),
      icon: "i-tabler-category",
      color: "purple",
      change: `${dashboardStats.value.categoryProgress.length} with content`,
    },
    {
      label: "Completed",
      value: dashboardStats.value.courses.completed.toString(),
      icon: "i-tabler-certificate",
      color: "amber",
      change: "courses finished",
    },
  ];
});

// Format date helpers
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
};

// Calculate upcoming schedule from recent topics
const schedule = computed(() => {
  if (!dashboardStats.value || !dashboardStats.value.recentActivity) return [];

  // Transform recent activity topics into schedule items
  return dashboardStats.value.recentActivity
    .filter((topic) => topic.status !== "done")
    .map((topic, index) => {
      // Simulate upcoming dates (today/tomorrow) for display purposes
      const isToday = index < 2;
      return {
        id: topic.id,
        title: topic.title,
        type: topic.course_title
          ? `${topic.course_title} Topic`
          : `${topic.category_name} Topic`,
        date: isToday ? "Today" : "Tomorrow",
        time: isToday
          ? index === 0
            ? "14:00"
            : "16:00"
          : index === 2
          ? "10:00"
          : "14:00",
        duration: "1h",
        completed: topic.status === "done",
      };
    });
});
</script>

<template>
  <div>
    <UContainer>
      <!-- Welcome header -->
      <div class="pb-6">
        <h1 class="text-2xl font-bold">
          Welcome back, {{ user?.name || "Student" }}!
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Here's an overview of your learning progress.
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <UButton loading variant="ghost">Loading dashboard data</UButton>
      </div>

      <!-- Error state -->
      <UAlert
        v-else-if="error"
        icon="i-tabler-alert-triangle"
        color="red"
        variant="soft"
        title="Error loading data"
        :description="error"
        class="mb-6"
      />

      <!-- Stats cards -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <UCard
          v-for="(stat, index) in stats"
          :key="index"
          class="border-0 shadow-sm"
        >
          <div class="flex items-center">
            <div
              :class="[
                'p-3 rounded-lg mr-4',
                `bg-${stat.color}-100 dark:bg-${stat.color}-900/20`,
              ]"
            >
              <i :class="[stat.icon, 'w-6 h-6', `text-${stat.color}-500`]"></i>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                {{ stat.label }}
              </p>
              <h3 class="text-2xl font-semibold">{{ stat.value }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ stat.change }}
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Main content grid -->
      <div
        v-if="!isLoading && !error"
        class="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <!-- Left column: Current courses -->
        <div class="lg:col-span-2">
          <div class="mb-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium">Current Courses</h2>
              <UButton
                size="xs"
                to="/dashboard/courses"
                color="gray"
                variant="ghost"
                trailing-icon="i-tabler-chevron-right"
              >
                View all
              </UButton>
            </div>
          </div>

          <!-- Course cards -->
          <div v-if="currentCourses.length" class="space-y-4">
            <UCard
              v-for="course in currentCourses"
              :key="course.id"
              class="border-0 shadow-sm"
            >
              <div
                class="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                <!-- Default course image -->
                <div
                  class="w-full sm:w-24 h-16 sm:h-16 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                >
                  <i class="i-tabler-book-2 w-8 h-8 text-blue-500"></i>
                </div>

                <!-- Course info -->
                <div class="flex-1">
                  <h3 class="text-base font-medium">{{ course.title }}</h3>
                  <p
                    v-if="course.author"
                    class="text-sm text-gray-500 dark:text-gray-400"
                  >
                    Instructor: {{ course.author }}
                  </p>
                  <p
                    v-else-if="course.platform"
                    class="text-sm text-gray-500 dark:text-gray-400"
                  >
                    Platform: {{ course.platform }}
                  </p>
                  <div class="mt-2">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs text-gray-600 dark:text-gray-400">
                        Progress: {{ course.progress }}%
                      </span>
                      <span
                        v-if="course.end_date"
                        class="text-xs text-gray-600 dark:text-gray-400"
                      >
                        Est. completion: {{ formatDate(course.end_date) }}
                      </span>
                    </div>
                    <UProgress
                      :value="course.progress"
                      color="primary"
                      size="sm"
                    />
                  </div>
                </div>

                <!-- Continue button -->
                <UButton
                  size="sm"
                  color="primary"
                  variant="soft"
                  class="sm:self-center mt-2 sm:mt-0"
                  :to="course.url"
                  target="_blank"
                  v-if="course.url"
                >
                  Continue
                </UButton>
                <UButton
                  v-else
                  size="sm"
                  color="primary"
                  variant="soft"
                  class="sm:self-center mt-2 sm:mt-0"
                  to="/dashboard/courses"
                >
                  View
                </UButton>
              </div>
            </UCard>
          </div>

          <!-- Empty state for courses -->
          <UCard v-else class="border-0 shadow-sm">
            <div class="p-4 text-center">
              <i
                class="i-tabler-books block mx-auto text-4xl text-gray-400 mb-2"
              ></i>
              <h3 class="font-medium mb-2">No courses in progress</h3>
              <p class="text-sm text-gray-500 mb-4">
                Start learning by adding a new course
              </p>
              <UButton to="/dashboard/courses" color="primary" size="sm">
                Browse Courses
              </UButton>
            </div>
          </UCard>
        </div>

        <!-- Right column: Schedule -->
        <div>
          <div class="mb-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium">
                {{
                  dashboardStats?.recentActivity?.length
                    ? "Recent Activity"
                    : "Today's Schedule"
                }}
              </h2>
            </div>
          </div>

          <!-- Schedule list -->
          <UCard class="border-0 shadow-sm">
            <div v-if="schedule.length" class="space-y-4">
              <div
                v-for="item in schedule"
                :key="item.id"
                class="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <!-- Time -->
                <div class="mr-4 text-center">
                  <p class="text-sm font-medium">{{ item.time }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ item.date }}
                  </p>
                </div>

                <!-- Details -->
                <div class="flex-1">
                  <h4 class="text-sm font-medium">{{ item.title }}</h4>
                  <div class="flex items-center mt-1">
                    <span
                      class="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {{ item.type }}
                    </span>
                    <span
                      class="ml-2 text-xs text-gray-500 dark:text-gray-400"
                      >{{ item.duration }}</span
                    >
                  </div>
                </div>

                <!-- Action button -->
                <UButton
                  icon="i-tabler-play"
                  color="primary"
                  variant="soft"
                  size="xs"
                />
              </div>
            </div>

            <!-- Empty state for schedule -->
            <div v-else class="text-center p-4">
              <i
                class="i-tabler-calendar-event block mx-auto text-4xl text-gray-400 mb-2"
              ></i>
              <h3 class="font-medium mb-2">No upcoming items</h3>
              <p class="text-sm text-gray-500 mb-4">
                Add topics to see them here
              </p>
            </div>

            <!-- Add study session button -->
            <div
              class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
            >
              <UButton
                block
                color="gray"
                variant="soft"
                icon="i-tabler-plus"
                to="/dashboard/courses"
              >
                Add New Topic
              </UButton>
            </div>
          </UCard>

          <!-- Categories progress -->
          <div class="mt-6">
            <h2 class="text-lg font-medium mb-4">Categories Progress</h2>
            <UCard class="border-0 shadow-sm">
              <div
                v-if="dashboardStats?.categoryProgress?.length"
                class="space-y-4"
              >
                <div
                  v-for="category in dashboardStats.categoryProgress"
                  :key="category.id"
                  class="mb-4"
                >
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium">{{ category.name }}</span>
                    <span class="text-xs text-gray-500">
                      {{ category.completedTopics }}/{{
                        category.totalTopics
                      }}
                      ({{ category.progress }}%)
                    </span>
                  </div>
                  <UProgress
                    :value="category.progress"
                    :color="(['primary', 'green', 'red', 'orange', 'amber', 'yellow', 'lime', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'].includes(category.color) ? category.color : 'primary') as any"
                    size="sm"
                  />
                </div>
              </div>

              <!-- Empty state for categories -->
              <div v-else class="text-center p-4">
                <i
                  class="i-tabler-category block mx-auto text-4xl text-gray-400 mb-2"
                ></i>
                <p class="text-sm text-gray-500">
                  No categories with topics yet
                </p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
