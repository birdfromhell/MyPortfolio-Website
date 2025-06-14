<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

// Explicitly import useAuth
import useAuth from "~/composables/auth/useAuth";
import type { Course, Category } from "~/types/learning";

const auth = useAuth();
// Initialize auth
onMounted(() => {
  auth.initAuth();
  fetchCategories();
  fetchCourses();
});

// Course categories from database
const categories = ref<Category[]>([]);
const courses = ref<Course[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// UI state
const activeCategory = ref("all");
const searchQuery = ref("");

// Fetch categories from API
const fetchCategories = async () => {
  try {
    // First get all categories
    const result = await $fetch<Category[]>("/api/learning/categories/all");

    // Add the "All Courses" option at the beginning
    categories.value = [
      { id: 0, name: "All Courses", created_at: "", updated_at: "" },
      { id: -1, name: "In Progress", created_at: "", updated_at: "" },
      { id: -2, name: "Completed", created_at: "", updated_at: "" },
      ...result,
    ];
  } catch (err) {
    console.error("Error fetching categories:", err);
    error.value = "Failed to load categories";
  }
};

// Fetch courses from API
const fetchCourses = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const result = await $fetch<Course[]>("/api/learning/courses/all");
    courses.value = result;
  } catch (err) {
    console.error("Error fetching courses:", err);
    error.value = "Failed to load courses";
  } finally {
    isLoading.value = false;
  }
};

// Filter courses based on selected category
const filteredCourses = computed(() => {
  let filtered = [...courses.value];

  if (activeCategory.value === "all" || activeCategory.value === "0") {
    // No filtering needed
  } else if (activeCategory.value === "-1") {
    // In progress courses
    filtered = filtered.filter((course) => course.status === "in_progress");
  } else if (activeCategory.value === "-2") {
    // Completed courses
    filtered = filtered.filter((course) => course.status === "completed");
  } else {
    // Filter by category id
    const categoryId = parseInt(activeCategory.value);
    filtered = filtered.filter((course) => course.category_id === categoryId);
  }

  return filtered;
});

// Search functionality
const searchedCourses = computed(() => {
  if (!searchQuery.value) return filteredCourses.value;

  const query = searchQuery.value.toLowerCase();
  return filteredCourses.value.filter(
    (course) =>
      course.title.toLowerCase().includes(query) ||
      (course.description &&
        course.description.toLowerCase().includes(query)) ||
      (course.author && course.author.toLowerCase().includes(query)) ||
      (course.platform && course.platform.toLowerCase().includes(query))
  );
});

// Format date helpers
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
};

// Status to display text mapping
const statusDisplay = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

// Update course status
const updateCourseStatus = async (courseId: number, newStatus: string) => {
  try {
    await $fetch(`/api/learning/courses/${courseId}`, {
      method: "PUT",
      body: {
        status: newStatus,
        // If completed, set progress to 100, if just started, set to small value
        progress:
          newStatus === "completed"
            ? 100
            : newStatus === "not_started"
            ? 0
            : undefined,
      },
    });

    // Refresh courses after update
    fetchCourses();
  } catch (err) {
    console.error("Error updating course status:", err);
  }
};
</script>

<template>
  <div>
    <UContainer>
      <!-- Page header -->
      <div class="pb-6">
        <h1 class="text-2xl font-bold">Courses</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Browse and manage your learning courses
        </p>
      </div>

      <!-- Search and filters -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <!-- Search input -->
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            placeholder="Search courses..."
            icon="i-tabler-search"
            size="md"
            class="w-full"
          />
        </div>

        <!-- Filter buttons -->
        <div class="flex gap-2 overflow-x-auto pb-2">
          <UButton
            v-for="category in categories"
            :key="category.id"
            size="sm"
            :color="
              activeCategory === category.id.toString() ? 'primary' : 'gray'
            "
            :variant="
              activeCategory === category.id.toString() ? 'solid' : 'soft'
            "
            @click="activeCategory = category.id.toString()"
          >
            {{ category.name }}
          </UButton>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <UButton loading variant="ghost">Loading courses</UButton>
      </div>

      <!-- Error state -->
      <UAlert
        v-else-if="error"
        icon="i-tabler-alert-triangle"
        color="red"
        variant="soft"
        title="Error loading courses"
        :description="error"
        class="mb-6"
      />

      <!-- Add new course button -->
      <div class="mb-6">
        <UButton
          color="primary"
          icon="i-tabler-plus"
          to="/dashboard/courses/new"
        >
          Add New Course
        </UButton>
      </div>

      <!-- Courses grid -->
      <div
        v-if="searchedCourses.length > 0 && !isLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <UCard
          v-for="course in searchedCourses"
          :key="course.id"
          class="border-0 shadow-sm hover:shadow-md transition-shadow"
        >
          <!-- Course image/placeholder -->
          <div class="relative">
            <!-- Default course image placeholder -->
            <div
              class="w-full h-40 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded-t-md"
            >
              <i class="i-tabler-book-2 w-12 h-12 text-blue-500"></i>
            </div>

            <!-- Status badge -->
            <div class="absolute top-3 right-3">
              <span
                class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-700': course.status === 'completed',
                  'bg-blue-100 text-blue-700': course.status === 'in_progress',
                  'bg-gray-100 text-gray-700': course.status === 'not_started',
                }"
              >
                {{ statusDisplay[course.status] }}
              </span>
            </div>
          </div>

          <!-- Course details -->
          <div class="p-4">
            <h3 class="text-lg font-medium">{{ course.title }}</h3>
            <p
              v-if="course.description"
              class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2"
            >
              {{ course.description }}
            </p>

            <!-- Meta info -->
            <div
              class="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-gray-500 dark:text-gray-400"
            >
              <div v-if="course.author" class="flex items-center">
                <i class="i-tabler-user mr-1"></i> {{ course.author }}
              </div>
              <div v-if="course.platform" class="flex items-center">
                <i class="i-tabler-device-laptop mr-1"></i>
                {{ course.platform }}
              </div>
              <div v-if="course.start_date" class="flex items-center">
                <i class="i-tabler-calendar mr-1"></i> Started:
                {{ formatDate(course.start_date) }}
              </div>
              <div v-if="course.category_name" class="flex items-center">
                <i class="i-tabler-category mr-1"></i>
                {{ course.category_name }}
              </div>
            </div>

            <!-- Progress bar -->
            <div class="mt-4">
              <div class="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{{ course.progress }}%</span>
              </div>
              <UProgress
                :value="course.progress"
                :color="course.status === 'completed' ? 'green' : 'primary'"
                size="sm"
              />
            </div>

            <!-- Action buttons -->
            <div class="mt-4 flex gap-2">
              <!-- External link button -->
              <UButton
                v-if="course.url"
                size="xs"
                color="gray"
                variant="soft"
                icon="i-tabler-external-link"
                :to="course.url"
                target="_blank"
              />

              <!-- Course status buttons -->
              <UDropdown v-if="course.status !== 'completed'">
                <UButton
                  v-if="course.status === 'not_started'"
                  block
                  color="primary"
                  variant="solid"
                >
                  Start Course
                </UButton>
                <UButton
                  v-else-if="course.status === 'in_progress'"
                  block
                  color="primary"
                  variant="solid"
                >
                  Continue
                </UButton>

                <template #items>
                  <UDropdownItem
                    @click="updateCourseStatus(course.id, 'not_started')"
                  >
                    Mark as Not Started
                  </UDropdownItem>
                  <UDropdownItem
                    @click="updateCourseStatus(course.id, 'in_progress')"
                  >
                    Mark as In Progress
                  </UDropdownItem>
                  <UDropdownItem
                    @click="updateCourseStatus(course.id, 'completed')"
                  >
                    Mark as Completed
                  </UDropdownItem>
                </template>
              </UDropdown>

              <UButton
                v-else
                block
                color="green"
                variant="soft"
                icon="i-tabler-check"
              >
                Completed
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!isLoading"
        class="py-12 flex flex-col items-center justify-center text-center"
      >
        <div class="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
          <i
            class="i-tabler-search text-5xl text-gray-500 dark:text-gray-400"
          ></i>
        </div>
        <h3 class="text-lg font-medium mb-2">No courses found</h3>
        <p class="text-gray-600 dark:text-gray-400 max-w-md mb-4">
          {{
            courses.length === 0
              ? "No courses have been added yet. Add your first course to get started!"
              : "We couldn't find any courses matching your search criteria. Try adjusting your search or filters."
          }}
        </p>
        <div class="flex gap-2">
          <UButton
            v-if="activeCategory !== 'all' || searchQuery"
            @click="
              searchQuery = '';
              activeCategory = 'all';
            "
            variant="soft"
            color="primary"
          >
            Clear Filters
          </UButton>

          <UButton
            color="primary"
            icon="i-tabler-plus"
            to="/dashboard/courses/new"
          >
            Add Course
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
